import { useState, useEffect } from 'react';
import { defaultUserStats, getUserStats, getWorkoutLogs } from '../lib/storage';
import { Flame, Trophy, TrendingUp, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function Progress() {
  const [stats, setStats] = useState(defaultUserStats);
  const [workoutLogs, setWorkoutLogs] = useState<any[]>([]);

  useEffect(() => {
    const loadProgressData = async () => {
      setStats(await getUserStats());
      setWorkoutLogs(await getWorkoutLogs());
    };

    loadProgressData();
  }, []);

  // Calculate this week's stats (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const weeklyWorkouts = workoutLogs.filter(log => 
    new Date(log.date) >= sevenDaysAgo
  );
  
  const weeklyMinutes = weeklyWorkouts.reduce((sum, log) => sum + log.duration, 0);
  const weeklyCalories = weeklyWorkouts.reduce((sum, log) => sum + (log.caloriesBurned || 0), 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900">Your Progress</h1>
        <p className="text-gray-500 text-sm mt-1">Track your fitness journey</p>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Overall Stats */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3">All Time Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Trophy className="size-5" />
              </div>
              <p className="text-3xl font-semibold text-gray-900">{stats.totalWorkouts}</p>
              <p className="text-sm text-gray-600 mt-1">Total Workouts</p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <Flame className="size-5" />
              </div>
              <p className="text-3xl font-semibold text-gray-900">{stats.currentStreak}</p>
              <p className="text-sm text-gray-600 mt-1">Day Streak</p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Clock className="size-5" />
              </div>
              <p className="text-3xl font-semibold text-gray-900">{stats.totalMinutes}</p>
              <p className="text-sm text-gray-600 mt-1">Total Minutes</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <TrendingUp className="size-5" />
              </div>
              <p className="text-3xl font-semibold text-gray-900">{stats.totalCalories}</p>
              <p className="text-sm text-gray-600 mt-1">Calories Burned</p>
            </div>
          </div>
        </div>

        {/* This Week Stats */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3">This Week</h2>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-semibold">{weeklyWorkouts.length}</p>
                <p className="text-sm text-blue-100 mt-1">Workouts</p>
              </div>
              <div>
                <p className="text-3xl font-semibold">{weeklyMinutes}</p>
                <p className="text-sm text-blue-100 mt-1">Minutes</p>
              </div>
              <div>
                <p className="text-3xl font-semibold">{weeklyCalories}</p>
                <p className="text-sm text-blue-100 mt-1">Calories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Workouts */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3">Recent Activity</h2>
          {workoutLogs.length > 0 ? (
            <div className="space-y-3">
              {[...workoutLogs].reverse().slice(0, 10).map((log) => (
                <div key={log.id} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{log.workoutName}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {format(new Date(log.date), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{log.duration} min</p>
                      <p className="text-xs text-gray-500 mt-1">{log.caloriesBurned} cal</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <p className="text-gray-500">No workouts completed yet</p>
              <p className="text-sm text-gray-400 mt-1">Start your first workout to see your progress!</p>
            </div>
          )}
        </div>

        {/* Personal Bests */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3">Personal Bests</h2>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Longest Streak</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.longestStreak} days</p>
                </div>
                <Flame className="size-8 text-orange-500" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Weekly Goal</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.weeklyGoal} workouts</p>
                </div>
                <Trophy className="size-8 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
