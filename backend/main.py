from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio
import httpx
import json
import uvicorn
from fastapi.responses import HTMLResponse
import aiofiles

import aiofiles

app = FastAPI()


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

                chat_history = chat_histories[client_id]

                # Add system prompt at the beginning of the chat history
                if not chat_history or chat_history[0].get("role") != "system":
                    chat_history.insert(0, {
                        "role": "system", 
                        "content": "넌 팝업 도우미야. 손님이 많아서 언제나 불필요한 문장을 빼서 말해야 돼. 특히 [성수동, 코카콜라, 팝업스토어, 연락처, 게임]관련 질문이 아니면 더욱 짧게 대답만 해."
                    })

                assistant_message = ""  # To collect the response


                
                # 어떤 mcp가 필요한지 간략히 탐색
                mcp = None
                mcp_content = user_input
                command_response = ""
                async with httpx.AsyncClient() as client:
                    prompt = f"""The user said: '{user_input}'. 이 중에서 어느 단어가 가장 관련도가 높아? 
                    - 'info' (더 자세한 정보를 원하면)
                    - 'kia' (코카콜라 키야 게임를 하고싶으면)
                    - 'tower' (코카콜라 반도체 게임하고싶으면)
                    - 'nothing_related' (이 중에서 아무 것도 해당 안 되면)
                    이 중에서 한 단어만 선택해서 대답해: kia, tower, info, or nothing_related."""

                    async with client.stream(
                        "POST",
                        "http://localhost:11434/api/chat",
                        json={"model": "EEVE-Korean-10.8B", "messages": [{"role": "user", "content": prompt}], "stream": True},
                    ) as response:
                        async for line in response.aiter_lines():
                            if not line:
                                continue

                            try:
                                data = json.loads(line)
                                if "message" in data and "content" in data["message"]:
                                    command_response += data["message"]["content"].strip().lower()

                                    if "kia" in command_response:
                                        mcp = "kia"
                                        mcp_content = "유저가 시원한 콜라잡기 게임을 하려고 합니다. 테마에 맞게 응원해주세요."
                                        break
                                    elif "info" in command_response:
                                        mcp = "info"
                                        mcp_content = "유저는 정보를 읽고 있습니다. 도움이 더 필요한지 물어보세요."
                                        break
                                    elif "tower" in command_response:
                                        mcp = "tower"
                                        mcp_content = "유저는 반도체 쌓기 게임을 하고 있습니다. 테마에 맞게 응원해주세요."
                                        break

                            except json.JSONDecodeError:
                                continue


                html_content = None
                if mcp == "info":
                    html_content = await read_html_file("../info/info.html")
                elif mcp == "kia":
                    print(mcp)
                    html_content = await read_html_file("../games/kia.html")
                elif mcp == "tower":
                    html_content = await read_html_file("../games/tower.html")

                if html_content:
                    await websocket.send_json({
                        "type": "html",
                        "html": html_content
                    })

                async with client.stream(
                    "POST",
                    "http://localhost:11434/api/chat",
                    json={"model": "EEVE-Korean-10.8B", "messages": chat_history, "stream": True},
                ) as response:
                    
                    
                    
                    
                    if mcp_content:
                        for sentence in mcp_content.split():
                            await websocket.send_json({
                                "message": {
                                    "role": "assistant",
                                    "content": sentence
                                }
                            })
                            await asyncio.sleep(0.2)




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
        "main:app",
        host="0.0.0.0",
        port=8000,
        # ssl_keyfile="key.pem",
        # ssl_certfile="cert.pem"
    )