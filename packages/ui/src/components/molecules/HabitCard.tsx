import React, { useRef, useState, useEffect } from 'react';
import type { Habit, HabitLog } from '@waqtify/types';
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

  return (
    <div className={cn(
      "relative flex items-center justify-between p-4 rounded-xl border bg-card transition-all shadow-sm hover:shadow-md",
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
