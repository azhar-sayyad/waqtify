import { z } from 'zod';
import { defaultAppPreferences, AppPreferencesSchema, type AppPreferences } from '../../domain/settings/types';
import { readJsonFromStorage, writeJsonToStorage } from '../storage/localStorage';

const SETTINGS_STORAGE_KEY = 'waqtify.settings.v1';
const LEGACY_SETTINGS_STORAGE_KEY = 'userProfile';

const SettingsRepositorySchema = z.object({
  version: z.literal(1),
  users: z.record(z.string(), AppPreferencesSchema),
  unassigned: AppPreferencesSchema.nullable(),
});

const LegacyUserProfileSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notifications: z.boolean().optional(),
  dailyGoal: z.number().int().positive().optional(),
});

interface SettingsRepositorySnapshot {
  version: 1;
  users: Record<string, AppPreferences>;
  unassigned: AppPreferences | null;
}

export interface SettingsRepository {
  getUserSettings(userId: string): AppPreferences;
  saveUserSettings(userId: string, settings: AppPreferences): AppPreferences;
}

const defaultSnapshot = (): SettingsRepositorySnapshot => ({
  version: 1,
  users: {},
  unassigned: null,
});

const migrateLegacySettings = (): SettingsRepositorySnapshot | null => {
  const legacyRaw = readJsonFromStorage(LEGACY_SETTINGS_STORAGE_KEY);
  const legacy = LegacyUserProfileSchema.safeParse(legacyRaw);
  if (!legacy.success) return null;

  return {
    version: 1,
    users: {},
    unassigned: {
      theme: legacy.data.theme || defaultAppPreferences.theme,
      notifications: legacy.data.notifications ?? defaultAppPreferences.notifications,
      dailyGoal: legacy.data.dailyGoal || defaultAppPreferences.dailyGoal,
    },
  };
};

export class LocalSettingsRepository implements SettingsRepository {
  private readSnapshot(): SettingsRepositorySnapshot {
    const parsed = SettingsRepositorySchema.safeParse(readJsonFromStorage(SETTINGS_STORAGE_KEY));
    if (parsed.success) {
      return parsed.data;
    }

    const migrated = migrateLegacySettings();
    if (migrated) {
      this.writeSnapshot(migrated);
      return migrated;
    }

    return defaultSnapshot();
  }

  private writeSnapshot(snapshot: SettingsRepositorySnapshot): void {
    writeJsonToStorage(SETTINGS_STORAGE_KEY, snapshot);
  }

  getUserSettings(userId: string): AppPreferences {
    const snapshot = this.readSnapshot();
    const existing = snapshot.users[userId];
    if (existing) return existing;

    if (snapshot.unassigned) {
      const nextSnapshot: SettingsRepositorySnapshot = {
        ...snapshot,
        users: {
          ...snapshot.users,
          [userId]: snapshot.unassigned,
        },
        unassigned: null,
      };
      this.writeSnapshot(nextSnapshot);
      return nextSnapshot.users[userId];
    }

    return defaultAppPreferences;
  }

  saveUserSettings(userId: string, settings: AppPreferences): AppPreferences {
    const snapshot = this.readSnapshot();
    const nextSnapshot: SettingsRepositorySnapshot = {
      ...snapshot,
      users: {
        ...snapshot.users,
        [userId]: settings,
      },
    };
    this.writeSnapshot(nextSnapshot);
    return settings;
  }
}
