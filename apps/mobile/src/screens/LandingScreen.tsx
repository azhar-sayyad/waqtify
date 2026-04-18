import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { useAuthStore } from '../stores/authStore';
import type { AuthStackParamList } from '../navigation/types';
import type { AppTheme } from '../theme';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'Landing'>;

interface LandingScreenProps {
  theme: AppTheme;
}

export function LandingScreen({ theme }: LandingScreenProps) {
  const navigation = useNavigation<Navigation>();
  const loginGuest = useAuthStore((state) => state.loginGuest);
  const [loading, setLoading] = useState(false);

  return (
    <Screen theme={theme}>
      <View style={[styles.hero, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.brand, { color: theme.primary }]}>Waqtify</Text>
        <Text style={[styles.title, { color: theme.text }]}>Master your time, shape your life.</Text>
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>
          Track habits, measure streaks, and review analytics in one place.
        </Text>

        <Pressable
          disabled={loading}
          onPress={async () => {
            setLoading(true);
            await loginGuest();
            setLoading(false);
          }}
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Entering...' : 'Enter as Guest'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Login')}
          style={[styles.outlineButton, { borderColor: theme.border, backgroundColor: theme.cardAlt }]}
        >
          <Text style={[styles.outlineButtonText, { color: theme.text }]}>Sign In</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Signup')}>
          <Text style={[styles.linkText, { color: theme.primary }]}>
            Create a free account
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  brand: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  outlineButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  outlineButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});

