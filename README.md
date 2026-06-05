
# Fitness Consistency

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Tech Stack](https://img.shields.io/badge/stack-React%20%7C%20TypeScript%20%7C%20FastAPI%20%7C%20Supabase-blue)](https://github.com)

> A full-stack MVP fitness tracking web application that unifies exercise, nutrition, and progress monitoring into a single dashboard.

## Executive Summary

Many individuals struggle with fragmented health tracking across separate apps for workouts, calories, and progress metrics. This project solves that problem by providing a centralized web application where users can log activity, track nutrition, and review trends with a shared data model.

Fitness Consistency is built for students and fitness enthusiasts who want a polished, academic-grade solution for personal health monitoring. The application combines a modern React frontend with a robust backend API to support authenticated tracking, workout logging, and visual progress reporting.

## Core Features

- **User Authentication**: since it MVP there is just simple sign-up and login flow no session management.
- **Personalized Dashboard**: Daily activity summaries with a tailored view of workouts and nutrition.
- **Workout Logging**: Access an exercise database or create custom entries for workouts.
- **Calorie / Macro Tracking**: Log meals and nutrition details to monitor energy intake.
- **Progress Visualization**: Weekly and monthly charts for performance trends using frontend charting libraries.
- **Responsive UI**: Mobile-friendly interface designed for gym-goers and at-home trainers.
- **Data Persistence**: Backend storage for user data, nutrition logs, and workout history.

## System Architecture

Fitness Consistency is implemented as a full-stack web application with the following high-level architecture:

- **Frontend**: React + TypeScript, built with Vite, providing the user interface and data visualization.
- **Backend**: Python FastAPI, exposing REST endpoints for authentication, workouts, nutrition, and progress.
- **Database**: Supabase/PostgreSQL for persistent storage of user profiles, workout logs, and nutrition entries.
- **Authentication**: JWT-based token security to protect user sessions and API access.

### Directory Structure

```
fitness-consistency-app/
├── .gitignore                  # Tells Git to ignore node_modules, Python venv, and .env keys
├── index.html                  # Main HTML entry point for the React app
├── package.json                # Frontend packages (React, Vite, Radix UI, Tailwind)
├── vite.config.ts              # Vite configuration for building/bundling the frontend
├── src/                        # FRONTEND SOURCE
│   ├── main.tsx                # Mounts the React application
│   ├── styles/                 # Tailwind, fonts, and theme definitions
│   └── app/
│       ├── App.tsx             # Root component handling routes & layout wrappers
│       ├── routes.ts           # Defines pages (Home, Dashboard, Progress, etc.)
│       ├── lib/
│       │   ├── storage.ts      # API client: calls Python backend instead of direct LocalStorage
│       │   └── workoutData.ts  # Pre-defined workout templates and exercises
│       ├── components/         # Reusable UI widgets (cards, buttons, calendars)
│       └── pages/              # Screen components
│           ├── GetStarted.tsx  # Onboarding screen (User Profile creation)
│           ├── Dashboard.tsx   # Aggregated stats, streak visualization, achievements
│           ├── Workouts.tsx    # List of available workouts
│           ├── WorkoutScreen.tsx # Interactive workout tracker (timer, set checker)
│           ├── WorkoutComplete.tsx # Summary of calorie burn and duration
│           ├── Progress.tsx    # Logs history and analytics graphs
│           └── Schedule.tsx    # Planner calendar (schedule future workouts)
│
└── backend/                    # BACKEND SOURCE
    ├── .env                    # SECRETS: Stored locally only (NEVER committed to GitHub)
    ├── .env.example            # Placeholder templates showing required env vars
    ├── requirements.txt        # Python package list (fastapi, uvicorn, supabase)
    ├── supabase_schema.sql     # SQL database schema to set up tables in Supabase
    └── app/
        ├── __init__.py
        ├── config.py           # Loads env keys and restricts access
        ├── database.py         # Connects to Supabase with the service_role key
        ├── schemas.py          # Validates data shapes sent by React (Pydantic models)
        └── main.py             # FastAPI App: routes profiles, logs, and stats
```

## Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/thisissiddharthbisht/fitness-consistency.git
cd fitness-consistency
```

2. Install frontend dependencies:

```bash
npm install
```

3. Configure frontend environment variables:

```bash
cp .env.example .env
```

4. Set up the backend environment:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

5. Initialize the database schema in Supabase or PostgreSQL using `backend/supabase_schema.sql`.

6. Run the services:

```bash
npm run dev
```

In a second terminal:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

## User Journey

1. A new user signs up and authenticates with the application.
2. They land on a personalized dashboard that summarizes daily activity and nutrition.
3. The user logs a workout from the exercise collection or creates a custom entry.
4. They add meal and macro details for calorie tracking.
5. The application updates progress charts and metrics for weekly/monthly review.

## Future Enhancements

- Wearable integration with Apple Health and Google Fit APIs.
- AI-driven workout recommendations and adaptive training plans.
- Social sharing and friend comparison features.
- Advanced biometric tracking with sleep and recovery analytics.
- Mobile-first native companion app or PWA support.

## Contributors


| Siddhart Bisht | [@thisissiddharthbisht](https://github.com/thisissiddhartbisht) |



