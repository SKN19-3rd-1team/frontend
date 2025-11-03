from fastapi import FastAPI, WebSocket
import asyncio
import httpx
import json

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected")

    chat_history = []

    try:
        while True:
            user_input = await websocket.receive_text()
            print(f"Received: {user_input}")

            chat_history.append({"role": "user", "content": user_input})

            assistant_message = ""  # 응답 수집용

            async with httpx.AsyncClient(timeout=None) as client:
                async with client.stream(
                    "POST",
                    "http://localhost:11434/api/chat",
                    json={"model": "llama3", "messages": chat_history, "stream": True},
                ) as response:
                    async for line in response.aiter_lines():
                        if not line:
                            continue
                        
                        try:
                            data = json.loads(line)
                            
                            # 메시지 내용 추출 및 즉시 전송
                            if "message" in data and "content" in data["message"]:
                                content = data["message"]["content"]
                                assistant_message += content
                                
                            # 원본 JSON 그대로 클라이언트에 전송 (스트리밍)
                            await websocket.send_text(line)
                            await asyncio.sleep(0.01)
                            print(line)
                                
                        except json.JSONDecodeError:
                            continue
            
            # 완성된 응답을 chat_history에 추가
            if assistant_message:
                chat_history.append({"role": "assistant", "content": assistant_message})
                print(f"Assistant response saved to history")

    except Exception as e:
        print(f"Error: {e}")

    finally:
        if not websocket.client_state.name == "DISCONNECTED":
            await websocket.close()
        print("WebSocket closed")




@app.get("/")
async def root():
	return { "message" : "Hello World" }