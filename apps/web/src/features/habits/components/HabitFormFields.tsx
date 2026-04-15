import { Input, Label } from '@waqtify/ui';
import {
  categoryLabels,
  colorOptions,
  iconOptions,
  priorityColors,
  type HabitFormValues,
} from '../../../domain/habits/form';

interface HabitFormFieldsProps {
  values: HabitFormValues;
  onFieldChange: <Key extends keyof HabitFormValues>(
    field: Key,
    value: HabitFormValues[Key]
  ) => void;
  variant?: 'dialog' | 'page';
}

const pageVariant = {
  inputHeight: 'h-14 text-lg',
  textareaHeight: 'min-h-[80px]',
  gridGap: 'gap-4',
  iconSize: 'w-12 h-12 text-xl rounded-xl',
  colorSize: 'w-10 h-10',
  typeCard: 'p-4 rounded-xl',
  titleClass: 'text-sm uppercase tracking-wider text-muted-foreground font-semibold',
  sectionHeading: 'text-lg font-semibold flex items-center gap-2',
};

const dialogVariant = {
  inputHeight: 'h-11 text-sm',
  textareaHeight: 'min-h-[40px]',
  gridGap: 'gap-2',
  iconSize: 'w-10 h-10 text-lg rounded-lg',
  colorSize: 'w-8 h-8',
  typeCard: 'p-3 rounded-lg',
  titleClass: 'text-sm font-semibold',
  sectionHeading: 'text-sm font-semibold flex items-center gap-2',
};

export function HabitFormFields({
  values,
  onFieldChange,
  variant = 'dialog',
}: HabitFormFieldsProps) {
  const styles = variant === 'page' ? pageVariant : dialogVariant;
  const fieldBaseClass =
    'bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors';

  return (
    <>
      <div className={variant === 'page' ? 'space-y-6' : 'grid grid-cols-1 gap-4'}>
        <div className={variant === 'page' ? 'space-y-3' : 'space-y-2'}>
          <Label className={styles.titleClass}>Habit Name</Label>
          <Input
            autoFocus
            placeholder="e.g. Read 10 Pages, Drink Water"
            className={`${styles.inputHeight} ${fieldBaseClass}`}
            value={values.name}
            onChange={(event) => onFieldChange('name', event.target.value)}
            required
          />
        </div>

        <div className={variant === 'page' ? 'space-y-3' : 'space-y-2'}>
          <Label className={`${styles.titleClass} flex items-center gap-2`}>Description</Label>
          <textarea
            placeholder="What's this habit about? Why is it important?"
            className={`w-full ${styles.textareaHeight} p-3 rounded-lg border ${fieldBaseClass} resize-none ${variant === 'dialog' ? 'text-sm' : ''}`}
            value={values.description}
            onChange={(event) => onFieldChange('description', event.target.value)}
          />
        </div>
      </div>

      <div className={variant === 'page' ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-3 gap-4'}>
        <div className={variant === 'page' ? 'space-y-3' : 'space-y-3'}>
          <Label className={styles.titleClass}>Measurement Type</Label>
          <div className={`grid grid-cols-3 ${styles.gridGap}`}>
            {[
              { key: 'binary', label: 'Toggle' },
              { key: 'count', label: 'Quantity' },
              { key: 'timer', label: 'Duration' },
            ].map((option) => (
              <label key={option.key} className="cursor-pointer group">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={values.type === option.key}
                  onChange={() => onFieldChange('type', option.key as HabitFormValues['type'])}
                />
                <div
                  className={`flex flex-col items-center border bg-card peer-checked:border-primary peer-checked:bg-primary/5 transition-all hover:border-primary/50 ${styles.typeCard}`}
                >
                  <span className="text-xs font-medium">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
          {variant === 'page' && (
            <p className="text-xs text-muted-foreground px-1 mt-2">
              {values.type === 'binary' && 'A simple yes or no completion check for the day.'}
              {values.type === 'count' &&
                'Track numerical goals like glasses of water or pages read.'}
              {values.type === 'timer' && 'Measure the time spent on a focused activity.'}
            </p>
          )}
        </div>

        {values.type !== 'binary' && (
          <div className={variant === 'page' ? 'space-y-3 animate-in fade-in slide-in-from-top-2' : 'space-y-2 md:col-span-2'}>
            <Label className={styles.titleClass}>
              {values.type === 'count' ? 'Daily Target Quantity' : 'Daily Target Time (Minutes)'}
            </Label>
            <Input
              type="number"
              min={1}
              className={`${styles.inputHeight} ${fieldBaseClass} ${variant === 'page' ? 'w-1/2' : ''}`}
              value={values.type === 'count' ? values.target : values.targetTime}
              onChange={(event) => {
                const nextValue = parseInt(event.target.value, 10);
                if (values.type === 'count') {
                  onFieldChange('target', Number.isNaN(nextValue) ? 1 : nextValue);
                  return;
                }
                onFieldChange('targetTime', Number.isNaN(nextValue) ? 10 : nextValue);
              }}
              required
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={variant === 'page' ? 'space-y-3' : 'space-y-2'}>
          <Label className={styles.titleClass}>Category</Label>
          <select
            value={values.category}
            onChange={(event) =>
              onFieldChange('category', event.target.value as HabitFormValues['category'])
            }
            className={`${styles.inputHeight} px-4 rounded-lg border w-full ${fieldBaseClass}`}
          >
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className={variant === 'page' ? 'space-y-3' : 'space-y-2'}>
          <Label className={styles.titleClass}>Priority</Label>
          <div className={`grid grid-cols-3 ${styles.gridGap}`}>
            {(['low', 'medium', 'high'] as const).map((priority) => (
              <label key={priority} className="cursor-pointer group">
                <input
                  type="radio"
                  className="peer sr-only"
                  checked={values.priority === priority}
                  onChange={() => onFieldChange('priority', priority)}
                />
                <div
                  className={`flex items-center justify-center border bg-card peer-checked:border-primary peer-checked:bg-primary/5 transition-all capitalize font-medium ${styles.typeCard}`}
                >
                  <div className={`w-3 h-3 rounded-full ${priorityColors[priority]} mr-2`} />
                  {priority}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={variant === 'page' ? 'space-y-3' : 'space-y-2'}>
          <Label className={styles.titleClass}>Color</Label>
          <div className={`flex flex-wrap ${variant === 'page' ? 'gap-3' : 'gap-2'}`}>
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onFieldChange('color', color)}
                className={`${styles.colorSize} rounded-full border-2 transition-all ${
                  values.color === color
                    ? 'border-primary scale-110'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className={variant === 'page' ? 'space-y-3' : 'space-y-2'}>
          <Label className={styles.titleClass}>Icon</Label>
          <div className={`flex flex-wrap ${variant === 'page' ? 'gap-3' : 'gap-2'}`}>
            {iconOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onFieldChange('icon', option.value)}
                className={`${styles.iconSize} flex items-center justify-center border-2 transition-all ${
                  values.icon === option.value
                    ? 'border-primary bg-primary/5 scale-110'
                    : 'border-transparent hover:bg-secondary/50'
                }`}
                title={option.label}
              >
                {option.value}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={variant === 'page' ? 'space-y-6 pt-4 border-t' : 'space-y-3 pt-2 border-t'}>
        <h4 className={styles.sectionHeading}>Scheduling</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={variant === 'page' ? 'space-y-3' : 'space-y-2'}>
            <Label className={variant === 'page' ? styles.titleClass : 'text-xs'}>Start Date</Label>
            <Input
              type="date"
              value={values.startDate}
              onChange={(event) => onFieldChange('startDate', event.target.value)}
              className={`${variant === 'page' ? 'h-12' : 'h-10 text-sm'} ${fieldBaseClass}`}
            />
          </div>
          <div className={variant === 'page' ? 'space-y-3' : 'space-y-2'}>
            <Label className={variant === 'page' ? styles.titleClass : 'text-xs'}>
              End Date (Optional)
            </Label>
            <Input
              type="date"
              value={values.endDate}
              onChange={(event) => onFieldChange('endDate', event.target.value)}
              className={`${variant === 'page' ? 'h-12' : 'h-10 text-sm'} ${fieldBaseClass}`}
            />
          </div>
        </div>

        <div className={variant === 'page' ? 'space-y-3' : 'space-y-2'}>
          <Label className={variant === 'page' ? styles.titleClass : 'text-xs'}>
            Daily Reminder Time (Optional)
          </Label>
          <Input
            type="time"
            value={values.reminderTime}
            onChange={(event) => onFieldChange('reminderTime', event.target.value)}
            className={`${variant === 'page' ? 'h-12 w-1/2' : 'h-10 w-1/2 text-sm'} ${fieldBaseClass}`}
          />
        </div>
      </div>

      <div className={variant === 'page' ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
        <div className={variant === 'page' ? 'space-y-3' : 'space-y-2'}>
          <Label className={styles.titleClass}>Tags (comma-separated)</Label>
          <Input
            placeholder="e.g. morning, health, routine"
            value={values.tagsInput}
            onChange={(event) => onFieldChange('tagsInput', event.target.value)}
            className={`${variant === 'page' ? 'h-12' : 'h-10 text-sm'} ${fieldBaseClass}`}
          />
        </div>

        <div className={variant === 'page' ? 'space-y-3' : 'space-y-2'}>
          <Label className={styles.titleClass}>Notes</Label>
          <textarea
            placeholder="Additional notes, reflections, or context..."
            className={`w-full ${styles.textareaHeight} p-3 rounded-lg border ${fieldBaseClass} resize-none ${variant === 'dialog' ? 'text-sm' : ''}`}
            value={values.notes}
            onChange={(event) => onFieldChange('notes', event.target.value)}
          />
        </div>
      </div>
    </>
  );
}
