import React, { useMemo, useState } from 'react';
import { useHabitStore } from '../stores/habitStore';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend,
} from 'recharts';
import { Flame, Trophy, CheckCircle2, Info, BarChart2, Download, Calendar, TrendingUp, Activity, PieChart as PieChartIcon, Award, Target, Zap } from 'lucide-react';
import { Button, StatCard, SectionHeader, Badge } from '@waqtify/ui';
import { ActivityHeatmap } from '../components/ActivityHeatmap';
import { HabitLeaderboard } from '../components/HabitLeaderboard';
import { WeeklyProgressChart } from '../components/WeeklyProgressChart';

// ─── Date range options ────────────────────────────────────────────────────
type DateRange = 30 | 90 | 365;

const DATE_RANGE_OPTIONS: { label: string; value: DateRange }[] = [
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
  { label: '1yr', value: 365 },
];

// ─── Custom tooltip for Bar Chart ─────────────────────────────────────────
function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-sm">
      <p className="font-bold text-foreground mb-1">{label}</p>
      <p className="text-destructive font-semibold">{payload[0].value} misses</p>
    </div>
  );
}

// ─── Pie chart custom label ────────────────────────────────────────────────
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.07) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${Math.round(percent * 100)}%`}
    </text>
  );
}

// ─── Pie chart palette ─────────────────────────────────────────────────────
const PIE_COLORS = [
  'hsl(265 90% 72%)',
  'hsl(142 70% 50%)',
  'hsl(38 92% 55%)',
  'hsl(199 89% 55%)',
  'hsl(330 80% 62%)',
  'hsl(25 90% 55%)',
  'hsl(175 70% 45%)',
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

      {/* ── Enhanced KPI Cards with Icons and Gradients ────────────────── */}
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
            subtitle={`Last ${dateRange} days`}
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

      {/* ── Enhanced Contribution Heatmap Section ──────────────────────── */}
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
          {hasData ? (
            <ActivityHeatmap compact={false} />
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Activity className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">Add habits and start tracking to see your activity</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Enhanced Charts Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line chart: completion trend */}
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
                <p className="text-sm text-muted-foreground">Daily percentage for last {Math.min(dateRange, 30)} days</p>
              </div>
            </div>
            <WeeklyProgressChart data={weeklyProgress} target={80} height={220} />
          </div>
        </section>

        {/* Bar chart: missed days by DOW */}
        <section className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-destructive/5 rounded-full blur-3xl"></div>
          <div className="relative p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-destructive" />
                  </div>
                  <span className="text-xs font-semibold text-destructive uppercase tracking-wider">Weaknesses</span>
                </div>
                <h2 className="text-lg font-bold tracking-tight">Misses by Day of Week</h2>
                <p className="text-sm text-muted-foreground">Find your weak spots</p>
              </div>
            </div>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={missedDaysData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: 'hsl(240 5% 65%)' }} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} tickMargin={4} tick={{ fill: 'hsl(240 5% 65%)' }} />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: 'hsl(240 5% 16%)', opacity: 0.4 }} />
                  <Bar dataKey="misses" radius={[6, 6, 2, 2]} barSize={28}>
                    {missedDaysData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry === worstDay ? 'hsl(var(--destructive))' : 'hsl(var(--destructive) / 0.4)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Enhanced Insight tip */}
            <div className="mt-4">
              <div className="bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border/40 rounded-xl p-4 flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary mb-1">AI Insight</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {worstDay?.misses > 0
                      ? `You miss the most on ${worstDay.name}s. Consider setting lighter habits or reminders for that day.`
                      : 'Your schedule looks balanced — great consistency across the entire week!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Enhanced Per-Habit Breakdown ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donut chart: completion share by habit */}
        <section className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PieChartIcon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">Breakdown</span>
                </div>
                <h2 className="text-lg font-bold tracking-tight">Completion by Habit</h2>
                <p className="text-sm text-muted-foreground">Share of total completions</p>
              </div>
            </div>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={PieLabel}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number, name: string) => [`${v} completions`, name]}
                    contentStyle={{ borderRadius: '10px', border: '1px solid hsl(240 5% 20%)', background: 'hsl(240 5% 10%)', fontSize: '12px' }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ fontSize: 11, color: 'hsl(240 5% 65%)' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[240px] text-muted-foreground">
                <p className="text-sm">No completions logged in this period</p>
              </div>
            )}
          </div>
        </section>

        {/* Horizontal progress bars: per-habit completion rate */}
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
              {leaderboard.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <p className="text-sm">No habit data available</p>
                </div>
              ) : (
                leaderboard.map(stat => (
                  <div key={stat.id} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold truncate max-w-[150px]">{stat.name}</span>
                      <span className={`text-sm font-bold ${
                        stat.percentage >= 70 ? 'text-emerald-500'
                        : stat.percentage >= 40 ? 'text-amber-500'
                        : 'text-destructive'
                      }`}>
                        {stat.percentage}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                        style={{
                          width: `${stat.percentage}%`,
                          background: stat.percentage >= 70
                            ? 'linear-gradient(90deg, hsl(142 70% 45%), hsl(142 70% 55%))'
                            : stat.percentage >= 40
                            ? 'linear-gradient(90deg, hsl(38 92% 50%), hsl(38 92% 60%))'
                            : 'linear-gradient(90deg, hsl(0 84% 60%), hsl(0 84% 65%))',
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ── Enhanced Habit Leaderboard ─────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="w-4 h-4 text-primary" />
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
