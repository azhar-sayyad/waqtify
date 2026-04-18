import React, { useEffect } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Text, View } from 'react-native';
import { LandingScreen } from '../screens/LandingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { DashboardScreen } from '../screens/app/DashboardScreen';
import { AnalyticsScreen } from '../screens/app/AnalyticsScreen';
import { SettingsScreen } from '../screens/app/SettingsScreen';
import { AddHabitScreen, EditHabitScreen } from '../screens/app/HabitFormScreen';
import { useAuthStore } from '../stores/authStore';
import { useHabitStore } from '../stores/habitStore';
import { useSettingsStore } from '../stores/settingsStore';
import { getTheme, resolveThemePreference, useSystemTheme } from '../theme';
import type {
  AppStackParamList,
  AppTabParamList,
  AuthStackParamList,
} from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tabs = createBottomTabNavigator<AppTabParamList>();

const getNavigationTheme = (mode: 'light' | 'dark', color: string): NavigationTheme => {
  const base = mode === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: color,
    },
  };
};

function MainTabs({ theme }: { theme: ReturnType<typeof getTheme> }) {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.mutedText,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
      }}
    >
      <Tabs.Screen name="Dashboard" options={{ title: 'Dashboard' }}>
        {() => <DashboardScreen theme={theme} />}
      </Tabs.Screen>
      <Tabs.Screen name="Analytics" options={{ title: 'Analytics' }}>
        {() => <AnalyticsScreen theme={theme} />}
      </Tabs.Screen>
      <Tabs.Screen name="Settings" options={{ title: 'Settings' }}>
        {() => <SettingsScreen theme={theme} />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  const authHydrated = useAuthStore((state) => state.hasHydrated);
  const habitHydrated = useHabitStore((state) => state.hasHydrated);
  const settingsHydrated = useSettingsStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loadHabits = useHabitStore((state) => state.loadForUser);
  const clearHabits = useHabitStore((state) => state.clear);
  const loadSettings = useSettingsStore((state) => state.loadForUser);
  const clearSettings = useSettingsStore((state) => state.clear);
  const themePreference = useSettingsStore((state) => state.settings.theme);
  const systemTheme = useSystemTheme();
  const resolvedTheme = resolveThemePreference(themePreference, systemTheme);
  const theme = getTheme(resolvedTheme);
  const navTheme = getNavigationTheme(theme.mode, theme.primary);

  useEffect(() => {
    if (user?.id) {
      loadHabits(user.id);
      loadSettings(user.id);
      return;
    }

    clearHabits();
    clearSettings();
  }, [clearHabits, clearSettings, loadHabits, loadSettings, user?.id]);

  if (!authHydrated || !habitHydrated || !settingsHydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.background,
          gap: 10,
        }}
      >
        <ActivityIndicator color={theme.primary} />
        <Text style={{ color: theme.mutedText }}>Loading Waqtify...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {!isAuthenticated ? (
        <AuthStack.Navigator
          initialRouteName="Landing"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.background },
          }}
        >
          <AuthStack.Screen name="Landing">
            {() => <LandingScreen theme={theme} />}
          </AuthStack.Screen>
          <AuthStack.Screen name="Login">{() => <LoginScreen theme={theme} />}</AuthStack.Screen>
          <AuthStack.Screen name="Signup">{() => <SignupScreen theme={theme} />}</AuthStack.Screen>
          <AuthStack.Screen name="ForgotPassword">
            {() => <ForgotPasswordScreen theme={theme} />}
          </AuthStack.Screen>
        </AuthStack.Navigator>
      ) : (
        <AppStack.Navigator
          initialRouteName="Tabs"
          screenOptions={{
            headerStyle: { backgroundColor: theme.card },
            headerTintColor: theme.text,
            contentStyle: { backgroundColor: theme.background },
          }}
        >
          <AppStack.Screen
            name="Tabs"
            options={{ headerShown: false }}
          >
            {() => <MainTabs theme={theme} />}
          </AppStack.Screen>
          <AppStack.Screen name="AddHabit" options={{ title: 'Add Habit' }}>
            {() => <AddHabitScreen theme={theme} />}
          </AppStack.Screen>
          <AppStack.Screen name="EditHabit" options={{ title: 'Edit Habit' }}>
            {() => <EditHabitScreen theme={theme} />}
          </AppStack.Screen>
        </AppStack.Navigator>
      )}
    </NavigationContainer>
  );
}

