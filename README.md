# Frontend Project

## 실행 방법
1. `frontend/page1/index.html` 파일을 선택 후, 오른쪽 클릭 → Copy Path → 복사한 경로를 브라우저 주소창에 붙여넣기
2. VSCode Live Server 사용 시 `Alt + L + O` 단축키 사용

## 깃 구조
- HTML, CSS, JS 파일은 각 페이지별로 분리
```
frontend/
├─ page1/           # 시작 페이지 + 로그인/회원가입 팝업
│  ├─ index.html
│  ├─ script.js
│  └─ style.css
│
├─ page2/           # 설정 페이지
│  ├─ index.html
│  ├─ script.js
│  └─ style.css
│
├─ assets/
│  └─ *.png 
│
├─ .gitignore
└─ README.md
```

## 페이지 설명
### Page1 (시작 페이지)

- 시작 화면
- 로그인 / 회원가입 팝업 모달
- 버튼 클릭 시 팝업 열림

### Page2 (설정 페이지)

- 사용자 설정 화면
- 필요한 JS/CSS 연동