import type { Habit, HabitLog } from '@waqtify/types';
import {
  eachDayOfInterval,
  endOfYear,
  format,
  getDay,
  parseISO,
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

export interface CompletionShareDatum {
  id: string;
  name: string;
  value: number;
}

export interface HabitAnalyticsOverview {
  totalCompleted: number;
  overallRate: number;
  maxCurrentStreak: number;
  maxLongestStreak: number;
  completionShare: CompletionShareDatum[];
  dailyCompletionSeries: DailyCompletionPoint[];
  missedDays: MissedDayData[];
  leaderboard: HabitCompletionStat[];
}

export interface DashboardSummary {
  today: {
    completed: number;
    total: number;
    percentage: number;
  };
  highestStreak: number;
  weeklyAverage: number;
  weeklyCompletionSeries: DailyCompletionPoint[];
}

const countToLevel = (count: number, max: number): 0 | 1 | 2 | 3 | 4 => {
  if (count === 0 || max === 0) return 0;
  const ratio = count / max;
  if (ratio >= 0.9) return 4;
  if (ratio >= 0.6) return 3;
  if (ratio >= 0.3) return 2;
  return 1;
};

const getHabitStartDate = (habit: Habit): string =>
  habit.startDate || getLocalDateString(new Date(habit.createdAt));

const isHabitActiveOnDate = (habit: Habit, date: string): boolean => {
  if (date < getHabitStartDate(habit)) return false;
  if (habit.endDate && date > habit.endDate) return false;
  return true;
};

const hasCompletedLogForDate = (habitLogs: HabitLog[], date: string): boolean =>
  habitLogs.some((log) => log.date === date && log.completed);

const getWindowDates = (days: number, now = new Date()): string[] =>
  Array.from({ length: days }, (_, index) =>
    getLocalDateString(subDays(now, days - 1 - index))
  );

const getEligibleDatesForHabit = (
  habit: Habit,
  days: number,
  now = new Date()
): string[] => getWindowDates(days, now).filter((date) => isHabitActiveOnDate(habit, date));

const getCompletedCountInDates = (habitLogs: HabitLog[], dates: string[]): number => {
  const completedDates = new Set(
    habitLogs.filter((log) => log.completed).map((log) => log.date)
  );
  return dates.filter((date) => completedDates.has(date)).length;
};

export const calculateStreak = (habitLogs: HabitLog[], now = new Date()): number => {
  if (habitLogs.length === 0) return 0;

  const completedDates = new Set(
    habitLogs.filter((log) => log.completed).map((log) => log.date)
  );
  if (completedDates.size === 0) return 0;

  let streak = 0;
  const todayStr = getLocalDateString(now);
  let checkDate = new Date(now);
  let checkDateStr = getLocalDateString(checkDate);

  if (!completedDates.has(todayStr)) {
    checkDate = subDays(now, 1);
    checkDateStr = getLocalDateString(checkDate);
    if (!completedDates.has(checkDateStr)) return 0;
  }

  while (completedDates.has(checkDateStr)) {
    streak++;
    checkDate = subDays(checkDate, 1);
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
    .sort((left, right) => right.localeCompare(left));

  if (sortedDates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let index = 0; index < sortedDates.length - 1; index++) {
    const current = parseISO(sortedDates[index]);
    const next = parseISO(sortedDates[index + 1]);
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
  const eligibleDates = getEligibleDatesForHabit(habit, days, now);
  if (eligibleDates.length === 0) return 0;

  const completed = getCompletedCountInDates(habitLogs, eligibleDates);
  return Math.min(100, Math.round((completed / eligibleDates.length) * 100));
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

  return allDays.map((day) => {
    const date = getLocalDateString(day);
    const activeHabits = habits.filter((habit) => isHabitActiveOnDate(habit, date));
    const completed = activeHabits.filter((habit) =>
      hasCompletedLogForDate(logs[habit.id] || [], date)
    ).length;

    return {
      date,
      count: completed,
      level: countToLevel(completed, activeHabits.length),
    };
  });
};

export const getDailyCompletionSeries = (
  habits: Habit[],
  logs: Record<string, HabitLog[]>,
  days: number,
  now = new Date()
): DailyCompletionPoint[] =>
  getWindowDates(days, now).map((date) => {
    const eligibleHabits = habits.filter((habit) => isHabitActiveOnDate(habit, date));
    const completed = eligibleHabits.filter((habit) =>
      hasCompletedLogForDate(logs[habit.id] || [], date)
    ).length;
    const total = eligibleHabits.length;

    return {
      date: format(parseISO(date), 'MMM d'),
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      completed,
      total,
    };
  });

export const getWeeklyStats = getDailyCompletionSeries;

export const getMissedDayStats = (
  habits: Habit[],
  logs: Record<string, HabitLog[]>,
  days: number,
  now = new Date()
): MissedDayData[] => {
  const weekCounts = [0, 0, 0, 0, 0, 0, 0];

  getWindowDates(days, now).forEach((date) => {
    habits.forEach((habit) => {
      if (!isHabitActiveOnDate(habit, date)) return;

      if (!hasCompletedLogForDate(logs[habit.id] || [], date)) {
        weekCounts[getDay(parseISO(date))]++;
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
): HabitCompletionStat[] =>
  habits
    .map((habit) => {
      const habitLogs = logs[habit.id] || [];
      const eligibleDates = getEligibleDatesForHabit(habit, days, now);
      const completed = getCompletedCountInDates(habitLogs, eligibleDates);

      return {
        id: habit.id,
        name: habit.name,
        percentage: getCompletionRate(habit, habitLogs, days, now),
        completed,
        possible: eligibleDates.length,
        currentStreak: calculateStreak(habitLogs, now),
        longestStreak: calculateLongestStreak(habitLogs),
      };
    })
    .sort((left, right) => right.percentage - left.percentage);

export const getTodayStats = (
  habits: Habit[],
  logs: Record<string, HabitLog[]>,
  now = new Date()
): { completed: number; total: number; percentage: number } => {
  const today = getLocalDateString(now);
  const eligibleHabits = habits.filter((habit) => isHabitActiveOnDate(habit, today));
  const total = eligibleHabits.length;
  const completed = eligibleHabits.filter((habit) =>
    hasCompletedLogForDate(logs[habit.id] || [], today)
  ).length;

  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
};

export const getAnalyticsOverview = (
  habits: Habit[],
  logs: Record<string, HabitLog[]>,
  days: number,
  now = new Date()
): HabitAnalyticsOverview => {
  const leaderboard = getHabitLeaderboard(habits, logs, days, now);
  const dailyCompletionSeries = getDailyCompletionSeries(
    habits,
    logs,
    Math.min(days, 30),
    now
  );
  const missedDays = getMissedDayStats(habits, logs, days, now);

  const totalCompleted = habits.reduce(
    (sum, habit) => sum + (logs[habit.id] || []).filter((log) => log.completed).length,
    0
  );

  const totals = leaderboard.reduce(
    (accumulator, stat) => {
      accumulator.completed += stat.completed;
      accumulator.possible += stat.possible;
      accumulator.maxCurrentStreak = Math.max(
        accumulator.maxCurrentStreak,
        stat.currentStreak
      );
      accumulator.maxLongestStreak = Math.max(
        accumulator.maxLongestStreak,
        stat.longestStreak
      );
      return accumulator;
    },
    {
      completed: 0,
      possible: 0,
      maxCurrentStreak: 0,
      maxLongestStreak: 0,
    }
  );

  const completionShare = habits
    .map((habit) => {
      const eligibleDates = getEligibleDatesForHabit(habit, days, now);
      const completed = getCompletedCountInDates(logs[habit.id] || [], eligibleDates);

      return {
        id: habit.id,
        name: habit.name,
        value: completed,
      };
    })
    .filter((datum) => datum.value > 0)
    .sort((left, right) => right.value - left.value);

  return {
    totalCompleted,
    overallRate:
      totals.possible > 0
        ? Math.round((totals.completed / totals.possible) * 100)
        : 0,
    maxCurrentStreak: totals.maxCurrentStreak,
    maxLongestStreak: totals.maxLongestStreak,
    completionShare,
    dailyCompletionSeries,
    missedDays,
    leaderboard,
  };
};

export const getDashboardSummary = (
  habits: Habit[],
  logs: Record<string, HabitLog[]>,
  now = new Date()
): DashboardSummary => {
  const today = getTodayStats(habits, logs, now);
  const weeklyCompletionSeries = getDailyCompletionSeries(habits, logs, 7, now);
  const highestStreak = habits.reduce(
    (max, habit) => Math.max(max, calculateStreak(logs[habit.id] || [], now)),
    0
  );
  const weeklyAverage =
    weeklyCompletionSeries.length > 0
      ? Math.round(
          weeklyCompletionSeries.reduce((sum, day) => sum + day.rate, 0) /
            weeklyCompletionSeries.length
        )
      : 0;

  return {
    today,
    highestStreak,
    weeklyAverage,
    weeklyCompletionSeries,
  };
};
