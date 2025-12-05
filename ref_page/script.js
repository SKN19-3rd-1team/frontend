document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatHistory = document.querySelector('.chat-history');

    // Auto-scroll to bottom on load
    scrollToBottom();

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Add User Message
        appendMessage(text, 'user');
        chatInput.value = '';

        // Simulate Bot Response (Delayed)
        setTimeout(() => {
            const botResponses = [
                "흥미로운 답변이네요! 더 자세히 말씀해 주실 수 있나요?",
                "그렇군요. 관련된 다른 정보도 찾아드릴까요?",
                "좋은 선택입니다. 해당 분야의 전망은 매우 밝습니다."
            ];
            const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
            appendMessage(randomResponse, 'bot');
        }, 1000);
    }

    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('bubble');
        bubbleDiv.textContent = text;

        messageDiv.appendChild(bubbleDiv);
        chatHistory.appendChild(messageDiv);

        scrollToBottom();
    }

    function scrollToBottom() {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Sidebar Navigation Interactions (Visual only for now)
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});
