import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckCircle2, BarChart2, Settings, LogOut, Hexagon } from 'lucide-react';
import { Button } from '@waqtify/ui';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar (Desktop) */}
      <aside className="fixed inset-y-0 left-0 w-[260px] hidden md:flex flex-col border-r bg-card/50 backdrop-blur-xl z-50">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <Hexagon className="w-6 h-6 text-primary mr-3" />
          <span className="font-bold text-lg tracking-tight">Waqtify</span>
        </div>

        <div className="flex-1 py-6 px-4 space-y-1">
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Overview</p>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </button>
            )
          })}
        </div>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium border border-border">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <p className="text-sm font-medium truncate leading-tight">{user?.name || 'Guest User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || 'guest@waqtify.com'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[260px] min-h-screen relative flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden h-14 border-b bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center px-4 justify-between">
           <div className="flex items-center gap-2">
              <Hexagon className="w-5 h-5 text-primary" />
              <span className="font-bold tracking-tight">Waqtify</span>
           </div>
           <Button variant="ghost" size="sm" onClick={handleLogout}>
             <LogOut className="w-4 h-4" />
           </Button>
        </header>

        <div className="flex-1 p-4 md:p-8 md:pt-10 mb-16 md:mb-0 max-w-5xl mx-auto w-full">
           {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-background/80 backdrop-blur-md z-40 flex items-center justify-around px-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all ${
                  isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">{link.name}</span>
              </button>
            )
          })}
        </nav>
      </main>
    </div>
  );
}
