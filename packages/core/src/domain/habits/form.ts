import {
  habitCategoryLabels,
  habitColorOptions,
  habitIconOptions,
  habitPriorityClasses,
  type Habit,
  type HabitCategory,
  type HabitPriority,
} from '@waqtify/types';
import type { HabitUpsertInput } from './types';
import { getLocalDateString } from './date';

export interface HabitFormValues {
  name: string;
  description: string;
  type: Habit['type'];
  category: HabitCategory;
  priority: HabitPriority;
  color: string;
  icon: string;
  target: number;
  targetTime: number;
  reminderTime: string;
  reminderEnabled: boolean;
  reminderFrequency: { interval: number; unit: 'hours' | 'days' } | undefined;
  startDate: string;
  endDate: string;
  tagsInput: string;
  notes: string;
}

export const categoryLabels: Record<HabitCategory, string> = habitCategoryLabels;

export const priorityColors: Record<HabitPriority, string> = habitPriorityClasses;

export const iconOptions = [...habitIconOptions];

export const colorOptions = [...habitColorOptions];

export const createDefaultHabitFormValues = (): HabitFormValues => ({
  name: '',
  description: '',
  type: 'binary',
  category: 'other',
  priority: 'medium',
  color: '#3B82F6',
  icon: '⭐',
  target: 1,
  targetTime: 10,
  reminderTime: '',
  reminderEnabled: true,
  reminderFrequency: undefined,
  startDate: getLocalDateString(new Date()),
  endDate: '',
  tagsInput: '',
  notes: '',
});

export const habitToFormValues = (habit: Habit): HabitFormValues => ({
  name: habit.name,
  description: habit.description || '',
  type: habit.type,
  category: habit.category || 'other',
  priority: habit.priority || 'medium',
  color: habit.color || '#3B82F6',
  icon: habit.icon || '⭐',
  target: habit.target ?? 1,
  targetTime: habit.expectedDuration ? Math.round(habit.expectedDuration / 60) : 10,
  reminderTime: habit.reminderTime || '',
  reminderEnabled: habit.reminderEnabled ?? true,
  reminderFrequency: habit.reminderFrequency,
  startDate: habit.startDate || getLocalDateString(new Date()),
  endDate: habit.endDate || '',
  tagsInput: habit.tags ? habit.tags.join(', ') : '',
  notes: habit.notes || '',
});

export const habitFormValuesToInput = (values: HabitFormValues): HabitUpsertInput => {
  const tags = values.tagsInput
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    name: values.name.trim(),
    description: values.description.trim() || undefined,
    category: values.category,
    type: values.type,
    priority: values.priority,
    color: values.color,
    icon: values.icon,
    target: values.type === 'count' ? values.target : undefined,
    expectedDuration: values.type === 'timer' ? values.targetTime * 60 : undefined,
    reminderTime: values.reminderTime || undefined,
    reminderEnabled: values.reminderEnabled,
    reminderFrequency: values.reminderFrequency,
    startDate: values.startDate,
    endDate: values.endDate || undefined,
    tags: tags.length > 0 ? tags : undefined,
    notes: values.notes.trim() || undefined,
  };
};
