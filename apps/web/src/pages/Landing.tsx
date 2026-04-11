import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@waqtify/ui';

export function Landing() {
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleBypass = async () => {
    // Generate a secure anonymous session
    const randomGuestId = "guest_" + Math.random().toString(36).substring(2, 9);
    await login(`${randomGuestId}@anonymous.local`);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background blobs for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />

      <main className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 flex flex-col items-center"
        >
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
            Welcome to the Beta
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Master your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Time</span>,<br/>
            Shape your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">Life</span>.
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-8">
            Waqtify is an offline-first, blazing fast habit tracking ecosystem.
            Eliminate friction, visualize your streaks with beautiful analytics, and never break the chain.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button size="lg" className="h-12 px-8 text-md shadow-lg" onClick={handleBypass}>
              Enter as Guest (No Signup)
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-md" onClick={() => navigate('/auth/login')}>
              Sign In
            </Button>
          </div>
        </motion.div>
      </main>

      <footer className="absolute bottom-8 text-sm text-muted-foreground">
        Built with React 19, Turborepo, and Tailwind CSS v4.
      </footer>
    </div>
  );
}
