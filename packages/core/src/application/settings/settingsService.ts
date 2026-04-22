import type { AppPreferences } from '../../domain/settings/types';
import type { SettingsRepository } from '../../infrastructure/repositories/localSettingsRepository';

export class SettingsService {
  constructor(private readonly repository: SettingsRepository) {}

  getUserSettings(userId: string): AppPreferences {
    return this.repository.getUserSettings(userId);
  }

  saveUserSettings(userId: string, settings: AppPreferences): AppPreferences {
    return this.repository.saveUserSettings(userId, settings);
  }
}
