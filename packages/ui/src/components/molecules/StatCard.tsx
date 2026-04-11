import React from 'react';

type TrendDirection = 'up' | 'down' | 'neutral';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  /** Large decorative icon rendered in the background */
  decorativeIcon?: React.ReactNode;
  trend?: {
    direction: TrendDirection;
    label: string;
  };
  /** Accent the value text with the primary color */
  accentValue?: boolean;
  className?: string;
}

const trendColors: Record<TrendDirection, string> = {
  up:      'text-emerald-400',
  down:    'text-destructive',
  neutral: 'text-muted-foreground',
};

const trendArrows: Record<TrendDirection, string> = {
  up:      '↑',
  down:    '↓',
  neutral: '→',
};

/**
 * Reusable stat card for dashboards. Shows a label, large value, optional subtitle,
 * a small header icon, a trend indicator, and an optional large decorative background icon.
 */
export function StatCard({
  label,
  value,
  subtitle,
  icon,
  decorativeIcon,
  trend,
  accentValue = false,
  className = '',
}: StatCardProps) {
  return (
    <div className={`relative bg-card border border-border/50 rounded-2xl p-5 shadow-sm overflow-hidden flex flex-col gap-1 ${className}`}>
      {/* Decorative background icon */}
      {decorativeIcon && (
        <div className="absolute -right-4 -bottom-4 opacity-[0.07] pointer-events-none select-none">
          {decorativeIcon}
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between text-muted-foreground mb-2">
        <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
        <span className="w-7 h-7 rounded-lg bg-secondary/80 flex items-center justify-center">
          {icon}
        </span>
      </div>

      {/* Value */}
      <p className={`text-3xl font-black tracking-tight leading-none ${accentValue ? 'text-primary' : 'text-foreground'}`}>
        {value}
      </p>

      {/* Subtitle / trend */}
      <div className="mt-2 min-h-[1rem]">
        {trend && (
          <p className={`text-xs font-semibold flex items-center gap-1 ${trendColors[trend.direction]}`}>
            <span>{trendArrows[trend.direction]}</span>
            {trend.label}
          </p>
        )}
        {!trend && subtitle && (
          <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
