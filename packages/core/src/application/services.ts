import { AuthService } from './auth/authService';
import { HabitService } from './habits/habitService';
import { SettingsService } from './settings/settingsService';
import { NotificationService } from './notifications/notificationService';
import { LocalAuthRepository } from '../infrastructure/repositories/localAuthRepository';
import { LocalHabitRepository } from '../infrastructure/repositories/localHabitRepository';
import { LocalSettingsRepository } from '../infrastructure/repositories/localSettingsRepository';

export const authService = new AuthService(new LocalAuthRepository());
export const habitService = new HabitService(new LocalHabitRepository());
export const settingsService = new SettingsService(new LocalSettingsRepository());
export const notificationService = new NotificationService();
