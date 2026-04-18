import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { defaultAppPreferences, type AppPreferences } from '../types';

interface SettingsStoreState {
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  userSettings: Record<string, AppPreferences>;
  userId: string | null;
  settings: AppPreferences;
  loadForUser: (userId: string) => void;
  clear: () => void;
  saveSettings: (settings: AppPreferences) => Promise<void>;
}

const storage = createJSONStorage(() => AsyncStorage);

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      userSettings: {},
      userId: null,
      settings: defaultAppPreferences,

      loadForUser: (userId) => {
        const settings = get().userSettings[userId] || defaultAppPreferences;
        set({ userId, settings });
      },

      clear: () => {
        set({
          userId: null,
          settings: defaultAppPreferences,
        });
      },

      saveSettings: async (settings) => {
        const userId = get().userId;
        if (!userId) return;

        set((state) => ({
          settings,
          userSettings: {
            ...state.userSettings,
            [userId]: settings,
          },
        }));
      },
    }),
    {
      name: 'waqtify.mobile.settings.v1',
      storage,
      partialize: (state) => ({
        userSettings: state.userSettings,
        userId: state.userId,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

