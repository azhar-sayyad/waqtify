import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Label } from '@waqtify/ui';
import { LayoutTemplate, User, Mail, Lock, ShieldCheck, ArrowRight, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export function Signup() {
  const signup = useAuthStore(state => state.signup);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await signup(email, password, name);
    if (!res.success) setError(res.message || 'Registration failed');
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[50%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />

      {/* Decorative Left Progression Line */}
      <div className="hidden xl:flex absolute left-20 top-1/2 -translate-y-1/2 items-center rotate-[-90deg] origin-left opacity-30">
        <div className="w-12 h-1 bg-primary mr-4 rounded-full"></div>
        <span className="tracking-[0.3em] font-bold text-xs uppercase text-foreground">Progression</span>
      </div>

      {/* Decorative Bottom Right Quote */}
      <div className="hidden lg:block absolute bottom-12 right-12 bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-2xl max-w-sm shadow-xl">
        <div className="w-8 h-1 bg-primary rounded-full mb-4"></div>
        <p className="text-foreground/90 font-medium text-lg leading-relaxed mb-4">
          "The secret of your future is hidden in your daily routine."
        </p>
        <p className="text-muted-foreground text-sm flex items-center gap-2">
          <span className="w-2 h-[1px] bg-muted-foreground/50"></span> Mike Murdock
        </p>
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Start your journey</h2>
          <p className="text-muted-foreground text-sm">Design your life, one mindful choice at a time.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-1">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                required 
                placeholder="e.g. Julian Gray" 
                className="pl-10 h-12 bg-secondary/30 border-transparent focus:border-primary transition-colors text-sm rounded-xl"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  required 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-12 bg-secondary/30 border-transparent focus:border-primary transition-colors text-sm rounded-xl"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-1">Confirm</Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  required 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-12 bg-secondary/30 border-transparent focus:border-primary transition-colors text-sm rounded-xl"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 pt-2 cursor-pointer group">
             <div className="w-4 h-4 rounded border border-muted-foreground/50 group-hover:border-primary flex items-center justify-center transition-colors">
               <input type="checkbox" required className="w-full h-full opacity-0 cursor-pointer" />
             </div>
             <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
               I agree to the <a href="#" className="font-semibold text-foreground hover:underline">Terms of Service</a>
             </span>
          </label>

          <Button type="submit" className="w-full h-12 rounded-xl mt-4 font-semibold group flex items-center justify-center gap-2">
            Create Account
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-border/50 flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-4">Already have an account?</p>
          <Button variant="outline" className="rounded-full px-8 h-10 border-border hover:bg-secondary transition-colors" onClick={() => navigate('/auth/login')}>
             Log In
          </Button>
        </div>
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
