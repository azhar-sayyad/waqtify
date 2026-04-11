import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'outline' | 'secondary';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, string> = {
  default:     'bg-primary/10 text-primary border-primary/20',
  success:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning:     'bg-amber-500/10 text-amber-400 border-amber-500/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  outline:     'bg-transparent text-foreground border-border',
  secondary:   'bg-secondary text-muted-foreground border-transparent',
};

const sizeClasses = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

export function Badge({ variant = 'default', size = 'md', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold tracking-wide uppercase ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
