import { cn } from "@/lib/utils";
import { getScoreColor, getScoreBgColor } from "@/lib/mockData";
import { useEffect, useState } from "react";

interface ScoreCardProps {
  label: string;
  score: number;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  showBar?: boolean;
}

export function ScoreCard({ label, score, icon, size = "md", showBar = true }: ScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const scoreSizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <div className={cn(
      "rounded-xl border bg-card/80 backdrop-blur-sm score-card card-hover",
      sizeClasses[size]
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon && (
          <span className="text-primary/70 p-1.5 rounded-lg bg-primary/10">
            {icon}
          </span>
        )}
      </div>
      <div className={cn("font-bold tabular-nums", scoreSizeClasses[size], getScoreColor(score))}>
        {animatedScore}
        <span className="text-base font-normal text-muted-foreground">/100</span>
      </div>
      {showBar && (
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary/50">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-out",
              getScoreBgColor(score)
            )}
            style={{ width: `${animatedScore}%` }}
          />
        </div>
      )}
    </div>
  );
}
