import React from 'react';
import { StatCard } from '@waqtify/ui';
import { CheckCircle2, BarChart2, Flame, Trophy } from 'lucide-react';

interface KPISectionProps {
  kpis: {
    totalCompleted: number;
    maxCurrentStreak: number;
    maxLongestStreak: number;
    overallRate: number;
  };
}

export function KPISection({ kpis }: KPISectionProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-0 group-hover:opacity-100"></div>
        <StatCard
          label="Total Completed"
          value={kpis.totalCompleted.toLocaleString()}
          subtitle="Cumulative actions taken"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          decorativeIcon={<CheckCircle2 className="w-32 h-32" />}
          className="relative"
        />
      </div>

      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-0 group-hover:opacity-100"></div>
        <StatCard
          label="Completion Rate"
          value={`${kpis.overallRate}%`}
          subtitle="Last 30 days"
          accentValue={kpis.overallRate >= 70}
          icon={<BarChart2 className="w-4 h-4 text-primary" />}
          decorativeIcon={<BarChart2 className="w-32 h-32" />}
          trend={
            kpis.overallRate >= 70 ? { direction: 'up', label: 'Great consistency' }
            : kpis.overallRate >= 40 ? { direction: 'neutral', label: 'Keep building' }
            : { direction: 'down', label: 'Needs focus' }
          }
          className="relative"
        />
      </div>

      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-500/5 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-0 group-hover:opacity-100"></div>
        <StatCard
          label="Current Streak"
          value={`${kpis.maxCurrentStreak}d`}
          subtitle="Active momentum"
          icon={<Flame className="w-4 h-4 text-orange-500" />}
          decorativeIcon={<Flame className="w-32 h-32" />}
          trend={
            kpis.maxCurrentStreak >= 7 ? { direction: 'up', label: 'Week+ streak!' }
            : kpis.maxCurrentStreak > 0 ? { direction: 'neutral', label: 'Keep it up' }
            : undefined
          }
          className="relative"
        />
      </div>

      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-0 group-hover:opacity-100"></div>
        <StatCard
          label="Longest Streak"
          value={`${kpis.maxLongestStreak}d`}
          subtitle="Historical best"
          icon={<Trophy className="w-4 h-4 text-yellow-500" />}
          decorativeIcon={<Trophy className="w-32 h-32" />}
          className="relative"
        />
        {kpis.maxLongestStreak >= 30 && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-xs">🏆</span>
          </div>
        )}
      </div>
    </section>
  );
}