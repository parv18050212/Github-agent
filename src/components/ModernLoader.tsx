import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function ModernLoader({ size = "md", className, text }: ModernLoaderProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}
