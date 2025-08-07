// script.js

document.addEventListener("DOMContentLoaded", () => {
    // Element references
    const app = document.getElementById("app");
    const chatBox = document.getElementById("chatBox");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendMessage");
    const voiceButton = document.getElementById("startVoice");
    const clearButton = document.getElementById("clearChat");
    const themeButton = document.getElementById("toggleTheme");
    const saveChatButton = document.getElementById("saveChat");
    const languageSelector = document.getElementById("languageSelector");
    const currentYearSpan = document.getElementById("currentYear");
    const commonQuestionsContainer = document.querySelector(".common-questions");
    const welcomeMessage = document.getElementById("welcome-message");
  
    let isListening = false;
    let lastSent = 0;
  
    // Restore chat history if any
    const saved = localStorage.getItem("chatHistory");
    if (saved) chatBox.innerHTML = saved;
  
    // Set current year
    currentYearSpan.textContent = new Date().getFullYear();
    lucide.createIcons();
  
    // Scripted fallback responses
    const responses = {
      "what is mindguard?":
        "MindGuard is an AI-powered chatbot designed to assist with mental health queries and provide support. It offers information, resources, and guidance on various mental health topics.",
      "how can i improve my mental health?":
        "To improve your mental health, consider: 1) Practicing mindfulness and meditation, 2) Maintaining a regular exercise routine, 3) Getting adequate sleep, 4) Building and maintaining social connections, 5) Seeking professional help when needed, and 6) Engaging in activities you enjoy.",
      "where can i find resources?":
        "You can find mental health resources at: 1) NAMI, 2) Mental Health America, 3) WHO mental health resources, 4) Local community health centers, and 5) Online therapy platforms like BetterHelp or Talkspace.",
      "what are common mental health issues?":
        "Common mental health issues include: 1) Depression, 2) Anxiety disorders, 3) Bipolar disorder, 4) PTSD, 5) Eating disorders, 6) OCD, and 7) Schizophrenia.",
      "how to manage stress?":
        "To manage stress effectively: 1) Practice deep breathing, 2) Exercise regularly, 3) Eat healthy, 4) Sleep well, 5) Manage your time, 6) Connect with loved ones, and 7) Try relaxation techniques like yoga or progressive muscle relaxation."
    };
  
    // Helper to append messages
    function addMessage(text, isUser, extraClass = "") {
      const msg = document.createElement("div");
      msg.classList.add("message", isUser ? "user-message" : "bot-message");
      if (extraClass) msg.classList.add(extraClass);
      msg.textContent = text;
      chatBox.appendChild(msg);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  
    // Main send function
    async function sendMessage() {
      // Rate-limit: 1s
      const now = Date.now();
      if (now - lastSent < 1000) return;
      lastSent = now;
  
      const text = userInput.value.trim();
      if (!text) return;
  
      addMessage(text, true);
      userInput.value = "";
      commonQuestionsContainer.classList.add("hidden");
  
      // Check scripted fallback
      const key = text.toLowerCase();
      if (responses[key]) {
        addMessage(responses[key], false);
        localStorage.setItem("chatHistory", chatBox.innerHTML);
        return;
      }
  
      // Typing indicator
      const loading = document.createElement("div");
      loading.classList.add("message", "bot-message", "loading");
      loading.innerHTML = `
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>`;
      chatBox.appendChild(loading);
      chatBox.scrollTop = chatBox.scrollHeight;
  
      // Call RAG backend
      try {
        const res = await fetch("/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        });
        if (!res.ok) throw new Error(res.statusText);
        const { response } = await res.json();
  
        loading.remove();
        addMessage(response, false);
      } catch (err) {
        console.error("API error:", err);
        loading.remove();
        addMessage("⚠️ Server unreachable. Try again later.", false, "error");
      }
  
      // Persist history
      localStorage.setItem("chatHistory", chatBox.innerHTML);
    }
  
    // Voice input
    function startVoiceRecognition() {
      if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
        return alert("Speech recognition not supported.");
      }
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SR();
      recog.lang = "en-US";
      recog.interimResults = false;
      recog.maxAlternatives = 1;
  
      voiceButton.style.backgroundColor = "#ff0000";
      voiceButton.innerHTML = '<i data-lucide="x"></i>';
      lucide.createIcons();
      recog.start();
      isListening = true;
  
      recog.onresult = e => {
        userInput.value = e.results[0][0].transcript;
        sendMessage();
      };
      recog.onend = () => {
        isListening = false;
        voiceButton.style.backgroundColor = "";
        voiceButton.innerHTML = '<i data-lucide="mic"></i>';
        lucide.createIcons();
      };
      recog.onerror = () => {
        isListening = false;
        voiceButton.style.backgroundColor = "";
        voiceButton.innerHTML = '<i data-lucide="mic"></i>';
        lucide.createIcons();
      };
    }
  
    // Theme toggle
    function toggleTheme() {
      app.classList.toggle("dark-mode");
      const dark = app.classList.contains("dark-mode");
      themeButton.innerHTML = dark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
      themeButton.setAttribute("aria-label", dark ? "Light mode" : "Dark mode");
      lucide.createIcons();
    }
  
    // Clear chat
    function clearChat() {
      chatBox.innerHTML = "";
      chatBox.appendChild(welcomeMessage);
      commonQuestionsContainer.classList.remove("hidden");
      localStorage.removeItem("chatHistory");
    }
  
    // Save chat
    saveChatButton.addEventListener("click", () => {
      const msgs = document.querySelectorAll(".user-message, .bot-message");
      let content = "";
      msgs.forEach(m => {
        content += `${m.classList.contains("user-message") ? "User: " : "Bot: "} ${m.textContent}\n`;
      });
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "chat.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  
    // Event listeners
    sendButton.addEventListener("click", sendMessage);
    voiceButton.addEventListener("click", () => { if (!isListening) startVoiceRecognition(); });
    clearButton.addEventListener("click", clearChat);
    themeButton.addEventListener("click", toggleTheme);
    userInput.addEventListener("keypress", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
   }
  });
    document.querySelectorAll(".common-question").forEach(btn => {
      btn.addEventListener("click", () => {
        const question = btn.textContent.trim();
        userInput.value = question;
    
        // Slight delay to ensure input is updated before sending
        setTimeout(() => {
          sendMessage();
        }, 50);
      });
    });
    
    userInput.addEventListener("input", () => {
      userInput.style.height = "auto";
      userInput.style.height = `${userInput.scrollHeight}px`;
    });
  
// Lara Translate - direct API call from frontend (secure for production!)
languageSelector.addEventListener("change", async () => {
  const lang = languageSelector.value;
  if (lang === "en") return;

  const messages = document.querySelectorAll(".message");

  for (const msg of messages) {
    const originalText = msg.textContent.trim();
    if (!originalText) continue;

    try {
      const response = await fetch("/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: originalText,
          target_lang: lang
        })
      });

      const result = await response.json();

      if (result.translated_text) {
        msg.textContent = result.translated_text;
      } else {
        msg.textContent = "⚠️ Translation failed";
        console.error("❌ Backend error:", result.details || result.error);
      }
    } catch (err) {
      msg.textContent = "⚠️ Server error";
      console.error("❌ Request failed:", err);
    }
  }
});

});