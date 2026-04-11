import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useHabitStore } from '../stores/habitStore';
import { HabitCard, Button, Dialog, Input, Label } from '@waqtify/ui';
import { Plus, Layout } from 'lucide-react';
import type { Habit, HabitType } from '@waqtify/types';
import { formatISO, startOfDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { user, logout } = useAuthStore();
  const { habits, logs, addHabit, trackHabit, calculateStreak } = useHabitStore();
  const navigate = useNavigate();
  
  // Dialog state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitType, setNewHabitType] = useState<HabitType>('binary');
  const [newHabitTarget, setNewHabitTarget] = useState<number>(1);

  const todayStr = formatISO(startOfDay(new Date()), { representation: 'date' });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const navHabit: Habit = {
      id: Math.random().toString(36).substring(2, 9),
      name: newHabitName,
      type: newHabitType,
      target: newHabitType === 'count' ? newHabitTarget : undefined,
      expectedDuration: newHabitType === 'timer' ? newHabitTarget * 60 : undefined,
      createdAt: new Date().toISOString()
    };

    addHabit(navHabit);
    setShowAddForm(false);
    setNewHabitName('');
    setNewHabitType('binary');
    setNewHabitTarget(1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 mr-4">
              <Layout className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold tracking-tight">Waqtify</span>
            </div>
            <nav className="flex items-center space-x-4 text-sm font-medium">
              <span className="text-foreground border-b-2 border-primary py-5 cursor-pointer">Habits</span>
              <span 
                className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer py-5" 
                onClick={() => navigate('/analytics')}
              >
                Analytics
              </span>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              {user?.name || 'Guest'}
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>Sign Out</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Today's Focus</h2>
            <p className="text-muted-foreground mt-1">Consistency is the key to mastery.</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Habit
          </Button>
        </div>

        <Dialog isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="Create a New Habit">
          <form onSubmit={handleCreateHabit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="habitName">Habit Name</Label>
              <Input 
                id="habitName" 
                placeholder="e.g., Drink Water" 
                value={newHabitName}
                onChange={e => setNewHabitName(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="habitType">Tracking Method</Label>
              <select 
                id="habitType"
                value={newHabitType}
                onChange={e => setNewHabitType(e.target.value as HabitType)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="binary">Yes / No (Binary)</option>
                <option value="count">Target Count (e.g., 8 glasses)</option>
                <option value="timer">Timer Duration (Minutes)</option>
              </select>
            </div>

            {newHabitType !== 'binary' && (
              <div className="space-y-2">
                <Label htmlFor="habitTarget">
                  {newHabitType === 'count' ? 'Target Amount' : 'Duration (Minutes)'}
                </Label>
                <Input 
                  id="habitTarget"
                  type="number"
                  min={1}
                  value={newHabitTarget}
                  onChange={e => setNewHabitTarget(parseInt(e.target.value) || 1)}
                />
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={!newHabitName.trim()}>
                Create Habit
              </Button>
            </div>
          </form>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map((habit) => {
            const todaysLog = logs[habit.id]?.find(l => l.date === todayStr);
            const streakCount = calculateStreak(habit.id);

            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                todaysLog={todaysLog}
                streakCount={streakCount}
                onTrack={(count, duration) => trackHabit(habit.id, todayStr, { count, duration })}
              />
            );
          })}
        </div>

        {habits.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-xl mt-8">
            <p className="text-muted-foreground mb-4">You have not created any habits yet.</p>
            <Button variant="outline" onClick={() => setShowAddForm(true)}>Add your first habit</Button>
          </div>
        )}
      </main>
    </div>
  );
}
