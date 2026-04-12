import React, { useState, useRef, useEffect } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import type { Activity as CalendarActivity } from 'react-activity-calendar';
import { Tooltip, useTooltip } from './Tooltip';

// Re-export the Activity type so consumers use our local alias
export type ActivityDay = CalendarActivity;  // { date: string; count: number, level: 0|1|2|3|4 }

interface ContributionMapProps {
  data: ActivityDay[];
  /** Label shown in the legend (e.g. "habits completed") */
  countLabel?: string;
  /** Toggle the legend row */
  showLegend?: boolean;
  /** Toggle the total count label */
  showTotalCount?: boolean;
  blockSize?: number;
  /** Gap between blocks (blockMargin in react-activity-calendar v3) */
  blockGap?: number;
  fontSize?: number;
  /**
   * Custom theme. Must provide at least light or dark with 5 color stops.
   * Defaults to the Waqtify blue palette.
   */
  colorScale?: [string, string, string, string, string];
}

/**
 * ContributionMap — wraps `react-activity-calendar` (v3) with a custom beautiful tooltip.
 *
 * This is the single place in the codebase that depends on `react-activity-calendar`,
 * keeping the library swappable in the future.
 *
 * Data format: ActivityDay[] — same as `Activity` from react-activity-calendar:
 *   { date: "YYYY-MM-DD", count: number, level: 0 | 1 | 2 | 3 | 4 }
 */
export function ContributionMap({
  data,
  countLabel = 'habits completed',
  showLegend = true,
  showTotalCount = true,
  blockSize = 13,
  blockGap = 4,
  fontSize = 12,
  colorScale,
}: ContributionMapProps) {
  // react-activity-calendar needs at least one entry; guard against empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-muted-foreground italic">
        No activity data yet. Start logging habits!
      </div>
    );
  }

  // Match the app's primary color: hsl(221, 83%, 53%) — a vivid blue
  // Light scheme: from very pale blue → saturated primary blue
  const defaultLightScale: [string, string, string, string, string] = [
    'hsl(210, 40%, 93%)',    // level 0 — matches secondary bg
    'hsl(221, 70%, 80%)',    // level 1 — light blue
    'hsl(221, 75%, 67%)',    // level 2
    'hsl(221, 80%, 57%)',    // level 3
    'hsl(221, 83%, 46%)',    // level 4 — primary (slightly darker for contrast)
  ];

  const scale = colorScale ?? defaultLightScale;

  // Use the reusable tooltip hook
  const { tooltipData, showTooltip, hideTooltip } = useTooltip();
  const containerRef = useRef<HTMLDivElement>(null);

  // Format date nicely
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get status text based on level
  const getStatusText = (level: number, count: number) => {
    if (count === 0) return 'No activity';
    if (level <= 1) return 'Light activity';
    if (level <= 2) return 'Moderate activity';
    if (level <= 3) return 'Active day';
    return 'Highly active';
  };

  // Get status emoji based on level
  const getStatusEmoji = (level: number) => {
    if (level === 0) return '😴';
    if (level === 1) return '🌱';
    if (level === 2) return '📈';
    if (level === 3) return '🔥';
    return '⚡';
  };

  // Handle mouse events using the reusable hook
  const handleMouseEnter = (event: React.MouseEvent, activity: CalendarActivity) => {
    showTooltip(event, {
      title: formatDate(activity.date),
      subtitle: getStatusText(activity.level, activity.count),
      emoji: getStatusEmoji(activity.level),
      indicator: {
        color: scale[activity.level],
        label: `${activity.count}`,
      },
      content: countLabel,
    });
  };

  // Custom render function for blocks with tooltip support
  const renderBlock = (
    element: React.ReactElement<React.SVGProps<SVGRectElement>>,
    activity: CalendarActivity
  ) => {
    return React.cloneElement<React.SVGProps<SVGRectElement>>(element, {
      onMouseEnter: (e: React.MouseEvent) => handleMouseEnter(e, activity),
      onMouseLeave: hideTooltip,
      style: {
        ...(element.props.style || {}),
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      },
    });
  };

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <ActivityCalendar
        data={data}
        blockSize={blockSize}
        blockMargin={blockGap}
        blockRadius={4}
        fontSize={fontSize}
        colorScheme="light"
        showWeekdayLabels
        showTotalCount={showTotalCount}
        showColorLegend={showLegend}
        labels={{
          totalCount: `{{count}} ${countLabel} in {{year}}`,
          legend: { less: 'Less', more: 'More' },
        }}
        theme={{
          light: scale,
        }}
        renderBlock={renderBlock}
        // Disable built-in tooltips since we have custom ones
        tooltips={undefined}
      />
      
      {/* Reusable tooltip overlay */}
      <Tooltip data={tooltipData} />
    </div>
  );
}
