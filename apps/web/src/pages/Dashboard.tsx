import React, { useMemo } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useHabitStore } from '../stores/habitStore';
import { HabitCard, Button, StatCard, SectionHeader } from '@waqtify/ui';
import { Plus, Target, Flame, LayoutList, TrendingUp, BarChart2, ChevronRight } from 'lucide-react';
import { formatISO, startOfDay, format, subDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ActivityHeatmap } from '../components/ActivityHeatmap';

export function Dashboard() {
  const { user } = useAuthStore();
  const { habits, logs, trackHabit, calculateStreak, getTodayStats, getWeeklyStats } = useHabitStore();
  const navigate = useNavigate();

  const todayStr = formatISO(startOfDay(new Date()), { representation: 'date' });

  // Today's stats
  const { completed: completedToday, total: totalToday, percentage: completionPercentage } = getTodayStats();

  // Highest current streak across all habits
  const highestStreak = useMemo(
    () => habits.reduce((max, h) => Math.max(max, calculateStreak(h.id)), 0),
    [habits, calculateStreak]
  );

  // 7-day average completion %
  const weeklyStats = useMemo(() => getWeeklyStats(7), [getWeeklyStats]);
  const weeklyAverage = useMemo(() => {
    if (weeklyStats.length === 0) return 0;
    return Math.round(weeklyStats.reduce((sum, d) => sum + d.rate, 0) / weeklyStats.length);
  }, [weeklyStats]);

  // Determine greeting by time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';
  const dateLabel = format(new Date(), 'EEEE, MMMM d');

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in duration-500 pb-6">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-1">{dateLabel}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {greeting},{' '}
            <span className="text-primary">{firstName}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            {completedToday === totalToday && totalToday > 0
              ? '🎉 All done for today! Outstanding work.'
              : totalToday === 0
              ? 'Start tracking by creating your first habit.'
              : `${completedToday} of ${totalToday} habits done today — keep pushing!`}
          </p>
        </div>

        <Button
          onClick={() => navigate('/add-habit')}
          className="shrink-0 group gap-2"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          New Habit
        </Button>
      </section>

      {/* ── KPI Stats ───────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Progress"
          value={`${completionPercentage}%`}
          subtitle={`${completedToday} / ${totalToday} habits`}
          accentValue={completionPercentage === 100}
          icon={<Target className="w-3.5 h-3.5" />}
          decorativeIcon={<Target className="w-28 h-28" />}
          trend={
            completionPercentage >= 80
              ? { direction: 'up', label: 'On track' }
              : completionPercentage > 0
              ? { direction: 'neutral', label: 'In progress' }
              : undefined
          }
        />
        <StatCard
          label="Best Streak"
          value={`${highestStreak}d`}
          subtitle="Highest active streak"
          icon={<Flame className="w-3.5 h-3.5 text-orange-400" />}
          decorativeIcon={<Flame className="w-28 h-28" />}
          trend={
            highestStreak >= 7
              ? { direction: 'up', label: 'Week+ streak!' }
              : highestStreak > 0
              ? { direction: 'neutral', label: 'Keep going' }
              : undefined
          }
        />
        <StatCard
          label="Active Habits"
          value={totalToday}
          subtitle="Habits tracked daily"
          icon={<LayoutList className="w-3.5 h-3.5" />}
          decorativeIcon={<LayoutList className="w-28 h-28" />}
        />
        <StatCard
          label="7-Day Average"
          value={`${weeklyAverage}%`}
          subtitle="Completion rate this week"
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          decorativeIcon={<TrendingUp className="w-28 h-28" />}
          trend={
            weeklyAverage >= 70
              ? { direction: 'up', label: 'Excellent week' }
              : weeklyAverage >= 40
              ? { direction: 'neutral', label: 'Room to grow' }
              : weeklyAverage > 0
              ? { direction: 'down', label: 'Needs attention' }
              : undefined
          }
        />
      </section>

      {/* ── Today's Habits ──────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <SectionHeader
          eyebrow="Daily Protocol"
          title="Today's Habits"
          subtitle="Check off your habits to keep your streaks alive."
        />

        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-2xl bg-card/30">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4 shadow-inner">
              <Plus className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">No habits configured</h3>
            <p className="text-muted-foreground text-sm max-w-xs mb-6 leading-relaxed">
              Build your daily routine by adding your first habit. Small steps, compounding results.
            </p>
            <Button variant="outline" onClick={() => navigate('/add-habit')}>
              Get Started
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit) => {
              const todaysLog = logs[habit.id]?.find(l => l.date === todayStr);
              const streakCount = calculateStreak(habit.id);
              return (
                <div
                  key={habit.id}
                  className="hover:-translate-y-0.5 transition-transform duration-200"
                >
                  <HabitCard
                    habit={habit}
                    todaysLog={todaysLog}
                    streakCount={streakCount}
                    onTrack={(count, duration) =>
                      trackHabit(habit.id, todayStr, { count, duration })
                    }
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Mini Activity Preview ────────────────────────────────────────── */}
      {habits.length > 0 && (
        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <SectionHeader
            eyebrow="Activity"
            title="Recent Consistency"
            subtitle="Your last 14 weeks at a glance."
            actions={
              <button
                onClick={() => navigate('/analytics')}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Full Analytics
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
            className="mb-5"
          />
          <ActivityHeatmap compact />
        </section>
      )}

    </div>
  );
}
