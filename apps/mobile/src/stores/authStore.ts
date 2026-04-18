import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '../types';
import { createId } from '../utils/id';

interface AuthActionResult {
  success: boolean;
  message?: string;
}

interface AuthStoreState {
  registeredUsers: User[];
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  signup: (name: string, email: string, passwordHash: string) => Promise<AuthActionResult>;
  login: (email: string, passwordHash: string) => Promise<AuthActionResult>;
  loginGuest: () => Promise<AuthActionResult>;
  logout: () => void;
  resetPassword: (email: string, newPasswordHash: string) => Promise<AuthActionResult>;
  updateProfile: (profile: Pick<User, 'name' | 'email'>) => Promise<AuthActionResult>;
}

const storage = createJSONStorage(() => AsyncStorage);

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      registeredUsers: [],
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      signup: async (name, email, passwordHash) => {
        const state = get();
        const normalizedEmail = email.trim().toLowerCase();
        const exists = state.registeredUsers.some(
          (user) => user.email.toLowerCase() === normalizedEmail
        );
        if (exists) {
          return { success: false, message: 'Email already exists in system.' };
        }

        const newUser: User = {
          id: createId(),
          name: name.trim(),
          email: normalizedEmail,
          passwordHash,
        };

        set({
          registeredUsers: [...state.registeredUsers, newUser],
          user: newUser,
          isAuthenticated: true,
        });

        return { success: true };
      },

      login: async (email, passwordHash) => {
        const state = get();
        const normalizedEmail = email.trim().toLowerCase();
        const found = state.registeredUsers.find(
          (user) =>
            user.email.toLowerCase() === normalizedEmail &&
            user.passwordHash === passwordHash
        );

        if (!found) {
          return { success: false, message: 'Invalid email or password.' };
        }

        set({ user: found, isAuthenticated: true });
        return { success: true };
      },

      loginGuest: async () => {
        const guestUser: User = {
          id: createId(),
          email: `guest_${createId()}@anonymous.local`,
          name: 'Guest User',
          passwordHash: 'none',
        };

        set({ user: guestUser, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      resetPassword: async (email, newPasswordHash) => {
        const state = get();
        const normalizedEmail = email.trim().toLowerCase();
        const userIndex = state.registeredUsers.findIndex(
          (user) => user.email.toLowerCase() === normalizedEmail
        );

        if (userIndex === -1) {
          return { success: false, message: 'Email not found.' };
        }

        const nextUsers = [...state.registeredUsers];
        const updatedUser = { ...nextUsers[userIndex], passwordHash: newPasswordHash };
        nextUsers[userIndex] = updatedUser;

        const nextCurrentUser =
          state.user?.id === updatedUser.id ? updatedUser : state.user;

        set({ registeredUsers: nextUsers, user: nextCurrentUser });
        return { success: true };
      },

      updateProfile: async (profile) => {
        const state = get();
        if (!state.user) {
          return { success: false, message: 'No active user.' };
        }

        const normalizedEmail = profile.email.trim().toLowerCase();
        const taken = state.registeredUsers.some(
          (user) =>
            user.email.toLowerCase() === normalizedEmail &&
            user.id !== state.user?.id
        );

        if (taken) {
          return { success: false, message: 'Email already exists in system.' };
        }

        const updatedUser: User = {
          ...state.user,
          name: profile.name.trim(),
          email: normalizedEmail,
        };

        set({
          user: updatedUser,
          registeredUsers: state.registeredUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          ),
        });

        return { success: true };
      },
    }),
    {
      name: 'waqtify.mobile.auth.v1',
      storage,
      partialize: (state) => ({
        registeredUsers: state.registeredUsers,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

