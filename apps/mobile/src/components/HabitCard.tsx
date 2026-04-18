import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Habit, HabitLog } from '../types';
import type { AppTheme } from '../theme';
import { habitCategoryLabels } from '../types';

interface HabitCardProps {
  habit: Habit;
  todaysLog?: HabitLog;
  streakCount: number;
  theme: AppTheme;
  onTrack: (countInput?: number, durationInput?: number) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function HabitCard({
  habit,
  todaysLog,
  streakCount,
  theme,
  onTrack,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const isCompleted = todaysLog?.completed || false;

  let progress = 0;
  if (isCompleted) {
    progress = 100;
  } else if (habit.type === 'count' && habit.target && todaysLog?.count) {
    progress = Math.min(100, Math.round((todaysLog.count / habit.target) * 100));
  } else if (habit.type === 'timer' && habit.expectedDuration && todaysLog?.duration) {
    progress = Math.min(100, Math.round((todaysLog.duration / habit.expectedDuration) * 100));
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: isCompleted ? theme.success : theme.border,
          borderLeftColor: habit.color || theme.primary,
        },
      ]}
    >
      <View style={styles.rowTop}>
        <View style={styles.titleWrap}>
          <Text style={styles.emoji}>{habit.icon || '⭐'}</Text>
          <View style={styles.titleTextWrap}>
            <Text style={[styles.title, { color: theme.text }]}>{habit.name}</Text>
            <Text style={[styles.meta, { color: theme.mutedText }]}>
              {streakCount > 0 ? `${streakCount} day streak` : 'Built today'}
              {habit.category ? ` • ${habitCategoryLabels[habit.category]}` : ''}
            </Text>
          </View>
        </View>
        <View style={styles.menuRow}>
          <Pressable
            onPress={onEdit}
            style={[styles.menuButton, { borderColor: theme.border, backgroundColor: theme.cardAlt }]}
          >
            <Text style={[styles.menuButtonText, { color: theme.text }]}>Edit</Text>
          </Pressable>
          <Pressable
            onPress={onDelete}
            style={[styles.menuButton, { borderColor: theme.border, backgroundColor: theme.cardAlt }]}
          >
            <Text style={[styles.menuButtonText, { color: theme.danger }]}>Delete</Text>
          </Pressable>
        </View>
      </View>

      {habit.description ? (
        <Text style={[styles.description, { color: theme.mutedText }]}>{habit.description}</Text>
      ) : null}

      {habit.tags && habit.tags.length > 0 ? (
        <View style={styles.tagsRow}>
          {habit.tags.slice(0, 3).map((tag) => (
            <View
              key={tag}
              style={[
                styles.tag,
                { backgroundColor: theme.cardAlt, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.tagText, { color: theme.mutedText }]}>#{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.progressWrap}>
        <View style={[styles.progressTrack, { backgroundColor: theme.cardAlt }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: isCompleted ? theme.success : habit.color || theme.primary,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.mutedText }]}>{progress}%</Text>
      </View>

      <View style={styles.actionsRow}>
        {habit.type === 'binary' ? (
          <Pressable
            onPress={() => onTrack()}
            style={[
              styles.primaryAction,
              {
                backgroundColor: isCompleted ? theme.success : theme.primary,
              },
            ]}
          >
            <Text style={styles.primaryActionText}>
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </Text>
          </Pressable>
        ) : null}

        {habit.type === 'count' ? (
          <View style={styles.counterWrap}>
            <Pressable
              onPress={() => onTrack((todaysLog?.count || 0) - 1)}
              style={[styles.counterButton, { borderColor: theme.border }]}
            >
              <Text style={[styles.counterButtonText, { color: theme.text }]}>-</Text>
            </Pressable>
            <Text style={[styles.counterValue, { color: theme.text }]}>
              {todaysLog?.count || 0}
            </Text>
            <Pressable
              onPress={() => onTrack((todaysLog?.count || 0) + 1)}
              style={[styles.counterButton, { borderColor: theme.border }]}
            >
              <Text style={[styles.counterButtonText, { color: theme.text }]}>+</Text>
            </Pressable>
          </View>
        ) : null}

        {habit.type === 'timer' ? (
          <Pressable
            onPress={() => onTrack(undefined, (todaysLog?.duration || 0) + 60)}
            style={[styles.primaryAction, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.primaryActionText}>
              +1 min ({Math.round((todaysLog?.duration || 0) / 60)}m)
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleWrap: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    paddingRight: 6,
  },
  emoji: {
    fontSize: 20,
  },
  titleTextWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    fontSize: 12,
    fontWeight: '500',
  },
  menuRow: {
    flexDirection: 'row',
    gap: 6,
  },
  menuButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  menuButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    fontSize: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    minWidth: 34,
    textAlign: 'right',
  },
  actionsRow: {
    marginTop: 2,
  },
  primaryAction: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  primaryActionText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 13,
  },
  counterWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  counterButton: {
    borderWidth: 1,
    borderRadius: 10,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: -2,
  },
  counterValue: {
    minWidth: 42,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
});

