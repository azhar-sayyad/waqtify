import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button, Input, Label } from '@waqtify/ui';
import { LayoutTemplate, Mail, KeyRound, ArrowLeft, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export function ForgotPassword() {
  const navigate = useNavigate();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* Decorative Left Progression Line */}
      <div className="hidden xl:flex absolute left-20 top-1/2 -translate-y-1/2 items-center rotate-[-90deg] origin-left opacity-30">
        <div className="w-12 h-1 bg-primary mr-4 rounded-full"></div>
        <span className="tracking-[0.3em] font-bold text-xs uppercase text-foreground">Recovery</span>
      </div>

      {/* Brand Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
           <LayoutTemplate className="w-8 h-8 text-primary" />
           <h1 className="text-3xl font-extrabold tracking-tight">Waqtify</h1>
        </div>
        <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">The Canvas of Consistency</p>
      </motion.div>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card/80 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
             <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Reset Password</h2>
            <p className="text-muted-foreground text-sm">Reset the local demo password for your account.</p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
             <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                 <Mail className="w-8 h-8 text-primary" />
             </div>
             <h3 className="font-bold text-lg mb-2">Check your inbox</h3>
             <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Your password for <span className="text-foreground font-semibold">{email}</span> has been updated. You can log in with the new password now.
             </p>
             <Button variant="outline" className="w-full h-12 rounded-xl" onClick={() => navigate('/auth/login')}>
                Return to Log In
             </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center font-medium">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  required 
                  type="email" 
                  placeholder="julian@example.com" 
                  className="pl-10 h-12 bg-secondary/30 border-transparent focus:border-primary transition-colors text-sm rounded-xl"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-1">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-secondary/30 border-transparent focus:border-primary transition-colors text-sm rounded-xl"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-1">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-secondary/30 border-transparent focus:border-primary transition-colors text-sm rounded-xl"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl mt-4 font-semibold">
              Update Password
            </Button>
          </form>
        )}

        {!submitted && (
          <div className="mt-8 pt-8 border-t border-border/50 flex flex-col items-center">
            <Link to="/auth/login" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
               <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
               I remember my password
            </Link>
          </div>
        )}
      </motion.div>

      {/* Footer Links */}
      <div className="mt-12 flex gap-8 text-[10px] font-bold tracking-widest uppercase text-muted-foreground relative z-10">
         <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
         <a href="#" className="hover:text-foreground transition-colors">Terms</a>
         <a href="#" className="hover:text-foreground transition-colors">Help Center</a>
      </div>
    </div>
  );
}
