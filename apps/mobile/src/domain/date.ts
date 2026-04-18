import { formatISO, startOfDay } from 'date-fns';

export const getLocalDateString = (date: Date): string =>
  formatISO(startOfDay(date), { representation: 'date' });

