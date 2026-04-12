import React, { useRef, useState, useEffect } from 'react';
import type { Habit, HabitLog, HabitPriority, HabitCategory } from '@waqtify/types';
import { Button } from '../atoms/Button';
import { ProgressRing } from '../atoms/ProgressRing';
import { Check, Plus, Minus, Play, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface HabitCardProps {
  habit: Habit;
  todaysLog?: HabitLog;
  onTrack: (countInput?: number, durationInput?: number) => void;
  streakCount: number;
  /** Optional: navigate to edit screen */
  onEdit?: () => void;
  /** Optional: trigger delete confirmation */
  onDelete?: () => void;
}

const categoryLabels: Record<HabitCategory, string> = {
  health_fitness: 'Health & Fitness',
  productivity: 'Productivity',
  learning: 'Learning',
  mindfulness: 'Mindfulness',
  social: 'Social',
  finance: 'Finance',
  career: 'Career',
  creativity: 'Creativity',
  relationships: 'Relationships',
  personal_development: 'Personal Development',
  other: 'Other'
};

const priorityColors: Record<HabitPriority, string> = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500'
};

export function HabitCard({ habit, todaysLog, onTrack, streakCount, onEdit, onDelete }: HabitCardProps) {
  const isCompleted = todaysLog?.completed || false;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Calculate progress for UI
  let progress = 0;
  if (isCompleted) {
    progress = 100;
  } else if (habit.type === 'count' && habit.target && todaysLog?.count) {
    progress = Math.min(100, Math.round((todaysLog.count / habit.target) * 100));
  } else if (habit.type === 'timer' && habit.expectedDuration && todaysLog?.duration) {
    progress = Math.min(100, Math.round((todaysLog.duration / habit.expectedDuration) * 100));
  }

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

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
        return (
          <Button size="icon" variant="outline" onClick={() => onTrack(undefined, (todaysLog?.duration || 0) + 60)}>
            <Play className="h-4 w-4 text-primary" />
          </Button>
        );
      default:
        return null;
    }
  };

  const showMenu = !!(onEdit || onDelete);

  // Get custom color or default
  const accentColor = habit.color || '#3B82F6';
  const icon = habit.icon || '⭐';

  return (
    <div className={cn(
      "relative flex items-center justify-between p-4 rounded-xl border bg-card transition-all shadow-sm hover:shadow-md",
      isCompleted && "border-green-200 bg-green-50/50"
    )} style={isCompleted ? {} : { borderLeft: `4px solid ${accentColor}` }}>
      <div className="flex items-center space-x-4">
        {/* Custom colored progress ring */}
        <div className="relative">
          <ProgressRing
            progress={progress}
            radius={28}
            strokeWidth={4}
            colorClass={isCompleted ? "text-green-500" : "text-primary"}
          />
          {/* Priority indicator dot */}
          {habit.priority && (
            <div className={cn(
              "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
              priorityColors[habit.priority]
            )} />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            {habit.icon && <span className="text-xl">{icon}</span>}
            <h3 className="font-semibold text-lg">{habit.name}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <span>
              {streakCount > 0 ? `${streakCount} day streak 🔥` : 'Built today'}
            </span>
            {habit.category && (
              <>
                <span>•</span>
                <span>{categoryLabels[habit.category]}</span>
              </>
            )}
            {habit.tags && habit.tags.length > 0 && (
              <div className="flex gap-1 mt-1">
                {habit.tags.slice(0, 3).map((tag, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-2 py-0.5 bg-secondary/60 rounded-full"
                    style={isCompleted ? {} : { backgroundColor: `${accentColor}20` }}
                  >
                    #{tag}
                  </span>
                ))}
                {habit.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{habit.tags.length - 3} more</span>
                )}
              </div>
            )}
          </div>
          {habit.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {habit.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {renderAction()}

        {/* ─── Context Menu ───────────────────────────────────── */}
        {showMenu && (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Habit options"
              className={cn(
                "ml-1 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                menuOpen && "bg-secondary/60 text-foreground"
              )}
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-30 min-w-[130px] rounded-xl border border-border bg-popover shadow-lg py-1 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                {onEdit && (
                  <button
                    onClick={() => { setMenuOpen(false); onEdit(); }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm hover:bg-secondary/60 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(); }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}