import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, useHabitStore, useSettingsStore } from '@waqtify/core';
import { applyResolvedTheme, useResolvedTheme } from './lib/theme';
import { Dashboard } from './pages/Dashboard';
import { Landing } from './pages/Landing';
import { Analytics } from './pages/Analytics';
import { AddHabit } from './pages/AddHabit';
import { EditHabit } from './pages/EditHabit';
import { Settings } from './pages/Settings';
import { AppLayout } from './layouts/AppLayout';

import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';

const StoreBootstrapper = () => {
  const userId = useAuthStore((state) => state.user?.id ?? null);

  useEffect(() => {
    if (userId) {
      useHabitStore.getState().loadForUser(userId);
      useSettingsStore.getState().loadForUser(userId);
      return;
    }

    useHabitStore.getState().clear();
    useSettingsStore.getState().clear();
  }, [userId]);

  return null;
};

const ThemeBootstrapper = () => {
  const themePreference = useSettingsStore((state) => state.settings.theme);
  const resolvedTheme = useResolvedTheme(themePreference);

  useEffect(() => {
    applyResolvedTheme(resolvedTheme);
  }, [resolvedTheme]);

  return null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (!isAuthenticated) return <Navigate to="/landing" replace />;
  return <AppLayout>{children}</AppLayout>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <StoreBootstrapper />
      <ThemeBootstrapper />
      <Routes>
        {/* Core Auth & Landing Routes */}
        <Route path="/landing" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/auth/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/auth/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/auth/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        
        {/* Dashboard Endpoints (Wrapped in AppLayout via ProtectedRoute) */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/add-habit" element={<ProtectedRoute><AddHabit /></ProtectedRoute>} />
        <Route path="/edit-habit/:id" element={<ProtectedRoute><EditHabit /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
