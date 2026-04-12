import { useEffect, useState } from 'react';
import type { Habit } from '@waqtify/types';
import {
  createDefaultHabitFormValues,
  habitFormValuesToInput,
  habitToFormValues,
  type HabitFormValues,
} from '../../../domain/habits/form';

interface UseHabitFormStateOptions {
  initialHabit?: Habit | null;
  mode: 'create' | 'edit';
  resetSignal?: unknown;
}

export const useHabitFormState = ({
  initialHabit,
  mode,
  resetSignal,
}: UseHabitFormStateOptions) => {
  const [values, setValues] = useState<HabitFormValues>(createDefaultHabitFormValues());

  useEffect(() => {
    if (mode === 'edit' && initialHabit) {
      setValues(habitToFormValues(initialHabit));
      return;
    }

    if (mode === 'create') {
      setValues(createDefaultHabitFormValues());
    }
  }, [initialHabit, mode, resetSignal]);

  const updateField = <Key extends keyof HabitFormValues>(
    field: Key,
    value: HabitFormValues[Key]
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const reset = () => {
    if (mode === 'edit' && initialHabit) {
      setValues(habitToFormValues(initialHabit));
      return;
    }

    setValues(createDefaultHabitFormValues());
  };

  return {
    values,
    updateField,
    reset,
    isValid: values.name.trim().length > 0,
    toInput: () => habitFormValuesToInput(values),
  };
};
