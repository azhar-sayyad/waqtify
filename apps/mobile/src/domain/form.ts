import {
  habitCategoryLabels,
  habitColorOptions,
  habitIconOptions,
  type Habit,
  type HabitCategory,
  type HabitPriority,
  type HabitUpsertInput,
} from '../types';
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
  startDate: string;
  endDate: string;
  tagsInput: string;
  notes: string;
}

export const categoryLabels = habitCategoryLabels;
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
    startDate: values.startDate,
    endDate: values.endDate || undefined,
    tags: tags.length > 0 ? tags : undefined,
    notes: values.notes.trim() || undefined,
  };
};

