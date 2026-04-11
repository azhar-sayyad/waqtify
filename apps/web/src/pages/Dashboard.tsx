import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { useHabitStore } from '../stores/habitStore';
import { HabitCard, Button } from '@waqtify/ui';
import { Plus, Target, Flame, LayoutList } from 'lucide-react';
import { formatISO, startOfDay, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuthStore();
  const { habits, logs, trackHabit, calculateStreak } = useHabitStore();
  const navigate = useNavigate();

  const todayStr = formatISO(startOfDay(new Date()), { representation: 'date' });
  const todaysLogs = habits.map(h => logs[h.id]?.find(l => l.date === todayStr));
  const completedToday = todaysLogs.filter(l => l?.completed).length;
  const totalToday = habits.length;

  const highestStreak = habits.reduce((max, habit) => Math.max(max, calculateStreak(habit.id)), 0);
  const completionPercentage = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  return (
    <div className="w-full flex flex-col gap-10 animate-in fade-in duration-500">
      
      {/* Greetings & Overview */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Welcome back, <span className="text-primary">{user?.name ? user.name.split(' ')[0] : 'User'}</span>
          </h1>
          <p className="text-muted-foreground">Keep up the momentum. You have completed {completedToday} out of {totalToday} goals today.</p>
        </div>
        <Button onClick={() => navigate('/add-habit')} className="shrink-0 group">
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
          Create Habit
        </Button>
      </section>

      {/* Analytics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 text-muted-foreground">
            <span className="text-sm font-medium uppercase tracking-wider">Completion</span>
            <Target className="w-4 h-4" />
          </div>
          <p className="text-3xl font-bold">{completionPercentage}%</p>
          <div className="w-full h-1.5 bg-secondary mt-4 rounded-full overflow-hidden">
             <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 text-muted-foreground">
            <span className="text-sm font-medium uppercase tracking-wider">Top Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-3xl font-bold">{highestStreak} Days</p>
          <p className="text-sm text-muted-foreground mt-2">Your highest active momentum</p>
        </div>

        <div className="bg-card border rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 text-muted-foreground">
            <span className="text-sm font-medium uppercase tracking-wider">Active Goals</span>
            <LayoutList className="w-4 h-4" />
          </div>
          <p className="text-3xl font-bold">{totalToday}</p>
          <p className="text-sm text-muted-foreground mt-2">Habits tracked daily</p>
        </div>
      </section>

      {/* Habit List */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Today's Protocol</h2>
          <p className="text-sm text-muted-foreground mt-1">Check off your habits below to maintain your streaks.</p>
        </div>

        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl bg-card/30">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No habits configured</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">Start building your routine by adding your first daily habit.</p>
            <Button variant="outline" onClick={() => navigate('/add-habit')}>Get Started</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit) => {
              const todaysLog = logs[habit.id]?.find(l => l.date === todayStr);
              const streakCount = calculateStreak(habit.id);

              return (
                <div key={habit.id} className="transform hover:-translate-y-1 transition-all duration-300">
                  <HabitCard
                    habit={habit}
                    todaysLog={todaysLog}
                    streakCount={streakCount}
                    onTrack={(count, duration) => trackHabit(habit.id, todayStr, { count, duration })}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
