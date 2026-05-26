-- Run this in the Supabase SQL Editor before starting the Python backend.
-- It creates the tables used by the React fitness app.

create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  goal text not null check (goal in ('lose-fat', 'build-muscle')),
  daily_schedule text not null,
  onboarded boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_stats (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  total_workouts integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  total_minutes integer not null default 0,
  total_calories integer not null default 0,
  last_workout_date timestamptz,
  weekly_goal integer not null default 4
);

create table if not exists public.workout_logs (
  id text primary key,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  workout_id text not null default '',
  workout_name text not null,
  date timestamptz not null,
  duration integer not null,
  exercises jsonb not null default '[]'::jsonb,
  calories_burned integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.scheduled_workouts (
  id text primary key,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  workout_id text not null,
  workout_name text not null,
  date date not null,
  time time not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id text not null,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  title text not null,
  description text not null,
  icon text not null,
  unlocked boolean not null default false,
  unlocked_date timestamptz,
  primary key (id, user_id)
);

create index if not exists workout_logs_user_date_idx
  on public.workout_logs (user_id, date desc);

create index if not exists scheduled_workouts_user_date_idx
  on public.scheduled_workouts (user_id, date);

-- RLS is enabled because these tables live in the public schema.
-- The backend can still access them with the server-side service_role key.
alter table public.user_profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.workout_logs enable row level security;
alter table public.scheduled_workouts enable row level security;
alter table public.achievements enable row level security;
