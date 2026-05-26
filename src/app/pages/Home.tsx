import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Clock, Flame } from 'lucide-react';
import { defaultUserStats, getUserProfile, getUserStats } from '../lib/storage';
import { workouts } from '../lib/workoutData';
import { useEffect, useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [todayWorkout, setTodayWorkout] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState(defaultUserStats);

  useEffect(() => {
    const loadHomeData = async () => {
      const profile = await getUserProfile();
      if (profile) {
        setUserName(profile.name);
        
        // Select today's workout based on user's goal.
        const filteredWorkouts = profile.goal === 'lose-fat' 
          ? workouts.filter(w => w.category === 'cardio' || w.category === 'strength')
          : workouts.filter(w => w.category === 'strength');
        
        // Get a consistent workout for today based on the date.
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const workoutIndex = dayOfYear % filteredWorkouts.length;
        setTodayWorkout(filteredWorkouts[workoutIndex]);
      }

      setStats(await getUserStats());
    };

    loadHomeData();
  }, []);

  const handleStartWorkout = () => {
    if (todayWorkout) {
      navigate(`/workout/${todayWorkout.id}`);
    }
  };

  if (!todayWorkout) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <p className="text-gray-500 text-sm">Hello, {userName}</p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">Today's Plan</h1>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Workout Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white">
          <div className="space-y-4">
            <div>
              <p className="text-blue-100 text-sm">Today's Workout</p>
              <h2 className="text-2xl font-semibold mt-1">{todayWorkout.name}</h2>
            </div>

            {/* Duration & Calories */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="size-5" />
                <span>{todayWorkout.duration} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="size-5" />
                <span>{todayWorkout.caloriesBurned} cal</span>
              </div>
            </div>

            {/* Exercises Preview */}
            <div className="pt-4 border-t border-blue-400/30">
              <p className="text-blue-100 text-sm mb-3">Exercises ({todayWorkout.exercises.length})</p>
              <div className="space-y-2">
                {todayWorkout.exercises.slice(0, 4).map((exercise: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{exercise.name}</span>
                    <span className="text-blue-100">{exercise.sets} × {exercise.reps}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Based on schedule text */}
        <p className="text-center text-gray-500 text-sm">
          Based on your schedule
        </p>

        {/* Start Button */}
        <Button 
          onClick={handleStartWorkout}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl text-base"
        >
          Start Workout
        </Button>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6">
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-semibold text-gray-900">{stats.currentStreak}</p>
            <p className="text-xs text-gray-500 mt-1">Streak</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-semibold text-gray-900">{stats.totalWorkouts}</p>
            <p className="text-xs text-gray-500 mt-1">Workouts</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-semibold text-gray-900">{stats.totalMinutes}</p>
            <p className="text-xs text-gray-500 mt-1">Minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
