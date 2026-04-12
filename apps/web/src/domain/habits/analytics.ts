import type { Habit, HabitLog } from '@waqtify/types';
import {
  differenceInDays,
  eachDayOfInterval,
  endOfYear,
  format,
  getDay,
  startOfYear,
  subDays,
} from 'date-fns';
import { getLocalDateString } from './date';

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
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface DailyCompletionPoint {
  date: string;
  rate: number;
  completed: number;
  total: number;
}

export interface MissedDayData {
  name: string;
  misses: number;
}

const countToLevel = (count: number, max: number): 0 | 1 | 2 | 3 | 4 => {
  if (count === 0 || max === 0) return 0;
  const ratio = count / max;
  if (ratio >= 0.9) return 4;
  if (ratio >= 0.6) return 3;
  if (ratio >= 0.3) return 2;
  return 1;
};

const getHabitActivationDate = (habit: Habit): Date => {
  if (habit.startDate) return new Date(habit.startDate);
  return new Date(habit.createdAt);
};

export const calculateStreak = (habitLogs: HabitLog[], now = new Date()): number => {
  if (habitLogs.length === 0) return 0;

  const completedDates = new Set(habitLogs.filter((log) => log.completed).map((log) => log.date));
  if (completedDates.size === 0) return 0;

  let streak = 0;
  const todayStr = getLocalDateString(now);
  let checkDate = new Date(now);
  let checkDateStr = getLocalDateString(checkDate);

  if (!completedDates.has(todayStr)) {
    checkDate = new Date(now.getTime() - 86400000);
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
};

export const calculateLongestStreak = (habitLogs: HabitLog[]): number => {
  if (habitLogs.length === 0) return 0;

  const sortedDates = habitLogs
    .filter((log) => log.completed)
    .map((log) => log.date)
    .sort((a, b) => b.localeCompare(a));

  if (sortedDates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let index = 0; index < sortedDates.length - 1; index++) {
    const current = new Date(sortedDates[index]);
    const next = new Date(sortedDates[index + 1]);
    const diffDays = Math.round((current.getTime() - next.getTime()) / 86400000);

    if (diffDays === 1) {
      currentStreak++;
      if (currentStreak > maxStreak) maxStreak = currentStreak;
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }

  return maxStreak;
};

export const getCompletionRate = (
  habit: Habit,
  habitLogs: HabitLog[],
  days: number,
  now = new Date()
): number => {
  const cutoff = getLocalDateString(subDays(now, days));
  const recentCompleted = habitLogs.filter((log) => log.date >= cutoff && log.completed).length;
  const activationDate = getHabitActivationDate(habit);
  const maxDays = Math.min(days, differenceInDays(now, activationDate) + 1);

  return maxDays > 0 ? Math.min(100, Math.round((recentCompleted / maxDays) * 100)) : 0;
};

export const getActivityCalendarData = (
  habits: Habit[],
  logs: Record<string, HabitLog[]>,
  year: number,
  now = new Date()
): ActivityDay[] => {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 0, 1));
  const effectiveEnd = end > now ? now : end;
  const allDays = eachDayOfInterval({ start, end: effectiveEnd });
  const maxHabits = Math.max(1, habits.length);

  return allDays.map((day) => {
    const dateStr = getLocalDateString(day);
    let count = 0;
    habits.forEach((habit) => {
      if (logs[habit.id]?.find((log) => log.date === dateStr && log.completed)) {
        count++;
      }
    });

    return {
      date: dateStr,
      count,
      level: countToLevel(count, maxHabits),
    };
  });
};

export const getWeeklyStats = (
  habits: Habit[],
  logs: Record<string, HabitLog[]>,
  days: number,
  now = new Date()
): DailyCompletionPoint[] =>
  Array.from({ length: days }, (_, index) => {
    const day = subDays(now, days - 1 - index);
    const dateStr = getLocalDateString(day);
    const total = habits.length;
    let completed = 0;

    habits.forEach((habit) => {
      if (logs[habit.id]?.find((log) => log.date === dateStr && log.completed)) {
        completed++;
      }
    });

    return {
      date: format(day, 'MMM d'),
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      completed,
      total,
    };
  });

export const getMissedDayStats = (
  habits: Habit[],
  logs: Record<string, HabitLog[]>,
  days: number,
  now = new Date()
): MissedDayData[] => {
  const weekCounts = [0, 0, 0, 0, 0, 0, 0];
  const allDates: string[] = [];
  let currentDate = subDays(now, days - 1);

  for (let index = 0; index < days; index++) {
    allDates.push(getLocalDateString(currentDate));
    currentDate = new Date(currentDate.getTime() + 86400000);
  }

  habits.forEach((habit) => {
    const habitLogs = logs[habit.id] || [];
    allDates.forEach((dateStr) => {
      const logForDate = habitLogs.find((log) => log.date === dateStr);
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
};

export const getHabitLeaderboard = (
  habits: Habit[],
  logs: Record<string, HabitLog[]>,
  days: number,
  now = new Date()
): HabitCompletionStat[] => {
  const cutoff = getLocalDateString(subDays(now, days));

  return habits
    .map((habit) => {
      const habitLogs = logs[habit.id] || [];
      const recentLogs = habitLogs.filter((log) => log.date >= cutoff);
      const completed = recentLogs.filter((log) => log.completed).length;
      const possible = Math.min(days, differenceInDays(now, getHabitActivationDate(habit)) + 1);

      return {
        id: habit.id,
        name: habit.name,
        percentage: getCompletionRate(habit, habitLogs, days, now),
        completed,
        possible,
        currentStreak: calculateStreak(habitLogs, now),
        longestStreak: calculateLongestStreak(habitLogs),
      };
    })
    .sort((left, right) => right.percentage - left.percentage);
};

export const getTodayStats = (
  habits: Habit[],
  logs: Record<string, HabitLog[]>,
  now = new Date()
): { completed: number; total: number; percentage: number } => {
  const todayStr = getLocalDateString(now);
  const total = habits.length;
  const completed = habits.filter((habit) =>
    logs[habit.id]?.find((log) => log.date === todayStr && log.completed)
  ).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
};
