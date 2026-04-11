import React, { useMemo, useState } from 'react';
import { useHabitStore } from '../stores/habitStore';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend,
} from 'recharts';
import { Flame, Trophy, CheckCircle2, Info, BarChart2, Download } from 'lucide-react';
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
    <div className="w-full flex flex-col gap-8 animate-in fade-in duration-500 pb-10">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <SectionHeader
          eyebrow="Insights Engine"
          title="Consistency Overview"
          subtitle="Deep-dive into your habit patterns and performance trends."
        />
        <div className="flex gap-2 shrink-0">
          {/* Date range filter */}
          <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
            {DATE_RANGE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setDateRange(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  dateRange === opt.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </section>

      {/* ── KPI Cards ──────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Completed"
          value={kpis.totalCompleted.toLocaleString()}
          subtitle="Cumulative actions taken"
          icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          decorativeIcon={<CheckCircle2 className="w-28 h-28" />}
        />
        <StatCard
          label="Completion Rate"
          value={`${kpis.overallRate}%`}
          subtitle={`Last ${dateRange} days`}
          accentValue={kpis.overallRate >= 70}
          icon={<BarChart2 className="w-3.5 h-3.5 text-primary" />}
          decorativeIcon={<BarChart2 className="w-28 h-28" />}
          trend={
            kpis.overallRate >= 70 ? { direction: 'up', label: 'Great consistency' }
            : kpis.overallRate >= 40 ? { direction: 'neutral', label: 'Keep building' }
            : { direction: 'down', label: 'Needs focus' }
          }
        />
        <StatCard
          label="Current Streak"
          value={`${kpis.maxCurrentStreak}d`}
          subtitle="Active momentum"
          icon={<Flame className="w-3.5 h-3.5 text-orange-400" />}
          decorativeIcon={<Flame className="w-28 h-28" />}
          trend={
            kpis.maxCurrentStreak >= 7 ? { direction: 'up', label: 'Week+ streak!' }
            : kpis.maxCurrentStreak > 0 ? { direction: 'neutral', label: 'Keep it up' }
            : undefined
          }
        />
        <StatCard
          label="Longest Streak"
          value={`${kpis.maxLongestStreak}d`}
          subtitle="Historical best"
          icon={<Trophy className="w-3.5 h-3.5 text-yellow-400" />}
          decorativeIcon={<Trophy className="w-28 h-28" />}
        />
      </section>

      {/* ── Contribution Heatmap ────────────────────────────────────────── */}
      <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <SectionHeader
          eyebrow="Activity Map"
          title="Habit Streak Calendar"
          subtitle="Your year-at-a-glance consistency heatmap."
          className="mb-6"
        />
        {hasData ? (
          <ActivityHeatmap compact={false} />
        ) : (
          <div className="flex items-center justify-center h-24 text-sm text-muted-foreground italic">
            Add habits and start tracking to see your activity.
          </div>
        )}
      </section>

      {/* ── Completion Trend + Missed Days ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Line chart: completion trend */}
        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col">
          <SectionHeader
            eyebrow="Trend"
            title="Completion Rate Over Time"
            subtitle={`Daily % for last ${Math.min(dateRange, 30)} days`}
            className="mb-5"
          />
          <WeeklyProgressChart data={weeklyProgress} target={80} height={200} />
        </section>

        {/* Bar chart: missed days by DOW */}
        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col">
          <SectionHeader
            eyebrow="Weaknesses"
            title="Misses by Day of Week"
            subtitle={`Last ${dateRange} days — find your weak spots.`}
            className="mb-5"
          />
          <div className="h-[200px] w-full">
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
          {/* Insight tip */}
          <div className="mt-auto pt-4">
            <div className="bg-secondary/40 border border-border/40 rounded-xl p-3.5 flex gap-3">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Insight: </strong>
                {worstDay?.misses > 0
                  ? `You miss the most on ${worstDay.name}s. Consider lighter habits that day.`
                  : 'Your schedule looks balanced — great consistency across the week!'}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Per-Habit Breakdown + Pie ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Donut chart: completion share by habit */}
        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <SectionHeader
            eyebrow="Breakdown"
            title="Completion by Habit"
            subtitle={`Share of total completions — last ${dateRange} days.`}
            className="mb-5"
          />
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
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
            <div className="flex items-center justify-center h-[220px] text-sm text-muted-foreground italic">
              No completions logged in this period.
            </div>
          )}
        </section>

        {/* Horizontal progress bars: per-habit completion rate */}
        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <SectionHeader
            eyebrow="Performance"
            title="Per-Habit Rates"
            subtitle={`Completion % over last ${dateRange} days.`}
            className="mb-5"
          />
          <div className="space-y-4">
            {leaderboard.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No habit data available.</p>
            ) : (
              leaderboard.map(stat => (
                <div key={stat.id}>
                  <div className="flex justify-between text-sm font-semibold mb-1.5">
                    <span className="truncate max-w-[160px]">{stat.name}</span>
                    <span className={
                      stat.percentage >= 70 ? 'text-emerald-400'
                      : stat.percentage >= 40 ? 'text-amber-400'
                      : 'text-destructive'
                    }>
                      {stat.percentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${stat.percentage}%`,
                        background: stat.percentage >= 70
                          ? 'hsl(142 70% 45%)'
                          : stat.percentage >= 40
                          ? 'hsl(38 92% 50%)'
                          : 'hsl(var(--destructive))',
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* ── Habit Leaderboard ────────────────────────────────────────────── */}
      <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <SectionHeader
          eyebrow="Rankings"
          title="Habit Leaderboard"
          subtitle={`All habits ranked by completion rate over the last ${dateRange} days.`}
          actions={
            <Badge variant="secondary">
              {leaderboard.length} {leaderboard.length === 1 ? 'habit' : 'habits'}
            </Badge>
          }
          className="mb-5"
        />
        <HabitLeaderboard data={leaderboard} />
      </section>

    </div>
  );
}
