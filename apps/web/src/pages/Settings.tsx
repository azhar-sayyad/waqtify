import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Mail, Shield, Moon, Sun, Bell, Save, AlertCircle, CheckCircle, Target, Trash2, Download, Upload } from 'lucide-react';
import { Button, Input, Label, Badge } from '@waqtify/ui';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { applyThemePreference } from '../lib/theme';

interface UserProfile {
  name: string;
  email: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  dailyGoal: number;
}

export function Settings() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const persistedSettings = useSettingsStore((state) => state.settings);
  const saveSettings = useSettingsStore((state) => state.saveSettings);
  const [profile, setProfile] = useState<UserProfile>(() => ({
    name: user?.name ?? 'User',
    email: user?.email ?? 'user@example.com',
    theme: persistedSettings.theme,
    notifications: persistedSettings.notifications,
    dailyGoal: persistedSettings.dailyGoal,
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfile({
      name: user.name,
      email: user.email,
      theme: persistedSettings.theme,
      notifications: persistedSettings.notifications,
      dailyGoal: persistedSettings.dailyGoal,
    });
  }, [user, persistedSettings]);

  useEffect(() => {
    applyThemePreference(profile.theme);
  }, [profile.theme]);

  useEffect(() => {
    return () => {
      applyThemePreference(persistedSettings.theme);
    };
  }, [persistedSettings.theme]);

  const handleSave = async () => {
    setIsSaving(true);
    setShowSuccess(false);
    setErrorMessage('');

    try {
      const profileResult = await updateProfile({
        name: profile.name.trim(),
        email: profile.email.trim(),
      });

      if (!profileResult.success) {
        throw new Error(profileResult.message || 'Failed to update profile');
      }

      await saveSettings({
        theme: profile.theme,
        notifications: profile.notifications,
        dailyGoal: profile.dailyGoal,
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save settings.';
      setErrorMessage(message);
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-background border border-primary/20 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
              <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <SettingsIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Account Settings</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Personalize Your Experience</h1>
            <p className="text-muted-foreground max-w-xl">
              Configure your preferences, manage your account, and customize Waqtify to fit your workflow.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="gap-2 shadow-sm hover:shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </section>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 shadow-lg backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="font-semibold text-emerald-500">Settings saved successfully!</p>
              <p className="text-sm text-emerald-400">Your preferences have been updated.</p>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Profile Section */}
        <section className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">Profile</span>
                </div>
                <h2 className="text-lg font-bold tracking-tight">Personal Information</h2>
                <p className="text-sm text-muted-foreground">Update your account details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                <span>Use the same email here that you use to sign in locally.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Preferences</span>
                </div>
                <h2 className="text-lg font-bold tracking-tight">Application Settings</h2>
                <p className="text-sm text-muted-foreground">Customize your Waqtify experience</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  <span>Theme</span>
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
                    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
                    { value: 'system', label: 'System', icon: <SettingsIcon className="w-4 h-4" /> },
                  ].map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => handleInputChange('theme', theme.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        profile.theme === theme.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/50 hover:border-border/70 hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {theme.icon}
                        <span className="text-sm font-medium">{theme.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-500" />
                  <span>Notifications</span>
                </Label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleInputChange('notifications', !profile.notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profile.notifications ? 'bg-primary' : 'bg-border/50'
                    }`}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profile.notifications ? 'translate-x-3' : 'translate-x-1'
                      }`} 
                    />
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {profile.notifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* Daily Goal */}
              <div className="space-y-3">
                <Label htmlFor="dailyGoal" className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  <span>Daily Goal</span>
                </Label>
                <div className="flex gap-2">
                  {[1, 3, 5, 7, 10].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => handleInputChange('dailyGoal', goal)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        profile.dailyGoal === goal
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                          : 'border-border/50 hover:border-border/70 hover:bg-secondary/50'
                      }`}
                    >
                      {goal} habits
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Info */}
        <section className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Account</span>
                </div>
                <h2 className="text-lg font-bold tracking-tight">Account Information</h2>
                <p className="text-sm text-muted-foreground">Your account details and status</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Member Since</Label>
                  <p className="text-sm font-medium">Demo User</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Account Type</Label>
                  <Badge variant="secondary" className="text-sm">Free</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Current Theme</Label>
                  <p className="text-sm font-medium capitalize">{profile.theme}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Daily Goal</Label>
                  <p className="text-sm font-medium">{profile.dailyGoal} habits</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Reset Settings
                </Button>
                <Button variant="destructive" className="flex-1 gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear Data
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* App Info */}
        <section className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <SettingsIcon className="w-4 h-4 text-purple-500" />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">App Info</span>
                </div>
                <h2 className="text-lg font-bold tracking-tight">Application Details</h2>
                <p className="text-sm text-muted-foreground">Version and development information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Version</Label>
                  <p className="text-sm font-medium">1.0.0 (Demo)</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Status</Label>
                  <Badge variant="outline" className="text-sm">Development</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Storage</Label>
                <p className="text-sm text-muted-foreground">
                  Local storage is used for this demo version. Your data is saved locally in your browser.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Backend</Label>
                <p className="text-sm text-muted-foreground">
                  Backend integration is planned for future development. Currently using mock data and localStorage.
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Upload className="w-4 h-4" />
                  Import Data
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
