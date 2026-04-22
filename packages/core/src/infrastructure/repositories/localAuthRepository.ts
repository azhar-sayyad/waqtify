import { UserSchema } from '@waqtify/types';
import { z } from 'zod';
import { readJsonFromStorage, writeJsonToStorage } from '../storage/localStorage';

const AUTH_STORAGE_KEY = 'waqtify.auth.v1';
const LEGACY_AUTH_STORAGE_KEY = 'waqtify-auth-storage';

const AuthSnapshotSchema = z.object({
  version: z.literal(1),
  registeredUsers: z.array(UserSchema),
  currentUser: UserSchema.nullable(),
});

const LegacyAuthStateSchema = z.object({
  state: z.object({
    user: UserSchema.nullable().optional(),
    registeredUsers: z.array(UserSchema).optional(),
    isAuthenticated: z.boolean().optional(),
  }),
});

export type AuthSnapshot = z.infer<typeof AuthSnapshotSchema>;

const defaultAuthSnapshot = (): AuthSnapshot => ({
  version: 1,
  registeredUsers: [],
  currentUser: null,
});

export interface AuthRepository {
  read(): AuthSnapshot;
  write(snapshot: AuthSnapshot): void;
}

const migrateLegacySnapshot = (): AuthSnapshot | null => {
  const legacyRaw = readJsonFromStorage(LEGACY_AUTH_STORAGE_KEY);
  const legacy = LegacyAuthStateSchema.safeParse(legacyRaw);
  if (!legacy.success) return null;

  return {
    version: 1,
    registeredUsers: legacy.data.state.registeredUsers || [],
    currentUser: legacy.data.state.isAuthenticated ? legacy.data.state.user || null : null,
  };
};

export class LocalAuthRepository implements AuthRepository {
  read(): AuthSnapshot {
    const parsed = AuthSnapshotSchema.safeParse(readJsonFromStorage(AUTH_STORAGE_KEY));
    if (parsed.success) {
      return parsed.data;
    }

    const migrated = migrateLegacySnapshot();
    if (migrated) {
      this.write(migrated);
      return migrated;
    }

    return defaultAuthSnapshot();
  }

  write(snapshot: AuthSnapshot): void {
    writeJsonToStorage(AUTH_STORAGE_KEY, snapshot);
  }
}
