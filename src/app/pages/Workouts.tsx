import { useState } from 'react';
import { WorkoutCard } from '../components/WorkoutCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Search, X } from 'lucide-react';
import { workouts, Workout } from '../lib/workoutData';
import { addWorkoutLog } from '../lib/storage';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export default function Workouts() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isWorkoutDialogOpen, setIsWorkoutDialogOpen] = useState(false);

  const categories = ['all', 'strength', 'cardio', 'flexibility', 'sports'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredWorkouts = workouts.filter((workout) => {
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || workout.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || workout.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleStartWorkout = async (workout: Workout) => {
    // Log the workout through the Python backend.
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

    try {
      await addWorkoutLog(log);
      toast.success(`Workout completed! 🎉`, {
        description: `Great job completing ${workout.name}!`,
      });
      setIsWorkoutDialogOpen(false);
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Could not save workout', {
        description: 'Check that the backend is running and Supabase is configured.',
      });
    }
  };

  const handleViewWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setIsWorkoutDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Workouts</h1>
        <p className="text-muted-foreground mt-1">
          Choose from our collection of {workouts.length} workouts
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => setSearchQuery('')}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex gap-2 flex-wrap">
          {difficulties.map((difficulty) => (
            <Badge
              key={difficulty}
              variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
              className="cursor-pointer capitalize"
              onClick={() => setSelectedDifficulty(difficulty)}
            >
              {difficulty}
            </Badge>
          ))}
        </div>
      </div>

      {/* Workout Grid */}
      {filteredWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onView={() => handleViewWorkout(workout)}
              onStart={() => handleStartWorkout(workout)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No workouts found matching your criteria</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Workout Details Dialog */}
      <Dialog open={isWorkoutDialogOpen} onOpenChange={setIsWorkoutDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedWorkout?.name}</DialogTitle>
            <DialogDescription>{selectedWorkout?.description}</DialogDescription>
          </DialogHeader>
          {selectedWorkout && (
            <div className="space-y-6">
              <div className="flex gap-4 text-sm">
                <Badge className="capitalize">{selectedWorkout.category}</Badge>
                <Badge className="capitalize">{selectedWorkout.difficulty}</Badge>
                <Badge variant="secondary">{selectedWorkout.duration} min</Badge>
                <Badge variant="secondary">{selectedWorkout.caloriesBurned} cal</Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Equipment Needed</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedWorkout.equipment.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Exercises</h3>
                <div className="space-y-3">
                  {selectedWorkout.exercises.map((exercise, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <Badge variant="secondary">
                          {exercise.sets} × {exercise.reps}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Rest: {exercise.rest}s between sets
                      </p>
                      {exercise.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Note: {exercise.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsWorkoutDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => selectedWorkout && handleStartWorkout(selectedWorkout)}
                >
                  Start Workout
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
