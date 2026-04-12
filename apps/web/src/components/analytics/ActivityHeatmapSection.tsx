import React from 'react';
import { Calendar, Activity } from 'lucide-react';
import { ActivityHeatmap } from '../../components/ActivityHeatmap';

export function ActivityHeatmapSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Activity Map</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Habit Streak Calendar</h2>
            <p className="text-sm text-muted-foreground">Your year-at-a-glance consistency heatmap</p>
          </div>
        </div>
        <ActivityHeatmap compact={false} />
      </div>
    </section>
  );
}