import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { ArrowLeft, Clock, Play, Pause, CheckCircle2 } from 'lucide-react';
import { workouts } from '../lib/workoutData';
import { useState, useEffect } from 'react';

export default function WorkoutScreen() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());

  const workout = workouts.find(w => w.id === workoutId);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  if (!workout) {
    return null;
  }

  const currentExercise = workout.exercises[currentExerciseIndex];

  const handleStartTimer = () => {
    setSecondsRemaining(currentExercise.rest);
    setIsTimerRunning(true);
  };

  const handleCompleteExercise = () => {
    const newCompleted = new Set(completedExercises);
    newCompleted.add(currentExerciseIndex);
    setCompletedExercises(newCompleted);
    
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setSecondsRemaining(0);
      setIsTimerRunning(false);
    }
  };

  const handleCompleteWorkout = () => {
    navigate(`/workout-complete/${workoutId}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (completedExercises.size / workout.exercises.length) * 100;
  const allExercisesCompleted = completedExercises.size === workout.exercises.length;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 mb-4"
        >
          <ArrowLeft className="size-5" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">{workout.name}</h1>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Progress</span>
            <span>{completedExercises.size} / {workout.exercises.length}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-auto p-6 space-y-3">
        {workout.exercises.map((exercise, index) => {
          const isCompleted = completedExercises.has(index);
          const isCurrent = index === currentExerciseIndex;
          
          return (
            <div
              key={index}
              className={`p-4 rounded-2xl border-2 transition-all ${
                isCompleted
                  ? 'bg-green-50 border-green-500'
                  : isCurrent
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {isCompleted && <CheckCircle2 className="size-5 text-green-600" />}
                    <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {exercise.sets} sets × {exercise.reps} reps
                  </p>
                  {exercise.notes && (
                    <p className="text-xs text-gray-400 mt-1">{exercise.notes}</p>
                  )}
                </div>
                {isCurrent && !isCompleted && (
                  <button
                    onClick={handleCompleteExercise}
                    className="text-blue-600 text-sm font-medium"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timer Section */}
      <div className="border-t border-gray-100 p-6 space-y-4 bg-white">
        {!allExercisesCompleted && (
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Clock className="size-5" />
              <span className="text-sm">Rest Timer</span>
            </div>
            <div className="text-4xl font-semibold text-gray-900 my-4">
              {formatTime(secondsRemaining)}
            </div>
            <Button
              onClick={isTimerRunning ? () => setIsTimerRunning(false) : handleStartTimer}
              variant="outline"
              className="w-full h-12 rounded-2xl"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="size-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="size-4 mr-2" />
                  Start Rest ({currentExercise.rest}s)
                </>
              )}
            </Button>
          </div>
        )}

        {/* Complete Workout Button */}
        <Button
          onClick={handleCompleteWorkout}
          disabled={!allExercisesCompleted}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl text-base disabled:opacity-50"
        >
          Complete Workout
        </Button>
      </div>
    </div>
  );
}
