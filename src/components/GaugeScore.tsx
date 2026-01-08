import { cn } from "@/lib/utils";
import { useEffect, useId, useState } from "react";

interface GaugeScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  showLabel?: boolean;
  className?: string;
}

export function GaugeScore({ score, size = "md", label, showLabel = true, className }: GaugeScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const uid = useId();

  // Clamp score to 0-100
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(clampedScore), 100);
    return () => clearTimeout(timer);
  }, [clampedScore]);

  const sizeConfig = {
    sm: { width: 80, strokeWidth: 8, fontSize: "text-lg", labelSize: "text-xs" },
    md: { width: 120, strokeWidth: 10, fontSize: "text-2xl", labelSize: "text-sm" },
    lg: { width: 160, strokeWidth: 12, fontSize: "text-4xl", labelSize: "text-base" },
  };

  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = radius * Math.PI;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getScoreGradient = (score: number) => {
    if (score >= 80) return `url(#${uid}-excellent)`;
    if (score >= 60) return `url(#${uid}-good)`;
    if (score >= 40) return `url(#${uid}-average)`;
    return `url(#${uid}-poor)`;
  };

  const getGlowColor = (score: number) => {
    if (score >= 80) return "drop-shadow(0 0 8px hsl(var(--score-excellent) / 0.5))";
    if (score >= 60) return "drop-shadow(0 0 8px hsl(var(--score-good) / 0.5))";
    if (score >= 40) return "drop-shadow(0 0 6px hsl(var(--score-average) / 0.5))";
    return "drop-shadow(0 0 6px hsl(var(--score-poor) / 0.5))";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-score-excellent";
    if (score >= 60) return "text-score-good";
    if (score >= 40) return "text-score-average";
    return "text-score-poor";
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <svg
        width={config.width}
        height={config.width / 2 + config.strokeWidth}
        className="overflow-visible"
        style={{ filter: getGlowColor(animatedScore) }}
      >
        <defs>
          <linearGradient id={`${uid}-excellent`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--score-good))" />
            <stop offset="100%" stopColor="hsl(var(--score-excellent))" />
          </linearGradient>
          <linearGradient id={`${uid}-good`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--score-average))" />
            <stop offset="100%" stopColor="hsl(var(--score-good))" />
          </linearGradient>
          <linearGradient id={`${uid}-average`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--score-poor))" />
            <stop offset="100%" stopColor="hsl(var(--score-average))" />
          </linearGradient>
          <linearGradient id={`${uid}-poor`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--destructive))" />
            <stop offset="100%" stopColor="hsl(var(--score-poor))" />
          </linearGradient>
        </defs>
        
        {/* Background arc */}
        <path
          d={`M ${config.strokeWidth / 2} ${config.width / 2}
              A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${config.width / 2}`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Progress arc */}
        <path
          d={`M ${config.strokeWidth / 2} ${config.width / 2}
              A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${config.width / 2}`}
          fill="none"
          stroke={getScoreGradient(animatedScore)}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Score text */}
      <div 
        className={cn(
          "absolute font-bold tabular-nums transition-all duration-500",
          config.fontSize,
          getScoreColor(animatedScore)
        )}
        style={{ top: `${config.width / 2 - 8}px` }}
      >
        {animatedScore}
      </div>
      
      {/* Label */}
      {showLabel && label && (
        <span className={cn("text-muted-foreground mt-1", config.labelSize)}>
          {label}
        </span>
      )}
    </div>
  );
}