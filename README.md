
```markdown
# 🧠 MindGuard GPT

**MindGuard GPT** is an AI-powered mental health support system that offers real-time, multilingual, and context-aware assistance to users facing mental health challenges. It combines the power of modern Natural Language Processing (NLP), Retrieval-Augmented Generation (RAG), voice recognition, and multilingual support to deliver empathetic, personalized guidance with privacy at its core.

---

## 🔍 Key Features

- 🧠 **AI-Powered Mental Health Chatbot**  
  Provides intelligent and context-aware responses using RAG pipelines and transformer models.

- 📚 **Domain-Specific Knowledge Integration**  
  Uses the **DSM-5-TR** as a primary source for structured mental health knowledge.

- 🔍 **FAISS-based Semantic Search**  
  Enables fast and relevant chunk retrieval from PDF and large CSV datasets.

- 🌐 **Multilingual Support**  
  Real-time translation using **Lara Translate SDK** or Google Translate API.

- 🎙️ **Voice Interaction**  
  Integrates Web Speech API for speech-to-text functionality in supported browsers.

- 💬 **Conversation History**  
  Users can download full chat sessions for later reference.

- 🔒 **Privacy-Oriented**  
  No data is stored; all communication is secure and ephemeral.

---

## 🚀 Tech Stack

| Layer             | Technology Used |
|------------------|-----------------|
| Backend           | FastAPI, LangChain, Hugging Face Transformers |
| Frontend          | HTML/CSS/JavaScript (with Streamlit or web client) |
| Embedding & Search| SentenceTransformers (MiniLM), FAISS |
| Model Inference   | Hugging Face API (`Mistral-7B-Instruct`) |
| Translation       | Lara Translate SDK / Google Translate API |
| Speech Recognition| Web Speech API |
| Data Sources      | DSM-5-TR PDF, Mental Health CSV Dataset (~700k rows) |

---

## 📁 Project Structure

```

mindguard-gpt/
├── api.py                     # FastAPI server and endpoints
├── rag\_pipeline.py            # RAG logic: retrieve + generate
├── embed\_and\_index.py         # PDF/CSV chunking and FAISS index creation
├── mindguard\_index.idx        # Saved FAISS index
├── mindguard\_chunks.pkl       # Saved document chunks
├── data/
│   ├── dsm5tr.pdf             # Source document (DSM-5-TR)
│   └── mental\_health.csv      # Large-scale structured dataset
├── static/                    # Frontend assets (JS, CSS, icons)
├── templates/                 # HTML templates
├── .env                       # API keys and environment settings
└── README.md

````

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mindguard-gpt.git
cd mindguard-gpt

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
````

> **Note:** Also install frontend dependencies if using Lara Translate JS SDK.

---

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following:

```
HF_TOKEN=your_huggingface_api_token
LARA_API_KEY=your_lara_translate_api_key
```

---

## 🧠 Usage

1. **Index your documents (once):**

```bash
python embed_and_index.py
```

2. **Run the FastAPI server:**

```bash
uvicorn api:app --reload
```

3. **Interact via UI or API:**

* Visit: `http://localhost:8000` (if UI is set up)
* Or use `POST /query` endpoint to send user input.

---

## 🗣️ Translation & Voice

* Enable **voice input** in supported browsers using `Web Speech API`.
* Use dropdown/select to change languages — powered by **Lara Translate**.

---

## 🧪 Example Prompt

```
User: I feel like I can't get out of bed and everything feels pointless.
Bot: I'm really sorry you're feeling this way. It might be a sign of depression, which is a common but serious condition...
```

---

## ✅ Future Enhancements

* User authentication and journaling
* Daily mental health tasks and check-ins
* Integration with therapists and emergency support
* Offline support for privacy
* Mobile App version

---

## 🛡️ Disclaimer

MindGuard GPT is **not a replacement for professional mental health services**. If you or someone you know is in crisis, please seek help from qualified professionals or contact emergency services.

---

## 👨‍💻 Contributors

* Haseeb Ahmad (Project Lead, Backend + ML)


---

## 📄 License

MIT License. See `LICENSE` file for details.

---

## 📬 Contact

For queries, collaboration, or feedback:

📧 \[[your-email@example.com](mailto:haseebyousafxai81@gmail.com)]
🌐 \[https://haseebyousafxai.github.io/HaseebYousafxai/]

---

```

---

Let me know if you want:

- A simplified version
- To convert it to `index.html` format
- To include your email/portfolio directly
- A downloadable `.md` version
```
