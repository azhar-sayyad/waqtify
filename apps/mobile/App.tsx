import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import * as Notifications from 'expo-notifications';
import { notificationService } from '@waqtify/core';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Set platform-specific implementations
notificationService.setSendNotificationImpl(async (title: string, body: string, data?: any) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
    },
    trigger: null, // Immediate
  });
});

notificationService.setRequestPermissionsImpl(async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
});

// Request permissions on app start
Notifications.requestPermissionsAsync();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
