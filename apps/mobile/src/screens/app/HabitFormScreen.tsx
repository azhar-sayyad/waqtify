import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../components/Screen';
import { HabitEditorForm } from '../../components/HabitEditorForm';
import { useHabitStore } from '../../stores/habitStore';
import { useHabitFormState } from '../../hooks/useHabitFormState';
import type { AppStackParamList } from '../../navigation/types';
import type { AppTheme } from '../../theme';

type Navigation = NativeStackNavigationProp<AppStackParamList>;
type EditRoute = RouteProp<AppStackParamList, 'EditHabit'>;

interface AddHabitScreenProps {
  theme: AppTheme;
}

interface EditHabitScreenProps {
  theme: AppTheme;
}

export function AddHabitScreen({ theme }: AddHabitScreenProps) {
  const navigation = useNavigation<Navigation>();
  const createHabit = useHabitStore((state) => state.createHabit);
  const { values, updateField, isValid, toInput } = useHabitFormState({
    mode: 'create',
  });

  return (
    <Screen theme={theme}>
      <View style={styles.headerWrap}>
        <Text style={[styles.title, { color: theme.text }]}>Create Protocol</Text>
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>
          Define a measurable habit you want to track daily.
        </Text>
      </View>
      <HabitEditorForm
        values={values}
        onFieldChange={updateField}
        onSubmit={() => {
          if (!isValid) return;
          createHabit(toInput());
          navigation.goBack();
        }}
        submitLabel="Create Habit"
        disabled={!isValid}
        theme={theme}
      />
    </Screen>
  );
}

export function EditHabitScreen({ theme }: EditHabitScreenProps) {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<EditRoute>();
  const habits = useHabitStore((state) => state.habits);
  const updateHabit = useHabitStore((state) => state.updateHabit);
  const habit = habits.find((item) => item.id === route.params.id);

  const { values, updateField, isValid, toInput } = useHabitFormState({
    mode: 'edit',
    initialHabit: habit,
  });

  if (!habit) {
    return (
      <Screen theme={theme}>
        <View style={[styles.notFound, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>Habit not found</Text>
          <Text style={[styles.subtitle, { color: theme.mutedText }]}>
            This habit may have been removed.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen theme={theme}>
      <View style={styles.headerWrap}>
        <Text style={[styles.title, { color: theme.text }]}>Edit Protocol</Text>
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>
          Update details for {habit.name}.
        </Text>
      </View>
      <HabitEditorForm
        values={values}
        onFieldChange={updateField}
        onSubmit={() => {
          if (!isValid) return;
          updateHabit(habit.id, toInput());
          navigation.goBack();
        }}
        submitLabel="Save Changes"
        disabled={!isValid}
        theme={theme}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
  },
  notFound: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
});

