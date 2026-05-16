import { create } from 'zustand';
import type { Habit, HabitLog } from '@waqtify/types';
import { habitService, notificationService } from '../application/services';
import { useSettingsStore } from './settingsStore';
import {
  calculateLongestStreak,
  calculateStreak,
  getAnalyticsOverview,
  getActivityCalendarData,
  getCompletionRate,
  getDashboardSummary,
  getHabitLeaderboard,
  getMissedDayStats,
  getTodayStats,
  getWeeklyStats,
  type ActivityDay,
  type DashboardSummary,
  type DailyCompletionPoint,
  type HabitCompletionStat,
  type HabitAnalyticsOverview,
  type MissedDayData,
} from '../domain/habits/analytics';
import type { HabitTrackingInput, HabitUpsertInput } from '../domain/habits/types';

export type {
  ActivityDay,
  DashboardSummary,
  DailyCompletionPoint,
  HabitAnalyticsOverview,
  HabitCompletionStat,
  MissedDayData,
};

interface HabitState {
  userId: string | null;
  habits: Habit[];
  logs: Record<string, HabitLog[]>;
  loadForUser: (userId: string) => void;
  clear: () => void;
  createHabit: (input: HabitUpsertInput) => void;
  updateHabit: (habitId: string, input: HabitUpsertInput) => void;
  trackHabit: (habitId: string, date: string, params?: HabitTrackingInput) => void;
  deleteHabit: (habitId: string) => void;
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

const emptyState = {
  userId: null,
  habits: [],
  logs: {},
};

export const useHabitStore = create<HabitState>()((set, get) => ({
  ...emptyState,

  loadForUser: (userId) => {
    const data = habitService.getUserHabits(userId);
    set({ userId, habits: data.habits, logs: data.logs });
    // Schedule reminders for loaded habits if notifications enabled
    const globalNotifications = useSettingsStore.getState().settings.notifications;
    if (globalNotifications) {
      data.habits.forEach(habit => notificationService.scheduleHabitReminder(habit));
      // Check for missed habits
      const allLogs = Object.values(data.logs).flat();
      notificationService.checkMissedHabits(data.habits, allLogs);
    }
  },

  clear: () => {
    set(emptyState);
  },

  createHabit: (input) => {
    const userId = get().userId;
    if (!userId) return;
    const data = habitService.createHabit(userId, input);
    set({ habits: data.habits, logs: data.logs });
    // Schedule reminder for new habit if enabled
    const globalNotifications = useSettingsStore.getState().settings.notifications;
    if (globalNotifications) {
      const newHabit = data.habits.find(h => !get().habits.some(existing => existing.id === h.id));
      if (newHabit) notificationService.scheduleHabitReminder(newHabit);
    }
  },

  updateHabit: (habitId, input) => {
    const userId = get().userId;
    if (!userId) return;
    const data = habitService.updateHabit(userId, habitId, input);
    set({ habits: data.habits, logs: data.logs });
    // Reschedule reminder for updated habit if enabled
    const globalNotifications = useSettingsStore.getState().settings.notifications;
    notificationService.cancelHabitReminder(habitId);
    
    if (globalNotifications) {
      const updatedHabit = data.habits.find(h => h.id === habitId);
      if (updatedHabit) {
        notificationService.scheduleHabitReminder(updatedHabit);
      }
    }
  },

  trackHabit: (habitId, date, params) => {
    const userId = get().userId;
    if (!userId) return;
    const data = habitService.trackHabit(userId, habitId, date, params);
    set({ habits: data.habits, logs: data.logs });
  },

  deleteHabit: (habitId) => {
    const userId = get().userId;
    if (!userId) return;
    const data = habitService.deleteHabit(userId, habitId);
    set({ habits: data.habits, logs: data.logs });
    notificationService.cancelHabitReminder(habitId);
  },

  calculateStreak: (habitId) => calculateStreak(get().logs[habitId] || []),

  calculateLongestStreak: (habitId) => calculateLongestStreak(get().logs[habitId] || []),

  getCompletionRate: (habitId, days) => {
    const state = get();
    const habit = state.habits.find((item) => item.id === habitId);
    if (!habit) return 0;
    return getCompletionRate(habit, state.logs[habitId] || [], days);
  },

  getActivityCalendarData: (year) => getActivityCalendarData(get().habits, get().logs, year),

  getWeeklyStats: (days) => getWeeklyStats(get().habits, get().logs, days),

  getMissedDayStats: (days) => getMissedDayStats(get().habits, get().logs, days),

  getHabitLeaderboard: (days) => getHabitLeaderboard(get().habits, get().logs, days),

  getTodayStats: () => getTodayStats(get().habits, get().logs),

  getDashboardSummary: () => getDashboardSummary(get().habits, get().logs),

  getAnalyticsOverview: (days) => getAnalyticsOverview(get().habits, get().logs, days),
}));
