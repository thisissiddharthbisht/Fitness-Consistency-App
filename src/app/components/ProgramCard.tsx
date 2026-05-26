import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, Target, TrendingUp } from 'lucide-react';
import { Program } from '../lib/workoutData';

interface ProgramCardProps {
  program: Program;
  onStart?: () => void;
  onView?: () => void;
}

export function ProgramCard({ program, onStart, onView }: ProgramCardProps) {
  const levelColors = {
    beginner: 'bg-green-500',
    intermediate: 'bg-yellow-500',
    advanced: 'bg-red-500',
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{program.name}</CardTitle>
            <CardDescription className="text-xs mt-1 flex items-center gap-1">
              <Target className="size-3" />
              {program.goal}
            </CardDescription>
          </div>
          <Badge className={`${levelColors[program.level]} text-white capitalize`}>
            {program.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{program.description}</p>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="size-4" />
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="size-4" />
            <span>{program.daysPerWeek}x/week</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {onView && (
            <Button variant="outline" className="flex-1" onClick={onView}>
              View Program
            </Button>
          )}
          {onStart && (
            <Button className="flex-1" onClick={onStart}>
              Start Program
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}