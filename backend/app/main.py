from datetime import datetime, timedelta, timezone
from typing import List
from uuid import UUID

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import get_supabase, unwrap_response
from .schemas import (
    Achievement,
    ApiMessage,
    ScheduledWorkout,
    ScheduledWorkoutCreate,
    ScheduledWorkoutUpdate,
    UserProfile,
    UserProfileCreate,
    UserStats,
    WorkoutLog,
    WorkoutLogCreate,
    to_supabase_dict,
)


app = FastAPI(
    title="Fitness Consistency API",
    description="Python backend for the React fitness app. It stores user data in Supabase.",
    version="1.0.0",
)

settings = get_settings()

# CORS allows your React app to call this backend from localhost or your deployed frontend URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DEFAULT_ACHIEVEMENTS = [
    {"id": "1", "title": "First Step", "description": "Complete your first workout", "icon": "Trophy"},
    {"id": "2", "title": "Week Warrior", "description": "Complete 7 workouts", "icon": "Award"},
    {"id": "3", "title": "Consistent", "description": "Maintain a 7-day streak", "icon": "Flame"},
    {"id": "4", "title": "Dedicated", "description": "Complete 30 workouts", "icon": "Star"},
    {"id": "5", "title": "Unstoppable", "description": "Maintain a 30-day streak", "icon": "Zap"},
    {"id": "6", "title": "Century Club", "description": "Complete 100 workouts", "icon": "Medal"},
]


@app.get("/health", response_model=ApiMessage)
def health_check() -> ApiMessage:
    """Simple endpoint for deployment checks."""

    return ApiMessage(message="Fitness API is running")


@app.post("/profiles", response_model=UserProfile, status_code=status.HTTP_201_CREATED)
def create_profile(profile: UserProfileCreate) -> UserProfile:
    """Save the onboarding profile from the Get Started page."""

    supabase = get_supabase()
    saved_profile = unwrap_response(
        supabase.table("user_profiles").insert(to_supabase_dict(profile)).execute()
    )[0]

    # Create related rows immediately so Dashboard/Progress have defaults to read.
    ensure_stats(saved_profile["id"])
    ensure_achievements(saved_profile["id"])

    return UserProfile(**saved_profile)


@app.get("/profiles/{user_id}", response_model=UserProfile)
def get_profile(user_id: UUID) -> UserProfile:
    """Read a saved profile back from Supabase."""

    profile = _single_row("user_profiles", "id", str(user_id))
    return UserProfile(**profile)


@app.get("/profiles/{user_id}/stats", response_model=UserStats)
def get_stats(user_id: UUID) -> UserStats:
    """Return current totals for a user."""

    return UserStats(**ensure_stats(str(user_id)))


@app.get("/profiles/{user_id}/achievements", response_model=List[Achievement])
def get_achievements(user_id: UUID) -> List[Achievement]:
    """Return all achievement badges for a user."""

    rows = ensure_achievements(str(user_id))
    return [Achievement(**row) for row in rows]


@app.post("/workout-logs", response_model=WorkoutLog, status_code=status.HTTP_201_CREATED)
def create_workout_log(log: WorkoutLogCreate) -> WorkoutLog:
    """Save a completed workout and update stats/achievements.

    This is the endpoint you can demo: complete a workout in React, then open
    the Supabase `workout_logs` table and show that a new row appeared.
    """

    supabase = get_supabase()
    payload = to_supabase_dict(log)
    payload["id"] = payload.get("id") or f"log-{int(datetime.now(timezone.utc).timestamp() * 1000)}"

    saved_log = unwrap_response(supabase.table("workout_logs").insert(payload).execute())[0]
    updated_stats = update_stats_after_workout(saved_log)
    update_achievement_unlocks(str(log.user_id), updated_stats)

    return WorkoutLog(**saved_log)


@app.get("/profiles/{user_id}/workout-logs", response_model=List[WorkoutLog])
def list_workout_logs(user_id: UUID) -> List[WorkoutLog]:
    """Return workout history newest first."""

    supabase = get_supabase()
    rows = unwrap_response(
        supabase.table("workout_logs")
        .select("*")
        .eq("user_id", str(user_id))
        .order("date", desc=True)
        .execute()
    )
    return [WorkoutLog(**row) for row in rows]


@app.post("/scheduled-workouts", response_model=ScheduledWorkout, status_code=status.HTTP_201_CREATED)
def create_scheduled_workout(workout: ScheduledWorkoutCreate) -> ScheduledWorkout:
    """Save a workout scheduled from the calendar or program page."""

    supabase = get_supabase()
    payload = to_supabase_dict(workout)
    payload["id"] = payload.get("id") or f"schedule-{int(datetime.now(timezone.utc).timestamp() * 1000)}"

    row = unwrap_response(supabase.table("scheduled_workouts").insert(payload).execute())[0]
    return ScheduledWorkout(**row)


@app.get("/profiles/{user_id}/scheduled-workouts", response_model=List[ScheduledWorkout])
def list_scheduled_workouts(user_id: UUID) -> List[ScheduledWorkout]:
    """Return all calendar items for the Schedule screen."""

    supabase = get_supabase()
    rows = unwrap_response(
        supabase.table("scheduled_workouts")
        .select("*")
        .eq("user_id", str(user_id))
        .order("date")
        .execute()
    )
    return [ScheduledWorkout(**row) for row in rows]


@app.patch("/scheduled-workouts/{schedule_id}", response_model=ScheduledWorkout)
def update_scheduled_workout(schedule_id: str, updates: ScheduledWorkoutUpdate) -> ScheduledWorkout:
    """Update a scheduled workout, commonly to mark it as completed."""

    supabase = get_supabase()
    payload = updates.model_dump(mode="json", exclude_none=True)
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No updates provided.")

    rows = unwrap_response(
        supabase.table("scheduled_workouts").update(payload).eq("id", schedule_id).execute()
    )
    if not rows:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheduled workout not found.")

    return ScheduledWorkout(**rows[0])


@app.delete("/scheduled-workouts/{schedule_id}", response_model=ApiMessage)
def delete_scheduled_workout(schedule_id: str) -> ApiMessage:
    """Remove a scheduled workout from the calendar."""

    supabase = get_supabase()
    unwrap_response(supabase.table("scheduled_workouts").delete().eq("id", schedule_id).execute())
    return ApiMessage(message="Scheduled workout deleted")


def _single_row(table: str, column: str, value: str):
    """Fetch exactly one row or return a 404 that the frontend can understand."""

    supabase = get_supabase()
    rows = unwrap_response(supabase.table(table).select("*").eq(column, value).limit(1).execute())
    if not rows:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{table} row not found.")
    return rows[0]


def ensure_stats(user_id: str):
    """Create the default stats row if it does not exist yet."""

    supabase = get_supabase()
    rows = unwrap_response(supabase.table("user_stats").select("*").eq("user_id", user_id).limit(1).execute())
    if rows:
        return rows[0]

    default_stats = {
        "user_id": user_id,
        "total_workouts": 0,
        "current_streak": 0,
        "longest_streak": 0,
        "total_minutes": 0,
        "total_calories": 0,
        "last_workout_date": None,
        "weekly_goal": 4,
    }
    return unwrap_response(supabase.table("user_stats").insert(default_stats).execute())[0]


def ensure_achievements(user_id: str):
    """Create the six default achievement rows for a new user."""

    supabase = get_supabase()
    rows = unwrap_response(supabase.table("achievements").select("*").eq("user_id", user_id).execute())
    if rows:
        return rows

    default_rows = [
        {**achievement, "user_id": user_id, "unlocked": False, "unlocked_date": None}
        for achievement in DEFAULT_ACHIEVEMENTS
    ]
    return unwrap_response(supabase.table("achievements").insert(default_rows).execute())


def update_stats_after_workout(log: dict):
    """Update totals and streaks after a completed workout is saved."""

    supabase = get_supabase()
    user_id = log["user_id"]
    stats = ensure_stats(user_id)

    now = datetime.now(timezone.utc)
    last_workout_date = stats.get("last_workout_date")

    current_streak = stats.get("current_streak", 0)
    if not last_workout_date:
        current_streak = 1
    else:
        last_date = datetime.fromisoformat(last_workout_date.replace("Z", "+00:00")).date()
        today = now.date()
        yesterday = today - timedelta(days=1)

        if last_date == today:
            # Same-day extra workouts count toward totals but do not increase the day streak.
            current_streak = stats.get("current_streak", 0)
        elif last_date == yesterday:
            current_streak += 1
        else:
            current_streak = 1

    updated_stats = {
        "total_workouts": stats.get("total_workouts", 0) + 1,
        "current_streak": current_streak,
        "longest_streak": max(stats.get("longest_streak", 0), current_streak),
        "total_minutes": stats.get("total_minutes", 0) + int(log.get("duration") or 0),
        "total_calories": stats.get("total_calories", 0) + int(log.get("calories_burned") or 0),
        "last_workout_date": now.isoformat(),
        "weekly_goal": stats.get("weekly_goal", 4),
    }

    rows = unwrap_response(
        supabase.table("user_stats").update(updated_stats).eq("user_id", user_id).execute()
    )
    return rows[0]


def update_achievement_unlocks(user_id: str, stats: dict) -> None:
    """Unlock achievements when the user's stats reach a milestone."""

    supabase = get_supabase()
    achievements = ensure_achievements(user_id)
    now = datetime.now(timezone.utc).isoformat()

    for achievement in achievements:
        if achievement.get("unlocked"):
            continue

        should_unlock = (
            (achievement["id"] == "1" and stats["total_workouts"] >= 1)
            or (achievement["id"] == "2" and stats["total_workouts"] >= 7)
            or (achievement["id"] == "3" and stats["current_streak"] >= 7)
            or (achievement["id"] == "4" and stats["total_workouts"] >= 30)
            or (achievement["id"] == "5" and stats["current_streak"] >= 30)
            or (achievement["id"] == "6" and stats["total_workouts"] >= 100)
        )

        if should_unlock:
            unwrap_response(
                supabase.table("achievements")
                .update({"unlocked": True, "unlocked_date": now})
                .eq("user_id", user_id)
                .eq("id", achievement["id"])
                .execute()
            )
