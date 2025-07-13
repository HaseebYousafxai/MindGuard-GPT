from PyPDF2 import PdfReader
import pandas as pd

# --- 1. Extract DSM content ---
pdf = PdfReader("DSM 5 TR.pdf")
dsm_text = ""
for page in pdf.pages[30:]:  # skip intro pages
    dsm_text += page.extract_text() + "\n"
dsm_chunks = dsm_text.split("\n\n")

# --- 2. Extract structured Q&A ---
df = pd.read_csv("mental_health_dataset_20250112_194722.csv")

# Format each row into a coherent RAG chunk
structured_chunks = []
for _, row in df.iterrows():
    chunk = (
        f"User Query: {row['user_query']}\n"
        f"Emotion Detected: {row['emotion_detected']}\n"
        f"Situation Context: {row['situation_context']}\n\n"
        f"Acknowledgment: {row['response.acknowledgment']}\n"
        f"Support Response: {row['response.support']}"
    )
    structured_chunks.append(chunk)

# Combine all
all_chunks = dsm_chunks + structured_chunks

# Save to text file for embedding (use UTF-8 to avoid encode errors)
with open("all_chunks.txt", "w", encoding="utf-8") as f:
    f.write("\n\n".join(all_chunks))
