import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ContributionDay {
  date: string;
  count: number;
}

interface ContributionHeatmapProps {
  data: ContributionDay[];
  title?: string;
  colorScheme?: "green" | "blue" | "purple";
}

const DAYS_OF_WEEK = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getColorClass(count: number, maxCount: number, scheme: string): string {
  if (count === 0) return "bg-muted/50";
  
  const intensity = Math.ceil((count / maxCount) * 4);
  
  const colors = {
    green: ["bg-emerald-200 dark:bg-emerald-900", "bg-emerald-400 dark:bg-emerald-700", "bg-emerald-500 dark:bg-emerald-600", "bg-emerald-600 dark:bg-emerald-500"],
    blue: ["bg-blue-200 dark:bg-blue-900", "bg-blue-400 dark:bg-blue-700", "bg-blue-500 dark:bg-blue-600", "bg-blue-600 dark:bg-blue-500"],
    purple: ["bg-violet-200 dark:bg-violet-900", "bg-violet-400 dark:bg-violet-700", "bg-violet-500 dark:bg-violet-600", "bg-violet-600 dark:bg-violet-500"],
  };
  
  return colors[scheme as keyof typeof colors][Math.min(intensity - 1, 3)];
}

function generateCalendarGrid(data: ContributionDay[]): { weeks: (ContributionDay | null)[][]; months: { name: string; startWeek: number }[] } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 364); // ~1 year ago
  
  // Create a map for quick lookup
  const dataMap = new Map(data.map(d => [d.date, d.count]));
  
  const weeks: (ContributionDay | null)[][] = [];
  const months: { name: string; startWeek: number }[] = [];
  
  let currentDate = new Date(startDate);
  let currentWeek: (ContributionDay | null)[] = [];
  let lastMonth = -1;
  
  // Pad the first week with nulls if it doesn't start on Sunday
  const firstDayOfWeek = currentDate.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const count = dataMap.get(dateStr) || 0;
    
    // Track month changes
    const currentMonth = currentDate.getMonth();
    if (currentMonth !== lastMonth) {
      months.push({ name: MONTHS[currentMonth], startWeek: weeks.length });
      lastMonth = currentMonth;
    }
    
    currentWeek.push({ date: dateStr, count });
    
    // If it's Saturday, start a new week
    if (currentDate.getDay() === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Push the last incomplete week
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  return { weeks, months };
}

export function ContributionHeatmap({ data, title, colorScheme = "green" }: ContributionHeatmapProps) {
  const { weeks, months } = useMemo(() => generateCalendarGrid(data), [data]);
  
  const totalContributions = useMemo(() => data.reduce((sum, d) => sum + d.count, 0), [data]);
  const maxCount = useMemo(() => Math.max(...data.map(d => d.count), 1), [data]);
  
  return (
    <div className="space-y-2">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{totalContributions} contributions in the last year</h3>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-max">
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {months.map((month, i) => (
              <div
                key={`${month.name}-${i}`}
                className="text-xs text-muted-foreground"
                style={{
                  marginLeft: i === 0 ? `${month.startWeek * 13}px` : `${(month.startWeek - months[i - 1].startWeek - 3) * 13}px`,
                  minWidth: "30px",
                }}
              >
                {month.name}
              </div>
            ))}
          </div>
          
          {/* Grid */}
          <div className="flex gap-[3px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-1">
              {DAYS_OF_WEEK.map((day, i) => (
                <div key={i} className="h-[10px] text-[10px] text-muted-foreground leading-[10px] w-6">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Weeks */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => (
                  day ? (
                    <Tooltip key={`${weekIndex}-${dayIndex}`}>
                      <TooltipTrigger asChild>
                        <div
                          className={`h-[10px] w-[10px] rounded-[2px] ${getColorClass(day.count, maxCount, colorScheme)} transition-colors hover:ring-1 hover:ring-foreground/20`}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <p className="font-medium">{day.count} contributions</p>
                        <p className="text-muted-foreground">{new Date(day.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div key={`${weekIndex}-${dayIndex}`} className="h-[10px] w-[10px]" />
                  )
                ))}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-2 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-[3px]">
              <div className="h-[10px] w-[10px] rounded-[2px] bg-muted/50" />
              {[1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={`h-[10px] w-[10px] rounded-[2px] ${getColorClass(level * (maxCount / 4), maxCount, colorScheme)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
