import React from 'react';
import { useHabitStore } from '../stores/habitStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@waqtify/ui';
import { ArrowLeft } from 'lucide-react';
import { HabitFormFields } from '../features/habits/components/HabitFormFields';
import { useHabitFormState } from '../features/habits/hooks/useHabitFormState';

export function AddHabit() {
  const createHabit = useHabitStore((state) => state.createHabit);
  const navigate = useNavigate();
  const { values, updateField, isValid, toInput } = useHabitFormState({
    mode: 'create',
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) return;

    createHabit(toInput());
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create Protocol</h1>
          <p className="text-muted-foreground">
            Define a new measurable behavior to track consistently.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <HabitFormFields
            values={values}
            onFieldChange={updateField}
            variant="page"
          />

          <div className="pt-6 border-t flex justify-end">
            <Button
              size="lg"
              type="submit"
              disabled={!isValid}
              className="w-full sm:w-auto px-10 h-12"
            >
              Initialize Protocol
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
