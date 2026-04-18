export type HabitType = 'binary' | 'count' | 'timer';

export type HabitPriority = 'low' | 'medium' | 'high';

export const habitPriorityColors: Record<HabitPriority, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

export type HabitCategory =
  | 'health_fitness'
  | 'productivity'
  | 'learning'
  | 'mindfulness'
  | 'social'
  | 'finance'
  | 'career'
  | 'creativity'
  | 'relationships'
  | 'personal_development'
  | 'other';

export const habitCategoryLabels: Record<HabitCategory, string> = {
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
  other: 'Other',
};

export const habitIconOptions = [
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
] as const;

export const habitColorOptions = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#6366F1',
] as const;

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category?: HabitCategory;
  type: HabitType;
  priority: HabitPriority;
  color?: string;
  icon?: string;
  target?: number;
  expectedDuration?: number;
  reminderTime?: string;
  startDate: string;
  endDate?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  count?: number;
  duration?: number;
}

export interface HabitUpsertInput {
  name: string;
  description?: string;
  category?: HabitCategory;
  type: HabitType;
  priority: HabitPriority;
  color?: string;
  icon?: string;
  target?: number;
  expectedDuration?: number;
  reminderTime?: string;
  startDate: string;
  endDate?: string;
  tags?: string[];
  notes?: string;
}

export interface HabitTrackingInput {
  count?: number;
  duration?: number;
}

export interface AppPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  dailyGoal: number;
}

export const defaultAppPreferences: AppPreferences = {
  theme: 'system',
  notifications: true,
  dailyGoal: 5,
};

export interface HabitCollection {
  habits: Habit[];
  logs: Record<string, HabitLog[]>;
}

