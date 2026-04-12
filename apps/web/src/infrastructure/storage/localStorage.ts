const isBrowser = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const readJsonFromStorage = (key: string): unknown | null => {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to parse storage key "${key}"`, error);
    return null;
  }
};

export const writeJsonToStorage = (key: string, value: unknown): void => {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const removeStorageKey = (key: string): void => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
};
