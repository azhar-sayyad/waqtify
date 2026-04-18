import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  categoryLabels,
  colorOptions,
  iconOptions,
  type HabitFormValues,
} from '../domain/form';
import type { AppTheme } from '../theme';
import { habitPriorityColors, type HabitPriority } from '../types';

interface HabitEditorFormProps {
  values: HabitFormValues;
  onFieldChange: <Key extends keyof HabitFormValues>(
    field: Key,
    value: HabitFormValues[Key]
  ) => void;
  onSubmit: () => void;
  submitLabel: string;
  disabled?: boolean;
  theme: AppTheme;
}

const typeOptions: Array<{ key: HabitFormValues['type']; label: string }> = [
  { key: 'binary', label: 'Toggle' },
  { key: 'count', label: 'Quantity' },
  { key: 'timer', label: 'Duration' },
];

const priorityOptions: HabitPriority[] = ['low', 'medium', 'high'];

export function HabitEditorForm({
  values,
  onFieldChange,
  onSubmit,
  submitLabel,
  disabled,
  theme,
}: HabitEditorFormProps) {
  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.label, { color: theme.mutedText }]}>Habit Name</Text>
      <TextInput
        value={values.name}
        onChangeText={(text) => onFieldChange('name', text)}
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.cardAlt }]}
        placeholder="e.g. Read 10 pages"
        placeholderTextColor={theme.mutedText}
      />

      <Text style={[styles.label, { color: theme.mutedText }]}>Description</Text>
      <TextInput
        value={values.description}
        onChangeText={(text) => onFieldChange('description', text)}
        style={[
          styles.input,
          styles.textarea,
          { color: theme.text, borderColor: theme.border, backgroundColor: theme.cardAlt },
        ]}
        placeholder="Why this habit matters"
        placeholderTextColor={theme.mutedText}
        multiline
      />

      <Text style={[styles.label, { color: theme.mutedText }]}>Measurement Type</Text>
      <View style={styles.rowWrap}>
        {typeOptions.map((option) => (
          <Pressable
            key={option.key}
            onPress={() => onFieldChange('type', option.key)}
            style={[
              styles.chip,
              {
                borderColor: values.type === option.key ? theme.primary : theme.border,
                backgroundColor: values.type === option.key ? `${theme.primary}22` : theme.cardAlt,
              },
            ]}
          >
            <Text style={{ color: values.type === option.key ? theme.primary : theme.text }}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {values.type !== 'binary' ? (
        <>
          <Text style={[styles.label, { color: theme.mutedText }]}>
            {values.type === 'count' ? 'Daily Target Quantity' : 'Daily Target Time (minutes)'}
          </Text>
          <TextInput
            value={String(values.type === 'count' ? values.target : values.targetTime)}
            onChangeText={(text) => {
              const parsed = Number.parseInt(text, 10);
              if (values.type === 'count') {
                onFieldChange('target', Number.isNaN(parsed) ? 1 : parsed);
                return;
              }
              onFieldChange('targetTime', Number.isNaN(parsed) ? 10 : parsed);
            }}
            keyboardType="number-pad"
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.cardAlt }]}
            placeholderTextColor={theme.mutedText}
          />
        </>
      ) : null}

      <Text style={[styles.label, { color: theme.mutedText }]}>Category</Text>
      <View style={styles.rowWrap}>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <Pressable
            key={key}
            onPress={() => onFieldChange('category', key as HabitFormValues['category'])}
            style={[
              styles.chip,
              {
                borderColor: values.category === key ? theme.primary : theme.border,
                backgroundColor: values.category === key ? `${theme.primary}22` : theme.cardAlt,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: values.category === key ? theme.primary : theme.text },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.label, { color: theme.mutedText }]}>Priority</Text>
      <View style={styles.rowWrap}>
        {priorityOptions.map((priority) => (
          <Pressable
            key={priority}
            onPress={() => onFieldChange('priority', priority)}
            style={[
              styles.chip,
              {
                borderColor: values.priority === priority ? theme.primary : theme.border,
                backgroundColor: values.priority === priority ? `${theme.primary}22` : theme.cardAlt,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: habitPriorityColors[priority] }]} />
            <Text style={{ color: values.priority === priority ? theme.primary : theme.text }}>
              {priority}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.label, { color: theme.mutedText }]}>Color</Text>
      <View style={styles.rowWrap}>
        {colorOptions.map((color) => (
          <Pressable
            key={color}
            onPress={() => onFieldChange('color', color)}
            style={[
              styles.colorDot,
              {
                backgroundColor: color,
                borderColor: values.color === color ? theme.text : 'transparent',
              },
            ]}
          />
        ))}
      </View>

      <Text style={[styles.label, { color: theme.mutedText }]}>Icon</Text>
      <View style={styles.rowWrap}>
        {iconOptions.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => onFieldChange('icon', option.value)}
            style={[
              styles.iconButton,
              {
                borderColor: values.icon === option.value ? theme.primary : theme.border,
                backgroundColor: values.icon === option.value ? `${theme.primary}22` : theme.cardAlt,
              },
            ]}
          >
            <Text style={styles.iconText}>{option.value}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.label, { color: theme.mutedText }]}>Start Date (YYYY-MM-DD)</Text>
      <TextInput
        value={values.startDate}
        onChangeText={(text) => onFieldChange('startDate', text)}
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.cardAlt }]}
        placeholder="2026-04-15"
        placeholderTextColor={theme.mutedText}
      />

      <Text style={[styles.label, { color: theme.mutedText }]}>End Date (optional)</Text>
      <TextInput
        value={values.endDate}
        onChangeText={(text) => onFieldChange('endDate', text)}
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.cardAlt }]}
        placeholder="2026-12-31"
        placeholderTextColor={theme.mutedText}
      />

      <Text style={[styles.label, { color: theme.mutedText }]}>Reminder Time (optional)</Text>
      <TextInput
        value={values.reminderTime}
        onChangeText={(text) => onFieldChange('reminderTime', text)}
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.cardAlt }]}
        placeholder="08:30"
        placeholderTextColor={theme.mutedText}
      />

      <Text style={[styles.label, { color: theme.mutedText }]}>Tags (comma-separated)</Text>
      <TextInput
        value={values.tagsInput}
        onChangeText={(text) => onFieldChange('tagsInput', text)}
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.cardAlt }]}
        placeholder="morning, health, focus"
        placeholderTextColor={theme.mutedText}
      />

      <Text style={[styles.label, { color: theme.mutedText }]}>Notes</Text>
      <TextInput
        value={values.notes}
        onChangeText={(text) => onFieldChange('notes', text)}
        style={[
          styles.input,
          styles.textarea,
          { color: theme.text, borderColor: theme.border, backgroundColor: theme.cardAlt },
        ]}
        placeholder="Any context or reflections"
        placeholderTextColor={theme.mutedText}
        multiline
      />

      <Pressable
        onPress={onSubmit}
        disabled={disabled}
        style={[
          styles.submitButton,
          { backgroundColor: disabled ? theme.mutedText : theme.primary },
        ]}
      >
        <Text style={styles.submitButtonText}>{submitLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  colorDot: {
    width: 30,
    height: 30,
    borderRadius: 999,
    borderWidth: 2,
  },
  iconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
  iconText: {
    fontSize: 18,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

