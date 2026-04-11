import React, { useMemo } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useHabitStore } from '../stores/habitStore';
import { Button } from '@waqtify/ui';
import { Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatISO, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function Analytics() {
  const { user, logout } = useAuthStore();
  const { habits, logs } = useHabitStore();
  const navigate = useNavigate();

  // Generate last 7 days of performance
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const dateTarget = subDays(today, i);
      const dateStr = formatISO(dateTarget, { representation: 'date' });
      
      let completedCount = 0;
      let totalAssigned = habits.length;

      habits.forEach(h => {
        const hLogs = logs[h.id];
        if (hLogs) {
          const matchedLog = hLogs.find(l => l.date === dateStr);
          if (matchedLog && matchedLog.completed) {
            completedCount++;
          }
        }
      });

      data.push({
        name: dateTarget.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: completedCount,
        total: totalAssigned
      });
    }
    return data;
  }, [habits, logs]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 mr-4">
              <Layout className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold tracking-tight">Waqtify</span>
            </div>
            <nav className="flex items-center space-x-4 text-sm font-medium">
              <span 
                className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer py-5" 
                onClick={() => navigate('/')}
              >
                Habits
              </span>
              <span className="text-foreground border-b-2 border-primary py-5 cursor-pointer">
                Analytics
              </span>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              {user?.name || 'Guest'}
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>Sign Out</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance Analytics</h2>
          <p className="text-muted-foreground mt-1">Visualize your consistency.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Habits Tracked</h3>
            <p className="text-3xl font-bold mt-2">{habits.length}</p>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:col-span-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground mb-4">Global Completion (7 Days)</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }}
                  />
                  <Bar dataKey="completed" fill="currentColor" className="fill-primary" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
