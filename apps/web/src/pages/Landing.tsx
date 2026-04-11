import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@waqtify/ui';
import { 
  BarChart3, Calendar, Flame, LayoutTemplate, 
  Search, Bell, User as UserIcon, Droplets, BookOpen, Quote
} from 'lucide-react';

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
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans selection:bg-primary/30">
      
      {/* Background blobs for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Glass Header */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <LayoutTemplate className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg tracking-tight">Waqtify</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <span className="text-foreground border-b-2 border-primary py-5 cursor-pointer">Product</span>
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-5">Features</span>
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-5">Pricing</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-xs text-muted-foreground">
               <Search className="w-3.5 h-3.5" />
               <span className="w-32 text-left">Search...</span>
               <span className="bg-background px-1.5 py-0.5 rounded text-[10px]">⌘K</span>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
               <Bell className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/auth/login')} className="hidden sm:flex">
               Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20">
        
        {/* --- Hero Section --- */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start text-left"
          >
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-secondary/50 text-secondary-foreground mb-6">
              New: Advanced Analytics 2.0 ✨
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Master your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Time</span>,<br/>
              Shape your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">Life</span>.
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Experience the art of intentional living. Waqtify helps you track progress with editorial clarity, turning daily routines into lasting transformation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto">
              <Button size="lg" className="h-12 px-8 text-md shadow-[0_0_20px_-3px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_-3px_rgba(59,130,246,0.5)] transition-shadow" onClick={handleBypass}>
                Get Started for Free
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-md bg-background/50 backdrop-blur-sm" onClick={() => navigate('/auth/login')}>
                Sign In
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
              <div className="flex -space-x-3">
                 <div className="w-10 h-10 rounded-full border-2 border-background bg-blue-500 flex items-center justify-center overflow-hidden"><img src="https://i.pravatar.cc/100?img=1" alt="user" /></div>
                 <div className="w-10 h-10 rounded-full border-2 border-background bg-purple-500 flex items-center justify-center overflow-hidden"><img src="https://i.pravatar.cc/100?img=2" alt="user" /></div>
                 <div className="w-10 h-10 rounded-full border-2 border-background bg-pink-500 flex items-center justify-center overflow-hidden"><img src="https://i.pravatar.cc/100?img=3" alt="user" /></div>
              </div>
              <span>Joined by 20,000+ mindful achievers</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:ml-10"
          >
            {/* Mock Dashboard Widget */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-2xl relative z-10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold tracking-tight">Today's Canvas</h3>
                <span className="text-muted-foreground text-xl">...</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-secondary/40 rounded-xl border border-border/50">
                   <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center">
                     <Droplets className="w-5 h-5" />
                   </div>
                   <div className="flex-1">
                     <p className="font-semibold text-sm">Morning Hydration</p>
                     <div className="w-full bg-background h-1.5 rounded-full mt-2 overflow-hidden">
                       <div className="bg-blue-500 w-4/5 h-full rounded-full"></div>
                     </div>
                   </div>
                   <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white"><span className="text-[10px]">✓</span></div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-background rounded-xl border border-border/50">
                   <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center">
                     <UserIcon className="w-5 h-5" />
                   </div>
                   <div className="flex-1">
                     <p className="font-semibold text-sm">10 Min Meditation</p>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Health • 12 Day Streak</p>
                   </div>
                   <div className="w-6 h-6 rounded-full border-2 border-border"></div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-background rounded-xl border border-border/50">
                   <div className="w-10 h-10 rounded-lg bg-pink-500/20 text-pink-500 flex items-center justify-center">
                     <BookOpen className="w-5 h-5" />
                   </div>
                   <div className="flex-1">
                     <p className="font-semibold text-sm">Deep Work Session</p>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Study • 08:00 AM</p>
                   </div>
                   <div className="w-6 h-6 rounded-full border-2 border-border"></div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">85%</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Completion Rate</p>
                </div>
                <div className="flex gap-1.5 h-10 items-end">
                   <div className="w-2 bg-primary/20 h-[40%] rounded-t-sm"></div>
                   <div className="w-2 bg-primary/40 h-[60%] rounded-t-sm"></div>
                   <div className="w-2 bg-primary/60 h-[80%] rounded-t-sm"></div>
                   <div className="w-2 bg-primary h-[100%] rounded-t-sm text-shadow"></div>
                   <div className="w-2 bg-primary/80 h-[70%] rounded-t-sm"></div>
                </div>
              </div>
            </div>

            {/* Decorative element behind widget */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl blur-xl -z-10"></div>
          </motion.div>
        </section>

        {/* --- Features Grid Section --- */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Precision-Engineered for Progress</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We've stripped away the noise to leave you with the features that actually matter for behavioral change.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 (Spans 2 cols) */}
            <div className="md:col-span-2 relative bg-card border border-border/50 p-8 rounded-3xl overflow-hidden group hover:border-primary/50 transition-colors">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors"></div>
               <Calendar className="w-8 h-8 text-primary mb-6" />
               <h3 className="text-2xl font-bold mb-3 tracking-tight">Frictionless Daily Tracking</h3>
               <p className="text-muted-foreground max-w-md leading-relaxed">
                 Log your progress in seconds with our minimalist entry system. Whether it's a simple toggle or a quantitative metric, we make tracking feel like a reward.
               </p>
            </div>

            {/* Feature 2 (Accent card) */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-lg">
               <div className="absolute top-[-20%] right-[-20%] w-full h-full bg-white/10 rounded-full blur-2xl"></div>
               <div className="relative z-10">
                 <Flame className="w-8 h-8 text-orange-300 mb-6" />
                 <h3 className="text-2xl font-bold mb-3 tracking-tight">Momentum Engine</h3>
                 <p className="text-blue-100 leading-relaxed text-sm">Don't break the chain. Our streaks motivate through positive reinforcement, not guilt.</p>
               </div>
               <div className="relative z-10 mt-8">
                 <p className="text-4xl font-black tracking-tight">24 Days</p>
                 <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-200 mt-1">Personal Best Streak</p>
               </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border border-border/50 p-8 rounded-3xl flex flex-col justify-between hover:border-primary/50 transition-colors">
               <div>
                 <BarChart3 className="w-8 h-8 text-purple-400 mb-6" />
                 <h3 className="text-xl font-bold mb-3 tracking-tight">Behavioral Analytics</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                   Understand the "why" behind your success. Visualize correlations and identify peak performance windows.
                 </p>
               </div>
               <div className="flex items-end gap-2 h-16 w-full">
                  <div className="flex-1 bg-purple-500/20 h-[30%] rounded-t-sm"></div>
                  <div className="flex-1 bg-purple-500/40 h-[50%] rounded-t-sm"></div>
                  <div className="flex-1 bg-purple-500/60 h-[70%] rounded-t-sm"></div>
                  <div className="flex-1 bg-purple-500/80 h-[85%] rounded-t-sm"></div>
                  <div className="flex-1 bg-purple-500 h-[100%] rounded-t-sm"></div>
               </div>
            </div>

            {/* Feature 4 (Spans 2 cols) */}
            <div className="md:col-span-2 bg-secondary/50 border border-border/50 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 hover:border-primary/50 transition-colors">
               <div className="flex-1">
                 <h3 className="text-2xl font-bold mb-3 tracking-tight">Context-Aware Reminders</h3>
                 <p className="text-muted-foreground leading-relaxed">
                   Gentle nudges that respect your focus. Waqtify learns your schedule and suggests actions only when you're most likely to follow through.
                 </p>
               </div>
               <div className="w-full md:w-64 bg-background border border-border rounded-xl p-5 shadow-sm">
                 <div className="flex items-center gap-2 mb-3">
                   <Bell className="w-4 h-4 text-primary" />
                   <span className="text-xs font-semibold text-muted-foreground uppercase">Suggested Now</span>
                 </div>
                 <p className="font-bold">Focus: Meditation</p>
                 <p className="text-xs text-muted-foreground mt-1">Based on your calm morning routine</p>
               </div>
            </div>
          </div>
        </section>

        {/* --- Testimonial Section --- */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-32">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8 border border-border">
             <Quote className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-2xl md:text-3xl font-medium italic leading-relaxed text-foreground/90 mb-8">
            "Finally, a habit tracker that doesn't feel like a spreadsheet. It feels like a beautiful space where I can actually think and grow intentionally. Highly recommended."
          </p>
          <div className="flex items-center justify-center gap-4">
             <img src="https://i.pravatar.cc/100?img=5" alt="Reviewer" className="w-12 h-12 rounded-full border-2 border-border" />
             <div className="text-left">
               <p className="font-bold">Elena Rodriguez</p>
               <p className="text-sm text-muted-foreground">Product Designer @ Linear</p>
             </div>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="max-w-5xl mx-auto px-6 mb-16">
          <div className="bg-card border border-border rounded-3xl p-12 md:p-20 text-center relative overflow-hidden backdrop-blur-sm">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5"></div>
             <h2 className="relative text-3xl md:text-5xl font-bold tracking-tight mb-6">Ready to reclaim your day?</h2>
             <p className="relative text-muted-foreground max-w-2xl mx-auto mb-10 text-lg">
               Start your journey offline instantly. No credit card required. Experience Waqtify entirely in your browser right now.
             </p>
             <div className="relative flex justify-center gap-4">
               <Button size="lg" className="h-12 px-8 shadow-lg font-semibold" onClick={handleBypass}>
                 Enter as Guest Now
               </Button>
               <Button size="lg" variant="outline" className="h-12 px-8 font-semibold bg-background/50" onClick={() => navigate('/auth/signup')}>
                 Create Free Account
               </Button>
             </div>
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-border/40 bg-background pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <LayoutTemplate className="w-6 h-6 text-primary" />
              <span className="font-bold tracking-tight text-lg">Waqtify</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Redefining productivity through the lens of mindfulness. Built for those who value progress and peace of mind.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-tight uppercase mb-4 text-foreground">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Updates</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Templates</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-tight uppercase mb-4 text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-tight uppercase mb-4 text-foreground">Social</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Twitter (X)</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Waqtify Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
