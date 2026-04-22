import { create } from 'zustand';
import type { User } from '@waqtify/types';
import { authService } from '../application/services';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  signup: (
    name: string,
    email: string,
    passwordHash: string
  ) => Promise<{ success: boolean; message?: string }>;
  login: (email: string, passwordHash: string) => Promise<{ success: boolean; message?: string }>;
  loginGuest: () => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  resetPassword: (
    email: string,
    newPasswordHash: string
  ) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (
    profile: Pick<User, 'name' | 'email'>
  ) => Promise<{ success: boolean; message?: string }>;
}

const initialState = authService.getSessionState();

export const useAuthStore = create<AuthState>()((set) => ({
  ...initialState,

  signup: async (name, email, passwordHash) => {
    const result = authService.signup({ name, email, passwordHash });
    set({ user: result.user, isAuthenticated: result.isAuthenticated });
    return { success: result.success, message: result.message };
  },

  login: async (email, passwordHash) => {
    const result = authService.login(email, passwordHash);
    set({ user: result.user, isAuthenticated: result.isAuthenticated });
    return { success: result.success, message: result.message };
  },

  loginGuest: async () => {
    const result = authService.loginGuest();
    set({ user: result.user, isAuthenticated: result.isAuthenticated });
    return { success: result.success, message: result.message };
  },

  logout: () => {
    const session = authService.logout();
    set(session);
  },

  resetPassword: async (email, newPasswordHash) => {
    const result = authService.resetPassword(email, newPasswordHash);
    set({ user: result.user, isAuthenticated: result.isAuthenticated });
    return { success: result.success, message: result.message };
  },

  updateProfile: async (profile) => {
    const result = authService.updateProfile(profile);
    set({ user: result.user, isAuthenticated: result.isAuthenticated });
    return { success: result.success, message: result.message };
  },
}));
