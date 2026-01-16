import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TechBadgeProps {
  tech: string;
  variant?: "default" | "outline" | "secondary";
  className?: string;
}

// Tech-specific colors (using semantic tokens where possible)
const techColors: Record<string, string> = {
  react: "bg-info/20 text-info border-info/30",
  typescript: "bg-primary/20 text-primary border-primary/30",
  javascript: "bg-warning/20 text-warning border-warning/30",
  python: "bg-success/20 text-success border-success/30",
  node: "bg-success/20 text-success border-success/30",
  "node.js": "bg-success/20 text-success border-success/30",
  postgresql: "bg-primary/20 text-primary border-primary/30",
  mongodb: "bg-success/20 text-success border-success/30",
  redis: "bg-destructive/20 text-destructive border-destructive/30",
  docker: "bg-info/20 text-info border-info/30",
  aws: "bg-warning/20 text-warning border-warning/30",
  firebase: "bg-warning/20 text-warning border-warning/30",
  graphql: "bg-destructive/20 text-destructive border-destructive/30",
  vue: "bg-success/20 text-success border-success/30",
  "vue.js": "bg-success/20 text-success border-success/30",
  go: "bg-info/20 text-info border-info/30",
  solidity: "bg-muted text-muted-foreground border-border",
  unity: "bg-foreground/20 text-foreground border-foreground/30",
  fastapi: "bg-success/20 text-success border-success/30",
};

export function TechBadge({ tech, variant = "outline", className }: TechBadgeProps) {
  const colorClass = techColors[tech.toLowerCase()] || "bg-secondary text-secondary-foreground border-border";
  
  return (
    <Badge
      variant={variant}
      className={cn("font-semibold rounded-lg px-2.5 py-0.5 transition-all hover:scale-105", colorClass, className)}
    >
      {tech}
    </Badge>
  );
}
