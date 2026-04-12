import React from 'react';
import { Target } from 'lucide-react';

interface LeaderboardStat {
  id: string;
  name: string;
  percentage: number;
}

interface PerHabitRatesProps {
  data: LeaderboardStat[];
}

export function PerHabitRates({ data }: PerHabitRatesProps) {
  const getBarGradient = (percentage: number) => {
    if (percentage >= 70) {
      return 'linear-gradient(90deg, hsl(142 70% 45%), hsl(142 70% 55%))';
    } else if (percentage >= 40) {
      return 'linear-gradient(90deg, hsl(38 92% 50%), hsl(38 92% 60%))';
    } else {
      return 'linear-gradient(90deg, hsl(0 84% 60%), hsl(0 84% 65%))';
    }
  };

  const getTextColor = (percentage: number) => {
    if (percentage >= 70) return 'text-emerald-500';
    if (percentage >= 40) return 'text-amber-500';
    return 'text-destructive';
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Performance</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">Per-Habit Rates</h2>
            <p className="text-sm text-muted-foreground">Completion percentage breakdown</p>
          </div>
        </div>
        <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <p className="text-sm">No habit data available</p>
            </div>
          ) : (
            data.map((stat) => (
              <div key={stat.id} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold truncate max-w-[150px]">{stat.name}</span>
                  <span className={`text-sm font-bold ${getTextColor(stat.percentage)}`}>
                    {stat.percentage}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                    style={{
                      width: `${stat.percentage}%`,
                      background: getBarGradient(stat.percentage),
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}