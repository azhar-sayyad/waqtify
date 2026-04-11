import React, { useMemo, useState } from 'react';
import { useHabitStore } from '../stores/habitStore';
import { ContributionMap } from '@waqtify/ui';


interface ActivityHeatmapProps {
  /** Show only a compact strip (last N weeks) vs. a full year view */
  compact?: boolean;
  /** Year to display in full mode */
  year?: number;
  className?: string;
}

/**
 * ActivityHeatmap — page-level component that reads from the habit store,
 * transforms the data into the format required by ContributionMap,
 * and optionally shows a year selector.
 *
 * In `compact` mode it renders a 14-week strip (no legend, no selector).
 * In full mode it renders the entire year with a year selector.
 */
export function ActivityHeatmap({ compact = false, year: initialYear, className = '' }: ActivityHeatmapProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(initialYear ?? currentYear);

  const getActivityCalendarData = useHabitStore(s => s.getActivityCalendarData);

  const data = useMemo(() => {
    const all = getActivityCalendarData(selectedYear);
    if (compact) {
      // Last 14 weeks = 98 days
      return all.slice(-98);
    }
    return all;
  }, [getActivityCalendarData, selectedYear, compact]);

  const yearOptions = Array.from(
    { length: currentYear - 2023 + 1 },
    (_, i) => currentYear - i
  );

  return (
    <div className={className}>
      {!compact && (
        <div className="flex items-center justify-end mb-4">
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="text-sm bg-secondary border border-border/50 rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            {yearOptions.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      )}

      <ContributionMap
        data={data}
        countLabel="habits completed"
        showLegend={!compact}
        blockSize={compact ? 11 : 13}
        blockGap={compact ? 3 : 4}
        fontSize={11}
      />
    </div>
  );
}
