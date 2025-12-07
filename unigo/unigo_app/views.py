from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import sys
import os

# Add frontend root to path to import backend
# Current file: frontend/unigo/unigo_app/views.py
# Target: frontend/backend
# ../../ from here is frontend/unigo. ../../../ is frontend.
# But usually BASE_DIR in settings is frontend/unigo.
# Let's try to find backend relative to this file.
current_dir = os.path.dirname(os.path.abspath(__file__))
frontend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if frontend_dir not in sys.path:
    sys.path.append(frontend_dir)

try:
    from backend.main import run_mentor, run_major_recommendation
except ImportError:
    print("Backend module not found via standard import. Checking path...")
    # Fallback or error handling
    pass

# Create your views here.

def home(request):
    """홈 페이지 렌더링"""
    return render(request, "unigo_app/home.html")

def chat(request):
    """채팅 페이지 렌더링"""
    return render(request, "unigo_app/chat.html")

def setting(request):
    """설정 페이지 렌더링"""
    return render(request, "unigo_app/setting.html")

@csrf_exempt
def chat_api(request):
    """
    챗봇 대화 API 엔드포인트
    
    POST 요청으로 사용자 메시지와 대화 기록을 받아 AI 응답을 반환합니다.
    
    Request Body:
        message (str): 사용자 메시지
        history (list): 이전 대화 기록 (optional)
        
    Returns:
        JsonResponse: AI 응답 또는 에러 메시지
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            message = data.get("message")
            history = data.get("history", [])

            if not message:
                return JsonResponse({"error": "Empty message"}, status=400)

            # Call backend agent
            response_content = run_mentor(
                question=message,
                chat_history=history,
                mode="react"
            )
            
            # response_content can be dict or str
            if isinstance(response_content, dict):
                 return JsonResponse({"response": str(response_content)})

            return JsonResponse({"response": str(response_content)})
            
        except Exception as e:
            print(f"Error in chat_api: {e}")
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def onboarding_api(request):
    """
    온보딩 질문 답변 기반 전공 추천 API 엔드포인트
    
    POST 요청으로 온보딩 질문에 대한 답변을 받아 추천 전공 목록을 반환합니다.
    
    Request Body:
        answers (dict): 온보딩 질문 답변
            - subjects: 선호 과목
            - interests: 흥미 및 취미
            - desired_salary: 희망 연봉
            - preferred_majors: 희망 학과
            
    Returns:
        JsonResponse: 추천 전공 목록 및 상세 정보
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            answers = data.get("answers")
            
            if not answers:
                return JsonResponse({"error": "Empty answers"}, status=400)

            # Call backend recommendation
            result = run_major_recommendation(onboarding_answers=answers)
            
            return JsonResponse(result)
            
        except Exception as e:
            print(f"Error in onboarding_api: {e}")
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)
