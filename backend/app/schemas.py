from datetime import date, datetime, time
from typing import Any, Dict, List, Literal, Optional
from uuid import UUID

from pydantic import BaseModel, Field


Goal = Literal["lose-fat", "build-muscle"]


class UserProfileCreate(BaseModel):
    """Data collected on the Get Started screen."""

    name: str = Field(..., min_length=1, max_length=80)
    goal: Goal
    daily_schedule: str = Field(..., min_length=1, max_length=80)
    onboarded: bool = True


class UserProfile(UserProfileCreate):
    """Profile returned by the backend after Supabase saves it."""

    id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ExerciseLog(BaseModel):
    """One completed exercise inside a workout log."""

    name: str
    sets: int = 0
    reps: int = 0
    weight: Optional[float] = None


class WorkoutLogCreate(BaseModel):
    """Payload sent when a user completes a workout."""

    id: Optional[str] = None
    user_id: UUID
    workout_id: str = ""
    workout_name: str
    date: datetime
    duration: int
    exercises: List[ExerciseLog]
    calories_burned: int = 0


class WorkoutLog(WorkoutLogCreate):
    id: str
    created_at: Optional[datetime] = None


class UserStats(BaseModel):
    """Totals used by Dashboard, Home, and Progress screens."""

    user_id: UUID
    total_workouts: int = 0
    current_streak: int = 0
    longest_streak: int = 0
    total_minutes: int = 0
    total_calories: int = 0
    last_workout_date: Optional[datetime] = None
    weekly_goal: int = 4


class ScheduledWorkoutCreate(BaseModel):
    """Payload used by the Schedule and Programs screens."""

    id: Optional[str] = None
    user_id: UUID
    workout_id: str
    workout_name: str
    date: date
    time: time
    completed: bool = False


class ScheduledWorkoutUpdate(BaseModel):
    """Partial update, for example marking a scheduled workout complete."""

    workout_id: Optional[str] = None
    workout_name: Optional[str] = None
    date: Optional[date] = None
    time: Optional[time] = None
    completed: Optional[bool] = None


class ScheduledWorkout(ScheduledWorkoutCreate):
    id: str
    created_at: Optional[datetime] = None


class Achievement(BaseModel):
    """Achievement badges shown on the Dashboard."""

    id: str
    user_id: UUID
    title: str
    description: str
    icon: str
    unlocked: bool = False
    unlocked_date: Optional[datetime] = None


class ApiMessage(BaseModel):
    message: str


def to_supabase_dict(model: BaseModel) -> Dict[str, Any]:
    """Convert Pydantic models into JSON-friendly dicts for Supabase."""

    return model.model_dump(mode="json", exclude_none=True)
