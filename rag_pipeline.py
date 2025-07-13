import os
import pickle
import faiss
import numpy as np
import requests
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

# === Load .env file ===
load_dotenv()

# === Load FAISS Index and Chunks ===
print("📦 Loading FAISS index and document chunks...")

INDEX_PATH = "mindguard_index.idx"
CHUNKS_PATH = "mindguard_chunks.pkl"

index = faiss.read_index(INDEX_PATH)

with open(CHUNKS_PATH, "rb") as f:
    chunks = pickle.load(f)

print(f"✅ Loaded {len(chunks)} chunks.")

# === Hugging Face API Setup ===
HF_API_TOKEN = os.getenv("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") or "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"  # Fallback to your token
HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
HEADERS = {"Authorization": f"Bearer {HF_API_TOKEN}"}

# === Embedder ===
embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# === Retrieval ===
def retrieve_context(query, top_k=3):
    query_embedding = embedder.encode([query])[0]
    D, I = index.search(np.array([query_embedding]), top_k)
    return "\n".join([chunks[i] for i in I[0]])

# === Hugging Face Generation (Simplified) ===
def generate_answer(context, query):
    prompt = f"""[INST] Use the following context to answer the user's question.

Context:
{context}

Question: {query}
Answer:[/INST]"""

    payload = {
        "inputs": prompt,
        "parameters": {
            "temperature": 0.7,
            "max_new_tokens": 300,
            "return_full_text": False
        }
    }

    try:
        response = requests.post(HF_API_URL, headers=HEADERS, json=payload)
        response.raise_for_status()
        result = response.json()
        if isinstance(result, list) and len(result) > 0:
            return result[0]["generated_text"].strip()
        return "⚠️ No valid response from the model."
    except requests.exceptions.RequestException as e:
        return f"❌ Error: {str(e)}"

# === Unified Answer ===
def answer(query: str) -> str:
    context = retrieve_context(query)
    return generate_answer(context, query)

# === Example Usage ===
if __name__ == "__main__":
    test_query = "How can I manage anxiety?"
    print("🧠 Query:", test_query)
    print("📝 Answer:", answer(test_query))