import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '../../stores/authStore';
import type { AuthStackParamList } from '../../navigation/types';
import type { AppTheme } from '../../theme';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  theme: AppTheme;
}

export function LoginScreen({ theme }: LoginScreenProps) {
  const navigation = useNavigation<Navigation>();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Screen theme={theme}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>
          Sign in to continue tracking your habits.
        </Text>

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

        {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}

        <Pressable
          disabled={loading}
          onPress={async () => {
            setLoading(true);
            setError('');
            const result = await login(email, password);
            setLoading(false);
            if (!result.success) {
              setError(result.message || 'Login failed');
            }
          }}
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.primaryButtonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={[styles.link, { color: theme.primary }]}>Forgot password?</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Signup')}>
          <Text style={[styles.link, { color: theme.primary }]}>Create account</Text>
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

