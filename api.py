# api.py

import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from rag_pipeline import answer

from lara_sdk import Credentials, Translator  # ✅ Use Lara Python SDK

# Load .env credentials
load_dotenv()

LARA_API_ID = os.getenv("LARA_API_ID")
LARA_API_SECRET = os.getenv("LARA_API_SECRET")

if not LARA_API_ID or not LARA_API_SECRET:
    raise RuntimeError("Missing LARA_API_ID or LARA_API_SECRET in .env")

# Setup Lara SDK translator once
lara_credentials = Credentials(access_key_id=LARA_API_ID, access_key_secret=LARA_API_SECRET)
lara = Translator(lara_credentials)

# Set up FastAPI app
app = FastAPI()

# Static file serving (Frontend)
app.mount("/static", StaticFiles(directory="Frontend/static"), name="static")
@app.get("/")
def get_index():
    return FileResponse("Frontend/index.html")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Restrict this in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chat route
class UserQuery(BaseModel):
    text: str

@app.post("/chat")
def chat(query: UserQuery):
    return {"response": answer(query.text)}

# Translation route
@app.post("/translate")
async def translate(req: Request):
    from lara_sdk import Credentials, Translator

    body = await req.json()
    text = body.get("text")
    target_lang = body.get("target_lang")

    print(f"🟢 Incoming translation: '{text}' → '{target_lang}'")

    if not text or not target_lang:
        return {"error": "Missing text or target_lang"}

    lang_map = {
        "ur": "ur-PK",
        "en": "en-US",
        "es": "es-ES",
        "fr": "fr-FR",
        "de": "de-DE",
        "zh": "zh-CN"
    }

    # Map to full language codes
    target_full = lang_map.get(target_lang, target_lang)

    try:
        credentials = Credentials(
            access_key_id=os.getenv("LARA_API_ID"),
            access_key_secret=os.getenv("LARA_API_SECRET")
        )
        lara = Translator(credentials)

        result = lara.translate(text, source="en-US", target=target_full)
        print("✅ Translated:", result.translation)
        return {"translated_text": result.translation}

    except Exception as e:
        print("🔥 Translation error:", str(e))
        return {"error": "Translation failed", "details": str(e)}

# Run locally (optional)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
