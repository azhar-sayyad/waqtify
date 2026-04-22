import React from 'react';
import { TrendingUp, Calendar, CheckCircle2, CircleDashed, Award, Zap } from 'lucide-react';
import type { DailyCompletionPoint } from '@waqtify/core';

interface WeeklyStatsSectionProps {
  data: DailyCompletionPoint[];
  className?: string;
}

/**
 * WeeklyStatsSection - A beautiful visualization of the last 7 days of habit tracking.
 * Shows daily completion rates with animated progress bars, color-coded indicators,
 * and summary statistics.
 */
export function WeeklyStatsSection({ data, className = '' }: WeeklyStatsSectionProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Calculate summary stats
  const today = data[data.length - 1];
  const yesterday = data[data.length - 2];
  const averageRate = Math.round(data.reduce((sum, d) => sum + d.rate, 0) / data.length);
  const bestDay = data.reduce((best, d) => d.rate > best.rate ? d : best, data[0]);
  const perfectDays = data.filter(d => d.rate === 100).length;
  const trend = yesterday ? today.rate - yesterday.rate : 0;

  // Get color based on completion rate
  const getRateColor = (rate: number) => {
    if (rate === 100) return 'bg-emerald-500';
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 60) return 'bg-yellow-500';
    if (rate >= 40) return 'bg-orange-500';
    if (rate > 0) return 'bg-red-500';
    return 'bg-muted';
  };

  const getRateBgColor = (rate: number) => {
    if (rate === 100) return 'bg-emerald-500/10 border-emerald-500/20';
    if (rate >= 80) return 'bg-green-500/10 border-green-500/20';
    if (rate >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
    if (rate >= 40) return 'bg-orange-500/10 border-orange-500/20';
    if (rate > 0) return 'bg-red-500/10 border-red-500/20';
    return 'bg-muted/10 border-border/20';
  };

  const getRateTextColor = (rate: number) => {
    if (rate === 100) return 'text-emerald-500';
    if (rate >= 80) return 'text-green-500';
    if (rate >= 60) return 'text-yellow-500';
    if (rate >= 40) return 'text-orange-500';
    if (rate > 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  const getStatusIcon = (rate: number) => {
    if (rate === 100) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (rate === 0) return <CircleDashed className="w-4 h-4 text-muted-foreground" />;
    return null;
  };

  return (
    <section className={`relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg ${className}`}>
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Overview</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Last 7 Days</h2>
            <p className="text-sm text-muted-foreground">Daily habit completion breakdown</p>
          </div>
          
          {/* Quick stats badge */}
          <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-4 py-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary">{averageRate}% avg</span>
          </div>
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-secondary/30 rounded-xl p-3 border border-border/30">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">Best Day</span>
            </div>
            <p className="text-lg font-bold text-foreground">{bestDay.rate}%</p>
            <p className="text-xs text-muted-foreground truncate">{bestDay.date}</p>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-3 border border-border/30">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs text-muted-foreground">Perfect Days</span>
            </div>
            <p className="text-lg font-bold text-foreground">{perfectDays}/7</p>
            <p className="text-xs text-muted-foreground">100% completion</p>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-3 border border-border/30">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={`w-3.5 h-3.5 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-xs text-muted-foreground">vs Yesterday</span>
            </div>
            <p className={`text-lg font-bold ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </p>
            <p className="text-xs text-muted-foreground">
              {trend >= 0 ? 'Improving' : 'Declining'}
            </p>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-3 border border-border/30">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs text-muted-foreground">Today</span>
            </div>
            <p className="text-lg font-bold text-foreground">{today.rate}%</p>
            <p className="text-xs text-muted-foreground">{today.completed}/{today.total} done</p>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="space-y-3">
          {data.map((day, index) => (
            <div
              key={day.date}
              className={`group relative rounded-xl border transition-all duration-300 hover:scale-[1.01] ${getRateBgColor(day.rate)}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-3 flex items-center gap-4">
                {/* Date */}
                <div className="w-16 shrink-0">
                  <p className="text-sm font-semibold text-foreground">{day.date}</p>
                  <p className="text-xs text-muted-foreground">
                    {day.completed === day.total && day.total > 0 ? 'All done!' : `${day.completed}/${day.total}`}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="flex-1 h-8 rounded-lg bg-background/50 overflow-hidden border border-border/20 relative">
                  <div
                    className={`h-full ${getRateColor(day.rate)} transition-all duration-500 ease-out flex items-center justify-end pr-2`}
                    style={{ width: `${day.rate}%` }}
                  >
                    {day.rate > 0 && (
                      <span className="text-xs font-bold text-white drop-shadow-md">
                        {day.rate}%
                      </span>
                    )}
                  </div>
                  
                  {/* Target marker at 100% */}
                  <div className="absolute right-0 top-0 h-full w-0.5 bg-foreground/20"></div>
                </div>

                {/* Status Icon */}
                <div className="w-8 flex justify-center">
                  {getStatusIcon(day.rate)}
                </div>

                {/* Percentage */}
                <div className="w-12 text-right">
                  <span className={`text-lg font-bold ${getRateTextColor(day.rate)}`}>
                    {day.rate}%
                  </span>
                </div>
              </div>

              {/* Hover tooltip */}
              <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-5 pt-4 border-t border-border/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span>100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>80-99%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>60-79%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>40-59%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs">{`<40%`}</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Showing last 7 days
          </div>
        </div>
      </div>
    </section>
  );
}