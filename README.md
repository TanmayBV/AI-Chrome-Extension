# 🚀 Chat With Page AI (Chrome Extension + LangChain)

An AI-powered Chrome Extension that lets you **chat with any webpage instantly** — no need to read long content manually.

This project combines **Chrome Extension + FastAPI + LangChain + Groq LLM** to build a **real-time AI browsing assistant**.

---

## ✨ Features

* 💬 Chat with any webpage
* 📄 AI reads page content using Web Loader (LangChain)
* ⚡ Instant answers using Groq LLM (LLaMA 3)
* 🧠 RAG-based system (Retrieval Augmented Generation)
* 🖥️ Sidebar AI assistant (slides smoothly)
* 🤖 Floating toggle button (open/close sidebar)
* 🔁 Enable / Disable extension (via toolbar click)
* 🖱️ Right-click → Ask AI about selected text
* ⌨️ Enter to send message (Shift+Enter for new line)
* 🎨 Modern ChatGPT-style UI (bubbles, animation, clean design)
* 📜 Auto-scroll + smooth animations

---

## 🏗️ Tech Stack

### Frontend (Extension)

* HTML, CSS, JavaScript
* Shadow DOM (no iframe, works on most websites)

### Backend

* FastAPI
* LangChain
* FAISS (Vector Database)

### AI

* Groq API (LLaMA 3)
* Sentence Transformers (Embeddings)

---

## ⚙️ How It Works

```
User opens webpage
        ↓
Extension injects AI sidebar
        ↓
User asks question
        ↓
Backend loads webpage using WebBaseLoader
        ↓
Text is split into chunks
        ↓
FAISS retrieves relevant context
        ↓
LLM generates answer
        ↓
Response shown in sidebar
```

---

## 📁 Project Structure

```
chat-with-page/
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
└── extension/
    ├── manifest.json
    ├── background.js
    ├── content.js
```

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-Chrome-Extension.git
cd AI-Chrome-Extension
```

---

### 2️⃣ Setup Backend

```bash
cd backend
pip install -r requirements.txt
```

Set API key:

```bash
export GROQ_API_KEY=your_api_key
```

Windows:

```bash
set GROQ_API_KEY=your_api_key
```

Run backend:

```bash
uvicorn main:app --reload --port 8000
```

---

### 3️⃣ Load Chrome Extension

1. Open Chrome
2. Go to: `chrome://extensions`
3. Enable **Developer Mode**
4. Click **Load Unpacked**
5. Select `extension` folder

---

## 🧪 Usage

1. Open any website (example: product page, docs, blog)
2. Click extension icon → Enable AI
3. Click 🤖 button → Open sidebar
4. Ask questions like:

```
What are the specifications of this product?
Summarize this page
Explain this section
```

5. Get instant AI responses

---

## 🔥 Example Use Cases

* 📱 Product research (e.g. iPhone specs)
* 📄 Reading long documentation
* 📰 News summarization
* 💻 Developer docs assistant
* 🛒 Compare product features

---

## ⚡ Key Features You Implemented

* ✔ Shadow DOM sidebar (no iframe issues)
* ✔ Toggle ON/OFF without page reload
* ✔ Smooth sidebar animation
* ✔ Floating AI button with movement
* ✔ Chat UI with left/right alignment
* ✔ Enter-to-send functionality
* ✔ Right-click context AI

---

## 🛡️ Notes

* Some websites block scraping (use headers or Playwright loader)
* Extension does not work on:

  * chrome:// pages
  * Chrome Web Store
* Keep API keys secure (use `.env`)

---

## 🚀 Future Improvements

* ⚡ Streaming responses (ChatGPT typing effect)
* 🧠 Cache embeddings (10x faster responses)
* 🌐 Multi-page memory
* 🎥 YouTube summarization
* 📄 PDF chat support
* 🌙 Dark mode

---

## 📌 Author

**Tanmay Baravkar**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
