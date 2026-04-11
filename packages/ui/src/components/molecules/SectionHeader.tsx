import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Optional slot for buttons, badges, or controls rendered on the right */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Reusable section header with a consistent visual rhythm.
 * Accepts an optional `eyebrow` label (small uppercase text above the title),
 * a main `title`, an optional `subtitle`, and an `actions` slot for controls.
 */
export function SectionHeader({ eyebrow, title, subtitle, actions, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div>
        {eyebrow && (
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1.5">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-bold tracking-tight leading-snug">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          {actions}
        </div>
      )}
    </div>
  );
}
