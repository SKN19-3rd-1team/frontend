from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio
import httpx
import json
import uvicorn
from fastapi.responses import HTMLResponse
import aiofiles

from detect_command import detect_command

app = FastAPI()

# A dictionary to hold chat histories for each client
chat_histories = {}

async def read_html_file(path):
    async with aiofiles.open(path, "r", encoding="utf-8") as f:
        return await f.read()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    client_id = websocket.client.host
    chat_histories[client_id] = []
    print(f"Client connected: {client_id}")

    try:
        async with httpx.AsyncClient(timeout=None) as client:
            while True:
                user_input = await websocket.receive_text()
                print(f"Received from {client_id}: {user_input}")





                
                mcp, mcp_prompt, mcp_fixed_comment = detect_command(user_input)  # Example: "행사장 안내"


                html_content = None
                if mcp == "info":
                    html_content = await read_html_file("../info/info.html")
                elif mcp == "kia":
                    print(mcp)
                    html_content = await read_html_file("../games/kia.html")
                elif mcp == "tower":
                    html_content = await read_html_file("../games/tower.html")

                if html_content:
                    await asyncio.sleep(3.0)
                    await websocket.send_json({
                        "type": "html",
                        "html": html_content
                    })




                chat_history = chat_histories[client_id]
                chat_history.append({"role": "user", "content": mcp_prompt + "응답해야 할 문장: " + user_input})
                assistant_message = ""  # To collect the response


                # Add system prompt at the beginning of the chat history
                if not chat_history or chat_history[0].get("role") != "system":
                    chat_history.insert(0, {
                        "role": "system", 
                        "content": "넌 코카콜라 이벤트 도우미야. 손님이 많아서 불필요한 문장을 빼서 말해야 돼. 다만, [성수동, 코카콜라, 팝업스토어, 연락처, 게임]관련된 내용에는 성심성의껏 대답만 해."
                    })


                async with client.stream(
                    "POST",
                    "http://localhost:11434/api/chat",
                    json={"model": "EEVE-Korean-10.8B", "messages": chat_history, "stream": True},
                ) as response:
                    
                    
                    
                    
                    for w in mcp_fixed_comment:
                        await websocket.send_json({
                            "message": {
                                "role": "assistant",
                                "content": w  # 단어 하나만 전송
                            }
                        })
                        await asyncio.sleep(0.1)


                


                    async for line in response.aiter_lines():
                        if not line:
                            continue
                        
                        try:
                            data = json.loads(line)
                            
                            if "message" in data and "content" in data["message"]:
                                content = data["message"]["content"]
                                assistant_message += content
                                
                            await websocket.send_text(line)
                            await asyncio.sleep(0.01)
                            print(line)
                                
                        except json.JSONDecodeError:
                            continue
            
                if assistant_message:
                    chat_history.append({"role": "assistant", "content": assistant_message})
                    print(f"Assistant response saved to history for {client_id}")

    except WebSocketDisconnect:
        print(f"Client {client_id} disconnected")
    except Exception as e:
        print(f"Error with client {client_id}: {e}")
    finally:
        if client_id in chat_histories:
            del chat_histories[client_id]
        if not websocket.client_state.name == "DISCONNECTED":
            await websocket.close()
        print(f"WebSocket for {client_id} closed")




@app.get("/")
async def root():
	return { "message" : "Hello World" }



if __name__ == "__main__":
    uvicorn.run(
        "main-legacy2:app",
        host="0.0.0.0",
        port=8000,
        # ssl_keyfile="key.pem",
        # ssl_certfile="cert.pem"
    )