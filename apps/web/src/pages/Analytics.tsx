import React, { useMemo } from 'react';
import { useHabitStore } from '../stores/habitStore';
import { formatISO, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Target } from 'lucide-react';

export function Analytics() {
  const { habits, logs } = useHabitStore();

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
    <div className="w-full flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Performance Analytics</h1>
        <p className="text-muted-foreground">Visualize your consistency and track your system's efficiency.</p>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 text-muted-foreground">
            <span className="text-sm font-medium uppercase tracking-wider">Active Systems</span>
            <Target className="w-4 h-4" />
          </div>
          <p className="text-4xl font-bold">{habits.length}</p>
          <p className="text-sm text-muted-foreground mt-2">Habits currently active in your dashboard.</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-6 text-muted-foreground">
            <span className="text-sm font-medium uppercase tracking-wider">7-Day Completion Volume</span>
            <Activity className="w-4 h-4" />
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: 'var(--secondary)', opacity: 0.2}}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
                  itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                />
                <Bar dataKey="completed" fill="currentColor" className="fill-primary hover:opacity-80 transition-opacity" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
