import { z } from 'zod';

export const AppPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  notifications: z.boolean(),
  dailyGoal: z.number().int().min(1).max(50),
});

export type AppPreferences = z.infer<typeof AppPreferencesSchema>;

export const defaultAppPreferences: AppPreferences = {
  theme: 'system',
  notifications: true,
  dailyGoal: 5,
};
