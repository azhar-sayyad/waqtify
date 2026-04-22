import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '@waqtify/core';
import { useSettingsStore } from '@waqtify/core';
import type { AppTheme } from '../../theme';
import type { AppPreferences } from '../../types';

interface SettingsScreenProps {
  theme: AppTheme;
}

interface ProfileForm {
  name: string;
  email: string;
  theme: AppPreferences['theme'];
  notifications: boolean;
  dailyGoal: number;
}

const dailyGoals = [1, 3, 5, 7, 10];

export function SettingsScreen({ theme }: SettingsScreenProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const persistedSettings = useSettingsStore((state) => state.settings);
  const saveSettings = useSettingsStore((state) => state.saveSettings);
  const [form, setForm] = useState<ProfileForm>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    theme: persistedSettings.theme,
    notifications: persistedSettings.notifications,
    dailyGoal: persistedSettings.dailyGoal,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
      theme: persistedSettings.theme,
      notifications: persistedSettings.notifications,
      dailyGoal: persistedSettings.dailyGoal,
    });
  }, [user, persistedSettings]);

  return (
    <Screen theme={theme}>
      <View style={[styles.hero, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.heroTitle, { color: theme.text }]}>Settings</Text>
        <Text style={[styles.heroSubtitle, { color: theme.mutedText }]}>
          Personalize your account and app preferences.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Profile</Text>
        <TextInput
          value={form.name}
          onChangeText={(name) => setForm((current) => ({ ...current, name }))}
          placeholder="Display name"
          placeholderTextColor={theme.mutedText}
          style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.cardAlt }]}
        />
        <TextInput
          value={form.email}
          onChangeText={(email) => setForm((current) => ({ ...current, email }))}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email address"
          placeholderTextColor={theme.mutedText}
          style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.cardAlt }]}
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>
        <Text style={[styles.label, { color: theme.mutedText }]}>Theme</Text>
        <View style={styles.rowWrap}>
          {(['light', 'dark', 'system'] as const).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => setForm((current) => ({ ...current, theme: mode }))}
              style={[
                styles.chip,
                {
                  borderColor: form.theme === mode ? theme.primary : theme.border,
                  backgroundColor: form.theme === mode ? `${theme.primary}22` : theme.cardAlt,
                },
              ]}
            >
              <Text style={{ color: form.theme === mode ? theme.primary : theme.text }}>{mode}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.switchRow}>
          <Text style={[styles.label, { color: theme.mutedText }]}>Notifications</Text>
          <Switch
            value={form.notifications}
            onValueChange={(value) => setForm((current) => ({ ...current, notifications: value }))}
          />
        </View>

        <Text style={[styles.label, { color: theme.mutedText }]}>Daily Goal</Text>
        <View style={styles.rowWrap}>
          {dailyGoals.map((goal) => (
            <Pressable
              key={goal}
              onPress={() => setForm((current) => ({ ...current, dailyGoal: goal }))}
              style={[
                styles.chip,
                {
                  borderColor: form.dailyGoal === goal ? theme.primary : theme.border,
                  backgroundColor: form.dailyGoal === goal ? `${theme.primary}22` : theme.cardAlt,
                },
              ]}
            >
              <Text
                style={{
                  color: form.dailyGoal === goal ? theme.primary : theme.text,
                  fontWeight: '700',
                }}
              >
                {goal}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {message ? <Text style={[styles.message, { color: theme.success }]}>{message}</Text> : null}
      {error ? <Text style={[styles.message, { color: theme.danger }]}>{error}</Text> : null}

      <Pressable
        disabled={saving}
        onPress={async () => {
          setSaving(true);
          setMessage('');
          setError('');

          const result = await updateProfile({
            name: form.name.trim(),
            email: form.email.trim(),
          });

          if (!result.success) {
            setError(result.message || 'Failed to update profile');
            setSaving(false);
            return;
          }

          await saveSettings({
            theme: form.theme,
            notifications: form.notifications,
            dailyGoal: form.dailyGoal,
          });

          setSaving(false);
          setMessage('Settings saved');
        }}
        style={[styles.primaryButton, { backgroundColor: theme.primary }]}
      >
        <Text style={styles.primaryButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
      </Pressable>

      <Pressable
        onPress={logout}
        style={[styles.logoutButton, { borderColor: theme.border, backgroundColor: theme.cardAlt }]}
      >
        <Text style={[styles.logoutText, { color: theme.danger }]}>Log out</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 6,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    fontSize: 14,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  switchRow: {
    marginTop: 6,
    marginBottom: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontSize: 13,
    fontWeight: '700',
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  logoutButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '800',
  },
});

