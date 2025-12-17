import json
import time
from django.shortcuts import render, redirect
from django.http import JsonResponse, StreamingHttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt

# ============================================
# Mock Data
# ============================================

MOCK_USER = {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "nickname": "Test User",
    "character_type": "rabbit",
    "character": "rabbit",
}

# ============================================
# Page Views
# ============================================


@ensure_csrf_cookie
def auth(request):
    """Render auth page."""
    return render(request, "unigo_app/auth.html", {"user": MOCK_USER})


@ensure_csrf_cookie
def chat(request):
    """Render chat page."""
    # Assume always logged in for demo, or redirected from home
    context = {
        "user": MOCK_USER,
        "character_image": "rabbit",
        "character_code": "rabbit",
    }
    return render(request, "unigo_app/chat.html", context)


@ensure_csrf_cookie
def setting(request):
    """Render settings page."""
    return render(
        request,
        "unigo_app/setting.html",
        {"user": MOCK_USER, "character_image": "rabbit"},
    )


@ensure_csrf_cookie
def character_select(request):
    """Render character select page."""
    return render(request, "unigo_app/character_select.html", {"user": MOCK_USER})


def home(request):
    """Home redirect."""
    # Simple redirect logic
    return redirect("unigo_app:chat")


# ============================================
# Auth API
# ============================================


@csrf_exempt
def auth_signup(request):
    return JsonResponse({"message": "Signup successful", "user": MOCK_USER})


@csrf_exempt
def auth_login(request):
    return JsonResponse({"message": "Login successful", "user": MOCK_USER})


def auth_logout(request):
    return JsonResponse({"message": "Logout successful"})


def logout_view(request):
    return redirect("unigo_app:auth")


def auth_me(request):
    # Always return authorized user
    return JsonResponse(
        {"user": MOCK_USER, "isAuthenticated": True, "is_authenticated": True}
    )


@csrf_exempt
def auth_check_email(request):
    return JsonResponse({"available": True})


@csrf_exempt
def auth_check_username(request):
    return JsonResponse({"available": True})


# ============================================
# Setting API
# ============================================


@csrf_exempt
def check_username(request):
    return JsonResponse({"available": True})


@csrf_exempt
def change_nickname(request):
    return JsonResponse({"message": "Nickname changed"})


@csrf_exempt
def change_password(request):
    return JsonResponse({"message": "Password changed"})


@csrf_exempt
def update_character(request):
    return JsonResponse({"message": "Character updated", "character": "rabbit"})


@csrf_exempt
def upload_character_image(request):
    return JsonResponse(
        {"message": "Image uploaded", "image_url": "/static/images/rabbit.png"}
    )


@csrf_exempt
def delete_account(request):
    return JsonResponse({"message": "Account deleted"})


# ============================================
# Chat & Feature API
# ============================================


def stream_chat_responses():
    """Generator for streaming responses."""
    response_text = "저는 대학 전문 상담 챗봇 Unigo 입니다!"

    # 1. Yield initial status (optional but good for UI)
    yield f"data: {json.dumps({'type': 'status', 'content': 'Generating...'})}\n\n".encode(
        "utf-8"
    )
    time.sleep(0.5)

    # 2. Yield content deltas
    for char in response_text:
        data = json.dumps({"type": "delta", "content": char})
        yield f"data: {data}\n\n".encode("utf-8")
        time.sleep(0.05)

    # 3. Yield done/stop (if needed, or just end stream)


@csrf_exempt
def chat_api(request):
    """Mock chat API."""
    if request.method == "POST":
        # Simulate streaming response
        return StreamingHttpResponse(
            stream_chat_responses(), content_type="text/event-stream"
        )
    return JsonResponse({"error": "Method not allowed"}, status=405)


def chat_history(request):
    """Mock chat history."""
    return JsonResponse({"history": []})


@csrf_exempt
def save_chat_history(request):
    return JsonResponse({"message": "History saved", "conversation_id": 123})


def list_conversations(request):
    return JsonResponse(
        {
            "conversations": [
                {
                    "id": 123,
                    "title": "테스트 대화목록",
                    "updated_at": "2024-01-01T12:00:00Z",
                }
            ]
        }
    )


def load_conversation(request):
    return JsonResponse(
        {
            "messages": [
                {"role": "user", "content": "Hello"},
                {
                    "role": "assistant",
                    "content": "저는 대학 전문 상담 챗봇 Unigo 입니다!",
                },
            ]
        }
    )


@csrf_exempt
def reset_chat_history(request):
    return JsonResponse({"message": "대화 내역 초기화 테스트"})


@csrf_exempt
def summarize_conversation(request):
    return JsonResponse({"summary": "대화 내역 요약 테스트"})


@csrf_exempt
def delete_conversation(request, conversation_id):
    return JsonResponse({"message": "대화 내역 삭제 테스트"})


@csrf_exempt
def onboarding_api(request):
    return JsonResponse({"message": "온보딩 테스트"})
