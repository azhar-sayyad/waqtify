import React, { useState } from 'react';
import { useHabitStore } from '../stores/habitStore';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Label } from '@waqtify/ui';
import { ArrowLeft, CheckCircle2, Clock, Hash, Calendar, Tag, FileText, Bell, Palette, Star } from 'lucide-react';
import type { HabitType, HabitPriority, HabitCategory } from '@waqtify/types';

const categoryLabels: Record<HabitCategory, string> = {
  health_fitness: 'Health & Fitness',
  productivity: 'Productivity',
  learning: 'Learning',
  mindfulness: 'Mindfulness',
  social: 'Social',
  finance: 'Finance',
  career: 'Career',
  creativity: 'Creativity',
  relationships: 'Relationships',
  personal_development: 'Personal Development',
  other: 'Other'
};

const priorityColors: Record<HabitPriority, string> = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500'
};

const iconOptions = [
  { value: '💪', label: 'Muscle' },
  { value: '📚', label: 'Book' },
  { value: '🧘', label: 'Meditation' },
  { value: '💧', label: 'Water' },
  { value: '🏃', label: 'Running' },
  { value: '✍️', label: 'Writing' },
  { value: '🎨', label: 'Art' },
  { value: '💰', label: 'Money' },
  { value: '🎯', label: 'Target' },
  { value: '⭐', label: 'Star' },
  { value: '🌱', label: 'Plant' },
  { value: '🎵', label: 'Music' },
];

const colorOptions = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
];

export function AddHabit() {
  const addHabit = useHabitStore(state => state.addHabit);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<HabitType>('binary');
  const [category, setCategory] = useState<HabitCategory>('other');
  const [priority, setPriority] = useState<HabitPriority>('medium');
  const [color, setColor] = useState<string>('#3B82F6');
  const [icon, setIcon] = useState<string>('⭐');
  const [target, setTarget] = useState<number>(1);
  const [targetTime, setTargetTime] = useState<number>(10);
  const [reminderTime, setReminderTime] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    addHabit({
      id: Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      type,
      priority,
      color,
      icon,
      target: type === 'count' ? target : undefined,
      expectedDuration: type === 'timer' ? targetTime * 60 : undefined,
      reminderTime: reminderTime || undefined,
      startDate,
      endDate: endDate || undefined,
      tags: tags.length > 0 ? tags : undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString()
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create Protocol</h1>
          <p className="text-muted-foreground">Define a new measurable behavior to track consistently.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* ── Basic Info ─────────────────────────────────────── */}
          <div className="space-y-6">
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

            <div className="space-y-3">
              <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description
              </Label>
              <textarea
                placeholder="What's this habit about? Why is it important?"
                className="w-full min-h-[80px] p-3 rounded-lg border bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors resize-none"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* ── Type ─────────────────────────────────────────── */}
          <div className="space-y-3">
            <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">Measurement Type</Label>
            <div className="grid grid-cols-3 gap-4">
              <label className="cursor-pointer group">
                <input type="radio" className="peer sr-only" checked={type === 'binary'} onChange={() => setType('binary')} />
                <div className="flex flex-col items-center p-4 border rounded-xl bg-card peer-checked:border-primary peer-checked:bg-primary/5 transition-all outline-ring peer-focus-visible:outline peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 hover:border-primary/50">
                  <CheckCircle2 className={`w-6 h-6 mb-2 ${type === 'binary' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">Toggle</span>
                </div>
              </label>

              <label className="cursor-pointer group">
                <input type="radio" className="peer sr-only" checked={type === 'count'} onChange={() => setType('count')} />
                <div className="flex flex-col items-center p-4 border rounded-xl bg-card peer-checked:border-primary peer-checked:bg-primary/5 transition-all outline-ring peer-focus-visible:outline hover:border-primary/50">
                  <Hash className={`w-6 h-6 mb-2 ${type === 'count' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">Quantity</span>
                </div>
              </label>

              <label className="cursor-pointer group">
                <input type="radio" className="peer sr-only" checked={type === 'timer'} onChange={() => setType('timer')} />
                <div className="flex flex-col items-center p-4 border rounded-xl bg-card peer-checked:border-primary peer-checked:bg-primary/5 transition-all outline-ring peer-focus-visible:outline hover:border-primary/50">
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
                 onChange={e => type === 'count' ? setTarget(parseInt(e.target.value) || 1) : setTargetTime(parseInt(e.target.value) || 10)}
                 required
               />
            </div>
          )}

          {/* ── Category ─────────────────────────────────────── */}
          <div className="space-y-3">
            <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">Category</Label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as HabitCategory)}
              className="h-14 px-4 rounded-lg border bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors w-full"
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* ── Priority ─────────────────────────────────────── */}
          <div className="space-y-3">
            <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
              <Star className="w-4 h-4" />
              Priority
            </Label>
            <div className="grid grid-cols-3 gap-4">
              {(['low', 'medium', 'high'] as HabitPriority[]).map((p) => (
                <label key={p} className="cursor-pointer group">
                  <input type="radio" className="peer sr-only" checked={priority === p} onChange={() => setPriority(p)} />
                  <div className="flex items-center justify-center p-4 border rounded-xl bg-card peer-checked:border-primary peer-checked:bg-primary/5 transition-all capitalize font-medium">
                    <div className={`w-3 h-3 rounded-full ${priorityColors[p]} mr-2`} />
                    {p}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ── Color ────────────────────────────────────────── */}
          <div className="space-y-3">
            <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color
            </Label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${color === c ? 'border-primary scale-110' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* ── Icon ─────────────────────────────────────────── */}
          <div className="space-y-3">
            <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">Icon</Label>
            <div className="flex flex-wrap gap-3">
              {iconOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setIcon(opt.value)}
                  className={`w-12 h-12 flex items-center justify-center text-xl rounded-xl border-2 transition-all ${icon === opt.value ? 'border-primary bg-primary/5 scale-110' : 'border-transparent hover:bg-secondary/50'}`}
                  title={opt.label}
                >
                  {opt.value}
                </button>
              ))}
            </div>
          </div>

          {/* ── Scheduling ───────────────────────────────────── */}
          <div className="space-y-6 pt-4 border-t">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Scheduling
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">Start Date</Label>
                <Input 
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="h-12 bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">End Date (Optional)</Label>
                <Input 
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="h-12 bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Daily Reminder Time (Optional)
              </Label>
              <Input 
                type="time"
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
                className="h-12 w-1/2 bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors"
              />
            </div>
          </div>

          {/* ── Tags ─────────────────────────────────────────── */}
          <div className="space-y-3">
            <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags (comma-separated)
            </Label>
            <Input 
              placeholder="e.g. morning, health, routine"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="h-12 bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors"
            />
          </div>

          {/* ── Notes ────────────────────────────────────────── */}
          <div className="space-y-3">
            <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">Notes</Label>
            <textarea
              placeholder="Additional notes, reflections, or context..."
              className="w-full min-h-[80px] p-3 rounded-lg border bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors resize-none"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* ── Submit ───────────────────────────────────────── */}
          <div className="pt-6 border-t flex justify-end">
            <Button size="lg" type="submit" disabled={!name.trim()} className="w-full sm:w-auto px-10 h-12">
              Initialize Protocol
            </Button>
          </div>

        </form>
      </div>

    </div>
  );
}