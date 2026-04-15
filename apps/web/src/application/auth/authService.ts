import type { User } from '@waqtify/types';
import type { AuthRepository } from '../../infrastructure/repositories/localAuthRepository';

export interface AuthResult {
  success: boolean;
  message?: string;
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthCredentials {
  name: string;
  email: string;
  passwordHash: string;
}

const createId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11);

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  getSessionState(): Pick<AuthResult, 'user' | 'isAuthenticated'> {
    const snapshot = this.repository.read();
    return {
      user: snapshot.currentUser,
      isAuthenticated: !!snapshot.currentUser,
    };
  }

  signup({ name, email, passwordHash }: AuthCredentials): AuthResult {
    const snapshot = this.repository.read();
    if (snapshot.registeredUsers.some((user) => user.email === email)) {
      return {
        success: false,
        message: 'Email already exists in system.',
        user: snapshot.currentUser,
        isAuthenticated: !!snapshot.currentUser,
      };
    }

    const newUser: User = {
      id: createId(),
      name,
      email,
      passwordHash,
    };

    this.repository.write({
      ...snapshot,
      registeredUsers: [...snapshot.registeredUsers, newUser],
      currentUser: newUser,
    });

    return { success: true, user: newUser, isAuthenticated: true };
  }

  login(email: string, passwordHash: string): AuthResult {
    const snapshot = this.repository.read();
    const found = snapshot.registeredUsers.find(
      (user) => user.email === email && user.passwordHash === passwordHash
    );

    if (!found) {
      return {
        success: false,
        message: 'Invalid email or password.',
        user: snapshot.currentUser,
        isAuthenticated: !!snapshot.currentUser,
      };
    }

    this.repository.write({
      ...snapshot,
      currentUser: found,
    });

    return { success: true, user: found, isAuthenticated: true };
  }

  loginGuest(): AuthResult {
    const snapshot = this.repository.read();
    const guestUser: User = {
      id: createId(),
      email: `guest_${createId()}@anonymous.local`,
      name: 'Guest User',
      passwordHash: 'none',
    };

    this.repository.write({
      ...snapshot,
      currentUser: guestUser,
    });

    return { success: true, user: guestUser, isAuthenticated: true };
  }

  logout(): Pick<AuthResult, 'user' | 'isAuthenticated'> {
    const snapshot = this.repository.read();
    this.repository.write({
      ...snapshot,
      currentUser: null,
    });

    return { user: null, isAuthenticated: false };
  }

  resetPassword(email: string, newPasswordHash: string): AuthResult {
    const snapshot = this.repository.read();
    const index = snapshot.registeredUsers.findIndex((user) => user.email === email);
    if (index === -1) {
      return {
        success: false,
        message: 'Email not found.',
        user: snapshot.currentUser,
        isAuthenticated: !!snapshot.currentUser,
      };
    }

    const updatedUsers = [...snapshot.registeredUsers];
    updatedUsers[index] = { ...updatedUsers[index], passwordHash: newPasswordHash };
    const nextCurrentUser =
      snapshot.currentUser?.id === updatedUsers[index].id ? updatedUsers[index] : snapshot.currentUser;

    this.repository.write({
      ...snapshot,
      registeredUsers: updatedUsers,
      currentUser: nextCurrentUser,
    });

    return {
      success: true,
      user: nextCurrentUser,
      isAuthenticated: !!nextCurrentUser,
    };
  }

  updateProfile(profile: Pick<User, 'name' | 'email'>): AuthResult {
    const snapshot = this.repository.read();
    const currentUser = snapshot.currentUser;
    if (!currentUser) {
      return { success: false, message: 'No active user.', user: null, isAuthenticated: false };
    }

    const emailTakenByAnotherUser = snapshot.registeredUsers.some(
      (user) => user.email === profile.email && user.id !== currentUser.id
    );
    if (emailTakenByAnotherUser) {
      return {
        success: false,
        message: 'Email already exists in system.',
        user: currentUser,
        isAuthenticated: true,
      };
    }

    const updatedUser: User = {
      ...currentUser,
      ...profile,
    };

    const updatedUsers = snapshot.registeredUsers.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );

    this.repository.write({
      ...snapshot,
      registeredUsers: updatedUsers,
      currentUser: updatedUser,
    });

    return { success: true, user: updatedUser, isAuthenticated: true };
  }
}
