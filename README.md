# Unigo (Frontend Demo)

**Unigo**는 대학 입시 고민을 해결해주는 **AI 기반 1:1 맞춤형 입시 상담 챗봇 서비스**입니다.
현재 리포지토리는 Unigo의 **Frontend 및 UI/UX**를 중점적으로 보여주기 위한 **데모 버전**으로, 복잡한 AI 백엔드 로직 없이도 웹 인터페이스와 인터랙션을 체험할 수 있도록 구성되어 있습니다.

> **Note**: 본 프로젝트는 실제 DB나 AI 모델과 연동되지 않으며, Django로 작성된 **Mock Backend**를 통해 하드코딩된 데이터를 반환하여 프론트엔드 기능을 시연합니다.

---

## 1. 프로젝트 주요 화면 (Frontend Preview)

- **대화형 인터페이스**: 친근한 페르소나(캐릭터)와 대화하며 자연스럽게 정보를 얻을 수 있는 채팅 UI.
- **실시간 스트리밍 답변**: AI가 타이핑하는 듯한 효과를 구현하여 사용자 경험(UX) 극대화.
- **반응형 대시보드**: 데스크탑 및 태블릿 환경에 최적화된 Grid/Flex 레이아웃.

---

## 2. Frontend 기술 스택 (Tech Stack)

프레임워크 없이 기본기(HTML/CSS/JS)를 충실히 활용하여 가볍고 빠른 인터페이스를 구현했습니다.

| 분류            | 기술                          | 설명                                                               |
| :-------------- | :---------------------------- | :----------------------------------------------------------------- |
| **View Engine** | **Django Templates (DTL)**    | `<header>`, `<nav>` 등 공통 컴포넌트 모듈화 및 서버 사이드 렌더링. |
| **Logic**       | **Vanilla JavaScript (ES6+)** | 외부 라이브러리 의존성을 최소화한 순수 JS 로직.                    |
| **Styling**     | **CSS3**                      | Flexbox/Grid 레이아웃, CSS Variables 기반의 테마 관리.             |
| **Async**       | **Fetch API & SSE**           | 비동기 데이터 통신 및 Server-Sent Events 기반 스트리밍 처리.       |
| **Mock Server** | **Django Views**              | 프론트엔드 개발용 API Mocking (JSON, Streaming Response).          |

---

## 3. 핵심 기능 및 구현 포인트

### 1) 💬 실시간 스트리밍 채팅 UI (`chat.js`)

- **Server-Sent Events (SSE) 시뮬레이션**: 실제 AI 모델의 토큰 단위 생성 속도를 모사하기 위해, Mock 서버에서 전송하는 스트림 데이터를 `TextDecoderStream`으로 파싱하여 한 글자씩 출력하는 타이핑 효과를 구현했습니다.
- **Markdown 렌더링**: `marked.js`를 활용하여 챗봇의 답변(링크, 리스트, 강조 등)을 깔끔한 HTML로 변환합니다.

### 2) 🚀 인터랙티브 온보딩 (`onboarding`)

- **단계별 질문 흐름**: 사용자가 자연스럽게 자신의 성향(관심사, 과목 등)을 입력할 수 있도록 다단계 설문 인터페이스를 채팅 형식으로 구현했습니다.
- **동적 상태 관리**: `onboardingState` 객체를 통해 진행 상황을 추적하고, 세션이 끊겨도 이어할 수 있도록 `sessionStorage`와 연동했습니다.

### 3) 🎨 사용자 맞춤 테마 (`setting.html`)

- **페르소나 변경**: 사용자 선택에 따라 UI 전반의 캐릭터 이미지(Rabbit, Bear 등)가 즉시 변경됩니다.
- **이미지 폴백(Fallback)**: 이미지 로드 실패 시 기본 캐릭터(`rabbit.png`)로 자동 대체되는 로직을 적용하여 UI 깨짐을 방지했습니다.

---

## 4. 프로젝트 구조 (Directory Structure)

프론트엔드 리소스(`static`, `templates`)와 이를 서빙하기 위한 최소한의 Mock View(`views.py`)로 구성되어 있습니다.

```bash
unigo/
├── unigo_app/
│   ├── views.py            # [Mock API] 프론트엔드용 더미 데이터 및 스트리밍 응답 로직
│   └── urls.py             # 페이지 라우팅
├── templates/              # [HTML]
│   └── unigo_app/
│       ├── base.html       # 레이아웃 마스터 파일 (헤더/사이드바)
│       ├── chat.html       # 메인 채팅 화면
│       ├── auth.html       # 로그인 화면
│       └── setting.html    # 설정 화면
├── static/                 # [Assets]
│   ├── css/                # 스타일시트 (chat.css, setting.css 등)
│   ├── js/                 # 클라이언트 로직 (chat.js 등)
│   └── images/             # 캐릭터 및 아이콘 이미지
└── manage.py
```

---

## 5. 실행 방법 (How to Run)

이 프로젝트는 현재 Mock 모드로 동작하므로, 별도의 데이터베이스 설정 없이 바로 실행 가능합니다.

### 1. 환경 설정 (Prerequisites)

Python 3.11 이상이 필요합니다.

```bash
# 가상환경 생성 (선택)
conda create -n unigo python=3.11
conda activate unigo

# 의존성 설치
pip install django python-dotenv
```

### 2. 서버 실행

프로젝트 루트(`unigo/`) 폴더로 이동 후 실행합니다.

```bash
cd unigo
python manage.py runserver
```

### 3. 접속

브라우저에서 `http://127.0.0.1:8000/` 으로 접속합니다.

- **로그인**: 아무 ID/PW나 입력하면 자동으로 통과됩니다 (Mock Auth).
- **채팅 테스트**: 채팅창에 아무 메시지나 입력하면 하드코딩된 AI 답변이 스트리밍으로 출력됩니다.

---
