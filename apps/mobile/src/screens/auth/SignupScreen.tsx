import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '@waqtify/core';
import type { AuthStackParamList } from '../../navigation/types';
import type { AppTheme } from '../../theme';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

interface SignupScreenProps {
  theme: AppTheme;
}

export function SignupScreen({ theme }: SignupScreenProps) {
  const navigation = useNavigation<Navigation>();
  const signup = useAuthStore((state) => state.signup);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Screen theme={theme}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Create account</Text>
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>
          Start building consistent routines.
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Full name"
          placeholderTextColor={theme.mutedText}
          style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.cardAlt }]}
        />
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
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
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
          disabled={loading}
          onPress={async () => {
            if (password !== confirmPassword) {
              setError('Passwords do not match');
              return;
            }

            setLoading(true);
            setError('');
            const result = await signup(name, email, password);
            setLoading(false);
            if (!result.success) {
              setError(result.message || 'Registration failed');
            }
          }}
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Creating...' : 'Create Account'}
          </Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.link, { color: theme.primary }]}>I already have an account</Text>
        </Pressable>
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
  link: {
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 2,
  },
});

