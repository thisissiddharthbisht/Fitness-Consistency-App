import { useState } from 'react';
import { ProgramCard } from '../components/ProgramCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { programs, Program, workouts } from '../lib/workoutData';
import { toast } from 'sonner';
import { addScheduledWorkout } from '../lib/storage';
import { Target, Calendar, TrendingUp } from 'lucide-react';

export default function Programs() {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false);

  const handleViewProgram = (program: Program) => {
    setSelectedProgram(program);
    setIsProgramDialogOpen(true);
  };

  const handleStartProgram = async (program: Program) => {
    // Schedule the program's workouts through the Python backend.
    const today = new Date();
    const scheduledWorkouts = program.workouts
      .map((workoutId, index) => {
        const workout = workouts.find(w => w.id === workoutId);
        if (!workout) {
          return null;
        }

        const scheduleDate = new Date(today);
        scheduleDate.setDate(today.getDate() + index);
        
        return {
          id: Date.now().toString() + index,
          workoutId: workout.id,
          workoutName: workout.name,
          date: scheduleDate.toISOString().split('T')[0],
          time: '09:00',
          completed: false,
        };
      })
      .filter(Boolean);

    try {
      await Promise.all(scheduledWorkouts.map(workout => addScheduledWorkout(workout!)));
      toast.success('Program started! 🎯', {
        description: `${program.name} has been added to your schedule.`,
      });
      setIsProgramDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Could not start program', {
        description: 'Check that the backend is running and Supabase is configured.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Training Programs</h1>
        <p className="text-muted-foreground mt-1">
          Structured programs to help you reach your fitness goals
        </p>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onView={() => handleViewProgram(program)}
            onStart={() => handleStartProgram(program)}
          />
        ))}
      </div>

      {/* Program Details Dialog */}
      <Dialog open={isProgramDialogOpen} onOpenChange={setIsProgramDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProgram?.name}</DialogTitle>
            <DialogDescription>{selectedProgram?.description}</DialogDescription>
          </DialogHeader>
          {selectedProgram && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 rounded-lg border">
                  <Target className="size-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Goal</p>
                    <p className="font-medium text-sm">{selectedProgram.goal}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg border">
                  <Calendar className="size-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium text-sm">{selectedProgram.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg border">
                  <TrendingUp className="size-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Frequency</p>
                    <p className="font-medium text-sm">{selectedProgram.daysPerWeek}x/week</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Included Workouts</h3>
                  <Badge className="capitalize">{selectedProgram.level}</Badge>
                </div>
                <div className="space-y-2">
                  {selectedProgram.workouts.map((workoutId, index) => {
                    const workout = workouts.find(w => w.id === workoutId);
                    return workout ? (
                      <div key={workoutId} className="p-4 rounded-lg border">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              Day {index + 1}: {workout.name}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {workout.duration} min • {workout.caloriesBurned} cal • {workout.exercises.length} exercises
                            </p>
                          </div>
                          <Badge className="capitalize" variant="secondary">
                            {workout.category}
                          </Badge>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="bg-accent p-4 rounded-lg">
                <h4 className="font-medium mb-2">Program Guidelines</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Complete workouts in order for best results</li>
                  <li>• Rest 1-2 days between intense sessions</li>
                  <li>• Listen to your body and adjust as needed</li>
                  <li>• Stay hydrated and maintain proper nutrition</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsProgramDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => selectedProgram && handleStartProgram(selectedProgram)}
                >
                  Start Program
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
