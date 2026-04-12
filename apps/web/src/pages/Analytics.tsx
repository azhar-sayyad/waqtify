import React, { useMemo, useState } from 'react';
import { useHabitStore } from '../stores/habitStore';
import { BarChart2, Download } from 'lucide-react';
import { Button, Badge } from '@waqtify/ui';
import {
  KPICards,
  ActivityHeatmapSection,
  WeeklyProgressChartSection,
  MissedDaysChart,
  CompletionByHabitPieChart,
  PerHabitRates,
} from '../components/analytics';
import { HabitLeaderboard } from '../components/HabitLeaderboard';

// ─── Date range options ────────────────────────────────────────────────────
type DateRange = 30 | 90 | 365;

const DATE_RANGE_OPTIONS: { label: string; value: DateRange }[] = [
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
  { label: '1yr', value: 365 },
];

// ─── Analytics Page ────────────────────────────────────────────────────────
export function Analytics() {
  const { habits, logs, calculateStreak, calculateLongestStreak, getMissedDayStats, getHabitLeaderboard, getWeeklyStats } = useHabitStore();
  const [dateRange, setDateRange] = useState<DateRange>(30);

  // ── KPI calculations ──────────────────────────────────────────────────
  const kpis = useMemo(() => {
    let totalCompleted = 0;
    let maxCurrentStreak = 0;
    let maxLongestStreak = 0;

    habits.forEach(h => {
      const hLogs = logs[h.id] || [];
      totalCompleted += hLogs.filter(l => l.completed).length;
      maxCurrentStreak = Math.max(maxCurrentStreak, calculateStreak(h.id));
      maxLongestStreak = Math.max(maxLongestStreak, calculateLongestStreak(h.id));
    });

    // Overall completion rate for the selected window
    let totalPossible = 0;
    let totalDone = 0;
    const cutoffStr = new Date(Date.now() - dateRange * 86400000).toISOString().slice(0, 10);

    habits.forEach(h => {
      const hLogs = logs[h.id] || [];
      const recent = hLogs.filter(l => l.date >= cutoffStr);
      totalDone += recent.filter(l => l.completed).length;
      totalPossible += dateRange;
    });

    const overallRate = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

    return { totalCompleted, maxCurrentStreak, maxLongestStreak, overallRate };
  }, [habits, logs, calculateStreak, calculateLongestStreak, dateRange]);

  // ── Missed days data ──────────────────────────────────────────────────
  const missedDaysData = useMemo(() => getMissedDayStats(dateRange), [getMissedDayStats, dateRange]);
  const worstDay = useMemo(
    () => [...missedDaysData].sort((a, b) => b.misses - a.misses)[0],
    [missedDaysData]
  );

  // ── Leaderboard data ──────────────────────────────────────────────────
  const leaderboard = useMemo(() => getHabitLeaderboard(dateRange), [getHabitLeaderboard, dateRange]);

  // ── Pie chart: per-habit completion share (last N days) ───────────────
  const pieData = useMemo(() => {
    const cutoffStr = new Date(Date.now() - dateRange * 86400000).toISOString().slice(0, 10);
    return habits.map(h => {
      const completed = (logs[h.id] || []).filter(l => l.date >= cutoffStr && l.completed).length;
      return { name: h.name, value: completed };
    }).filter(d => d.value > 0);
  }, [habits, logs, dateRange]);

  // ── Weekly progress line chart ────────────────────────────────────────
  const weeklyProgress = useMemo(() => getWeeklyStats(Math.min(dateRange, 30)), [getWeeklyStats, dateRange]);

  const hasData = habits.length > 0;

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ── Enhanced Header with Gradient Background ───────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-background border border-primary/20 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart2 className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Insights Engine</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Consistency Overview</h1>
            <p className="text-muted-foreground max-w-xl">
              Deep-dive into your habit patterns, performance trends, and identify areas for improvement.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            {/* Date range filter with enhanced styling */}
            <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-1">
              {DATE_RANGE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setDateRange(opt.value)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    dateRange === opt.value
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <Button size="sm" variant="outline" className="gap-2 shadow-sm hover:shadow-md transition-all">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>
        </div>
      </section>

      {/* ── KPI Cards ──────────────────────────────────────────────────── */}
      <KPICards data={{ ...kpis, dateRange }} />

      {/* ── Activity Heatmap ───────────────────────────────────────────── */}
      <ActivityHeatmapSection />

      {/* ── Charts Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeeklyProgressChartSection data={weeklyProgress} />
        <MissedDaysChart data={missedDaysData} worstDay={worstDay} hasHabits={hasData} />
      </div>

      {/* ── Per-Habit Breakdown ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompletionByHabitPieChart data={pieData} />
        <PerHabitRates data={leaderboard} />
      </div>

      {/* ── Habit Leaderboard ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart2 className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Rankings</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">Habit Leaderboard</h2>
              <p className="text-sm text-muted-foreground">All habits ranked by completion rate</p>
            </div>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              {leaderboard.length} {leaderboard.length === 1 ? 'habit' : 'habits'} tracked
            </Badge>
          </div>
          <HabitLeaderboard data={leaderboard} />
        </div>
      </section>
    </div>
  );
}