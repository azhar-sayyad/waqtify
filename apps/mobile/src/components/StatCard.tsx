import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AppTheme } from '../theme';

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  theme: AppTheme;
}

export function StatCard({ label, value, subtitle, theme }: StatCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.label, { color: theme.mutedText }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 4,
    minWidth: 155,
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
  },
});

