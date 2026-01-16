import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ContributionHeatmap } from "./ContributionHeatmap";
import { GitCommit, FileCode, TrendingUp, Clock } from "lucide-react";

interface MemberStats {
  name: string;
  email: string;
  avatarUrl?: string;
  commits: number;
  additions: number;
  deletions: number;
  percentage: number;
  activeDays: number;
  avgCommitsPerDay: number;
  topFileTypes: string[];
  contributionData: { date: string; count: number }[];
  lastActive: string;
  streak: number;
}

interface MemberActivityCardProps {
  member: MemberStats;
  rank: number;
  colorScheme?: "green" | "blue" | "purple";
}

export function MemberActivityCard({ member, rank, colorScheme = "green" }: MemberActivityCardProps) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const getRankBadge = () => {
    if (rank === 1) return <Badge className="bg-amber-500 hover:bg-amber-600">Top Contributor</Badge>;
    if (rank === 2) return <Badge variant="secondary">2nd</Badge>;
    if (rank === 3) return <Badge variant="secondary">3rd</Badge>;
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-background shadow">
              <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {member.name}
                {getRankBadge()}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{member.percentage}%</div>
            <p className="text-xs text-muted-foreground">of total work</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <GitCommit className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-xl font-semibold">{member.commits}</div>
            <p className="text-[10px] text-muted-foreground uppercase">Commits</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <FileCode className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-xl font-semibold text-emerald-500">+{member.additions.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground uppercase">Additions</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-xl font-semibold">{member.activeDays}</div>
            <p className="text-[10px] text-muted-foreground uppercase">Active Days</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-xl font-semibold">{member.streak}</div>
            <p className="text-[10px] text-muted-foreground uppercase">Day Streak</p>
          </div>
        </div>

        {/* Contribution Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Contribution Progress</span>
            <span className="font-medium">{member.percentage}%</span>
          </div>
          <Progress value={member.percentage} className="h-2" />
        </div>

        {/* Top File Types */}
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Most Active In</span>
          <div className="flex flex-wrap gap-1">
            {member.topFileTypes.map((type) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Contribution Heatmap */}
        <div className="pt-2 border-t">
          <ContributionHeatmap 
            data={member.contributionData} 
            title={`${member.name}'s Activity`}
            colorScheme={colorScheme}
          />
        </div>
      </CardContent>
    </Card>
  );
}
