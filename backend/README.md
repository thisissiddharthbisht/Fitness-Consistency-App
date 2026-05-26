# Fitness Consistency Python Backend

This backend is the middle layer required by the assignment:

React frontend -> Python FastAPI backend -> Supabase database

The frontend should send workout/profile/schedule data to this API. The API then stores it in Supabase using environment variables, so secret keys are not exposed in the browser.

## Local Setup

1. Create the Supabase tables:

   Open Supabase -> SQL Editor -> paste `backend/supabase_schema.sql` -> Run.

2. Create a local environment file:

   ```bash
   cp backend/.env.example backend/.env
   ```

3. Fill in:

   ```bash
   SUPABASE_URL=...
   SUPABASE_KEY=...
   ```

4. Install dependencies:

   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

5. Run the API:

   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

6. Test it:

   Open `http://localhost:8000/health`.

## Demo Explanation

- `app/main.py` defines the API routes.
- `app/schemas.py` validates incoming data before it reaches Supabase.
- `app/database.py` creates the Supabase client using environment variables.
- `supabase_schema.sql` creates the database tables shown in the Supabase Table Editor.

For the video, complete this sentence:

"The React app collects the user's fitness data. Instead of saving only to localStorage, the data is sent to this FastAPI backend. The backend validates it, writes it to Supabase, and then the dashboard can retrieve the saved records."
