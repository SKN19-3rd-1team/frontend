# fastCHAT 

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio
import httpx
import json
import uvicorn
from fastapi.responses import HTMLResponse
import aiofiles

app = FastAPI()

# 클라이언트 chat 기록저장
chat_histories = {}


async def read_html_file(path):
    async with aiofiles.open(path, "r", encoding="utf-8") as f:
        return await f.read()


async def read_json_file(path):
    async with aiofiles.open(path, "r", encoding="utf-8") as f:
        content = await f.read()
        return json.loads(content)


# 웹소켓 방식으로 소통
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

                await websocket.send_json({
                    "role": "assistant"
                })

                html_content = None
                if user_input == "info":
                    html_content = await read_html_file("../info/info.html")
                # 테스트 중...
                elif user_input == "table":
                    table_content = await read_json_file("../data/example.json")

                if html_content:
                    await asyncio.sleep(2.0)
                    await websocket.send_json({
                        "type": "html",
                        "role": "assistant",
                        "html": html_content
                    })
                # 테스트 중...
                elif table_content:
                    await asyncio.sleep(2.0)
                    await websocket.send_json({
                        "type": "table",
                        "role": "assistant",
                        "table": table_content
                    })

                text_for_test = ["아 테스트 ", "테스트 중이니 ", "화이팅", "!"]
                for w in text_for_test:
                    await websocket.send_json({
                        "message": {
                            "role": "assistant",
                            "content": w  # 단어 하나만 전송
                        }
                    })
                    await asyncio.sleep(0.2)

                
                await websocket.send_json({"done": True})

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
        "main-legacy2-test:app",
        host="0.0.0.0",
        port=8000,
        # ssl_keyfile="key.pem",
        # ssl_certfile="cert.pem"
    )