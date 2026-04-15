import React from 'react';
import { useHabitStore } from '../stores/habitStore';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@waqtify/ui';
import { ArrowLeft } from 'lucide-react';
import { HabitFormFields } from '../features/habits/components/HabitFormFields';
import { useHabitFormState } from '../features/habits/hooks/useHabitFormState';

export function EditHabit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const habits = useHabitStore((state) => state.habits);
  const updateHabit = useHabitStore((state) => state.updateHabit);

  const habit = habits.find((item) => item.id === id);
  const { values, updateField, isValid, toInput } = useHabitFormState({
    initialHabit: habit,
    mode: 'edit',
  });

  if (!habit) {
    return (
      <div className="max-w-2xl mx-auto w-full animate-in fade-in duration-500 flex flex-col items-center justify-center py-24 text-center gap-4">
        <p className="text-muted-foreground">Habit not found.</p>
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid || !id) return;

    updateHabit(id, toInput());
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="bg-card border rounded-2xl shadow-sm p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Protocol</h1>
          <p className="text-muted-foreground">
            Update the details for{' '}
            <span className="text-foreground font-medium">{habit.name}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <HabitFormFields
            values={values}
            onFieldChange={updateField}
            variant="page"
          />

          <div className="pt-6 border-t flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-8 h-12"
            >
              Cancel
            </Button>
            <Button
              size="lg"
              type="submit"
              disabled={!isValid}
              className="w-full sm:w-auto px-10 h-12"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
