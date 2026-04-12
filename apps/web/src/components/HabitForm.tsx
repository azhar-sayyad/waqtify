import React from 'react';
import { Button, Dialog } from '@waqtify/ui';
import type { Habit } from '@waqtify/types';
import type { HabitUpsertInput } from '../domain/habits/types';
import { HabitFormFields } from '../features/habits/components/HabitFormFields';
import { useHabitFormState } from '../features/habits/hooks/useHabitFormState';

export interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (habitData: HabitUpsertInput) => void;
  initialData?: Habit;
  isEditing?: boolean;
}

export function HabitForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}: HabitFormProps) {
  const { values, updateField, reset, isValid, toInput } = useHabitFormState({
    initialHabit: initialData,
    mode: isEditing ? 'edit' : 'create',
    resetSignal: isOpen,
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) return;

    onSubmit(toInput());
    reset();
    onClose();
  };

  const handleDialogClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleDialogClose}
      title={isEditing ? 'Edit Protocol' : 'Create Protocol'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <HabitFormFields values={values} onFieldChange={updateField} />

        <div className="pt-4 border-t flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleDialogClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!isValid} className="px-6">
            {isEditing ? 'Save Changes' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
