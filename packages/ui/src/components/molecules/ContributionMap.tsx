import React from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import type { Activity as CalendarActivity } from 'react-activity-calendar';

// Re-export the Activity type so consumers use our local alias
export type ActivityDay = CalendarActivity;  // { date: string; count: number; level: 0|1|2|3|4 }

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
 * ContributionMap — wraps `react-activity-calendar` (v3) with built-in tooltip support.
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

  return (
    <div className="w-full overflow-x-auto">
      <ActivityCalendar
        data={data}
        blockSize={blockSize}
        blockMargin={blockGap}
        blockRadius={3}
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
        tooltips={{
          activity: {
            text: (activity) =>
              `${activity.date}: ${activity.count} ${countLabel}`,
          },
        }}
      />
    </div>
  );
}
