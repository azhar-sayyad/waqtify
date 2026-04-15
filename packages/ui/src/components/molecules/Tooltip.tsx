import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface TooltipData {
  visible: boolean;
  x: number;
  y: number;
  title?: string;
  subtitle?: string;
  content?: string;
  emoji?: string;
  icon?: React.ReactNode;
  indicator?: {
    color: string;
    label?: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

interface TooltipProps {
  data: TooltipData;
  /** Custom className for the tooltip card */
  className?: string;
  /** Offset from the target element */
  offsetY?: number;
  /** Custom content renderer */
  renderContent?: (data: TooltipData) => React.ReactNode;
}

/**
 * Reusable custom tooltip component with beautiful styling.
 * Can be used across the app for any hover-based information display.
 */
export function Tooltip({ 
  data, 
  className = '', 
  offsetY = 12,
  renderContent 
}: TooltipProps) {
  if (!data || !data.visible) return null;

  const variantStyles = {
    default: 'border-border',
    success: 'border-emerald-500/40',
    warning: 'border-amber-500/40',
    error: 'border-red-500/40',
    info: 'border-blue-500/40',
  };

  const variantIndicator = {
    default: 'bg-slate-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const getVariantTitle = (variant: string) => {
    switch (variant) {
      case 'success': return 'Success';
      case 'warning': return 'Warning';
      case 'error': return 'Error';
      case 'info': return 'Information';
      default: return '';
    }
  };

  return (
    <div
      className="fixed z-50 pointer-events-none transition-opacity duration-200"
      style={{
        left: data.x,
        top: data.y,
        transform: 'translate(-50%, -100%)',
        marginTop: `-${offsetY}px`,
      }}
    >
      <div className="relative">
        {/* Arrow */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent"
          style={{ borderTopColor: 'hsl(var(--card))' }}
        />
        
        {/* Tooltip card */}
        <div className={`bg-card text-card-foreground rounded-xl shadow-2xl p-4 min-w-[180px] border ${variantStyles[data.variant || 'default']} ${className}`}>
          {renderContent ? (
            renderContent(data)
          ) : (
            <div className="space-y-2">
              {/* Header */}
              {(data.title || data.emoji || data.icon) && (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {data.title && (
                      <p className="text-foreground font-semibold text-sm">{data.title}</p>
                    )}
                    {data.subtitle && (
                      <p className="text-muted-foreground text-xs mt-0.5">{data.subtitle}</p>
                    )}
                  </div>
                  {data.emoji && (
                    <span className="text-xl shrink-0">{data.emoji}</span>
                  )}
                  {data.icon && (
                    <div className="shrink-0 text-muted-foreground">
                      {data.icon}
                    </div>
                  )}
                </div>
              )}
              
              {/* Variant indicator with label */}
              {data.indicator && (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ 
                      backgroundColor: data.indicator.color,
                      boxShadow: `0 0 8px ${data.indicator.color}40`
                    }}
                  />
                  <span className="text-muted-foreground text-sm">
                    {data.indicator.label && (
                      <span className="text-foreground font-bold">{data.indicator.label}</span>
                    )}
                    {data.content && (
                      <span>{data.content}</span>
                    )}
                  </span>
                </div>
              )}
              
              {/* Just content (no indicator) */}
              {!data.indicator && data.content && (
                <p className="text-muted-foreground text-sm">{data.content}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to manage tooltip state and positioning
 */
export function useTooltip() {
  const [tooltipData, setTooltipData] = useState<TooltipData>({
    visible: false,
    x: 0,
    y: 0,
  });

  const showTooltip = useCallback((
    event: React.MouseEvent, 
    data: Omit<TooltipData, 'visible' | 'x' | 'y'>
  ) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setTooltipData({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top,
      ...data,
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltipData(prev => ({ ...prev, visible: false }));
  }, []);

  const updateTooltipPosition = useCallback((event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setTooltipData(prev => ({
      ...prev,
      x: rect.left + rect.width / 2,
      y: rect.top,
    }));
  }, []);

  return {
    tooltipData,
    showTooltip,
    hideTooltip,
    updateTooltipPosition,
    setTooltipData,
  };
}
