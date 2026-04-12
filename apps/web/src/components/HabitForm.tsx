import React, { useState, useEffect } from 'react';
import { Button, Input, Label, Dialog } from '@waqtify/ui';
import { CheckCircle2, Clock, Hash, Calendar, Tag, FileText, Bell, Palette, Star } from 'lucide-react';
import type { Habit, HabitType, HabitPriority, HabitCategory } from '@waqtify/types';
import type { HabitUpsertInput } from '../domain/habits/types';
import {
  categoryLabels,
  colorOptions,
  createDefaultHabitFormValues,
  habitFormValuesToInput,
  habitToFormValues,
  iconOptions,
  priorityColors,
} from '../domain/habits/form';

export interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (habitData: HabitUpsertInput) => void;
  initialData?: Habit;
  isEditing?: boolean;
}

export function HabitForm({ isOpen, onClose, onSubmit, initialData, isEditing = false }: HabitFormProps) {
  const defaults = createDefaultHabitFormValues();
  // Form state
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
  const [startDate, setStartDate] = useState<string>(defaults.startDate);
  const [endDate, setEndDate] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Populate form when editing
  useEffect(() => {
    if (initialData && isEditing) {
      const values = habitToFormValues(initialData);
      setName(values.name);
      setDescription(values.description);
      setType(values.type);
      setCategory(values.category);
      setPriority(values.priority);
      setColor(values.color);
      setIcon(values.icon);
      setTarget(values.target);
      setTargetTime(values.targetTime);
      setReminderTime(values.reminderTime);
      setStartDate(values.startDate);
      setEndDate(values.endDate);
      setTagsInput(values.tagsInput);
      setNotes(values.notes);
    } else if (!isEditing) {
      // Reset form for new habit
      resetForm();
    }
  }, [initialData, isEditing, isOpen]);

  const resetForm = () => {
    const values = createDefaultHabitFormValues();
    setName(values.name);
    setDescription(values.description);
    setType(values.type);
    setCategory(values.category);
    setPriority(values.priority);
    setColor(values.color);
    setIcon(values.icon);
    setTarget(values.target);
    setTargetTime(values.targetTime);
    setReminderTime(values.reminderTime);
    setStartDate(values.startDate);
    setEndDate(values.endDate);
    setTagsInput(values.tagsInput);
    setNotes(values.notes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit(
      habitFormValuesToInput({
        name,
        description,
        type,
        category,
        priority,
        color,
        icon,
        target,
        targetTime,
        reminderTime,
        startDate,
        endDate,
        tagsInput,
        notes,
      })
    );
    resetForm();
    onClose();
  };

  const handleDialogClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleDialogClose} title={isEditing ? 'Edit Protocol' : 'Create Protocol'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* ── Basic Info ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Habit Name</Label>
            <Input 
              autoFocus
              placeholder="e.g. Read 10 Pages, Drink Water" 
              className="h-11 bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </Label>
            <textarea
              placeholder="What's this habit about? Why is it important?"
              className="w-full min-h-[40px] p-3 rounded-lg border bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors resize-none text-sm"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* ── Type & Target ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Measurement Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <label className="cursor-pointer group">
                <input type="radio" className="peer sr-only" checked={type === 'binary'} onChange={() => setType('binary')} />
                <div className="flex flex-col items-center p-3 border rounded-lg bg-card peer-checked:border-primary peer-checked:bg-primary/5 transition-all hover:border-primary/50">
                  <CheckCircle2 className={`w-5 h-5 mb-1 ${type === 'binary' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-xs font-medium">Toggle</span>
                </div>
              </label>

              <label className="cursor-pointer group">
                <input type="radio" className="peer sr-only" checked={type === 'count'} onChange={() => setType('count')} />
                <div className="flex flex-col items-center p-3 border rounded-lg bg-card peer-checked:border-primary peer-checked:bg-primary/5 transition-all hover:border-primary/50">
                  <Hash className={`w-5 h-5 mb-1 ${type === 'count' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-xs font-medium">Quantity</span>
                </div>
              </label>

              <label className="cursor-pointer group">
                <input type="radio" className="peer sr-only" checked={type === 'timer'} onChange={() => setType('timer')} />
                <div className="flex flex-col items-center p-3 border rounded-lg bg-card peer-checked:border-primary peer-checked:bg-primary/5 transition-all hover:border-primary/50">
                  <Clock className={`w-5 h-5 mb-1 ${type === 'timer' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-xs font-medium">Duration</span>
                </div>
              </label>
            </div>
          </div>

          {type !== 'binary' && (
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-semibold">
                {type === 'count' ? 'Daily Target Quantity' : 'Daily Target Time (Minutes)'}
              </Label>
              <div className="flex gap-3">
                <Input 
                  type="number"
                  min={1}
                  className="h-11 bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors"
                  value={type === 'count' ? target : targetTime}
                  onChange={e => type === 'count' ? setTarget(parseInt(e.target.value) || 1) : setTargetTime(parseInt(e.target.value) || 10)}
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Category & Priority ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Category</Label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as HabitCategory)}
              className="h-11 px-4 rounded-lg border bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors text-sm"
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Star className="w-4 h-4" />
              Priority
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as HabitPriority[]).map((p) => (
                <label key={p} className="cursor-pointer group">
                  <input type="radio" className="peer sr-only" checked={priority === p} onChange={() => setPriority(p)} />
                  <div className="flex items-center justify-center p-3 border rounded-lg bg-card peer-checked:border-primary peer-checked:bg-primary/5 transition-all capitalize text-sm font-medium">
                    <div className={`w-2.5 h-2.5 rounded-full ${priorityColors[p]} mr-2`} />
                    {p}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── Color & Icon ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color
            </Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-primary scale-110' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Icon</Label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setIcon(opt.value)}
                  className={`w-10 h-10 flex items-center justify-center text-lg rounded-lg border-2 transition-all ${icon === opt.value ? 'border-primary bg-primary/5 scale-110' : 'border-transparent hover:bg-secondary/50'}`}
                  title={opt.label}
                >
                  {opt.value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Scheduling ───────────────────────────────────── */}
        <div className="space-y-3 pt-2 border-t">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Scheduling
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Start Date</Label>
              <Input 
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="h-10 bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">End Date (Optional)</Label>
              <Input 
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="h-10 bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-2">
              <Bell className="w-3 h-3" />
              Daily Reminder (Optional)
            </Label>
            <Input 
              type="time"
              value={reminderTime}
              onChange={e => setReminderTime(e.target.value)}
              className="h-10 w-1/2 bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors text-sm"
            />
          </div>
        </div>

        {/* ── Tags & Notes ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags (comma-separated)
            </Label>
            <Input 
              placeholder="e.g. morning, health, routine"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="h-10 bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Notes</Label>
            <textarea
              placeholder="Additional notes, reflections, or context..."
              className="w-full min-h-[40px] p-3 rounded-lg border bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors resize-none text-sm"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* ── Actions ──────────────────────────────────────── */}
        <div className="pt-4 border-t flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleDialogClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!name.trim()}
            className="px-6"
          >
            {isEditing ? 'Save Changes' : 'Create Habit'}
          </Button>
        </div>

      </form>
    </Dialog>
  );
}
