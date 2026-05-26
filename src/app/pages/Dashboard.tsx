import { useEffect, useState } from 'react';
import { StatCard } from '../components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Flame, Trophy, Clock, Target, Play, Award, Calendar as CalendarIcon, Zap } from 'lucide-react';
import { defaultAchievements, defaultUserStats, getUserStats, getWorkoutLogs, getAchievements, getScheduledWorkouts } from '../lib/storage';
import { workouts } from '../lib/workoutData';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(defaultUserStats);
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [achievements, setAchievements] = useState(defaultAchievements);
  const [upcomingWorkout, setUpcomingWorkout] = useState<any>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setStats(await getUserStats());
      const logs = await getWorkoutLogs();
      setRecentWorkouts(logs.slice(0, 5));
      setAchievements(await getAchievements());
      
      // Get next scheduled workout from the backend-backed calendar data.
      const scheduled = await getScheduledWorkouts();
      const today = new Date().toISOString().split('T')[0];
      const upcoming = scheduled
        .filter(w => !w.completed && w.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))[0];
      setUpcomingWorkout(upcoming);
    };

    loadDashboardData();
  }, []);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const weekProgress = Math.min((stats.totalWorkouts % stats.weeklyGoal) / stats.weeklyGoal * 100, 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="text-muted-foreground mt-1">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Streak"
          value={`${stats.currentStreak} days`}
          icon={Flame}
          subtitle={`Longest: ${stats.longestStreak} days`}
        />
        <StatCard
          title="Total Workouts"
          value={stats.totalWorkouts}
          icon={Trophy}
          subtitle="All time"
        />
        <StatCard
          title="Total Time"
          value={`${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`}
          icon={Clock}
          subtitle="Workout time"
        />
        <StatCard
          title="Calories Burned"
          value={stats.totalCalories.toLocaleString()}
          icon={Zap}
          subtitle="All time"
        />
      </div>

      {/* Weekly Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="size-5" />
            Weekly Goal Progress
          </CardTitle>
          <CardDescription>
            {stats.totalWorkouts % stats.weeklyGoal} of {stats.weeklyGoal} workouts completed this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={weekProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Start Workout */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="size-5" />
              Quick Start
            </CardTitle>
            <CardDescription>
              Popular workouts to get you moving
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {workouts.slice(0, 3).map((workout) => (
              <div
                key={workout.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                onClick={() => navigate('/workouts')}
              >
                <div>
                  <p className="font-medium">{workout.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {workout.duration} min • {workout.caloriesBurned} cal
                  </p>
                </div>
                <Button size="sm">Start</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Workout */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="size-5" />
              {upcomingWorkout ? 'Next Scheduled' : 'Schedule a Workout'}
            </CardTitle>
            <CardDescription>
              {upcomingWorkout 
                ? `${format(new Date(upcomingWorkout.date), 'EEEE, MMM d')} at ${upcomingWorkout.time}`
                : 'Plan your fitness routine'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingWorkout ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent">
                  <p className="font-medium text-lg">{upcomingWorkout.workoutName}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(upcomingWorkout.date), 'MMM d')} at {upcomingWorkout.time}
                  </p>
                </div>
                <Button className="w-full" onClick={() => navigate('/schedule')}>
                  View Schedule
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Schedule your workouts to stay on track with your fitness goals.
                </p>
                <Button className="w-full" onClick={() => navigate('/schedule')}>
                  Go to Schedule
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest workouts</CardDescription>
          </CardHeader>
          <CardContent>
            {recentWorkouts.length > 0 ? (
              <div className="space-y-3">
                {recentWorkouts.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{log.workoutName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(log.date), 'MMM d, yyyy')} • {log.duration} min
                      </p>
                    </div>
                    <Badge variant="secondary">{log.caloriesBurned} cal</Badge>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/progress')}
                >
                  View All Activity
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No workouts yet</p>
                <Button onClick={() => navigate('/workouts')}>Start Your First Workout</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="size-5" />
              Achievements
            </CardTitle>
            <CardDescription>
              {unlockedAchievements.length} of {achievements.length} unlocked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((achievement) => {
                const IconComponent = (LucideIcons as any)[achievement.icon];
                return (
                  <div
                    key={achievement.id}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                      achievement.unlocked ? 'bg-accent' : 'opacity-40'
                    }`}
                    title={achievement.description}
                  >
                    {IconComponent && (
                      <IconComponent
                        className={`size-8 ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`}
                      />
                    )}
                    <p className="text-xs text-center mt-2 font-medium">{achievement.title}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Import lucide icons
import * as LucideIcons from 'lucide-react';
