import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@waqtify/ui';
import {
  BarChart3, Calendar, Flame, LayoutTemplate,
  Bell, Droplets, BookOpen, ArrowRight,
  CheckCircle2, TrendingUp, Zap, Target, Shield, Star,
  Activity, Brain, Clock, ChevronRight
} from 'lucide-react';

// ─── Animated counter ───────────────────────────────────────────────────────
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0 });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    springValue.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.floor(v).toLocaleString() + suffix;
    });
  }, [springValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

// ─── Fade-up wrapper ─────────────────────────────────────────────────────────
const FadeUp = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── Section label ────────────────────────────────────────────────────────────
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-5">
    {children}
  </div>
);

export function Landing() {
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleBypass = async () => {
    const randomGuestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    await login(`${randomGuestId}@anonymous.local`);
    navigate('/');
  };

  const featureTags = ['Daily Habits', 'Streak Tracking', 'Analytics', 'Reminders', 'Progress Maps', 'Goal Setting'];

  const statsData = [
    { number: 20000, suffix: '+', label: 'Active Users', icon: <Activity className="w-5 h-5" /> },
    { number: 85, suffix: '%', label: 'Avg. Completion Rate', icon: <TrendingUp className="w-5 h-5" /> },
    { number: 4200000, suffix: '+', label: 'Habits Completed', icon: <CheckCircle2 className="w-5 h-5" /> },
    { number: 42, suffix: ' Days', label: 'Avg. Longest Streak', icon: <Flame className="w-5 h-5" /> },
  ];

  const featureHighlights = [
    {
      label: 'Track',
      title: 'Frictionless Daily Tracking',
      desc: 'Log your progress in seconds with our minimalist entry system. Whether it\'s a simple toggle or a quantitative metric, we make tracking feel like a reward, not a chore.',
      bullets: ['One-tap check-ins', 'Custom metrics & units', 'Offline-first architecture'],
      icon: <Calendar className="w-7 h-7 text-primary" />,
      mockup: (
        <div className="space-y-3 p-6 bg-card border border-border/40 rounded-2xl">
          {[
            { name: 'Morning Hydration', icon: <Droplets className="w-4 h-4 text-blue-400" />, pct: 80, done: true, color: 'bg-blue-500' },
            { name: '10 Min Meditation', icon: <Brain className="w-4 h-4 text-purple-400" />, pct: 50, done: false, color: 'bg-purple-500' },
            { name: 'Deep Work Session', icon: <BookOpen className="w-4 h-4 text-pink-400" />, pct: 0, done: false, color: 'bg-pink-500' },
          ].map((h) => (
            <div key={h.name} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-border/40">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">{h.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{h.name}</p>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-background overflow-hidden">
                  <div className={`h-full rounded-full ${h.color}`} style={{ width: `${h.pct}%` }} />
                </div>
              </div>
              {h.done
                ? <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-white" /></div>
                : <div className="w-6 h-6 rounded-full border-2 border-border shrink-0" />}
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Analyze',
      title: 'Behavioral Analytics',
      desc: 'Understand the "why" behind your success. Visualize correlations, identify peak performance windows, and get a bird\'s-eye view of your long-term transformation journey.',
      bullets: ['GitHub-style contribution map', 'Weekly & monthly reports', 'Habit correlation insights'],
      icon: <BarChart3 className="w-7 h-7 text-purple-400" />,
      flip: true,
      mockup: (
        <div className="p-6 bg-card border border-border/40 rounded-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Weekly Overview</p>
          <div className="flex items-end gap-2 h-28 mb-4">
            {[35, 55, 42, 78, 90, 65, 88].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${h}%`,
                    background: `hsl(${221 + i * 10}deg 83% 53%)`,
                    opacity: 0.6 + i * 0.06,
                  }}
                />
                <span className="text-[9px] text-muted-foreground">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <div className="flex-1 p-3 bg-secondary/40 rounded-xl text-center">
              <p className="text-xl font-black text-primary">85%</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Completion</p>
            </div>
            <div className="flex-1 p-3 bg-secondary/40 rounded-xl text-center">
              <p className="text-xl font-black text-orange-400">24</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Day Streak</p>
            </div>
            <div className="flex-1 p-3 bg-secondary/40 rounded-xl text-center">
              <p className="text-xl font-black text-green-400">↑12%</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">vs Last Wk</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: 'Stay on Track',
      title: 'Context-Aware Reminders',
      desc: 'Gentle nudges that respect your focus. Waqtify learns your schedule and surfaces the right habit at the right moment — only when you\'re most likely to follow through.',
      bullets: ['Smart time-based triggers', 'Streak protection alerts', 'Focus-mode respectful'],
      icon: <Bell className="w-7 h-7 text-blue-400" />,
      mockup: (
        <div className="space-y-3 p-6 bg-card border border-border/40 rounded-2xl">
          {[
            { time: '07:00 AM', habit: 'Morning Hydration', tag: 'Health', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { time: '12:30 PM', habit: 'Mindful Breathing', tag: 'Wellness', color: 'text-green-400', bg: 'bg-green-500/10' },
            { time: '09:00 PM', habit: 'Read 20 Pages', tag: 'Learning', color: 'text-orange-400', bg: 'bg-orange-500/10' },
          ].map((r) => (
            <div key={r.habit} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-border/40">
              <div className={`shrink-0 w-9 h-9 rounded-lg ${r.bg} flex items-center justify-center`}>
                <Bell className={`w-4 h-4 ${r.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{r.habit}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{r.time} · {r.tag}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.bg} ${r.color}`}>Set</span>
            </div>
          ))}
          <div className="mt-2 p-3 bg-primary/10 border border-primary/30 rounded-xl flex items-center gap-3">
            <Zap className="w-4 h-4 text-primary shrink-0" />
            <p className="text-xs text-primary font-medium">AI suggests: best time for Journal is 10 PM based on your pattern.</p>
          </div>
        </div>
      ),
    },
  ];

  const testimonials = [
    {
      quote: "Finally, a habit tracker that doesn't feel like a spreadsheet. It feels like a beautiful space where I can actually think and grow intentionally.",
      name: 'Elena Rodriguez',
      role: 'Product Designer @ Linear',
      avatar: 'https://i.pravatar.cc/100?img=5',
      stars: 5,
    },
    {
      quote: "The streak system is genuinely addictive in the best possible way. I've maintained a 60-day reading habit because I can't bear to break the chain.",
      name: 'Marcus Chen',
      role: 'Software Engineer @ Vercel',
      avatar: 'https://i.pravatar.cc/100?img=11',
      stars: 5,
    },
    {
      quote: "The analytics blew my mind. I could see that I was most productive on Wednesday mornings, and I restructured my whole week around that insight.",
      name: 'Aisha Kamara',
      role: 'Founder @ Bloom Studio',
      avatar: 'https://i.pravatar.cc/100?img=9',
      stars: 5,
    },
  ];

  const brands = ['Notion', 'Linear', 'Figma', 'Vercel', 'Stripe', 'Loom', 'Framer', 'Arc'];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans selection:bg-primary/30">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-3 inset-x-3 z-50 border border-border/40 bg-background/60 backdrop-blur-xl rounded-2xl shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-primary" />
              <span className="font-bold text-base tracking-tight">Waqtify</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <span className="text-foreground border-b-2 border-primary pb-0.5 cursor-pointer">Product</span>
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Features</span>
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Pricing</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm hidden sm:flex" onClick={() => navigate('/auth/login')}>
              Log in
            </Button>
            <Button size="sm" className="text-sm px-5" onClick={handleBypass}>
              Get started free <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-28 pb-20">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start text-left"
          >
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6 tracking-wider uppercase">
              ✨ Advanced Analytics 2.0 — Now Live
            </div>

            <h1 className="text-5xl lg:text-[4.5rem] font-extrabold tracking-tight mb-6 leading-[1.08]">
              Master your{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Time</span>,
              <br />
              Shape your{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-400">Life</span>.
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Experience the art of intentional living. Waqtify helps you track progress with editorial clarity, turning daily routines into lasting transformation.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8 w-full sm:w-auto">
              <Button size="lg" className="h-12 px-8 text-base shadow-[0_0_30px_-3px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_-3px_rgba(59,130,246,0.6)] transition-shadow" onClick={handleBypass}>
                Get Started for Free
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm" onClick={() => navigate('/auth/login')}>
                Sign In
              </Button>
            </div>

            {/* Feature tag chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {featureTags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/60 border border-border/60 text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-background overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span>Joined by <strong className="text-foreground">20,000+</strong> mindful achievers</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:ml-6"
          >
            {/* Mock Dashboard Widget */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-2xl relative z-10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold tracking-tight">Today's Canvas</h3>
                <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">April 12</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Morning Hydration', sub: 'Health · 8/10 glasses', icon: <Droplets className="w-5 h-5" />, color: 'blue', pct: 80, done: true },
                  { name: '10 Min Meditation', sub: 'Health · 12 Day Streak', icon: <Brain className="w-5 h-5" />, color: 'purple', pct: 50, done: false },
                  { name: 'Deep Work Session', sub: 'Study · 08:00 AM', icon: <BookOpen className="w-5 h-5" />, color: 'pink', pct: 0, done: false },
                ].map((h) => (
                  <div key={h.name} className={`flex items-center gap-4 p-3 rounded-xl border border-border/50 ${h.done ? 'bg-secondary/40' : 'bg-background'}`}>
                    <div className={`w-10 h-10 rounded-lg bg-${h.color}-500/20 text-${h.color}-400 flex items-center justify-center shrink-0`}>{h.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{h.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{h.sub}</p>
                      <div className="w-full bg-background h-1 rounded-full mt-2 overflow-hidden">
                        <div className={`bg-${h.color}-500 h-full rounded-full transition-all`} style={{ width: `${h.pct}%` }} />
                      </div>
                    </div>
                    {h.done
                      ? <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-white" /></div>
                      : <div className="w-6 h-6 rounded-full border-2 border-border shrink-0" />}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-border/50 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">85%</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Completion Rate</p>
                </div>
                <div className="flex gap-1.5 h-10 items-end">
                  {[40, 60, 80, 100, 70].map((h, i) => (
                    <div key={i} className="w-2 bg-primary rounded-t-sm" style={{ height: `${h}%`, opacity: 0.3 + i * 0.15 }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Stats mini-card floating */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -right-6 -bottom-6 bg-card border border-border/60 rounded-xl p-4 shadow-xl backdrop-blur-xl z-20 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-xl font-black text-orange-400">24</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Day Streak</p>
              </div>
            </motion.div>

            <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl blur-xl -z-10" />
          </motion.div>
        </section>

        {/* ── Social Proof Bar ─────────────────────────────────────────────── */}
        <section className="border-y border-border/40 bg-secondary/20 py-8 mb-32 overflow-hidden">
          <FadeUp>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Loved by teams at
            </p>
          </FadeUp>
          <div className="flex items-center gap-12 px-6 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
              {[...brands, ...brands].map((brand, i) => (
                <span key={i} className="text-muted-foreground/50 font-bold text-lg tracking-tight hover:text-muted-foreground transition-colors shrink-0 cursor-default">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats Section ─────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <FadeUp className="text-center mb-14">
            <SectionLabel><TrendingUp className="w-3.5 h-3.5" /> Impact</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Numbers that speak<br />for themselves</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Real results from real people building real habits, one day at a time.</p>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, i) => (
              <FadeUp key={stat.label} delay={i * 0.1}>
                <div className="bg-card border border-border/50 rounded-2xl p-8 text-center group hover:border-primary/40 transition-all hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    {stat.icon}
                  </div>
                  <p className="text-4xl lg:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-purple-500 mb-2">
                    <AnimatedNumber value={stat.number} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── Bento Features Grid ───────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <FadeUp className="text-center mb-14">
            <SectionLabel><Zap className="w-3.5 h-3.5" /> Features</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Precision-Engineered<br />for Progress</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We've stripped away the noise to leave you with features that actually matter for lasting behavioral change.</p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Big card: Daily Tracking */}
            <FadeUp delay={0} className="md:col-span-2">
              <div className="h-full relative bg-card border border-border/50 p-8 rounded-3xl overflow-hidden group hover:border-primary/40 transition-all">
                <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
                <Calendar className="w-8 h-8 text-primary mb-5" />
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Frictionless Daily Tracking</h3>
                <p className="text-muted-foreground max-w-md leading-relaxed mb-6">Log your progress in seconds. Whether it's a simple toggle or a quantitative metric, we make tracking feel like a reward.</p>
                <div className="flex flex-wrap gap-2">
                  {['One-tap check-ins', 'Custom metrics', 'Offline-first'].map((f) => (
                    <span key={f} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary">{f}</span>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Streak accent card */}
            <FadeUp delay={0.1}>
              <div className="h-full bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-lg">
                <div className="absolute top-[-20%] right-[-20%] w-full h-full bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <Flame className="w-8 h-8 text-orange-300 mb-5" />
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Momentum Engine</h3>
                  <p className="text-blue-100 leading-relaxed text-sm">Don't break the chain. Our streaks motivate through positive reinforcement, not guilt.</p>
                </div>
                <div className="relative z-10 mt-8">
                  <p className="text-5xl font-black tracking-tight">24 Days</p>
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-200 mt-1">Personal Best Streak</p>
                </div>
              </div>
            </FadeUp>

            {/* Analytics card */}
            <FadeUp delay={0.15}>
              <div className="h-full bg-card border border-border/50 p-8 rounded-3xl flex flex-col justify-between hover:border-primary/40 transition-all group">
                <div>
                  <BarChart3 className="w-8 h-8 text-purple-400 mb-5" />
                  <h3 className="text-xl font-bold mb-3 tracking-tight">Behavioral Analytics</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">Understand the "why" behind your success. Visualize correlations and identify peak performance windows.</p>
                </div>
                <div className="flex items-end gap-1.5 h-16 w-full">
                  {[30, 50, 70, 45, 85, 60, 100].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm bg-purple-500 group-hover:bg-purple-400 transition-colors" style={{ height: `${h}%`, opacity: 0.3 + i * 0.1 }} />
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Reminders card spans 2 */}
            <FadeUp delay={0.2} className="md:col-span-2">
              <div className="h-full bg-secondary/50 border border-border/50 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 hover:border-primary/40 transition-all">
                <div className="flex-1">
                  <Bell className="w-8 h-8 text-blue-400 mb-5" />
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Context-Aware Reminders</h3>
                  <p className="text-muted-foreground leading-relaxed">Gentle nudges that respect your focus. Waqtify learns your schedule and suggests actions when you're most likely to follow through.</p>
                </div>
                <div className="w-full md:w-64 bg-background border border-border rounded-2xl p-5 shadow-sm shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suggested Now</span>
                  </div>
                  <p className="font-bold">Focus: Meditation</p>
                  <p className="text-xs text-muted-foreground mt-1">Based on your calm morning routine</p>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 text-xs bg-primary text-primary-foreground py-1.5 rounded-lg font-medium">Start</button>
                    <button className="flex-1 text-xs bg-secondary text-muted-foreground py-1.5 rounded-lg font-medium">Snooze</button>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Goal setting mini card */}
            <FadeUp delay={0.1}>
              <div className="h-full bg-card border border-border/50 p-8 rounded-3xl hover:border-primary/40 transition-all group flex flex-col justify-between">
                <div>
                  <Target className="w-8 h-8 text-pink-400 mb-5" />
                  <h3 className="text-xl font-bold mb-3 tracking-tight">Goal Architecture</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Set ambitious targets and break them into daily micro-actions that compound over time.</p>
                </div>
                <div className="mt-6 space-y-2">
                  {[{ label: 'Read 12 Books', pct: 67, color: 'bg-pink-500' }, { label: 'Run 500km', pct: 42, color: 'bg-blue-500' }].map((g) => (
                    <div key={g.label}>
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1"><span>{g.label}</span><span>{g.pct}%</span></div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${g.color}`} style={{ width: `${g.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Privacy card */}
            <FadeUp delay={0.2} className="md:col-span-2">
              <div className="h-full bg-gradient-to-br from-foreground/5 to-primary/5 border border-border/50 p-8 rounded-3xl flex items-center gap-8 hover:border-primary/40 transition-all">
                <Shield className="w-12 h-12 text-primary shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight">Privacy-First by Design</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">All your habit data lives on your device first. No ads, no tracking, no selling your data. Just you and your growth.</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── Feature Highlights (Alternating) ─────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <FadeUp className="text-center mb-20">
            <SectionLabel><Activity className="w-3.5 h-3.5" /> How It Works</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Everything you need,<br />nothing you don't</h2>
          </FadeUp>

          <div className="space-y-28">
            {featureHighlights.map((feat, i) => (
              <FadeUp key={feat.title} delay={0.05}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${feat.flip ? 'lg:[direction:rtl]' : ''}`}>
                  <div className={feat.flip ? 'lg:[direction:ltr]' : ''}>
                    <SectionLabel>{feat.icon} {feat.label}</SectionLabel>
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">{feat.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-7 text-lg">{feat.desc}</p>
                    <ul className="space-y-3 mb-8">
                      {feat.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-3 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="group" onClick={handleBypass}>
                      Try it for free <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                  <div className={`relative ${feat.flip ? 'lg:[direction:ltr]' : ''}`}>
                    {feat.mockup}
                    <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl -z-10" />
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <FadeUp className="text-center mb-14">
            <SectionLabel><Star className="w-3.5 h-3.5" /> Testimonials</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Real people,<br />real transformations</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Don't take our word for it — hear from the community of mindful achievers who changed their lives.</p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="h-full bg-card border border-border/50 rounded-3xl p-8 flex flex-col hover:border-primary/30 transition-all hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]">
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground/90 leading-relaxed flex-1 italic mb-8">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-5 border-t border-border/40">
                    <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full border-2 border-border object-cover" />
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6">
          <FadeUp>
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 rounded-3xl p-12 md:p-20 text-center overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,0,0,0.2)_0%,transparent_60%)]" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold uppercase tracking-widest mb-6">
                  <Zap className="w-3.5 h-3.5" /> No credit card required
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                  Ready to reclaim<br />your day?
                </h2>
                <p className="text-blue-100 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
                  Start your journey instantly. No credit card required. Experience Waqtify entirely in your browser right now.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" className="h-12 px-8 bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-xl text-base" onClick={handleBypass}>
                    Enter as Guest Now
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 font-bold border-white/50 text-white hover:bg-white/20 hover:text-white text-base" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} onClick={() => navigate('/auth/signup')}>
                    Create Free Account
                  </Button>
                </div>

                {/* Mini trust signals */}
                <div className="flex flex-wrap justify-center gap-6 mt-10 text-blue-200 text-sm font-medium">
                  {['Free forever plan', 'No ads ever', 'Your data stays private', 'Cancel anytime'].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-300" />{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </section>

      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 bg-background pt-16 pb-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <LayoutTemplate className="w-5 h-5 text-primary" />
              <span className="font-bold tracking-tight text-base">Waqtify</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Redefining productivity through the lens of mindfulness. Built for those who value progress and peace of mind.
            </p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Integrations', 'Updates', 'Templates'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Contact'] },
            { title: 'Social', links: ['Twitter (X)', 'Instagram', 'LinkedIn', 'GitHub'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-xs tracking-widest uppercase mb-4 text-foreground">{col.title}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {col.links.map((l) => (
                  <li key={l}><a href="#" className="hover:text-primary transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Waqtify Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Marquee animation */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
