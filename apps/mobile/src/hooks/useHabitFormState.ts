import { useEffect, useState } from 'react';
import type { Habit } from '../types';
import {
  createDefaultHabitFormValues,
  habitFormValuesToInput,
  habitToFormValues,
  type HabitFormValues,
} from '../domain/form';

interface UseHabitFormStateOptions {
  initialHabit?: Habit | null;
  mode: 'create' | 'edit';
}

export const useHabitFormState = ({ initialHabit, mode }: UseHabitFormStateOptions) => {
  const [values, setValues] = useState<HabitFormValues>(createDefaultHabitFormValues());

  useEffect(() => {
    if (mode === 'edit' && initialHabit) {
      setValues(habitToFormValues(initialHabit));
      return;
    }

    if (mode === 'create') {
      setValues(createDefaultHabitFormValues());
    }
  }, [initialHabit, mode]);

  const updateField = <Key extends keyof HabitFormValues>(
    field: Key,
    value: HabitFormValues[Key]
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  return {
    values,
    updateField,
    isValid: values.name.trim().length > 0,
    toInput: () => habitFormValuesToInput(values),
  };
};

