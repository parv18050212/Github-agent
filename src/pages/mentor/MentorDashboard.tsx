import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Users, TrendingUp, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";

// Mock data - will be replaced with useMentorTeams() hook
const mockTeams = [
  {
    id: "1",
    name: "Team Alpha",
    repoUrl: "https://github.com/team-alpha/hackathon-project",
    lastActivity: "2 hours ago",
    health: "on_track" as const,
    contributionBalance: 85,
    riskFlags: [],
  },
  {
    id: "2",
    name: "Team Beta",
    repoUrl: "https://github.com/team-beta/ai-assistant",
    lastActivity: "1 day ago",
    health: "at_risk" as const,
    contributionBalance: 45,
    riskFlags: ["low_activity", "imbalanced"],
  },
  {
    id: "3",
    name: "Team Gamma",
    repoUrl: "https://github.com/team-gamma/web-app",
    lastActivity: "3 days ago",
    health: "critical" as const,
    contributionBalance: 20,
    riskFlags: ["plagiarism", "last_minute_rush", "low_activity"],
  },
];

const healthConfig = {
  on_track: { label: "On Track", color: "bg-green-500", icon: CheckCircle },
  at_risk: { label: "At Risk", color: "bg-yellow-500", icon: AlertTriangle },
  critical: { label: "Critical", color: "bg-red-500", icon: AlertTriangle },
};

const riskFlagLabels: Record<string, string> = {
  plagiarism: "Plagiarism Detected",
  last_minute_rush: "Last-Minute Rush",
  low_activity: "Low Activity",
  imbalanced: "Contribution Imbalance",
};

export default function MentorDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {user?.email?.split("@")[0] || "Mentor"}
          </h1>
          <p className="text-muted-foreground">
            You have {mockTeams.length} teams assigned to you
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Mentor
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTeams.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">On Track</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTeams.filter((t) => t.health === "on_track").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTeams.filter((t) => t.health !== "on_track").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Teams</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockTeams.map((team) => {
            const health = healthConfig[team.health];
            const HealthIcon = health.icon;

            return (
              <Card key={team.id} className="relative overflow-hidden">
                {/* Health indicator strip */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${health.color}`} />
                
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <ExternalLink className="h-3 w-3" />
                        <a
                          href={team.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline truncate max-w-[200px]"
                        >
                          {team.repoUrl.replace("https://github.com/", "")}
                        </a>
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${health.color} text-white flex items-center gap-1`}
                    >
                      <HealthIcon className="h-3 w-3" />
                      {health.label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Last Activity */}
                  <p className="text-sm text-muted-foreground">
                    Last activity: {team.lastActivity}
                  </p>

                  {/* Contribution Balance */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Contribution Balance</span>
                      <span className={team.contributionBalance < 50 ? "text-yellow-500" : ""}>
                        {team.contributionBalance}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          team.contributionBalance >= 70
                            ? "bg-green-500"
                            : team.contributionBalance >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${team.contributionBalance}%` }}
                      />
                    </div>
                  </div>

                  {/* Risk Flags */}
                  {team.riskFlags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {team.riskFlags.map((flag) => (
                        <Badge key={flag} variant="destructive" className="text-xs">
                          {riskFlagLabels[flag] || flag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* View Team Button */}
                  <Button className="w-full" variant="outline" asChild>
                    <a href={`/mentor/teams/${team.id}`}>View Team</a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
