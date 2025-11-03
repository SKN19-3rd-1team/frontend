from fastapi import FastAPI, WebSocket
import asyncio
import httpx

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # 클라이언트 연결 수락
    await websocket.accept()
    print("Client connected")

    try:
        while True:
            # 클라이언트의 메시지
            data = await websocket.receive_text()
            print(f"Received: {data}")

            # Ollama에 프롬프트 전달 (ollama serve로 실행 중이어야 함)
            async with httpx.AsyncClient(timeout=None) as client:
                async with client.stream(
                    "POST",
                    "http://localhost:11434/api/generate",
                    json={"model": "llama3", "prompt": data, "stream": True},
                ) as response:
                    async for line in response.aiter_lines():
                        if not line:
                            continue
                        await websocket.send_text(line)
                        await asyncio.sleep(0.01)  # 속도 조절




    except Exception as e:
        print(f"Error: {e}")
    finally:
        # 클라이언트가 이미 닫았을 가능성이 있으므로 예외 방지
        if not websocket.client_state.name == "DISCONNECTED":
            await websocket.close()
        print("WebSocket closed")