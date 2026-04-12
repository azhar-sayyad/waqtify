import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Activity, Info } from 'lucide-react';
import type { MissedDayData } from '../../stores/habitStore';

interface MissedDay {
  name: string;
  misses: number;
}

interface MissedDaysChartProps {
  data: MissedDay[];
  worstDay?: MissedDay;
  hasHabits: boolean;
}

function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-sm">
      <p className="font-bold text-foreground mb-1">{label}</p>
      <p className="text-destructive font-semibold">{payload[0].value} misses</p>
    </div>
  );
}

export function MissedDaysChart({ data, worstDay, hasHabits }: MissedDaysChartProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg">
      <div className="absolute top-0 right-0 w-64 h-64 bg-destructive/5 rounded-full blur-3xl"></div>
      <div className="relative p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-destructive" />
              </div>
              <span className="text-xs font-semibold text-destructive uppercase tracking-wider">Weaknesses</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">Misses by Day of Week</h2>
            <p className="text-sm text-muted-foreground">Find your weak spots</p>
          </div>
        </div>
        {!hasHabits ? (
          <div className="flex flex-col items-center justify-center h-[240px] text-muted-foreground">
            <Activity className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">No habits tracked yet</p>
            <p className="text-xs mt-1">Start tracking habits to see your weak spots</p>
          </div>
        ) : (
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: 'hsl(240 5% 65%)' }} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tickMargin={4} tick={{ fill: 'hsl(240 5% 65%)' }} />
                <Tooltip content={<BarTooltip />} cursor={{ fill: 'hsl(0, 0%, 100%)', opacity: 0.4 }} />
                <Bar dataKey="misses" radius={[6, 6, 2, 2]} barSize={28}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.misses > 0 && entry === worstDay ? 'hsl(var(--destructive))' : 'hsl(var(--destructive) / 0.4)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-4">
          <div className="bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border/40 rounded-xl p-4 flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary mb-1">AI Insight</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {worstDay?.misses > 0
                  ? `You miss the most on ${worstDay.name}s. Consider setting lighter habits or reminders for that day.`
                  : 'Your schedule looks balanced — great consistency across the entire week!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}