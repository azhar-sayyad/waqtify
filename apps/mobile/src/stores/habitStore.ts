import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  calculateLongestStreak,
  calculateStreak,
  getActivityCalendarData,
  getAnalyticsOverview,
  getCompletionRate,
  getDashboardSummary,
  getHabitLeaderboard,
  getMissedDayStats,
  getTodayStats,
  getWeeklyStats,
  type ActivityDay,
  type DailyCompletionPoint,
  type HabitAnalyticsOverview,
  type HabitCompletionStat,
  type MissedDayData,
  type DashboardSummary,
} from '../domain/analytics';
import type {
  Habit,
  HabitCollection,
  HabitLog,
  HabitTrackingInput,
  HabitUpsertInput,
} from '../types';
import { createId } from '../utils/id';

interface HabitStoreState {
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  userCollections: Record<string, HabitCollection>;
  userId: string | null;
  habits: Habit[];
  logs: Record<string, HabitLog[]>;
  loadForUser: (userId: string) => void;
  clear: () => void;
  createHabit: (input: HabitUpsertInput) => void;
  updateHabit: (habitId: string, input: HabitUpsertInput) => void;
  deleteHabit: (habitId: string) => void;
  trackHabit: (habitId: string, date: string, params?: HabitTrackingInput) => void;
  calculateStreak: (habitId: string) => number;
  calculateLongestStreak: (habitId: string) => number;
  getCompletionRate: (habitId: string, days: number) => number;
  getActivityCalendarData: (year: number) => ActivityDay[];
  getWeeklyStats: (days: number) => DailyCompletionPoint[];
  getMissedDayStats: (days: number) => MissedDayData[];
  getHabitLeaderboard: (days: number) => HabitCompletionStat[];
  getTodayStats: () => { completed: number; total: number; percentage: number };
  getDashboardSummary: () => DashboardSummary;
  getAnalyticsOverview: (days: number) => HabitAnalyticsOverview;
}

const emptyCollection = (): HabitCollection => ({ habits: [], logs: {} });

const storage = createJSONStorage(() => AsyncStorage);

const persistCurrentUserData = (
  state: HabitStoreState,
  nextHabits: Habit[],
  nextLogs: Record<string, HabitLog[]>
) => {
  if (!state.userId) {
    return {
      habits: nextHabits,
      logs: nextLogs,
    };
  }

  return {
    habits: nextHabits,
    logs: nextLogs,
    userCollections: {
      ...state.userCollections,
      [state.userId]: {
        habits: nextHabits,
        logs: nextLogs,
      },
    },
  };
};

const applyTrackingUpdate = (
  log: HabitLog,
  habit: Habit,
  params?: HabitTrackingInput
): HabitLog => {
  if (habit.type === 'binary') {
    return {
      ...log,
      completed: !log.completed,
    };
  }

  if (habit.type === 'count' && params?.count !== undefined) {
    const count = Math.max(0, params.count);
    return {
      ...log,
      count,
      completed: !!(habit.target && count >= habit.target),
    };
  }

  if (habit.type === 'timer' && params?.duration !== undefined) {
    const duration = Math.max(0, params.duration);
    return {
      ...log,
      duration,
      completed: !!(habit.expectedDuration && duration >= habit.expectedDuration),
    };
  }

  return log;
};

export const useHabitStore = create<HabitStoreState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      userCollections: {},
      userId: null,
      habits: [],
      logs: {},

      loadForUser: (userId) => {
        const collection = get().userCollections[userId] || emptyCollection();
        set({
          userId,
          habits: collection.habits,
          logs: collection.logs,
        });
      },

      clear: () => {
        set({
          userId: null,
          habits: [],
          logs: {},
        });
      },

      createHabit: (input) => {
        const state = get();
        if (!state.userId) return;

        const nextHabit: Habit = {
          ...input,
          id: createId(),
          createdAt: new Date().toISOString(),
          priority: input.priority || 'medium',
        };
        const nextHabits = [...state.habits, nextHabit];
        const nextLogs = { ...state.logs, [nextHabit.id]: [] };

        set(persistCurrentUserData(state, nextHabits, nextLogs));
      },

      updateHabit: (habitId, input) => {
        const state = get();
        if (!state.userId) return;

        const nextHabits = state.habits.map((habit) =>
          habit.id === habitId ? { ...habit, ...input } : habit
        );

        set(persistCurrentUserData(state, nextHabits, state.logs));
      },

      deleteHabit: (habitId) => {
        const state = get();
        if (!state.userId) return;

        const nextHabits = state.habits.filter((habit) => habit.id !== habitId);
        const nextLogs = { ...state.logs };
        delete nextLogs[habitId];

        set(persistCurrentUserData(state, nextHabits, nextLogs));
      },

      trackHabit: (habitId, date, params) => {
        const state = get();
        if (!state.userId) return;

        const habit = state.habits.find((item) => item.id === habitId);
        if (!habit) return;

        const currentLogs = state.logs[habitId] || [];
        const index = currentLogs.findIndex((log) => log.date === date);
        const nextLogsForHabit = [...currentLogs];

        if (index >= 0) {
          nextLogsForHabit[index] = applyTrackingUpdate(
            { ...nextLogsForHabit[index] },
            habit,
            params
          );
        } else {
          const newLog = applyTrackingUpdate(
            {
              id: createId(),
              habitId,
              date,
              completed: habit.type === 'binary',
            },
            habit,
            params
          );
          nextLogsForHabit.push(newLog);
        }

        const nextLogs = {
          ...state.logs,
          [habitId]: nextLogsForHabit,
        };

        set(persistCurrentUserData(state, state.habits, nextLogs));
      },

      calculateStreak: (habitId) => calculateStreak(get().logs[habitId] || []),

      calculateLongestStreak: (habitId) =>
        calculateLongestStreak(get().logs[habitId] || []),

      getCompletionRate: (habitId, days) => {
        const state = get();
        const habit = state.habits.find((item) => item.id === habitId);
        if (!habit) return 0;
        return getCompletionRate(habit, state.logs[habitId] || [], days);
      },

      getActivityCalendarData: (year) =>
        getActivityCalendarData(get().habits, get().logs, year),

      getWeeklyStats: (days) => getWeeklyStats(get().habits, get().logs, days),

      getMissedDayStats: (days) => getMissedDayStats(get().habits, get().logs, days),

      getHabitLeaderboard: (days) =>
        getHabitLeaderboard(get().habits, get().logs, days),

      getTodayStats: () => getTodayStats(get().habits, get().logs),

      getDashboardSummary: () => getDashboardSummary(get().habits, get().logs),

      getAnalyticsOverview: (days) =>
        getAnalyticsOverview(get().habits, get().logs, days),
    }),
    {
      name: 'waqtify.mobile.habits.v1',
      storage,
      partialize: (state) => ({
        userCollections: state.userCollections,
        userId: state.userId,
        habits: state.habits,
        logs: state.logs,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

