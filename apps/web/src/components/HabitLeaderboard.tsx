import React from 'react';
import { Flame, Trophy, TrendingUp, Medal } from 'lucide-react';
import { Badge } from '@waqtify/ui';
import type { HabitCompletionStat } from '../stores/habitStore';

interface HabitLeaderboardProps {
  data: HabitCompletionStat[];
  className?: string;
}

function getRankBadge(index: number) {
  if (index === 0) return <Medal className="w-4 h-4 text-yellow-400" />;
  if (index === 1) return <Medal className="w-4 h-4 text-slate-400" />;
  if (index === 2) return <Medal className="w-4 h-4 text-amber-600" />;
  return <span className="text-xs text-muted-foreground font-bold w-4 text-center">{index + 1}</span>;
}

function getCompletionVariant(pct: number): 'success' | 'warning' | 'destructive' {
  if (pct >= 70) return 'success';
  if (pct >= 40) return 'warning';
  return 'destructive';
}

/**
 * HabitLeaderboard — ranked table of habits sorted by completion percentage.
 * Shows rank, name, completion %, streak, longest streak.
 */
export function HabitLeaderboard({ data, className = '' }: HabitLeaderboardProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-muted-foreground italic">
        No habits tracked yet.
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="grid grid-cols-[2rem_1fr_5rem_4.5rem_4.5rem] gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 mb-1">
        <span>#</span>
        <span>Habit</span>
        <span className="text-right">Rate</span>
        <span className="text-right flex items-center justify-end gap-1"><Flame className="w-3 h-3" />Streak</span>
        <span className="text-right flex items-center justify-end gap-1"><Trophy className="w-3 h-3" />Best</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/20">
        {data.map((habit, i) => (
          <div
            key={habit.id}
            className="grid grid-cols-[2rem_1fr_5rem_4.5rem_4.5rem] gap-3 px-3 py-3 items-center hover:bg-secondary/30 rounded-lg transition-colors"
          >
            {/* Rank */}
            <div className="flex items-center justify-center">
              {getRankBadge(i)}
            </div>

            {/* Habit Name + progress bar */}
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate leading-tight">{habit.name}</p>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${habit.percentage}%`,
                    background: habit.percentage >= 70
                      ? 'hsl(142 70% 45%)'
                      : habit.percentage >= 40
                      ? 'hsl(38 92% 50%)'
                      : 'hsl(var(--destructive))',
                  }}
                />
              </div>
            </div>

            {/* Completion % */}
            <div className="text-right">
              <Badge variant={getCompletionVariant(habit.percentage)} size="sm">
                {habit.percentage}%
              </Badge>
            </div>

            {/* Current streak */}
            <div className="text-right text-sm font-bold">
              {habit.currentStreak > 0 ? (
                <span className="flex items-center justify-end gap-1 text-orange-400">
                  <Flame className="w-3.5 h-3.5" />
                  {habit.currentStreak}d
                </span>
              ) : (
                <span className="text-muted-foreground font-normal">—</span>
              )}
            </div>

            {/* Longest streak */}
            <div className="text-right text-sm font-bold">
              {habit.longestStreak > 0 ? (
                <span className="flex items-center justify-end gap-1 text-muted-foreground">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {habit.longestStreak}d
                </span>
              ) : (
                <span className="text-muted-foreground font-normal">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
