let root = null;
let shadow = null;
let sidebar, toggle, chat, input, send;

let isOpen = false;
let isEnabled = false;

// INITIAL LOAD
chrome.storage.local.get("enabled", (data) => {
    isEnabled = data.enabled;
    if (isEnabled) initUI();
});

// LISTENER
chrome.runtime.onMessage.addListener((msg) => {

    if (msg.action === "toggle") {
        isEnabled = msg.enabled;

        if (isEnabled) {
            initUI();
        } else {
            removeUI();
        }
    }

    if (msg.action === "askAI" && isEnabled) {
        sendQuestion("Explain this: " + msg.text);
    }

});

// INIT UI (ONLY ONCE)
function initUI() {

    if (root) return;

    root = document.createElement("div");
    root.id = "ai-root-container";
    document.body.appendChild(root);

    shadow = root.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    
    style.textContent = `
/* SIDEBAR */
.sidebar {
    position: fixed;
    top: 0;
    right: -360px;
    width: 360px;
    height: 100vh;
    background: #f9fafb;
    display: flex;
    flex-direction: column;
    transition: right 0.3s ease;
    z-index: 999999;
    box-shadow: -4px 0 20px rgba(0,0,0,0.15);
}

/* OPEN STATE */
.sidebar.open {
    right: 0;
}

/* HEADER */
.header {
    background: linear-gradient(135deg, #4a90e2, #357abd);
    color: white;
    padding: 14px;
    text-align: center;
    font-weight: 600;
    font-size: 16px;
    letter-spacing: 0.5px;
}

/* CHAT AREA */
.chat {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* SCROLLBAR */
.chat::-webkit-scrollbar {
    width: 6px;
}
.chat::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
}

/* MESSAGE BASE */
.message {
    padding: 10px 14px;
    border-radius: 14px;
    max-width: 75%;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    white-space: pre-wrap;
    animation: fadeIn 0.2s ease;
}

/* USER MESSAGE */
.user {
    align-self: flex-end;
    background: linear-gradient(135deg, #4a90e2, #357abd);
    color: white;
    border-bottom-right-radius: 4px;
}

/* AI MESSAGE */
.ai {
    align-self: flex-start;
    background: white;
    color: #333;
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

/* INPUT AREA */
.input {
    display: flex;
    padding: 10px;
    gap: 8px;
    border-top: 1px solid #e5e7eb;
    background: white;
}

/* TEXTAREA */
textarea {
    flex: 1;
    height: 42px;
    border-radius: 8px;
    border: 1px solid #ddd;
    padding: 8px;
    font-size: 14px;
    resize: none;
    outline: none;
    transition: border 0.2s;
}

textarea:focus {
    border-color: #4a90e2;
}

/* BUTTON */
button {
    background: linear-gradient(135deg, #4a90e2, #357abd);
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: 0.2s;
}

button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

button:active {
    transform: scale(0.95);
}

/* FLOATING TOGGLE BUTTON */
.toggle {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 52px;
    height: 52px;
    background: linear-gradient(135deg, #4a90e2, #357abd);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 22px;
    z-index: 999999;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.toggle:hover {
    transform: scale(1.1);
}

/* MOVE BUTTON WHEN OPEN */
.toggle.shift {
    right: 380px;
}

/* ANIMATION */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

    const container = document.createElement("div");

    container.innerHTML = `
    <div class="sidebar" id="sidebar">
        <div class="header">AI Assistant</div>
        <div class="chat" id="chat"></div>
        <div class="input">
            <textarea id="input"></textarea>
            <button id="send">Send</button>
        </div>
    </div>

    <div class="toggle" id="toggle">🤖</div>
    `;

    shadow.appendChild(style);
    shadow.appendChild(container);

    sidebar = shadow.getElementById("sidebar");
    toggle = shadow.getElementById("toggle");
    chat = shadow.getElementById("chat");
    input = shadow.getElementById("input");
    send = shadow.getElementById("send");

    // Toggle sidebar
    toggle.onclick = () => {
        isOpen = !isOpen;

        sidebar.classList.toggle("open", isOpen);
        toggle.classList.toggle("shift", isOpen);
    };

    input.addEventListener("keydown", (e) => {

    // Enter without Shift → send message
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();   // stop new line
        send.onclick();       // trigger send button
    }

    });

    // Send button
    send.onclick = () => {
        const q = input.value.trim();
        if (!q) return;
        input.value = "";
        sendQuestion(q);
    };

}

// REMOVE UI
function removeUI() {
    root?.remove();
    root = null;
}

// ADD MESSAGE
function addMsg(text, type) {
    const div = document.createElement("div");
    div.className = "message " + type;
    div.innerText = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    return div;
}

// SEND QUESTION
async function sendQuestion(q) {

    addMsg(q, "user");

    const loading = addMsg("Thinking...", "ai");

    try {

        const res = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: window.location.href,
                question: q
            })
        });

        const data = await res.json();

        console.log("API Response:", data); // DEBUG

        // FIX RESPONSE DISPLAY
        let answer = "";

        if (typeof data.answer === "string") {
            answer = data.answer;
        } else if (data.answer?.content) {
            answer = data.answer.content;
        } else {
            answer = JSON.stringify(data.answer);
        }

        loading.innerText = answer;

    } catch (err) {

        console.error(err);

        loading.innerText = "❌ Backend error. Check console.";

    }
}