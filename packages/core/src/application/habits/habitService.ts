import type { Habit, HabitLog } from '@waqtify/types';
import type {
  HabitCollection,
  HabitRepository,
} from '../../infrastructure/repositories/localHabitRepository';
import type { HabitTrackingInput, HabitUpsertInput } from '../../domain/habits/types';

const createId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11);

export class HabitService {
  constructor(private readonly repository: HabitRepository) {}

  getUserHabits(userId: string): HabitCollection {
    return this.repository.getUserData(userId);
  }

  createHabit(userId: string, input: HabitUpsertInput): HabitCollection {
    const current = this.repository.getUserData(userId);
    const newHabit: Habit = {
      id: createId(),
      createdAt: new Date().toISOString(),
      ...input,
    };

    return this.repository.saveUserData(userId, {
      habits: [...current.habits, newHabit],
      logs: {
        ...current.logs,
        [newHabit.id]: [],
      },
    });
  }

  updateHabit(userId: string, habitId: string, input: HabitUpsertInput): HabitCollection {
    const current = this.repository.getUserData(userId);
    return this.repository.saveUserData(userId, {
      habits: current.habits.map((habit) => (habit.id === habitId ? { ...habit, ...input } : habit)),
      logs: current.logs,
    });
  }

  deleteHabit(userId: string, habitId: string): HabitCollection {
    const current = this.repository.getUserData(userId);
    const nextLogs = { ...current.logs };
    delete nextLogs[habitId];

    return this.repository.saveUserData(userId, {
      habits: current.habits.filter((habit) => habit.id !== habitId),
      logs: nextLogs,
    });
  }

  trackHabit(
    userId: string,
    habitId: string,
    date: string,
    params?: HabitTrackingInput
  ): HabitCollection {
    const current = this.repository.getUserData(userId);
    const habit = current.habits.find((item) => item.id === habitId);
    if (!habit) return current;

    const currentLogs = current.logs[habitId] || [];
    const existingLogIndex = currentLogs.findIndex((log) => log.date === date);
    const nextLogs = [...currentLogs];

    if (existingLogIndex >= 0) {
      const existingLog = { ...nextLogs[existingLogIndex] };
      this.applyTrackingUpdate(existingLog, habit, params);
      nextLogs[existingLogIndex] = existingLog;
    } else {
      const newLog: HabitLog = {
        id: createId(),
        habitId,
        date,
        completed: habit.type === 'binary',
      };
      this.applyTrackingUpdate(newLog, habit, params);
      nextLogs.push(newLog);
    }

    return this.repository.saveUserData(userId, {
      habits: current.habits,
      logs: {
        ...current.logs,
        [habitId]: nextLogs,
      },
    });
  }

  private applyTrackingUpdate(log: HabitLog, habit: Habit, params?: HabitTrackingInput): void {
    if (habit.type === 'binary') {
      log.completed = !log.completed;
      return;
    }

    if (habit.type === 'count' && params?.count !== undefined) {
      log.count = Math.max(0, params.count);
      log.completed = !!(habit.target && log.count >= habit.target);
      return;
    }

    if (habit.type === 'timer' && params?.duration !== undefined) {
      log.duration = Math.max(0, params.duration);
      log.completed = !!(habit.expectedDuration && log.duration >= habit.expectedDuration);
      return;
    }
  }
}
