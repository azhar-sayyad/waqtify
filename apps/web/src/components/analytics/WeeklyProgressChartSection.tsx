import React from 'react';
import { TrendingUp } from 'lucide-react';
import { WeeklyProgressChart } from '../../components/WeeklyProgressChart';

interface WeeklyProgressChartSectionProps {
  data: any[];
}

export function WeeklyProgressChartSection({ data }: WeeklyProgressChartSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Trend</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">Completion Rate Over Time</h2>
            <p className="text-sm text-muted-foreground">Daily percentage for last 30 days</p>
          </div>
        </div>
        <WeeklyProgressChart data={data} target={80} height={220} />
      </div>
    </section>
  );
}