import { Habit } from '@waqtify/types';

export class NotificationService {
  private scheduledReminders: Map<string, NodeJS.Timeout> = new Map();
  private sendNotificationImpl?: (title: string, body: string, data?: any) => Promise<void>;
  private requestPermissionsImpl?: () => Promise<boolean>;

  setSendNotificationImpl(impl: (title: string, body: string, data?: any) => Promise<void>): void {
    this.sendNotificationImpl = impl;
  }

  setRequestPermissionsImpl(impl: () => Promise<boolean>): void {
    this.requestPermissionsImpl = impl;
  }

  // Platform-specific notification sending
  async sendNotification(title: string, body: string, data?: any): Promise<void> {
    if (!this.sendNotificationImpl) {
      throw new Error('sendNotificationImpl not set');
    }
    return this.sendNotificationImpl(title, body, data);
  }

  async requestPermissions(): Promise<boolean> {
    if (!this.requestPermissionsImpl) {
      return true; // Default to true if not set
    }
    return this.requestPermissionsImpl();
  }

  scheduleHabitReminder(habit: Habit): void {
    if (!habit.reminderEnabled) return;

    this.cancelHabitReminder(habit.id);

    const now = new Date();
    let nextReminderTime: Date | null = null;

    if (habit.reminderFrequency) {
      // Recurring reminder
      const [hours, minutes] = habit.reminderTime?.split(':').map(Number) || [9, 0];
      const startTime = new Date();
      startTime.setHours(hours, minutes, 0, 0);

      if (startTime <= now) {
        // Next occurrence
        const intervalMs = habit.reminderFrequency.unit === 'hours'
          ? habit.reminderFrequency.interval * 60 * 60 * 1000
          : habit.reminderFrequency.interval * 24 * 60 * 60 * 1000;
        nextReminderTime = new Date(startTime.getTime() + intervalMs);
      } else {
        nextReminderTime = startTime;
      }

      // Schedule recurring
      const intervalId = setInterval(() => {
        this.sendNotification(
          `Reminder: ${habit.name}`,
          `Time for your habit: ${habit.name}`,
          { habitId: habit.id, type: 'reminder' }
        );
      }, habit.reminderFrequency.unit === 'hours'
        ? habit.reminderFrequency.interval * 60 * 60 * 1000
        : habit.reminderFrequency.interval * 24 * 60 * 60 * 1000);

      this.scheduledReminders.set(habit.id, intervalId);
    } else if (habit.reminderTime) {
      // Daily reminder
      const [hours, minutes] = habit.reminderTime.split(':').map(Number);
      nextReminderTime = new Date();
      nextReminderTime.setHours(hours, minutes, 0, 0);

      if (nextReminderTime <= now) {
        nextReminderTime.setDate(nextReminderTime.getDate() + 1);
      }

      const timeoutId = setTimeout(() => {
        this.sendNotification(
          `Reminder: ${habit.name}`,
          `Time for your daily habit: ${habit.name}`,
          { habitId: habit.id, type: 'reminder' }
        );
        // Reschedule for next day
        this.scheduleHabitReminder(habit);
      }, nextReminderTime.getTime() - now.getTime());

      this.scheduledReminders.set(habit.id, timeoutId);
    }
  }

  cancelHabitReminder(habitId: string): void {
    const timer = this.scheduledReminders.get(habitId);
    if (timer) {
      clearTimeout(timer);
      clearInterval(timer);
      this.scheduledReminders.delete(habitId);
    }
  }

  cancelAllReminders(): void {
    for (const [habitId, timer] of this.scheduledReminders) {
      clearTimeout(timer);
      clearInterval(timer);
    }
    this.scheduledReminders.clear();
  }

  // Check for missed habits and send notifications
  async checkMissedHabits(habits: Habit[], habitLogs: any[]): Promise<void> {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    for (const habit of habits) {
      if (!habit.reminderEnabled) continue;

      // Check if habit was supposed to be done today
      const log = habitLogs.find(log => log.habitId === habit.id && log.date === today);
      if (!log || !log.completed) {
        // Missed habit
        await this.sendNotification(
          `Missed Habit: ${habit.name}`,
          `You haven't completed ${habit.name} today. Stay consistent!`,
          { habitId: habit.id, type: 'missed' }
        );
      }
    }
  }
}