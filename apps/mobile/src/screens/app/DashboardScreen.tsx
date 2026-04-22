import React, { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Screen } from '../../components/Screen';
import { HabitCard } from '../../components/HabitCard';
import { StatCard } from '../../components/StatCard';
import { useAuthStore } from '@waqtify/core';
import { useHabitStore } from '@waqtify/core';
import { getLocalDateString } from '@waqtify/core';
import type { AppStackParamList } from '../../navigation/types';
import type { AppTheme } from '../../theme';

type Navigation = NativeStackNavigationProp<AppStackParamList>;

interface DashboardScreenProps {
  theme: AppTheme;
}

export function DashboardScreen({ theme }: DashboardScreenProps) {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore((state) => state.user);
  const {
    habits,
    logs,
    trackHabit,
    deleteHabit,
    calculateStreak,
    getDashboardSummary,
  } = useHabitStore();

  const today = getLocalDateString(new Date());
  const summary = useMemo(() => getDashboardSummary(), [getDashboardSummary, habits, logs]);

  return (
    <Screen theme={theme}>
      <View style={[styles.hero, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.dateText, { color: theme.mutedText }]}>
          {format(new Date(), 'EEEE, MMMM d')}
        </Text>
        <Text style={[styles.heroTitle, { color: theme.text }]}>
          {`Hello, ${user?.name?.split(' ')[0] || 'there'} 👋`}
        </Text>
        <Text style={[styles.heroSubtitle, { color: theme.mutedText }]}>
          {summary.today.completed} / {summary.today.total} habits completed today
        </Text>
        <Pressable
          onPress={() => navigation.navigate('AddHabit')}
          style={[styles.addButton, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.addButtonText}>+ New Habit</Text>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          theme={theme}
          label="Today's Progress"
          value={`${summary.today.percentage}%`}
          subtitle={`${summary.today.completed}/${summary.today.total}`}
        />
        <StatCard
          theme={theme}
          label="Best Streak"
          value={`${summary.highestStreak}d`}
          subtitle="Current best"
        />
      </View>
      <View style={styles.statsRow}>
        <StatCard
          theme={theme}
          label="Active Habits"
          value={String(habits.length)}
          subtitle="Daily tracked"
        />
        <StatCard
          theme={theme}
          label="7-Day Average"
          value={`${summary.weeklyAverage}%`}
          subtitle="Completion rate"
        />
      </View>

      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Habits</Text>
        {habits.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.mutedText }]}>
            No habits yet. Create one to get started.
          </Text>
        ) : (
          <View style={styles.listWrap}>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                todaysLog={logs[habit.id]?.find((entry) => entry.date === today)}
                streakCount={calculateStreak(habit.id)}
                onTrack={(count, duration) => trackHabit(habit.id, today, { count, duration })}
                onEdit={() => navigation.navigate('EditHabit', { id: habit.id })}
                onDelete={() =>
                  Alert.alert(
                    'Delete Habit',
                    `Delete "${habit.name}" and all of its logs?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => deleteHabit(habit.id),
                      },
                    ]
                  )
                }
                theme={theme}
              />
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    fontSize: 14,
  },
  addButton: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
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
    fontSize: 19,
    fontWeight: '800',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  listWrap: {
    gap: 10,
  },
});

