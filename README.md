# Unigo - 대학 전공 추천 챗봇

AI 기반 대학 전공 추천 및 입시 정보 제공 챗봇 시스템

## 📁 프로젝트 구조

```
frontend/
├── docs/                          # 프로젝트 문서
│   ├── guide.md                   # 실행 가이드
│   ├── plans.md                   # 개발 계획
│   ├── fixed_log.md               # 수정 로그
│   └── development_log.md         # 개발 로그
│
├── static_pages/                  # 정적 페이지 (독립 실행 가능)
│   ├── home/                      # 랜딩 페이지
│   ├── setting/                   # 설정 페이지
│   ├── profile/                   # 프로필 페이지
│   └── chat/                      # 채팅 페이지 (독립 버전)
│
├── backend/                       # LangGraph RAG 백엔드
│   ├── data/                      # 전공 데이터
│   ├── graph/                     # LangGraph 노드 및 상태
│   ├── rag/                       # RAG 시스템 (검색, 임베딩, 툴)
│   ├── main.py                    # 메인 진입점
│   └── config.py                  # 설정 관리
│
├── unigo/                         # Django 웹 애플리케이션
│   ├── static/                    # 정적 파일 (CSS, JS, 이미지)
│   ├── templates/                 # Django 템플릿
│   ├── unigo_app/                 # 메인 앱
│   │   ├── views.py              # API 엔드포인트
│   │   └── urls.py               # URL 라우팅
│   └── manage.py                  # Django 관리 스크립트
│
├── assets/                        # 공통 자산
├── demo_streamlit/                # Streamlit 데모 (참고용)
├── .env                           # 환경 변수
├── requirements.txt               # Python 의존성
└── README.md                      # 이 파일
```

## 🚀 시작하기

### 1. 환경 설정

```bash
# 의존성 설치
pip install -r requirements.txt
pip install django

# 환경 변수 설정
# .env 파일에 OPENAI_API_KEY 설정
```

### 2. Django 서버 실행

```bash
cd unigo
python manage.py migrate  # 최초 1회 실행
python manage.py runserver
```

서버 실행 후 `http://127.0.0.1:8000/chat/` 접속

### 3. 정적 페이지 실행 (선택사항)

`static_pages/` 내의 각 폴더에서 `index.html`을 브라우저로 직접 열어 실행 가능

## 📚 주요 기능

### 1. 온보딩 기반 전공 추천
- 4가지 질문을 통한 사용자 프로파일링
- 차등 점수 시스템 (Tiered Scoring)을 통한 정확한 추천
  - Tier 1 (20점): 정확히 일치
  - Tier 2 (15점): 접두어 일치
  - Tier 3 (10점): 포함
  - Tier 4 (5점): 벡터 유사도

### 2. RAG 기반 대화형 챗봇
- LangGraph + OpenAI를 활용한 ReAct 패턴
- 전공 정보, 대학 정보, 입시 정보 검색
- Pinecone 벡터 DB 기반 의미론적 검색

### 3. 제공 정보
- 전공별 상세 정보 (관심사, 과목, 진출 분야)
- 대학별 개설 학과 목록
- 입시 정보 (정시/수시 컷 라인)

## 🛠️ 기술 스택

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Python, Django
- **AI/ML**: LangChain, LangGraph, OpenAI GPT
- **Vector DB**: Pinecone
- **Embeddings**: OpenAI Embeddings

## 📖 문서

자세한 내용은 `docs/` 폴더의 문서를 참고하세요:
- [실행 가이드](docs/guide.md)
- [개발 계획](docs/plans.md)
- [수정 로그](docs/fixed_log.md)

## 🔧 개발자 정보

### 코드 구조
- **backend/graph/nodes.py**: 전공 추천 로직 및 차등 점수 시스템
- **backend/rag/tools.py**: LangChain 툴 정의 (전공 검색, 대학 검색 등)
- **unigo/unigo_app/views.py**: Django API 엔드포인트
- **unigo/static/js/chat.js**: 프론트엔드 채팅 로직

### 주요 상수
```python
# backend/graph/nodes.py
SCORE_TIER_1_EXACT_MATCH = 20.0      # 정확 일치
SCORE_TIER_2_STARTS_WITH = 15.0      # 접두어 일치
SCORE_TIER_3_CONTAINS = 10.0         # 포함
SCORE_TIER_4_VECTOR_MATCH = 5.0      # 벡터 검색
```

## 📝 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.