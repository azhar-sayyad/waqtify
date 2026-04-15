import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  passwordHash: z.string(), // Mapped in auth store for local-first testing
});
export type User = z.infer<typeof UserSchema>;

export const HabitTypeSchema = z.enum(['binary', 'count', 'timer']);
export type HabitType = z.infer<typeof HabitTypeSchema>;

export const HabitPrioritySchema = z.enum(['low', 'medium', 'high']);
export type HabitPriority = z.infer<typeof HabitPrioritySchema>;

export const habitPriorityClasses: Record<HabitPriority, string> = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};

export const HabitCategorySchema = z.enum([
  'health_fitness',
  'productivity',
  'learning',
  'mindfulness',
  'social',
  'finance',
  'career',
  'creativity',
  'relationships',
  'personal_development',
  'other'
]);
export type HabitCategory = z.infer<typeof HabitCategorySchema>;

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

export const HabitSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: HabitCategorySchema.optional(),
  type: HabitTypeSchema,
  priority: HabitPrioritySchema.default('medium'),
  color: z.string().optional(),
  icon: z.string().optional(),
  target: z.number().optional(), // Used for 'count'
  expectedDuration: z.number().optional(), // Used for 'timer' in seconds
  reminderTime: z.string().optional(), // HH:MM format
  startDate: z.string(),
  endDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
});
export type Habit = z.infer<typeof HabitSchema>;

export const HabitLogSchema = z.object({
  id: z.string(),
  habitId: z.string(),
  date: z.string(), // ISO-8601 local date (e.g., "2025-05-10")
  completed: z.boolean(),
  count: z.number().optional(),
  duration: z.number().optional(), // Actual duration logged
});
export type HabitLog = z.infer<typeof HabitLogSchema>;
