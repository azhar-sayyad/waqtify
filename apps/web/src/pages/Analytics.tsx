import React, { useMemo } from 'react';
import { useHabitStore } from '../stores/habitStore';
import { formatISO, subDays, getDay, differenceInDays } from 'date-fns';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Trophy, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@waqtify/ui';

export function Analytics() {
  const { habits, logs, calculateStreak, calculateLongestStreak } = useHabitStore();

  // ----- KPI CALCULATIONS -----
  const { totalCompleted, maxCurrentStreak, maxLongestStreak } = useMemo(() => {
    let completed = 0;
    let maxCurrent = 0;
    let maxLongest = 0;

    habits.forEach(h => {
      const hLogs = logs[h.id] || [];
      completed += hLogs.filter(l => l.completed).length;
      maxCurrent = Math.max(maxCurrent, calculateStreak(h.id));
      maxLongest = Math.max(maxLongest, calculateLongestStreak(h.id));
    });

    return { totalCompleted: completed, maxCurrentStreak: maxCurrent, maxLongestStreak: maxLongest };
  }, [habits, logs, calculateStreak, calculateLongestStreak]);

  // ----- HEATMAP DATA (Last 140 days = 20 weeks) -----
  const heatmapDays = useMemo(() => {
    const days = [];
    const today = new Date();
    // Shift start date to a Sunday so the grid aligns nicely if needed, or just flat 140 days
    for (let i = 139; i >= 0; i--) {
      const targetDate = subDays(today, i);
      const dateStr = formatISO(targetDate, { representation: 'date' });
      
      let intensity = 0;
      habits.forEach(h => {
        if (logs[h.id]?.find(l => l.date === dateStr && l.completed)) intensity++;
      });
      
      days.push({ 
        date: dateStr, 
        intensity, 
        label: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric'}) 
      });
    }
    return days;
  }, [habits, logs]);

  const maxHeatmapIntensity = Math.max(1, ...heatmapDays.map(d => d.intensity));

  // ----- HABIT COMPLETION (Last 30 Days) -----
  const habitCompletionStats = useMemo(() => {
    const today = new Date();
    return habits.map(h => {
      const hLogs = logs[h.id] || [];
      const thirtyDaysAgoStr = formatISO(subDays(today, 30), { representation: 'date' });
      const recentLogs = hLogs.filter(l => l.date >= thirtyDaysAgoStr);
      
      const creationDateLog = [...hLogs].sort((a,b) => a.date.localeCompare(b.date))[0];
      let maxPossibleDays = 30;
      
      if (creationDateLog && creationDateLog.date > thirtyDaysAgoStr) {
         maxPossibleDays = differenceInDays(today, new Date(creationDateLog.date)) + 1;
      }
      
      const compCount = recentLogs.filter(l => l.completed).length;
      const percentage = maxPossibleDays > 0 ? Math.round((compCount / maxPossibleDays) * 100) : 0;

      return {
        id: h.id,
        name: h.name,
        percentage: Math.min(percentage, 100)
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [habits, logs]);

  // ----- MISSED DAYS TRACKER (Last 30 Days) -----
  const missedDaysData = useMemo(() => {
    const weekCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun to Sat
    const todayStr = formatISO(new Date(), { representation: 'date' });
    const thirtyDaysAgoStr = formatISO(subDays(new Date(), 30), { representation: 'date' });

    habits.forEach(h => {
       const hLogs = logs[h.id] || [];
       hLogs.filter(l => l.date >= thirtyDaysAgoStr && l.date <= todayStr && !l.completed).forEach(log => {
          const dayIndex = getDay(new Date(log.date));
          weekCounts[dayIndex]++;
       });
    });

    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // Shift to start on Monday for intuitive display
    return [
      { name: "Mon", misses: weekCounts[1] },
      { name: "Tue", misses: weekCounts[2] },
      { name: "Wed", misses: weekCounts[3] },
      { name: "Thu", misses: weekCounts[4] },
      { name: "Fri", misses: weekCounts[5] },
      { name: "Sat", misses: weekCounts[6] },
      { name: "Sun", misses: weekCounts[0] }
    ];
  }, [habits, logs]);

  const maxMissedDay = [...missedDaysData].sort((a, b) => b.misses - a.misses)[0];

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 pb-16">
      
      {/* Header */}
      <section className="flex items-end justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Insights Engine</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Consistency Overview</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" className="hidden sm:flex text-xs h-9">Last 30 Days</Button>
          <Button size="sm" className="text-xs h-9 shadow-md">Export Report</Button>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden">
           <CheckCircle2 className="absolute -right-4 -bottom-4 w-32 h-32 text-muted/10" />
           <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Completed</p>
           <p className="text-4xl font-black mb-4">{totalCompleted.toLocaleString()}</p>
           <p className="text-xs text-primary font-semibold flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-primary/20 flex items-center justify-center">
               <span className="w-1 h-1 rounded-full bg-primary"></span>
             </span>
             Cumulative actions taken
           </p>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden">
           <Flame className="absolute -right-4 -bottom-4 w-32 h-32 text-muted/10" />
           <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Current Streak</p>
           <p className="text-4xl font-black mb-4">{maxCurrentStreak} Days</p>
           <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
             <Flame className="w-3.5 h-3.5 text-orange-500" />
             Active momentum across modules
           </p>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden">
           <Trophy className="absolute -right-4 -bottom-4 w-32 h-32 text-muted/10" />
           <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Longest Streak</p>
           <p className="text-4xl font-black mb-4">{maxLongestStreak} Days</p>
           <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
             <Trophy className="w-3.5 h-3.5 text-yellow-500" />
             Historical maximum performance
           </p>
        </div>
      </section>

      {/* Consistency Heatmap */}
      <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
           <h3 className="font-bold tracking-tight">Consistency Heatmap</h3>
           <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
             <span>Less</span>
             <div className="flex gap-1">
               <div className="w-3 h-3 rounded-sm bg-secondary"></div>
               <div className="w-3 h-3 rounded-sm bg-primary/30"></div>
               <div className="w-3 h-3 rounded-sm bg-primary/60"></div>
               <div className="w-3 h-3 rounded-sm bg-primary"></div>
             </div>
             <span>More</span>
           </div>
        </div>
        
        {/* Responsive horizontal scroll for heatmap */}
        <div className="w-full overflow-x-auto pb-4">
          <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-7 gap-[3px] min-w-[700px]">
            {/* Because the grid is fixed rows-7, mapping left to right involves CSS column flow */}
            {heatmapDays.map((day, i) => {
              // Calc opacity level (0 = bg-primary/5, otherwise steps to 1)
              let alpha = day.intensity === 0 ? 0 : 0.2 + (day.intensity / maxHeatmapIntensity) * 0.8;
              if (alpha > 1) alpha = 1;

              return (
                <div 
                  key={day.date} 
                  className="aspect-square rounded-[3px] transition-all hover:scale-110 cursor-pointer relative group"
                  style={{ backgroundColor: day.intensity === 0 ? 'var(--secondary)' : `hsl(var(--primary) / ${alpha})` }}
                >
                   {/* Tooltip on hover */}
                   <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-1/2 -translate-x-1/2 mb-2 bg-foreground text-background text-[10px] py-1 px-2 rounded whitespace-nowrap z-50 pointer-events-none font-medium">
                     {day.label}: {day.intensity} completed
                   </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Habit Completion List */}
        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
           <h3 className="font-bold tracking-tight mb-6">Habit Completion (30d)</h3>
           <div className="space-y-6">
             {habitCompletionStats.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No habit data available.</p>
             ) : (
               habitCompletionStats.map(stat => (
                 <div key={stat.id}>
                   <div className="flex justify-between text-sm font-semibold mb-2">
                     <span>{stat.name}</span>
                     <span className="text-primary">{stat.percentage}%</span>
                   </div>
                   <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out" 
                       style={{ width: `${stat.percentage}%` }}
                     ></div>
                   </div>
                 </div>
               ))
             )}
           </div>
        </section>

        {/* Missed Days Overview */}
        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col h-full">
           <div>
             <h3 className="font-bold tracking-tight">Missed Days Overview</h3>
             <p className="text-sm text-muted-foreground mt-1 mb-8">Identifying patterns to optimize your schedule.</p>
           </div>
           
           <div className="h-[200px] w-full mb-6">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={missedDaysData}>
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tickMargin={10} />
                  <Tooltip 
                    cursor={{fill: 'var(--secondary)', opacity: 0.1}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)', fontSize: '12px' }}
                    formatter={(value: number) => [`${value} Misses`, 'Frequency']}
                  />
                  <Bar dataKey="misses" fill="hsl(var(--destructive) / 0.7)" radius={[4, 4, 4, 4]} barSize={20} />
               </BarChart>
             </ResponsiveContainer>
           </div>

           <div className="mt-auto bg-secondary/40 border border-border/40 rounded-xl p-4 flex gap-3">
             <div className="mt-0.5"><Info className="w-5 h-5 text-muted-foreground" /></div>
             <p className="text-xs text-muted-foreground leading-relaxed font-medium">
               <strong className="text-foreground">Pro Tip: </strong> 
               {maxMissedDay.misses > 0 
                  ? `Your completion rate drops significantly on ${maxMissedDay.name}days. Consider setting "Low-Intensity" targets for this day to maintain momentum without burnout.`
                  : `Your schedule is perfectly balanced. Maintain your current protocol to maximize long-term consistency.`
               }
             </p>
           </div>
        </section>
      </div>

    </div>
  );
}
