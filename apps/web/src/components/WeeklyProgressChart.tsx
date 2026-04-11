import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import type { DailyCompletionPoint } from '../stores/habitStore';

interface WeeklyProgressChartProps {
  data: DailyCompletionPoint[];
  /** Target line to show as reference (e.g. 80 for 80% goal) */
  target?: number;
  className?: string;
  height?: number;
}

/** Custom tooltip for the chart */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as DailyCompletionPoint;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-sm">
      <p className="font-bold text-foreground mb-1">{label}</p>
      <p className="text-primary font-semibold">{point.rate}% completion</p>
      <p className="text-muted-foreground text-xs mt-0.5">{point.completed} / {point.total} habits</p>
    </div>
  );
}

/**
 * WeeklyProgressChart — a smooth line chart showing daily habit completion % over time.
 * Uses recharts LineChart with custom styled tooltip, optional target reference line,
 * and gradient fill.
 */
export function WeeklyProgressChart({ data, target, className = '', height = 220 }: WeeklyProgressChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center text-sm text-muted-foreground italic ${className}`} style={{ height }}>
        Not enough data yet.
      </div>
    );
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(265 90% 72%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(265 90% 72%)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 20%)" vertical={false} />

          <XAxis
            dataKey="date"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
            tick={{ fill: 'hsl(240 5% 65%)' }}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={v => `${v}%`}
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            tick={{ fill: 'hsl(240 5% 65%)' }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(265 90% 72%)', strokeWidth: 1, strokeDasharray: '4 4' }} />

          {target !== undefined && (
            <ReferenceLine
              y={target}
              stroke="hsl(142 70% 45%)"
              strokeDasharray="4 4"
              label={{ value: `Goal ${target}%`, position: 'right', fontSize: 10, fill: 'hsl(142 70% 45%)' }}
            />
          )}

          <Line
            type="monotone"
            dataKey="rate"
            stroke="hsl(265 90% 72%)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: 'hsl(265 90% 72%)', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
