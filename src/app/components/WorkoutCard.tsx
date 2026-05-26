import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, Flame, Play } from 'lucide-react';
import { Workout, getDifficultyColor } from '../lib/workoutData';
import * as LucideIcons from 'lucide-react';

interface WorkoutCardProps {
  workout: Workout;
  onStart?: () => void;
  onView?: () => void;
}

export function WorkoutCard({ workout, onStart, onView }: WorkoutCardProps) {
  const IconComponent = (LucideIcons as any)[workout.category === 'strength' ? 'Dumbbell' : 
                                             workout.category === 'cardio' ? 'Heart' :
                                             workout.category === 'flexibility' ? 'Wind' : 'Trophy'];

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {IconComponent && <IconComponent className="size-5 text-primary" />}
            <div>
              <CardTitle className="text-lg">{workout.name}</CardTitle>
              <CardDescription className="capitalize text-xs mt-1">
                {workout.category}
              </CardDescription>
            </div>
          </div>
          <Badge className={`${getDifficultyColor(workout.difficulty)} text-white capitalize`}>
            {workout.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{workout.description}</p>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="size-4" />
            <span>{workout.duration} min</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Flame className="size-4" />
            <span>{workout.caloriesBurned} cal</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {workout.equipment.map((item) => (
            <Badge key={item} variant="secondary" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          {onView && (
            <Button variant="outline" className="flex-1" onClick={onView}>
              View Details
            </Button>
          )}
          {onStart && (
            <Button className="flex-1" onClick={onStart}>
              <Play className="size-4 mr-2" />
              Start Workout
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}