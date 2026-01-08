import { cn } from "@/lib/utils";
import { getScoreColor, getScoreBgColor } from "@/lib/mockData";

interface ScoreCardProps {
  label: string;
  score: number;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  showBar?: boolean;
}

export function ScoreCard({ label, score, icon, size = "md", showBar = true }: ScoreCardProps) {
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
    <div className={cn("rounded-lg border bg-card", sizeClasses[size])}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className={cn("font-bold", scoreSizeClasses[size], getScoreColor(score))}>
        {score}
        <span className="text-base font-normal text-muted-foreground">/100</span>
      </div>
      {showBar && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn("h-full rounded-full transition-all", getScoreBgColor(score))}
            style={{ width: `${score}%` }}
          />
        </div>
      )}
    </div>
  );
}
