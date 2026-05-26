import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { getScheduledWorkouts, addScheduledWorkout, updateScheduledWorkout, deleteScheduledWorkout, ScheduledWorkout, addWorkoutLog } from '../lib/storage';
import { workouts } from '../lib/workoutData';
import { format, isSameDay } from 'date-fns';
import { Plus, Trash2, Check, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');

  useEffect(() => {
    loadScheduledWorkouts();
  }, []);

  const loadScheduledWorkouts = async () => {
    setScheduledWorkouts(await getScheduledWorkouts());
  };

  const workoutsOnSelectedDate = scheduledWorkouts.filter(
    (workout) => selectedDate && isSameDay(new Date(workout.date), selectedDate)
  );

  const handleAddWorkout = async () => {
    if (!selectedWorkoutId || !selectedDate) {
      toast.error('Please select a workout and date');
      return;
    }

    const workout = workouts.find(w => w.id === selectedWorkoutId);
    if (!workout) return;

    const newScheduledWorkout: ScheduledWorkout = {
      id: Date.now().toString(),
      workoutId: workout.id,
      workoutName: workout.name,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      completed: false,
    };

    try {
      await addScheduledWorkout(newScheduledWorkout);
      await loadScheduledWorkouts();
      setIsAddDialogOpen(false);
      setSelectedWorkoutId('');
      toast.success('Workout scheduled!');
    } catch (error) {
      console.error(error);
      toast.error('Could not schedule workout', {
        description: 'Check that the backend is running and Supabase is configured.',
      });
    }
  };

  const handleCompleteWorkout = async (scheduledWorkout: ScheduledWorkout) => {
    try {
      await updateScheduledWorkout(scheduledWorkout.id, { completed: true });
    
      // Also add to workout log so Progress and Dashboard can show it.
      const workout = workouts.find(w => w.id === scheduledWorkout.workoutId);
      if (workout) {
        const log = {
          id: Date.now().toString(),
          workoutId: workout.id,
          workoutName: workout.name,
          date: new Date().toISOString(),
          duration: workout.duration,
          exercises: workout.exercises.map(e => ({
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            weight: 0,
          })),
          caloriesBurned: workout.caloriesBurned,
        };
        await addWorkoutLog(log);
      }
      
      await loadScheduledWorkouts();
      toast.success('Workout completed! 🎉');
    } catch (error) {
      console.error(error);
      toast.error('Could not complete workout', {
        description: 'Check that the backend is running and Supabase is configured.',
      });
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      await deleteScheduledWorkout(id);
      await loadScheduledWorkouts();
      toast.success('Workout removed from schedule');
    } catch (error) {
      console.error(error);
      toast.error('Could not delete workout', {
        description: 'Check that the backend is running and Supabase is configured.',
      });
    }
  };

  // Get dates that have scheduled workouts for calendar highlighting
  const datesWithWorkouts = scheduledWorkouts.map(w => new Date(w.date));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground mt-1">Plan your workouts ahead</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="size-4 mr-2" />
          Add Workout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="size-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasWorkout: datesWithWorkouts,
              }}
              modifiersStyles={{
                hasWorkout: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Scheduled Workouts for Selected Date */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {workoutsOnSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {workoutsOnSelectedDate.map((workout) => (
                  <div
                    key={workout.id}
                    className={`p-3 rounded-lg border ${
                      workout.completed ? 'bg-accent opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium">{workout.workoutName}</p>
                        <p className="text-sm text-muted-foreground">{workout.time}</p>
                      </div>
                      {workout.completed && (
                        <Badge variant="secondary" className="ml-2">
                          <Check className="size-3 mr-1" />
                          Done
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!workout.completed && (
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1"
                          onClick={() => handleCompleteWorkout(workout)}
                        >
                          <Check className="size-3 mr-1" />
                          Complete
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteWorkout(workout.id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No workouts scheduled</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="size-3 mr-1" />
                  Add Workout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Workouts */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const today = new Date().toISOString().split('T')[0];
            const upcoming = scheduledWorkouts
              .filter(w => !w.completed && w.date >= today)
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 10);

            return upcoming.length > 0 ? (
              <div className="space-y-3">
                {upcoming.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{workout.workoutName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(workout.date), 'EEEE, MMM d, yyyy')} at {workout.time}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleCompleteWorkout(workout)}
                      >
                        <Check className="size-3 mr-1" />
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteWorkout(workout.id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No upcoming workouts scheduled
              </p>
            );
          })()}
        </CardContent>
      </Card>

      {/* Add Workout Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule a Workout</DialogTitle>
            <DialogDescription>
              Choose a workout and time for{' '}
              {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'the selected date'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workout">Workout</Label>
              <Select value={selectedWorkoutId} onValueChange={setSelectedWorkoutId}>
                <SelectTrigger id="workout">
                  <SelectValue placeholder="Select a workout" />
                </SelectTrigger>
                <SelectContent>
                  {workouts.map((workout) => (
                    <SelectItem key={workout.id} value={workout.id}>
                      {workout.name} ({workout.duration} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddWorkout}>Schedule Workout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
