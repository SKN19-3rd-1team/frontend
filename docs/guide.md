# Unigo 챗봇 실행 가이드

**최종 업데이트**: 2025-12-08

이 문서는 Unigo 대학 전공 추천 챗봇을 로컬 환경에서 실행하는 방법을 안내합니다.

## 📋 목차

1. [사전 요구사항](#사전-요구사항)
2. [설치 및 설정](#설치-및-설정)
3. [Django 서버 실행](#django-서버-실행)
4. [사용 방법](#사용-방법)
5. [문제 해결](#문제-해결)

## 🔧 사전 요구사항

### 필수 소프트웨어
- **Python 3.10 이상**
- **pip** (Python 패키지 관리자)
- **Git** (저장소 클론용)

### 필수 API 키
- **OpenAI API Key**: GPT 모델 및 임베딩 사용

## 📦 설치 및 설정

### 1. 저장소 클론

```bash
git clone <repository-url>
cd frontend
```

### 2. Python 가상환경 생성 (권장)

```bash
# Windows
conda create -n langchain_env python=3.11
conda activate langchain_env
```

### 3. 의존성 설치

```bash
# Backend 의존성 설치
pip install -r requirements.txt

# Django 설치
pip install django
```

**주요 패키지**:
- `langchain`: LLM 오케스트레이션
- `langgraph`: 상태 기반 에이전트
- `openai`: OpenAI API 클라이언트
- `pinecone-client`: 벡터 DB
- `python-dotenv`: 환경 변수 관리
- `django`: 웹 프레임워크

### 4. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# OpenAI 설정
OPENAI_API_KEY=your_openai_api_key_here

# LLM 설정
LLM_PROVIDER=openai
MODEL_NAME=gpt-4o-mini

# Pinecone 설정 (선택사항)
PINECONE_API_KEY=your_pinecone_key_here
PINECONE_INDEX_NAME=major-index
PINECONE_ENVIRONMENT=us-east-1

# 데이터 경로 (기본값 사용 가능)
MAJOR_DETAIL_PATH=backend/data/major_detail.json
```

**중요**: `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

### 5. Django 데이터베이스 마이그레이션

```bash
cd unigo
python manage.py migrate
```

## 🚀 Django 서버 실행

### 기본 실행

```bash
cd unigo
python manage.py runserver
```

서버가 시작되면 다음과 같은 메시지가 표시됩니다:

```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

### 다른 포트로 실행

```bash
python manage.py runserver 8001
```

### 외부 접속 허용

```bash
python manage.py runserver 0.0.0.0:8000
```

**주의**: 개발 서버는 프로덕션 환경에서 사용하지 마세요.

## 💬 사용 방법

### 1. 웹 브라우저 접속

서버 실행 후 브라우저에서 다음 URL로 접속:

```
http://127.0.0.1:8000/chat/
```

### 2. 온보딩 질문 답변

처음 접속하면 4가지 온보딩 질문이 순차적으로 표시됩니다:

1. **선호 고교 과목**: 좋아하는 과목과 이유
   - 예: "수학과 물리를 특히 좋아하고 실험 수업을 즐깁니다."

2. **흥미 및 취미**: 학교 밖 관심사
   - 예: "로봇 동아리 활동, 디지털 드로잉, 음악 감상 등"

3. **희망 연봉**: 졸업 후 목표 연봉
   - 예: "연 4천만 원 이상이면 좋겠습니다."

4. **희망 학과**: 진학하고 싶은 전공
   - 예: "컴퓨터공학과, 데이터사이언스학과"

### 3. 전공 추천 확인

온보딩 완료 후 AI가 분석한 추천 전공 TOP 5가 표시됩니다:

- 채팅 창에 요약 표시
- 우측 패널에 상세 정보 표시

### 4. 추가 질문

온보딩 이후에는 자유롭게 질문할 수 있습니다:

**전공 정보 질문 예시**:
- "컴퓨터공학과에 대해 알려줘"
- "기계공학과 졸업 후 연봉은 얼마야?"
- "심리학과에서는 주로 뭘 배워?"

**대학 정보 질문 예시**:
- "컴퓨터공학과가 있는 대학 어디야?"
- "서울에 있는 간호학과 알려줘"

**입시 정보 질문 예시**:
- "서울대학교 컴퓨터공학과 정시컷 알려줘"
- "연세대학교 수시컷이 궁금해"

## 🔍 주요 기능

### 차등 점수 시스템

사용자가 명시한 희망 전공에 대해 정확도에 따라 차등 점수를 부여합니다:

| 티어 | 점수 | 설명 |
|------|------|------|
| Tier 1 | 20.0 | 정확히 일치 |
| Tier 2 | 15.0 | 접두어 일치 |
| Tier 3 | 10.0 | 포함 |
| Tier 4 | 5.0 | 벡터 유사도 |

### Markdown 링크 지원

챗봇이 제공하는 입시 정보 링크는 클릭 가능합니다:
- `[한양대학교 입시정보](URL)` → 클릭 가능한 링크로 표시

### 세션 유지

- 대화 기록은 브라우저 세션에 저장됩니다
- 페이지를 새로고침해도 대화가 유지됩니다
- 온보딩 상태도 세션에 저장됩니다

## 🐛 문제 해결

### 1. ModuleNotFoundError: No module named 'backend'

**원인**: Python이 backend 모듈을 찾지 못함

**해결 방법**:

```bash
# Windows
set PYTHONPATH=%PYTHONPATH%;C:\path\to\frontend

# Linux/Mac
export PYTHONPATH=$PYTHONPATH:/path/to/frontend
```

또는 Django 프로젝트 내에서 이미 처리되어 있으므로, `unigo/` 디렉토리에서 실행하세요.

### 2. OpenAI API Error

**원인**: API 키가 설정되지 않았거나 잘못됨

**해결 방법**:
1. `.env` 파일에 올바른 `OPENAI_API_KEY` 설정
2. API 키에 충분한 크레딧이 있는지 확인
3. 서버 재시작

### 3. Port already in use

**원인**: 8000 포트가 이미 사용 중

**해결 방법**:

```bash
# 다른 포트 사용
python manage.py runserver 8001

# 또는 기존 프로세스 종료 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### 4. 마이그레이션 경고

```
You have 18 unapplied migration(s)...
```

**해결 방법**:

```bash
cd unigo
python manage.py migrate
```

### 5. Pinecone 연결 오류

**원인**: Pinecone API 키 또는 인덱스 설정 문제

**해결 방법**:
1. `.env`에 `PINECONE_API_KEY` 설정 확인
2. 인덱스 이름 확인
3. 로컬 벡터 DB 사용 (Pinecone 없이도 작동 가능)

### 6. 채팅 응답이 느린 경우

**원인**: OpenAI API 응답 지연 또는 벡터 검색 시간

**해결 방법**:
- 정상적인 현상입니다 (보통 3-10초)
- 더 빠른 모델 사용 (`gpt-3.5-turbo`)
- 네트워크 연결 확인

## 📊 로그 확인

### Django 서버 로그

서버 실행 중 터미널에 다음과 같은 로그가 표시됩니다:

```
[Majors] ✅ Pinecone search returned 50 hits
🤖 LLM Normalized Majors: ['컴퓨터공학과'] -> ['컴퓨터공학과']
🔍 Searching for preferred major: '컴퓨터공학과'
🎯 Set '컴퓨터공학과' score to 20.00 [Tier 1 (Exact Match)]
```

### 브라우저 콘솔

개발자 도구(F12)의 콘솔에서 프론트엔드 로그 확인 가능

## 🔄 서버 재시작

코드 변경 후 Django 개발 서버는 자동으로 재시작됩니다.

**수동 재시작이 필요한 경우**:
- `.env` 파일 변경
- 새로운 Python 패키지 설치
- Django 설정 파일 변경

```bash
# Ctrl+C로 서버 중지 후
python manage.py runserver
```

## 📝 추가 정보

### API 엔드포인트 테스트

Postman이나 curl로 API를 직접 테스트할 수 있습니다:

```bash
# 채팅 API
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "컴퓨터공학과 알려줘", "history": []}'

# 온보딩 API
curl -X POST http://127.0.0.1:8000/api/onboarding \
  -H "Content-Type: application/json" \
  -d '{"answers": {"subjects": "수학", "interests": "코딩", "desired_salary": "5000만원", "preferred_majors": "컴퓨터공학과"}}'
```

### 개발 모드 vs 프로덕션

현재 설정은 **개발 모드**입니다. 프로덕션 배포 시:
- `DEBUG = False` 설정
- `ALLOWED_HOSTS` 설정
- 정적 파일 수집 (`collectstatic`)
- WSGI 서버 사용 (Gunicorn, uWSGI 등)

---

**도움이 필요하신가요?**
- [개발 계획](plans.md) 참고
- [수정 로그](fixed_log.md) 참고
- [README](../README.md) 참고
