import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { TooltipProps } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { chartTheme } from '../../lib/chartTheme';

interface PieData {
  name: string;
  value: number;
}

interface CompletionByHabitPieChartProps {
  data: PieData[];
}

const PIE_COLORS = [
  'hsl(265 90% 72%)',
  'hsl(142 70% 50%)',
  'hsl(38 92% 55%)',
  'hsl(199 89% 55%)',
  'hsl(330 80% 62%)',
  'hsl(25 90% 55%)',
  'hsl(175 70% 45%)',
];

function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.07) return null;
  return (
    <text x={x} y={y} fill={chartTheme.pieLabelFill} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${Math.round(percent * 100)}%`}
    </text>
  );
}

export function CompletionByHabitPieChart({ data }: CompletionByHabitPieChartProps) {
  const formatTooltipValue: TooltipProps<ValueType, NameType>['formatter'] = (value, name) => [
    `${Number(value ?? 0)} completions`,
    String(name ?? 'Habit'),
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <PieChartIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Breakdown</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">Completion by Habit</h2>
            <p className="text-sm text-muted-foreground">Share of total completions</p>
          </div>
        </div>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={PieLabel}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={chartTheme.tooltipContentStyle}
                labelStyle={chartTheme.tooltipLabelStyle}
                itemStyle={chartTheme.tooltipItemStyle}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={chartTheme.legendTextStyle}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[240px] text-muted-foreground">
            <p className="text-sm">No completions logged in this period</p>
          </div>
        )}
      </div>
    </section>
  );
}
