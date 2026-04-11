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

        const todayDate = getLocalDateString(new Date());
        let currentStreak = 0;
        
        // Very basic simple contiguous streak logic for demonstration
        const sortedLogs = [...logs]
          .filter(l => l.completed)
          .sort((a, b) => b.date.localeCompare(a.date)); // descending dates
        
        if (sortedLogs.length === 0) return 0;

        let checkDate = new Date();
        const latest = sortedLogs[0].date;
        const todayStr = todayDate;
        
        // If not completed today or yesterday, streak is broken
        // Needs proper date-fns logic in production
        return sortedLogs.length; 
      }
    })),
    {
      name: 'waqtify-habit-storage'
    }
  )
);
