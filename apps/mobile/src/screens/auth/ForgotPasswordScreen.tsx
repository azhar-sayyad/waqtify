import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '@waqtify/core';
import type { AuthStackParamList } from '../../navigation/types';
import type { AppTheme } from '../../theme';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

interface ForgotPasswordScreenProps {
  theme: AppTheme;
}

export function ForgotPasswordScreen({ theme }: ForgotPasswordScreenProps) {
  const navigation = useNavigation<Navigation>();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  return (
    <Screen theme={theme}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Reset password</Text>
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>
          Update the local password used for this demo account.
        </Text>

        {done ? (
          <>
            <Text style={[styles.success, { color: theme.success }]}>
              Password updated. You can log in now.
            </Text>
            <Pressable
              onPress={() => navigation.navigate('Login')}
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.primaryButtonText}>Back to Login</Text>
            </Pressable>
          </>
        ) : (
          <>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor={theme.mutedText}
              style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.cardAlt }]}
            />
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="New password"
              placeholderTextColor={theme.mutedText}
              style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.cardAlt }]}
            />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirm password"
              placeholderTextColor={theme.mutedText}
              style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.cardAlt }]}
            />

            {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}

            <Pressable
              onPress={async () => {
                setError('');
                if (newPassword !== confirmPassword) {
                  setError('Passwords do not match');
                  return;
                }

                const result = await resetPassword(email, newPassword);
                if (!result.success) {
                  setError(result.message || 'Unable to reset password');
                  return;
                }

                setDone(true);
              }}
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.primaryButtonText}>Update Password</Text>
            </Pressable>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
  },
  error: {
    fontSize: 13,
    fontWeight: '600',
  },
  success: {
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});

