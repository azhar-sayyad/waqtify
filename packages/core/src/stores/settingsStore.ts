import { create } from 'zustand';
import { settingsService } from '../application/services';
import { defaultAppPreferences, type AppPreferences } from '../domain/settings/types';

interface SettingsState {
  userId: string | null;
  settings: AppPreferences;
  loadForUser: (userId: string) => void;
  clear: () => void;
  saveSettings: (settings: AppPreferences) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  userId: null,
  settings: defaultAppPreferences,

  loadForUser: (userId) => {
    const settings = settingsService.getUserSettings(userId);
    set({ userId, settings });
  },

  clear: () => {
    set({ userId: null, settings: defaultAppPreferences });
  },

  saveSettings: async (settings) => {
    const userId = get().userId;
    if (!userId) return;
    const persisted = settingsService.saveUserSettings(userId, settings);
    set({ settings: persisted });
  },
}));
