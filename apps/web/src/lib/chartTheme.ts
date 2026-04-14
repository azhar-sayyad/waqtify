import type { CSSProperties } from 'react';

export const chartTheme = {
  seriesPrimary: 'hsl(var(--chart-series-1))',
  goal: 'hsl(var(--chart-goal))',
  axisTick: {
    fill: 'hsl(var(--chart-muted))',
    fontSize: 10,
  },
  gridStroke: 'hsl(var(--chart-grid))',
  cursorFill: 'hsl(var(--chart-cursor))',
  tooltipContentStyle: {
    borderRadius: '12px',
    border: '1px solid hsl(var(--chart-tooltip-border))',
    backgroundColor: 'hsl(var(--chart-tooltip-bg))',
    color: 'hsl(var(--chart-tooltip-foreground))',
    fontSize: '12px',
    boxShadow: '0 12px 28px hsl(var(--foreground) / 0.1)',
  } satisfies CSSProperties,
  tooltipLabelStyle: {
    color: 'hsl(var(--chart-tooltip-foreground))',
    fontWeight: 700,
  } satisfies CSSProperties,
  tooltipItemStyle: {
    color: 'hsl(var(--chart-tooltip-foreground))',
  } satisfies CSSProperties,
  legendTextStyle: {
    fontSize: 11,
    color: 'hsl(var(--chart-muted))',
  } satisfies CSSProperties,
  pieLabelFill: 'hsl(var(--chart-on-accent))',
};
