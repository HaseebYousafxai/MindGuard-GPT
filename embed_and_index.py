from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle

# Load chunks
with open("all_chunks.txt", encoding="utf-8") as f:
    chunks = f.read().split("\n\n")

# Create embeddings (MiniLM = fast, lightweight)
model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(chunks, convert_to_numpy=True, show_progress_bar=True)

# Create FAISS index
index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(embeddings)

# Save index and chunks
faiss.write_index(index, "mindguard_index.idx")
with open("mindguard_chunks.pkl", "wb") as f:
    pickle.dump(chunks, f)
