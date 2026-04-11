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

export const HabitSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional(),
  type: HabitTypeSchema,
  target: z.number().optional(), // Used for 'count'
  expectedDuration: z.number().optional(), // Used for 'timer' in seconds
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
