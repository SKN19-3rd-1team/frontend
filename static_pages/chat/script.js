const chatInput = document.querySelector('.chat-input');
const sendBtn = document.getElementById('chat-send-btn');
const chatCanvas = document.querySelector('.chat-canvas');
const STORAGE_KEY = 'unigo.page4.chatHistory';
const API_URL = 'http://localhost:8000/chat';

let chatHistory = [];

const detectReloadAndReset = () => {
    const navEntry = performance.getEntriesByType('navigation')[0];
    const isReload = navEntry
        ? navEntry.type === 'reload'
        : performance.navigation && performance.navigation.type === 1;
    if (isReload) {
        sessionStorage.removeItem(STORAGE_KEY);
    }
};

detectReloadAndReset();

const saveHistory = () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
};

const createBubble = (text, type) => {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble', type);
    // 텍스트 내의 줄바꿈 처리
    bubble.innerHTML = text.replace(/\n/g, '<br>');
    return bubble;
};

const appendBubble = (text, type, shouldPersist = true) => {
    if (!chatCanvas) return;
    const bubble = createBubble(text, type);
    chatCanvas.appendChild(bubble);
    chatCanvas.scrollTop = chatCanvas.scrollHeight;

    if (shouldPersist) {
        const role = type === 'user' ? 'user' : 'assistant';
        chatHistory.push({ role, content: text });
        saveHistory();
    }
};

const showLoadingDetails = () => {
    if (!chatCanvas) return null;
    const loadingBubble = document.createElement('div');
    loadingBubble.classList.add('bubble', 'ai', 'loading');
    loadingBubble.textContent = '...';
    chatCanvas.appendChild(loadingBubble);
    chatCanvas.scrollTop = chatCanvas.scrollHeight;
    return loadingBubble;
};

const restoreHistory = () => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
            chatHistory = parsed;
            // Clear existing static HTML content if history exists
            if (chatHistory.length > 0) {
                chatCanvas.innerHTML = '';
            }
            chatHistory.forEach((msg) => {
                const type = msg.role === 'user' ? 'user' : 'ai';
                const bubble = createBubble(msg.content, type);
                chatCanvas.appendChild(bubble);
            });
            chatCanvas.scrollTop = chatCanvas.scrollHeight;
        }
    } catch {
        chatHistory = [];
    }
};

restoreHistory();

const handleSend = async () => {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. 사용자 메시지 표시
    appendBubble(text, 'user');
    chatInput.value = '';

    // 2. 로딩 표시
    const loadingBubble = showLoadingDetails();

    try {
        // 3. API 호출
        const payload = {
            message: text,
            history: chatHistory.slice(0, -1) // 현재 메시지는 이미 추가했으므로 제외하거나 포함 정책 결정. 
            // backend logic: run_mentor takes history + current question. 
            // Our chatHistory already includes the current 'user' message we just pushed?
            // Wait, appendBubble pushes to chatHistory. 
            // So chatHistory has [...prev, current_user_msg].
            // Backend expects `chat_history` as PREVIOUS context.
            // So we should pass chatHistory excluding the last item.
        };

        // Adjust payload history
        const historyToSend = chatHistory.slice(0, -1);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: text,
                history: historyToSend
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // 4. 로딩 제거 및 응답 표시
        if (loadingBubble) loadingBubble.remove();
        appendBubble(data.response, 'ai');

    } catch (error) {
        console.error('Error:', error);
        if (loadingBubble) loadingBubble.remove();
        appendBubble('오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'ai', false);
    }

    chatInput.focus();
};

if (sendBtn) {
    sendBtn.addEventListener('click', handleSend);
}

if (chatInput) {
    chatInput.addEventListener('keydown', (event) => {
        // 한글 입력 중 엔터 키 중복 처리 방지 (isComposing)
        if (event.key === 'Enter' && !event.isComposing) {
            event.preventDefault();
            handleSend();
        }
    });
}
