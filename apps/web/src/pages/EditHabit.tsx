import React, { useState } from 'react';
import { useHabitStore } from '../stores/habitStore';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Label } from '@waqtify/ui';
import { ArrowLeft, CheckCircle2, Clock, Hash } from 'lucide-react';
import type { HabitType } from '@waqtify/types';

export function EditHabit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const habits = useHabitStore(state => state.habits);
  const updateHabit = useHabitStore(state => state.updateHabit);

  const habit = habits.find(h => h.id === id);

  // Pre-populate form from existing habit data
  const [name, setName] = useState(habit?.name ?? '');
  const [type, setType] = useState<HabitType>(habit?.type ?? 'binary');
  const [target, setTarget] = useState<number>(habit?.target ?? 1);
  const [targetTime, setTargetTime] = useState<number>(
    habit?.expectedDuration ? Math.round(habit.expectedDuration / 60) : 10
  );

  // Unknown habit → bounce back
  if (!habit) {
    return (
      <div className="max-w-2xl mx-auto w-full animate-in fade-in duration-500 flex flex-col items-center justify-center py-24 text-center gap-4">
        <p className="text-muted-foreground">Habit not found.</p>
        <Button variant="outline" onClick={() => navigate('/')}>Back to Dashboard</Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateHabit(id!, {
      name: name.trim(),
      type,
      target: type === 'count' ? target : undefined,
      expectedDuration: type === 'timer' ? targetTime * 60 : undefined,
    });

    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

      <button
        onClick={() => navigate('/')}
        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="bg-card border rounded-2xl shadow-sm p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Protocol</h1>
          <p className="text-muted-foreground">Update the details for <span className="text-foreground font-medium">{habit.name}</span>.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── Name ─────────────────────────────────────────── */}
          <div className="space-y-3">
            <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">Habit Name</Label>
            <Input
              autoFocus
              placeholder="e.g. Read 10 Pages, Drink Water"
              className="h-14 text-lg bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          {/* ── Type ─────────────────────────────────────────── */}
          <div className="space-y-3">
            <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">Measurement Type</Label>
            <div className="grid grid-cols-3 gap-4">
              <label className="cursor-pointer group">
                <input type="radio" className="peer sr-only" checked={type === 'binary'} onChange={() => setType('binary')} />
                <div className="flex flex-col items-center p-4 border rounded-xl bg-card peer-checked:border-primary peer-checked:bg-primary/5 transition-all hover:border-primary/50">
                  <CheckCircle2 className={`w-6 h-6 mb-2 ${type === 'binary' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">Toggle</span>
                </div>
              </label>

              <label className="cursor-pointer group">
                <input type="radio" className="peer sr-only" checked={type === 'count'} onChange={() => setType('count')} />
                <div className="flex flex-col items-center p-4 border rounded-xl bg-card peer-checked:border-primary peer-checked:bg-primary/5 transition-all hover:border-primary/50">
                  <Hash className={`w-6 h-6 mb-2 ${type === 'count' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">Quantity</span>
                </div>
              </label>

              <label className="cursor-pointer group">
                <input type="radio" className="peer sr-only" checked={type === 'timer'} onChange={() => setType('timer')} />
                <div className="flex flex-col items-center p-4 border rounded-xl bg-card peer-checked:border-primary peer-checked:bg-primary/5 transition-all hover:border-primary/50">
                  <Clock className={`w-6 h-6 mb-2 ${type === 'timer' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">Duration</span>
                </div>
              </label>
            </div>
            <p className="text-xs text-muted-foreground px-1 mt-2">
              {type === 'binary' && "A simple yes or no completion check for the day."}
              {type === 'count' && "Track numerical goals like glasses of water or pages read."}
              {type === 'timer' && "Measure the time spent on a focused activity."}
            </p>
          </div>

          {/* ── Target (conditional) ─────────────────────────── */}
          {type !== 'binary' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
                {type === 'count' ? 'Daily Target Quantity' : 'Daily Target Time (Minutes)'}
              </Label>
              <Input
                type="number"
                min={1}
                className="h-14 text-lg bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors w-1/2"
                value={type === 'count' ? target : targetTime}
                onChange={e =>
                  type === 'count'
                    ? setTarget(parseInt(e.target.value) || 1)
                    : setTargetTime(parseInt(e.target.value) || 10)
                }
                required
              />
            </div>
          )}

          {/* ── Actions ──────────────────────────────────────── */}
          <div className="pt-6 border-t flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-8 h-12"
            >
              Cancel
            </Button>
            <Button
              size="lg"
              type="submit"
              disabled={!name.trim()}
              className="w-full sm:w-auto px-10 h-12"
            >
              Save Changes
            </Button>
          </div>

        </form>
      </div>

    </div>
  );
}
