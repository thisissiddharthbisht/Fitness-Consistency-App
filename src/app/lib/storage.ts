// API-backed storage utilities for fitness data.
// React calls these functions, these functions call the Python FastAPI backend,
// and the backend stores/retrieves the real data from Supabase.

export interface UserProfile {
  id?: string;
  name: string;
  goal: 'lose-fat' | 'build-muscle';
  dailySchedule: string;
  onboarded: boolean;
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  workoutName: string;
  date: string;
  duration: number; // minutes
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }[];
  caloriesBurned?: number;
}

export interface UserStats {
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  totalMinutes: number;
  totalCalories: number;
  lastWorkoutDate: string | null;
  weeklyGoal: number; // workouts per week
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface ScheduledWorkout {
  id: string;
  workoutId: string;
  workoutName: string;
  date: string;
  time: string;
  completed: boolean;
}

const PRODUCTION_API_URL = 'https://fitness-progress-tracker-api.onrender.com';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? PRODUCTION_API_URL : 'http://127.0.0.1:8000');

const STORAGE_KEYS = {
  WORKOUT_LOGS: 'fitness_workout_logs',
  USER_STATS: 'fitness_user_stats',
  ACHIEVEMENTS: 'fitness_achievements',
  SCHEDULED_WORKOUTS: 'fitness_scheduled_workouts',
  USER_PROFILE: 'fitness_user_profile',
};

export const defaultUserStats: UserStats = {
  totalWorkouts: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalMinutes: 0,
  totalCalories: 0,
  lastWorkoutDate: null,
  weeklyGoal: 4,
};

export const defaultAchievements: Achievement[] = [
  { id: '1', title: 'First Step', description: 'Complete your first workout', icon: 'Trophy', unlocked: false },
  { id: '2', title: 'Week Warrior', description: 'Complete 7 workouts', icon: 'Award', unlocked: false },
  { id: '3', title: 'Consistent', description: 'Maintain a 7-day streak', icon: 'Flame', unlocked: false },
  { id: '4', title: 'Dedicated', description: 'Complete 30 workouts', icon: 'Star', unlocked: false },
  { id: '5', title: 'Unstoppable', description: 'Maintain a 30-day streak', icon: 'Zap', unlocked: false },
  { id: '6', title: 'Century Club', description: 'Complete 100 workouts', icon: 'Medal', unlocked: false },
];

const readJson = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
};

const writeJson = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API ${response.status}: ${body}`);
  }

  return response.json();
};

const toApiProfile = (profile: UserProfile) => ({
  name: profile.name,
  goal: profile.goal,
  daily_schedule: profile.dailySchedule,
  onboarded: profile.onboarded,
});

const fromApiProfile = (profile: any): UserProfile => ({
  id: profile.id,
  name: profile.name,
  goal: profile.goal,
  dailySchedule: profile.daily_schedule,
  onboarded: profile.onboarded,
});

const fromApiStats = (stats: any): UserStats => ({
  totalWorkouts: stats.total_workouts,
  currentStreak: stats.current_streak,
  longestStreak: stats.longest_streak,
  totalMinutes: stats.total_minutes,
  totalCalories: stats.total_calories,
  lastWorkoutDate: stats.last_workout_date,
  weeklyGoal: stats.weekly_goal,
});

const toApiWorkoutLog = (log: WorkoutLog, userId: string) => ({
  id: log.id,
  user_id: userId,
  workout_id: log.workoutId,
  workout_name: log.workoutName,
  date: log.date,
  duration: log.duration,
  exercises: log.exercises,
  calories_burned: log.caloriesBurned || 0,
});

const fromApiWorkoutLog = (log: any): WorkoutLog => ({
  id: log.id,
  workoutId: log.workout_id,
  workoutName: log.workout_name,
  date: log.date,
  duration: log.duration,
  exercises: log.exercises || [],
  caloriesBurned: log.calories_burned,
});

const toApiScheduledWorkout = (workout: ScheduledWorkout, userId: string) => ({
  id: workout.id,
  user_id: userId,
  workout_id: workout.workoutId,
  workout_name: workout.workoutName,
  date: workout.date,
  time: workout.time,
  completed: workout.completed,
});

const fromApiScheduledWorkout = (workout: any): ScheduledWorkout => ({
  id: workout.id,
  workoutId: workout.workout_id,
  workoutName: workout.workout_name,
  date: workout.date,
  time: workout.time,
  completed: workout.completed,
});

const fromApiAchievement = (achievement: any): Achievement => ({
  id: achievement.id,
  title: achievement.title,
  description: achievement.description,
  icon: achievement.icon,
  unlocked: achievement.unlocked,
  unlockedDate: achievement.unlocked_date,
});

const getCachedProfile = (): UserProfile | null => {
  return readJson<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
};

const getCurrentUserId = (): string | null => {
  return getCachedProfile()?.id || null;
};

// User Profile
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const cachedProfile = getCachedProfile();

  // The backend needs the current user's id, so localStorage keeps only the active profile id.
  if (!cachedProfile?.id) {
    return cachedProfile;
  }

  try {
    const profile = fromApiProfile(await request(`/profiles/${cachedProfile.id}`));
    writeJson(STORAGE_KEYS.USER_PROFILE, profile);
    return profile;
  } catch (error) {
    console.warn('Using cached profile because the backend profile request failed.', error);
    return cachedProfile;
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  const savedProfile = fromApiProfile(
    await request('/profiles', {
      method: 'POST',
      body: JSON.stringify(toApiProfile(profile)),
    })
  );

  writeJson(STORAGE_KEYS.USER_PROFILE, savedProfile);
  return savedProfile;
};

// Workout Logs
export const getWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  const userId = getCurrentUserId();
  if (!userId) {
    return readJson<WorkoutLog[]>(STORAGE_KEYS.WORKOUT_LOGS, []);
  }

  try {
    const logs = (await request<any[]>(`/profiles/${userId}/workout-logs`)).map(fromApiWorkoutLog);
    writeJson(STORAGE_KEYS.WORKOUT_LOGS, logs);
    return logs;
  } catch (error) {
    console.warn('Using cached workout logs because the backend request failed.', error);
    return readJson<WorkoutLog[]>(STORAGE_KEYS.WORKOUT_LOGS, []);
  }
};

export const addWorkoutLog = async (log: WorkoutLog): Promise<WorkoutLog> => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('No user profile found. Complete onboarding before saving a workout.');
  }

  const savedLog = fromApiWorkoutLog(
    await request('/workout-logs', {
      method: 'POST',
      body: JSON.stringify(toApiWorkoutLog(log, userId)),
    })
  );

  const cachedLogs = readJson<WorkoutLog[]>(STORAGE_KEYS.WORKOUT_LOGS, []);
  writeJson(STORAGE_KEYS.WORKOUT_LOGS, [savedLog, ...cachedLogs]);

  // Refresh stats/achievements so the next screen can show updated values.
  await Promise.allSettled([getUserStats(), getAchievements()]);
  return savedLog;
};

// Simplified workout log saving
export const saveWorkoutLog = async (data: {
  workoutName: string;
  duration: number;
  caloriesBurned: number;
  date: string;
  exercises: string[];
}): Promise<WorkoutLog> => {
  const log: WorkoutLog = {
    id: `log-${Date.now()}`,
    workoutId: '',
    workoutName: data.workoutName,
    date: data.date,
    duration: data.duration,
    exercises: data.exercises.map(name => ({ name, sets: 0, reps: 0 })),
    caloriesBurned: data.caloriesBurned,
  };

  return addWorkoutLog(log);
};

// User Stats
export const getUserStats = async (): Promise<UserStats> => {
  const userId = getCurrentUserId();
  if (!userId) {
    return readJson<UserStats>(STORAGE_KEYS.USER_STATS, defaultUserStats);
  }

  try {
    const stats = fromApiStats(await request(`/profiles/${userId}/stats`));
    writeJson(STORAGE_KEYS.USER_STATS, stats);
    return stats;
  } catch (error) {
    console.warn('Using cached stats because the backend request failed.', error);
    return readJson<UserStats>(STORAGE_KEYS.USER_STATS, defaultUserStats);
  }
};

// Achievements
export const getAchievements = async (): Promise<Achievement[]> => {
  const userId = getCurrentUserId();
  if (!userId) {
    return readJson<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, defaultAchievements);
  }

  try {
    const achievements = (await request<any[]>(`/profiles/${userId}/achievements`)).map(fromApiAchievement);
    writeJson(STORAGE_KEYS.ACHIEVEMENTS, achievements);
    return achievements;
  } catch (error) {
    console.warn('Using cached achievements because the backend request failed.', error);
    return readJson<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, defaultAchievements);
  }
};

// Scheduled Workouts
export const getScheduledWorkouts = async (): Promise<ScheduledWorkout[]> => {
  const userId = getCurrentUserId();
  if (!userId) {
    return readJson<ScheduledWorkout[]>(STORAGE_KEYS.SCHEDULED_WORKOUTS, []);
  }

  try {
    const scheduled = (await request<any[]>(`/profiles/${userId}/scheduled-workouts`)).map(fromApiScheduledWorkout);
    writeJson(STORAGE_KEYS.SCHEDULED_WORKOUTS, scheduled);
    return scheduled;
  } catch (error) {
    console.warn('Using cached scheduled workouts because the backend request failed.', error);
    return readJson<ScheduledWorkout[]>(STORAGE_KEYS.SCHEDULED_WORKOUTS, []);
  }
};

export const addScheduledWorkout = async (workout: ScheduledWorkout): Promise<ScheduledWorkout> => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('No user profile found. Complete onboarding before scheduling a workout.');
  }

  const savedWorkout = fromApiScheduledWorkout(
    await request('/scheduled-workouts', {
      method: 'POST',
      body: JSON.stringify(toApiScheduledWorkout(workout, userId)),
    })
  );

  const cachedScheduled = readJson<ScheduledWorkout[]>(STORAGE_KEYS.SCHEDULED_WORKOUTS, []);
  writeJson(STORAGE_KEYS.SCHEDULED_WORKOUTS, [...cachedScheduled, savedWorkout]);
  return savedWorkout;
};

export const updateScheduledWorkout = async (
  id: string,
  updates: Partial<ScheduledWorkout>
): Promise<ScheduledWorkout> => {
  const apiUpdates = {
    workout_id: updates.workoutId,
    workout_name: updates.workoutName,
    date: updates.date,
    time: updates.time,
    completed: updates.completed,
  };

  const savedWorkout = fromApiScheduledWorkout(
    await request(`/scheduled-workouts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(apiUpdates),
    })
  );

  const cachedScheduled = readJson<ScheduledWorkout[]>(STORAGE_KEYS.SCHEDULED_WORKOUTS, []);
  writeJson(
    STORAGE_KEYS.SCHEDULED_WORKOUTS,
    cachedScheduled.map(workout => (workout.id === id ? savedWorkout : workout))
  );
  return savedWorkout;
};

export const deleteScheduledWorkout = async (id: string): Promise<void> => {
  await request(`/scheduled-workouts/${id}`, { method: 'DELETE' });

  const cachedScheduled = readJson<ScheduledWorkout[]>(STORAGE_KEYS.SCHEDULED_WORKOUTS, []);
  writeJson(
    STORAGE_KEYS.SCHEDULED_WORKOUTS,
    cachedScheduled.filter(workout => workout.id !== id)
  );
};
