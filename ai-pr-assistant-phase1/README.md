# AI Pull Request Assistant — Phase 1

Phase 1 sets up the project skeleton only: a FastAPI backend with two basic
routes, and a React (Vite) frontend that confirms it can talk to the backend.
No GitHub integration, AI, or database yet — that comes in later phases.

See the full setup guide in the chat response, or follow the quick commands
below.

## Backend
```
cd backend
python3 -m venv venv
source venv/bin/activate   # venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Runs at http://127.0.0.1:8000 — Swagger docs at http://127.0.0.1:8000/docs

## Frontend
```
cd frontend
npm install
npm run dev
```
Runs at http://localhost:5173
