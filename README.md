
# Fitness Consistency App

This project started as a Figma-generated React frontend and now includes a Python FastAPI backend for Supabase persistence.

## Frontend

Run `npm i` to install the dependencies.

Create `.env` from `.env.example` if you need to change the backend URL.

Run `npm run dev` to start the React development server.

## Backend

The backend lives in `backend/`.

Run the SQL in `backend/supabase_schema.sql` inside the Supabase SQL Editor, then create `backend/.env` from `backend/.env.example`.

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Health check:

```bash
curl http://127.0.0.1:8000/health
```
