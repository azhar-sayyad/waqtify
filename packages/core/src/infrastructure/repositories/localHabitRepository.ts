import { HabitLogSchema, HabitSchema, type Habit, type HabitLog } from '@waqtify/types';
import { z } from 'zod';
import { readJsonFromStorage, writeJsonToStorage } from '../storage/localStorage';

const HABIT_STORAGE_KEY = 'waqtify.habits.v1';
const LEGACY_HABIT_STORAGE_KEY = 'waqtify-habit-storage';

const HabitCollectionSchema = z.object({
  habits: z.array(HabitSchema),
  logs: z.record(z.string(), z.array(HabitLogSchema)),
});

const HabitRepositorySchema = z.object({
  version: z.literal(1),
  users: z.record(z.string(), HabitCollectionSchema),
  unassigned: HabitCollectionSchema,
});

const LegacyHabitStateSchema = z.object({
  state: z.object({
    habits: z.array(HabitSchema).optional(),
    logs: z.record(z.string(), z.array(HabitLogSchema)).optional(),
  }),
});

export interface HabitCollection {
  habits: Habit[];
  logs: Record<string, HabitLog[]>;
}

export interface HabitRepositorySnapshot {
  version: 1;
  users: Record<string, HabitCollection>;
  unassigned: HabitCollection;
}

const createEmptyCollection = (): HabitCollection => ({
  habits: [],
  logs: {},
});

const defaultSnapshot = (): HabitRepositorySnapshot => ({
  version: 1,
  users: {},
  unassigned: createEmptyCollection(),
});

const migrateLegacySnapshot = (): HabitRepositorySnapshot | null => {
  const legacyRaw = readJsonFromStorage(LEGACY_HABIT_STORAGE_KEY);
  const legacy = LegacyHabitStateSchema.safeParse(legacyRaw);
  if (!legacy.success) return null;

  return {
    version: 1,
    users: {},
    unassigned: {
      habits: legacy.data.state.habits || [],
      logs: legacy.data.state.logs || {},
    },
  };
};

const normalizeCollection = (collection: HabitCollection): HabitCollection => {
  const habitIds = new Set(collection.habits.map((habit) => habit.id));
  const filteredLogs = Object.fromEntries(
    Object.entries(collection.logs).filter(([habitId]) => habitIds.has(habitId))
  );

  return {
    habits: collection.habits,
    logs: filteredLogs,
  };
};

export interface HabitRepository {
  getUserData(userId: string): HabitCollection;
  saveUserData(userId: string, data: HabitCollection): HabitCollection;
}

export class LocalHabitRepository implements HabitRepository {
  private readSnapshot(): HabitRepositorySnapshot {
    const parsed = HabitRepositorySchema.safeParse(readJsonFromStorage(HABIT_STORAGE_KEY));
    if (parsed.success) {
      return parsed.data;
    }

    const migrated = migrateLegacySnapshot();
    if (migrated) {
      this.writeSnapshot(migrated);
      return migrated;
    }

    return defaultSnapshot();
  }

  private writeSnapshot(snapshot: HabitRepositorySnapshot): void {
    writeJsonToStorage(HABIT_STORAGE_KEY, snapshot);
  }

  getUserData(userId: string): HabitCollection {
    const snapshot = this.readSnapshot();
    const existing = snapshot.users[userId];
    if (existing) return normalizeCollection(existing);

    if (snapshot.unassigned.habits.length > 0 || Object.keys(snapshot.unassigned.logs).length > 0) {
      const normalized = normalizeCollection(snapshot.unassigned);
      const nextSnapshot: HabitRepositorySnapshot = {
        ...snapshot,
        users: {
          ...snapshot.users,
          [userId]: normalized,
        },
        unassigned: createEmptyCollection(),
      };
      this.writeSnapshot(nextSnapshot);
      return normalized;
    }

    return createEmptyCollection();
  }

  saveUserData(userId: string, data: HabitCollection): HabitCollection {
    const snapshot = this.readSnapshot();
    const normalized = normalizeCollection(data);
    const nextSnapshot: HabitRepositorySnapshot = {
      ...snapshot,
      users: {
        ...snapshot.users,
        [userId]: normalized,
      },
    };
    this.writeSnapshot(nextSnapshot);
    return normalized;
  }
}
