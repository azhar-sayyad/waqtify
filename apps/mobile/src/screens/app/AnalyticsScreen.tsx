import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { StatCard } from '../../components/StatCard';
import { useHabitStore } from '../../stores/habitStore';
import type { AppTheme } from '../../theme';

type DateRange = 30 | 90 | 365;

const DATE_RANGES: Array<{ label: string; value: DateRange }> = [
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
  { label: '1yr', value: 365 },
];

interface AnalyticsScreenProps {
  theme: AppTheme;
}

const levelColor = (level: number, theme: AppTheme) => {
  if (level === 0) return theme.cardAlt;
  if (level === 1) return `${theme.primary}33`;
  if (level === 2) return `${theme.primary}66`;
  if (level === 3) return `${theme.primary}99`;
  return theme.primary;
};

const rateColor = (rate: number, theme: AppTheme) => {
  if (rate >= 70) return theme.success;
  if (rate >= 40) return theme.warning;
  return theme.danger;
};

export function AnalyticsScreen({ theme }: AnalyticsScreenProps) {
  const { habits, logs, getAnalyticsOverview, getActivityCalendarData } = useHabitStore();
  const [dateRange, setDateRange] = useState<DateRange>(30);

  const overview = useMemo(
    () => getAnalyticsOverview(dateRange),
    [dateRange, getAnalyticsOverview, habits, logs]
  );

  const activity = useMemo(() => {
    const all = getActivityCalendarData(new Date().getFullYear());
    return all.slice(-98);
  }, [getActivityCalendarData, habits, logs]);

  const heatmapRows = useMemo(() => {
    const rows: typeof activity[] = [];
    for (let i = 0; i < activity.length; i += 14) {
      rows.push(activity.slice(i, i + 14));
    }
    return rows;
  }, [activity]);

  const worstDay = [...overview.missedDays].sort((a, b) => b.misses - a.misses)[0];

  return (
    <Screen theme={theme}>
      <View style={[styles.hero, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.heroTitle, { color: theme.text }]}>Consistency Overview</Text>
        <Text style={[styles.heroSubtitle, { color: theme.mutedText }]}>
          Analyze your completion trends and weak spots.
        </Text>
        <View style={styles.filtersRow}>
          {DATE_RANGES.map((range) => (
            <Pressable
              key={range.value}
              onPress={() => setDateRange(range.value)}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    dateRange === range.value ? theme.primary : theme.cardAlt,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  { color: dateRange === range.value ? '#fff' : theme.text },
                ]}
              >
                {range.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          theme={theme}
          label="Total Completed"
          value={overview.totalCompleted.toLocaleString()}
        />
        <StatCard
          theme={theme}
          label="Completion Rate"
          value={`${overview.overallRate}%`}
          subtitle={`Last ${dateRange} days`}
        />
      </View>
      <View style={styles.statsRow}>
        <StatCard
          theme={theme}
          label="Current Streak"
          value={`${overview.maxCurrentStreak}d`}
        />
        <StatCard
          theme={theme}
          label="Longest Streak"
          value={`${overview.maxLongestStreak}d`}
        />
      </View>

      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Activity Heatmap</Text>
        <View style={styles.heatmapWrap}>
          {heatmapRows.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.heatmapRow}>
              {row.map((cell) => (
                <View
                  key={cell.date}
                  style={[
                    styles.heatCell,
                    {
                      backgroundColor: levelColor(cell.level, theme),
                      borderColor: theme.border,
                    },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily Completion (30d)</Text>
        <View style={styles.dailySeriesWrap}>
          {overview.dailyCompletionSeries.slice(-12).map((point) => (
            <View key={point.date} style={styles.dailyItem}>
              <View style={[styles.dailyTrack, { backgroundColor: theme.cardAlt }]}>
                <View
                  style={[
                    styles.dailyFill,
                    {
                      height: `${Math.max(6, point.rate)}%`,
                      backgroundColor: rateColor(point.rate, theme),
                    },
                  ]}
                />
              </View>
              <Text style={[styles.dailyLabel, { color: theme.mutedText }]}>{point.date}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Misses by Weekday</Text>
        {overview.missedDays.map((day) => (
          <View key={day.name} style={styles.rowItem}>
            <Text style={[styles.rowName, { color: theme.text }]}>{day.name}</Text>
            <View style={[styles.rowTrack, { backgroundColor: theme.cardAlt }]}>
              <View
                style={[
                  styles.rowFill,
                  {
                    width: `${Math.min(100, day.misses * 8)}%`,
                    backgroundColor:
                      worstDay && day.name === worstDay.name ? theme.danger : `${theme.danger}77`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.rowValue, { color: theme.mutedText }]}>{day.misses}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Per-Habit Rates</Text>
        {overview.leaderboard.length === 0 ? (
          <Text style={[styles.empty, { color: theme.mutedText }]}>
            No habits tracked yet.
          </Text>
        ) : (
          overview.leaderboard.map((habit) => (
            <View key={habit.id} style={styles.rowItem}>
              <Text style={[styles.rowName, { color: theme.text }]} numberOfLines={1}>
                {habit.name}
              </Text>
              <View style={[styles.rowTrack, { backgroundColor: theme.cardAlt }]}>
                <View
                  style={[
                    styles.rowFill,
                    {
                      width: `${habit.percentage}%`,
                      backgroundColor: rateColor(habit.percentage, theme),
                    },
                  ]}
                />
              </View>
              <Text style={[styles.rowValue, { color: theme.mutedText }]}>{habit.percentage}%</Text>
            </View>
          ))
        )}
      </View>

      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Leaderboard</Text>
        {overview.leaderboard.slice(0, 10).map((item, index) => (
          <View key={item.id} style={styles.rankRow}>
            <Text style={[styles.rank, { color: theme.mutedText }]}>{index + 1}</Text>
            <Text style={[styles.rankName, { color: theme.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.rankValue, { color: theme.mutedText }]}>
              {item.percentage}% • {item.currentStreak}d
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    fontSize: 14,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  filterButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  filterButtonText: {
    fontWeight: '700',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  section: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  heatmapWrap: {
    gap: 6,
  },
  heatmapRow: {
    flexDirection: 'row',
    gap: 6,
  },
  heatCell: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderRadius: 4,
  },
  dailySeriesWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 6,
  },
  dailyItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  dailyTrack: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  dailyFill: {
    width: '100%',
    borderRadius: 6,
  },
  dailyLabel: {
    fontSize: 10,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowName: {
    width: 90,
    fontSize: 13,
    fontWeight: '600',
  },
  rowTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  rowFill: {
    height: '100%',
    borderRadius: 999,
  },
  rowValue: {
    width: 42,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    fontSize: 14,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rank: {
    width: 18,
    fontSize: 12,
    fontWeight: '700',
  },
  rankName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  rankValue: {
    fontSize: 12,
    fontWeight: '600',
  },
});

