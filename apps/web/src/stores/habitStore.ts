import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Habit, HabitLog } from '@waqtify/types';
import { startOfDay, formatISO, subDays, getDay, differenceInDays, format, eachDayOfInterval, startOfYear, endOfYear } from 'date-fns';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HabitCompletionStat {
  id: string;
  name: string;
  percentage: number;
  completed: number;
  possible: number;
  currentStreak: number;
  longestStreak: number;
}

export interface ActivityDay {
  date: string;  // "YYYY-MM-DD"
  count: number; // number of habits completed
  level: 0 | 1 | 2 | 3 | 4; // intensity level for heatmap
}

export interface DailyCompletionPoint {
  date: string;
  rate: number; // 0-100 percentage
  completed: number;
  total: number;
}

export interface MissedDayData {
  name: string;
  misses: number;
}

// ─── Store Interface ──────────────────────────────────────────────────────────

interface HabitState {
  habits: Habit[];
  logs: Record<string, HabitLog[]>; // Keyed by habit id

  // Mutations
  addHabit: (habit: Habit) => void;
  updateHabit: (habitId: string, fields: Partial<Pick<Habit, 'name' | 'description' | 'category' | 'type' | 'priority' | 'color' | 'icon' | 'target' | 'expectedDuration' | 'reminderTime' | 'startDate' | 'endDate' | 'tags' | 'notes'>>) => void;
  trackHabit: (habitId: string, date: string, params?: { count?: number; duration?: number }) => void;
  deleteHabit: (habitId: string) => void;

  // Core streak calculators
  calculateStreak: (habitId: string) => number;
  calculateLongestStreak: (habitId: string) => number;

  // Derived / computed selectors
  getCompletionRate: (habitId: string, days: number) => number;
  getActivityCalendarData: (year: number) => ActivityDay[];
  getWeeklyStats: (days: number) => DailyCompletionPoint[];
  getMissedDayStats: (days: number) => MissedDayData[];
  getHabitLeaderboard: (days: number) => HabitCompletionStat[];
  getTodayStats: () => { completed: number; total: number; percentage: number; };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getLocalDateString = (dateObj: Date): string =>
  formatISO(startOfDay(dateObj), { representation: 'date' });

const countToLevel = (count: number, max: number): 0 | 1 | 2 | 3 | 4 => {
  if (count === 0 || max === 0) return 0;
  const ratio = count / max;
  if (ratio >= 0.9) return 4;
  if (ratio >= 0.6) return 3;
  if (ratio >= 0.3) return 2;
  return 1;
};

// ─── Store ───────────────────────────────────────────────────────────────────

export const useHabitStore = create<HabitState>()(
  persist(
    immer((set, get) => ({
      habits: [],
      logs: {},

      // ── Mutations ─────────────────────────────────────────────────────────

      addHabit: (habit) => {
        set((state) => {
          state.habits.push(habit);
          state.logs[habit.id] = [];
        });
      },

      updateHabit: (habitId, fields) => {
        set((state) => {
          const idx = state.habits.findIndex(h => h.id === habitId);
          if (idx === -1) return;
          state.habits[idx] = { ...state.habits[idx], ...fields };
        });
      },

      deleteHabit: (habitId) => {
        set((state) => {
          state.habits = state.habits.filter(h => h.id !== habitId);
          delete state.logs[habitId];
        });
      },

      trackHabit: (habitId, dateStr, params) => {
        set((state) => {
          let habitLogs = state.logs[habitId];
          if (!habitLogs) {
            habitLogs = [];
            state.logs[habitId] = habitLogs;
          }

          const existingLogIndex = habitLogs.findIndex(log => log.date === dateStr);
          const habit = state.habits.find(h => h.id === habitId);
          if (!habit) return;

          if (existingLogIndex >= 0) {
            const log = habitLogs[existingLogIndex];
            if (habit.type === 'binary') {
              log.completed = !log.completed;
            } else if (habit.type === 'count' && params?.count !== undefined) {
              log.count = Math.max(0, params.count);
              log.completed = !!(habit.target && log.count >= habit.target);
            } else if (habit.type === 'timer' && params?.duration !== undefined) {
              log.duration = Math.max(0, params.duration);
              log.completed = !!(habit.expectedDuration && log.duration >= habit.expectedDuration);
            }
          } else {
            const newLog: HabitLog = {
              id: Math.random().toString(36).substr(2, 9),
              habitId,
              date: dateStr,
              completed: habit.type === 'binary',
            };

            if (habit.type === 'count' && params?.count !== undefined) {
              newLog.count = Math.max(0, params.count);
              newLog.completed = !!(habit.target && newLog.count >= habit.target);
            } else if (habit.type === 'timer' && params?.duration !== undefined) {
              newLog.duration = Math.max(0, params.duration);
              newLog.completed = !!(habit.expectedDuration && newLog.duration >= habit.expectedDuration);
            }

            habitLogs.push(newLog);
          }
        });
      },

      // ── Streak Calculators ─────────────────────────────────────────────────

      calculateStreak: (habitId) => {
        const logs = get().logs[habitId];
        if (!logs || logs.length === 0) return 0;

        const completedDates = new Set(logs.filter(l => l.completed).map(l => l.date));
        if (completedDates.size === 0) return 0;

        let streak = 0;
        const today = new Date();
        const todayStr = getLocalDateString(today);

        let checkDate = new Date();
        let checkDateStr = getLocalDateString(checkDate);

        // If today not completed, check if yesterday was
        if (!completedDates.has(todayStr)) {
          checkDate = new Date(today.getTime() - 86400000);
          checkDateStr = getLocalDateString(checkDate);
          if (!completedDates.has(checkDateStr)) return 0;
        }

        while (completedDates.has(checkDateStr)) {
          streak++;
          checkDate = new Date(checkDate.getTime() - 86400000);
          checkDateStr = getLocalDateString(checkDate);
          if (streak > 5000) break;
        }

        return streak;
      },

      calculateLongestStreak: (habitId) => {
        const logs = get().logs[habitId];
        if (!logs || logs.length === 0) return 0;

        const sortedDates = logs
          .filter(l => l.completed)
          .map(l => l.date)
          .sort((a, b) => b.localeCompare(a));

        if (sortedDates.length === 0) return 0;

        let maxStreak = 1;
        let currentStreak = 1;

        for (let i = 0; i < sortedDates.length - 1; i++) {
          const d1 = new Date(sortedDates[i]);
          const d2 = new Date(sortedDates[i + 1]);
          const diffDays = Math.round((d1.getTime() - d2.getTime()) / 86400000);

          if (diffDays === 1) {
            currentStreak++;
            if (currentStreak > maxStreak) maxStreak = currentStreak;
          } else if (diffDays > 1) {
            currentStreak = 1;
          }
        }

        return maxStreak;
      },

      // ── Computed Selectors ─────────────────────────────────────────────────

      getCompletionRate: (habitId, days) => {
        const { logs, habits } = get();
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return 0;

        const hLogs = logs[habitId] || [];
        const cutoff = getLocalDateString(subDays(new Date(), days));
        const recentCompleted = hLogs.filter(l => l.date >= cutoff && l.completed).length;
        const maxDays = Math.min(days, differenceInDays(new Date(), new Date(habit.createdAt)) + 1);

        return maxDays > 0 ? Math.min(100, Math.round((recentCompleted / maxDays) * 100)) : 0;
      },

      getActivityCalendarData: (year) => {
        const { habits, logs } = get();
        const start = startOfYear(new Date(year, 0, 1));
        const end = endOfYear(new Date(year, 0, 1));
        const today = new Date();
        const effectiveEnd = end > today ? today : end;

        const allDays = eachDayOfInterval({ start, end: effectiveEnd });
        const maxHabits = Math.max(1, habits.length);

        return allDays.map((day): ActivityDay => {
          const dateStr = getLocalDateString(day);
          let count = 0;
          habits.forEach(h => {
            if (logs[h.id]?.find(l => l.date === dateStr && l.completed)) count++;
          });
          return {
            date: dateStr,
            count,
            level: countToLevel(count, maxHabits),
          };
        });
      },

      getWeeklyStats: (days) => {
        const { habits, logs } = get();
        const today = new Date();

        return Array.from({ length: days }, (_, i) => {
          const day = subDays(today, days - 1 - i);
          const dateStr = getLocalDateString(day);
          const total = habits.length;
          let completed = 0;

          habits.forEach(h => {
            if (logs[h.id]?.find(l => l.date === dateStr && l.completed)) completed++;
          });

          return {
            date: format(day, 'MMM d'),
            rate: total > 0 ? Math.round((completed / total) * 100) : 0,
            completed,
            total,
          };
        });
      },

      getMissedDayStats: (days) => {
        const { habits, logs } = get();
        const weekCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun → Sat
        const todayStr = getLocalDateString(new Date());
        const cutoff = getLocalDateString(subDays(new Date(), days));

        // Generate all dates in the range
        const allDates: string[] = [];
        let currentDate = subDays(new Date(), days - 1);
        for (let i = 0; i < days; i++) {
          allDates.push(getLocalDateString(currentDate));
          currentDate = new Date(currentDate.getTime() + 86400000);
        }

        habits.forEach(h => {
          const hLogs = logs[h.id] || [];
          allDates.forEach(dateStr => {
            const logForDate = hLogs.find(l => l.date === dateStr);
            // Count as miss if: no log exists OR log exists but not completed
            if (!logForDate || !logForDate.completed) {
              weekCounts[getDay(new Date(dateStr))]++;
            }
          });
        });

        return [
          { name: 'Mon', misses: weekCounts[1] },
          { name: 'Tue', misses: weekCounts[2] },
          { name: 'Wed', misses: weekCounts[3] },
          { name: 'Thu', misses: weekCounts[4] },
          { name: 'Fri', misses: weekCounts[5] },
          { name: 'Sat', misses: weekCounts[6] },
          { name: 'Sun', misses: weekCounts[0] },
        ];
      },

      getHabitLeaderboard: (days) => {
        const { habits, calculateStreak, calculateLongestStreak, getCompletionRate, logs } = get();
        const cutoff = getLocalDateString(subDays(new Date(), days));

        return habits.map(h => {
          const hLogs = logs[h.id] || [];
          const recentLogs = hLogs.filter(l => l.date >= cutoff);
          const completed = recentLogs.filter(l => l.completed).length;
          const possible = Math.min(days, differenceInDays(new Date(), new Date(h.createdAt)) + 1);
          const percentage = getCompletionRate(h.id, days);

          return {
            id: h.id,
            name: h.name,
            percentage,
            completed,
            possible,
            currentStreak: calculateStreak(h.id),
            longestStreak: calculateLongestStreak(h.id),
          };
        }).sort((a, b) => b.percentage - a.percentage);
      },

      getTodayStats: () => {
        const { habits, logs } = get();
        const todayStr = getLocalDateString(new Date());
        const total = habits.length;
        const completed = habits.filter(h =>
          logs[h.id]?.find(l => l.date === todayStr && l.completed)
        ).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { completed, total, percentage };
      },
    })),
    { name: 'waqtify-habit-storage' }
  )
);
