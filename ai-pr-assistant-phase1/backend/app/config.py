import os
from dotenv import load_dotenv

# Load .env variables from backend root
load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "").strip()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
