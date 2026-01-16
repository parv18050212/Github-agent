import { GitCommit, GitBranch, GitPullRequest, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActivityItem {
  id: string;
  type: "commit" | "branch" | "pr" | "comment";
  title: string;
  description?: string;
  author: string;
  date: string;
  metadata?: {
    additions?: number;
    deletions?: number;
    files?: number;
  };
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
  maxItems?: number;
}

const activityIcons = {
  commit: GitCommit,
  branch: GitBranch,
  pr: GitPullRequest,
  comment: MessageSquare,
};

const activityColors = {
  commit: "text-emerald-500",
  branch: "text-blue-500",
  pr: "text-violet-500",
  comment: "text-amber-500",
};

export function ActivityTimeline({ activities, maxItems = 10 }: ActivityTimelineProps) {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className="relative space-y-0">
      {/* Timeline line */}
      <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />
      
      {displayedActivities.map((activity, index) => {
        const Icon = activityIcons[activity.type];
        const colorClass = activityColors[activity.type];
        
        return (
          <div key={activity.id} className="relative flex gap-4 pb-4">
            {/* Icon */}
            <div className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background border ${colorClass}`}>
              <Icon className="h-3 w-3" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  {activity.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{activity.description}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.date}</span>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{activity.author}</span>
                {activity.metadata && (
                  <div className="flex gap-1">
                    {activity.metadata.additions !== undefined && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 text-emerald-500 border-emerald-500/30">
                        +{activity.metadata.additions}
                      </Badge>
                    )}
                    {activity.metadata.deletions !== undefined && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 text-red-500 border-red-500/30">
                        -{activity.metadata.deletions}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      {activities.length > maxItems && (
        <div className="pl-10 text-xs text-muted-foreground">
          +{activities.length - maxItems} more activities
        </div>
      )}
    </div>
  );
}
