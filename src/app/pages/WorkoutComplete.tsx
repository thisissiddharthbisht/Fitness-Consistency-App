import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Trophy, Flame, TrendingUp, ArrowRight } from 'lucide-react';
import { workouts } from '../lib/workoutData';
import { useEffect, useRef, useState } from 'react';
import { defaultUserStats, saveWorkoutLog, getUserStats } from '../lib/storage';

export default function WorkoutComplete() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const workout = workouts.find(w => w.id === workoutId);
  const hasSavedWorkout = useRef(false);
  const [stats, setStats] = useState(defaultUserStats);

  useEffect(() => {
    const saveCompletedWorkout = async () => {
      if (!workout || hasSavedWorkout.current) {
        return;
      }

      hasSavedWorkout.current = true;

      // Save workout log through the backend, then refresh stats from Supabase.
      await saveWorkoutLog({
        workoutName: workout.name,
        duration: workout.duration,
        caloriesBurned: workout.caloriesBurned,
        date: new Date().toISOString(),
        exercises: workout.exercises.map(e => e.name),
      });
      setStats(await getUserStats());
    };

    saveCompletedWorkout().catch(error => {
      console.error('Could not save completed workout', error);
    });
  }, [workout]);

  if (!workout) {
    return null;
  }

  const progress = Math.min((stats.totalWorkouts / 10) * 100, 100); // Progress towards 10 workouts milestone

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-green-50 rounded-full p-6">
            <Trophy className="size-16 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">Workout Completed!</h1>
          <p className="text-gray-500">Great job on finishing your workout</p>
        </div>

        {/* Stats Cards */}
        <div className="space-y-3">
          {/* Workout Name */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <p className="text-sm text-gray-500">Workout</p>
            <p className="text-xl font-semibold text-gray-900 mt-1">{workout.name}</p>
          </div>

          {/* Duration & Calories */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <Flame className="size-5" />
              </div>
              <p className="text-2xl font-semibold text-gray-900">{workout.caloriesBurned}</p>
              <p className="text-sm text-gray-500 mt-1">Calories burned</p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-2 text-purple-600 mb-2">
                <TrendingUp className="size-5" />
              </div>
              <p className="text-2xl font-semibold text-gray-900">{Math.round(progress)}%</p>
              <p className="text-sm text-gray-500 mt-1">Progress</p>
            </div>
          </div>
        </div>

        {/* Total Stats */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <p className="text-blue-100 text-sm mb-4">Your Total Stats</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-semibold">{stats.currentStreak}</p>
              <p className="text-xs text-blue-100 mt-1">Day Streak</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.totalWorkouts}</p>
              <p className="text-xs text-blue-100 mt-1">Workouts</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.totalCalories}</p>
              <p className="text-xs text-blue-100 mt-1">Calories</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={() => navigate('/progress')}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl text-base"
          >
            View Progress
            <ArrowRight className="size-5 ml-2" />
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full h-12 rounded-2xl"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
