import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@waqtify/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  registeredUsers: User[];
  
  signup: (name: string, email: string, passwordHash: string) => Promise<{ success: boolean; message?: string }>;
  login: (email: string, passwordHash: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  resetPassword: (email: string, newPasswordHash: string) => Promise<{ success: boolean; message?: string }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      registeredUsers: [], // Local mockup of a DB

      signup: async (name, email, passwordHash) => {
        const { registeredUsers } = get();
        if (registeredUsers.some(u => u.email === email)) {
          return { success: false, message: "Email already exists in system." };
        }
        
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          passwordHash,
        };
        
        set((state) => ({ 
          registeredUsers: [...state.registeredUsers, newUser],
          user: newUser, 
          isAuthenticated: true 
        }));
        
        return { success: true };
      },

      login: async (email, passwordHash) => {
        // Special bypass for demo users that don't need a password hash strictly checked
        if (email.endsWith('@anonymous.local')) {
            const guestUser: User = {
                id: Math.random().toString(36).substr(2, 9),
                email,
                name: 'Guest User',
                passwordHash: 'none',
            };
            set({ user: guestUser, isAuthenticated: true });
            return { success: true };
        }

        const { registeredUsers } = get();
        const found = registeredUsers.find(u => u.email === email && u.passwordHash === passwordHash);
        
        if (!found) {
          return { success: false, message: "Invalid email or password." };
        }
        
        set({ user: found, isAuthenticated: true });
        return { success: true };
      },

      resetPassword: async (email, newPasswordHash) => {
        const { registeredUsers } = get();
        const index = registeredUsers.findIndex(u => u.email === email);
        
        if (index === -1) {
          return { success: false, message: "Email not found." };
        }
        
        const updatedUsers = [...registeredUsers];
        updatedUsers[index] = { ...updatedUsers[index], passwordHash: newPasswordHash };
        
        set({ registeredUsers: updatedUsers });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'waqtify-auth-storage', 
    }
  )
);
