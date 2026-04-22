import type { Habit } from '@waqtify/types';

export type HabitUpsertInput = Omit<Habit, 'id' | 'createdAt'>;

export interface HabitTrackingInput {
  count?: number;
  duration?: number;
}
