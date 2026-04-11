import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Habit, HabitLog } from '@waqtify/types';
import { startOfDay, formatISO } from 'date-fns';

interface HabitState {
  habits: Habit[];
  logs: Record<string, HabitLog[]>; // Keyed by habit id
  addHabit: (habit: Habit) => void;
  trackHabit: (habitId: string, date: string, params?: { count?: number; duration?: number }) => void;
  calculateStreak: (habitId: string) => number;
  calculateLongestStreak: (habitId: string) => number;
}

const getLocalDateString = (dateObj: Date) => {
  return formatISO(startOfDay(dateObj), { representation: 'date' });
};

export const useHabitStore = create<HabitState>()(
  persist(
    immer((set, get) => ({
      habits: [],
      logs: {},
      
      addHabit: (habit) => {
        set((state) => {
          state.habits.push(habit);
          state.logs[habit.id] = [];
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
              if (habit.target && log.count >= habit.target) log.completed = true;
              else log.completed = false;
            } else if (habit.type === 'timer' && params?.duration !== undefined) {
              log.duration = Math.max(0, params.duration);
              if (habit.expectedDuration && log.duration >= habit.expectedDuration) log.completed = true;
              else log.completed = false;
            }
          } else {
            // New log
            let newLog: HabitLog = {
              id: Math.random().toString(36).substr(2, 9),
              habitId,
              date: dateStr,
              completed: habit.type === 'binary' ? true : false,
            };

            if (habit.type === 'count' && params?.count !== undefined) {
              newLog.count = Math.max(0, params.count);
              newLog.completed = habit.target ? newLog.count >= habit.target : false;
            } else if (habit.type === 'timer' && params?.duration !== undefined) {
              newLog.duration = Math.max(0, params.duration);
              newLog.completed = habit.expectedDuration ? newLog.duration >= habit.expectedDuration : false;
            }

            habitLogs.push(newLog);
          }
        });
      },

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

        // If today is not completed, we check if yesterday was. If neither are, streak is broken (0).
        if (!completedDates.has(todayStr)) {
            checkDate = new Date(today.getTime() - 24 * 60 * 60 * 1000); // Yesterday
            checkDateStr = getLocalDateString(checkDate);
            if (!completedDates.has(checkDateStr)) return 0;
        }

        while (completedDates.has(checkDateStr)) {
            streak++;
            checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
            checkDateStr = getLocalDateString(checkDate);
            
            // Failsafe in case of extremely long loops
            if (streak > 5000) break;
        }

        return streak;
      },

      calculateLongestStreak: (habitId) => {
        const logs = get().logs[habitId];
        if (!logs || logs.length === 0) return 0;

        // Sort descending
        const sortedDates = logs
          .filter(l => l.completed)
          .map(l => l.date)
          .sort((a, b) => b.localeCompare(a));
          
        if (sortedDates.length === 0) return 0;

        let maxStreak = 1;
        let currentStreak = 1;

        for (let i = 0; i < sortedDates.length - 1; i++) {
           const d1 = new Date(sortedDates[i]);
           const d2 = new Date(sortedDates[i+1]);
           const diffInDays = Math.round((d1.getTime() - d2.getTime()) / (1000 * 3600 * 24));
           
           if (diffInDays === 1) {
             currentStreak++;
             if (currentStreak > maxStreak) maxStreak = currentStreak;
           } else if (diffInDays > 1) {
             currentStreak = 1;
           }
        }

        return maxStreak;
      }
    })),
    {
      name: 'waqtify-habit-storage'
    }
  )
);
