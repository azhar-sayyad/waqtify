import React from 'react';
import type { Habit, HabitLog } from '@waqtify/types';
import { Button } from '../atoms/Button';
import { ProgressRing } from '../atoms/ProgressRing';
import { Check, Plus, Minus, Play, Square } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface HabitCardProps {
  habit: Habit;
  todaysLog?: HabitLog;
  onTrack: (countInput?: number, durationInput?: number) => void;
  streakCount: number;
}

export function HabitCard({ habit, todaysLog, onTrack, streakCount }: HabitCardProps) {
  const isCompleted = todaysLog?.completed || false;
  
  // Calculate progress for UI
  let progress = 0;
  if (isCompleted) {
    progress = 100;
  } else if (habit.type === 'count' && habit.target && todaysLog?.count) {
    progress = Math.min(100, Math.round((todaysLog.count / habit.target) * 100));
  } else if (habit.type === 'timer' && habit.expectedDuration && todaysLog?.duration) {
    progress = Math.min(100, Math.round((todaysLog.duration / habit.expectedDuration) * 100));
  }

  const renderAction = () => {
    switch (habit.type) {
      case 'binary':
        return (
          <Button
            size="icon"
            variant={isCompleted ? "default" : "outline"}
            onClick={() => onTrack()}
            className={cn("rounded-full h-12 w-12", isCompleted && "bg-green-500 hover:bg-green-600 border-none")}
          >
            <Check className={cn("h-6 w-6", isCompleted ? "text-white" : "text-muted-foreground")} />
          </Button>
        );
      case 'count':
        return (
          <div className="flex items-center space-x-2">
            <Button size="icon" variant="outline" onClick={() => onTrack((todaysLog?.count || 0) - 1)}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{todaysLog?.count || 0}</span>
            <Button size="icon" variant="outline" onClick={() => onTrack((todaysLog?.count || 0) + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        );
      case 'timer':
        // Extremely simplified version: starts/stops a logged duration mock or real depending on store
        return (
          <Button size="icon" variant="outline" onClick={() => onTrack(undefined, (todaysLog?.duration || 0) + 60)}>
            <Play className="h-4 w-4 text-primary" />
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-xl border bg-card transition-all shadow-sm hover:shadow-md",
      isCompleted && "border-green-200 bg-green-50/50"
    )}>
      <div className="flex items-center space-x-4">
        <ProgressRing 
          progress={progress} 
          radius={28} 
          strokeWidth={4} 
          colorClass={isCompleted ? "text-green-500" : "text-primary"}
        />
        <div>
          <h3 className="font-semibold text-lg">{habit.name}</h3>
          <p className="text-sm text-muted-foreground">
            {streakCount > 0 ? `${streakCount} day streak 🔥` : 'Built today'}
            {habit.category && ` • ${habit.category}`}
          </p>
        </div>
      </div>
      <div>
        {renderAction()}
      </div>
    </div>
  );
}
