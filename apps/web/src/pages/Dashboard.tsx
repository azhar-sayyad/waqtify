import React, { useMemo, useState } from 'react';
import { useAuthStore } from '@waqtify/core';
import { useHabitStore } from '@waqtify/core';
import { HabitCard, Button, StatCard, Dialog } from '@waqtify/ui';
import { Plus, Target, Flame, LayoutList, TrendingUp, ChevronRight, AlertTriangle, Calendar, Zap, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ActivityHeatmap } from '../components/ActivityHeatmap';
import { HabitForm } from '../components/HabitForm';
import type { Habit } from '@waqtify/types';
import { getLocalDateString } from '@waqtify/core';

export function Dashboard() {
  const { user } = useAuthStore();
  const {
    habits,
    logs,
    trackHabit,
    deleteHabit,
    createHabit,
    updateHabit,
    calculateStreak,
    getDashboardSummary,
  } = useHabitStore();
  const navigate = useNavigate();

  // ── Dialog states ─────────────────────────────────────────────────────────
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  const todayStr = getLocalDateString(new Date());
  const dashboardSummary = useMemo(
    () => getDashboardSummary(),
    [getDashboardSummary, habits, logs]
  );
  const {
    today: {
      completed: completedToday,
      total: totalToday,
      percentage: completionPercentage,
    },
    highestStreak,
    weeklyAverage,
  } = dashboardSummary;

  // Determine greeting by time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';
  const dateLabel = format(new Date(), 'EEEE, MMMM d');

  const handleConfirmDelete = () => {
    if (habitToDelete) {
      deleteHabit(habitToDelete.id);
      setHabitToDelete(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ── Welcome Header with Enhanced Design ────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{dateLabel}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {greeting}, <span className="text-primary">{firstName}</span>
              <span className="ml-2 text-2xl">👋</span>
            </h1>
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-2 inline-flex">
              {completedToday === totalToday && totalToday > 0 ? (
                <>
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">All done for today! Outstanding work! 🎉</span>
                </>
              ) : totalToday === 0 ? (
                <>
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Start tracking by creating your first habit</span>
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{completedToday} of {totalToday} habits done — keep pushing!</span>
                </>
              )}
            </div>
          </div>
          
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="shrink-0 group gap-2 h-12 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            size="lg"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold">New Habit</span>
          </Button>
        </div>
      </section>

      {/* ── Enhanced KPI Stats with Better Visual Hierarchy ────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-0 group-hover:opacity-100"></div>
          <StatCard
            label="Today's Progress"
            value={`${completionPercentage}%`}
            subtitle={`${completedToday} / ${totalToday} habits`}
            accentValue={completionPercentage === 100}
            icon={<Target className="w-4 h-4" />}
            decorativeIcon={<Target className="w-32 h-32" />}
            trend={
              completionPercentage >= 80
                ? { direction: 'up', label: 'On track' }
                : completionPercentage > 0
                ? { direction: 'neutral', label: 'In progress' }
                : undefined
            }
            className="relative"
          />
          {completionPercentage === 100 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-xs">🎯</span>
            </div>
          )}
        </div>

        <StatCard
          label="Best Streak"
          value={`${highestStreak}d`}
          subtitle="Highest active streak"
          icon={<Flame className="w-4 h-4 text-orange-500" />}
          decorativeIcon={<Flame className="w-32 h-32" />}
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
          icon={<LayoutList className="w-4 h-4" />}
          decorativeIcon={<LayoutList className="w-32 h-32" />}
        />

        <StatCard
          label="7-Day Average"
          value={`${weeklyAverage}%`}
          subtitle="Completion rate this week"
          icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
          decorativeIcon={<TrendingUp className="w-32 h-32" />}
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

      {/* ── Weekly Stats Section ──────────────────────────────────────── */}
      {/* <WeeklyStatsSection data={dashboardSummary.weeklyCompletionSeries} /> */}

      {/* ── Today's Habits with Enhanced Section Header ────────────────── */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <LayoutList className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Daily Protocol</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Today's Habits</h2>
            <p className="text-sm text-muted-foreground">Check off your habits to keep your streaks alive</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-1.5">
            <span className="text-xs font-medium text-muted-foreground">{habits.length} total</span>
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/60 bg-card/30 p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Plus className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">No habits configured yet</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Start building your daily routine by adding your first habit. Small consistent actions lead to remarkable results over time.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                Create Your First Habit
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit, index) => {
              const todaysLog = logs[habit.id]?.find(l => l.date === todayStr);
              const streakCount = calculateStreak(habit.id);
              return (
                <div
                  key={habit.id}
                  className="group relative"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative hover:-translate-y-1 transition-all duration-300">
                    <HabitCard
                      habit={habit}
                      todaysLog={todaysLog}
                      streakCount={streakCount}
                      onTrack={(count, duration) =>
                        trackHabit(habit.id, todayStr, { count, duration })
                      }
                      onEdit={() => setHabitToEdit(habit)}
                      onDelete={() => setHabitToDelete(habit)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Enhanced Activity Preview Section ──────────────────────────── */}
      {habits.length > 0 && (
        <section className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">Activity</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">Recent Consistency</h2>
                <p className="text-sm text-muted-foreground">Your last 14 weeks at a glance</p>
              </div>
              <button
                onClick={() => navigate('/analytics')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
              >
                Full Analytics
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <ActivityHeatmap compact />
          </div>
        </section>
      )}

      {/* ── Dialogs (Preserved) ────────────────────────────────────────── */}
      <HabitForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={(habitData) => {
          createHabit(habitData);
        }}
      />

      <HabitForm
        isOpen={!!habitToEdit}
        onClose={() => setHabitToEdit(null)}
        onSubmit={(habitData) => {
          if (habitToEdit) {
            updateHabit(habitToEdit.id, habitData);
          }
        }}
        initialData={habitToEdit || undefined}
        isEditing={true}
      />

      <Dialog
        isOpen={!!habitToDelete}
        onClose={() => setHabitToDelete(null)}
        title={
          <span className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Habit
          </span>
        }
      >
        <div className="flex flex-col gap-5">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-foreground">{habitToDelete?.name}</span>?{' '}
            All tracking history for this habit will be permanently removed and cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setHabitToDelete(null)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg"
            >
              Delete Habit
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
