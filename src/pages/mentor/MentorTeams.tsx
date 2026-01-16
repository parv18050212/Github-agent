import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Search, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Mock data - will be replaced with useMentorTeams() hook
const mockTeams = [
  {
    id: "1",
    name: "Team Alpha",
    repoUrl: "https://github.com/team-alpha/hackathon-project",
    lastActivity: "2 hours ago",
    health: "on_track" as const,
    members: 4,
    score: 85,
  },
  {
    id: "2",
    name: "Team Beta",
    repoUrl: "https://github.com/team-beta/ai-assistant",
    lastActivity: "1 day ago",
    health: "at_risk" as const,
    members: 3,
    score: 62,
  },
  {
    id: "3",
    name: "Team Gamma",
    repoUrl: "https://github.com/team-gamma/web-app",
    lastActivity: "3 days ago",
    health: "critical" as const,
    members: 5,
    score: 38,
  },
];

const healthConfig = {
  on_track: { label: "On Track", color: "bg-green-500", icon: CheckCircle },
  at_risk: { label: "At Risk", color: "bg-yellow-500", icon: AlertTriangle },
  critical: { label: "Critical", color: "bg-red-500", icon: AlertTriangle },
};

export default function MentorTeams() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = mockTeams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Teams</h1>
        <p className="text-muted-foreground">
          Manage and evaluate your assigned teams
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Teams List */}
      <div className="space-y-4">
        {filteredTeams.map((team) => {
          const health = healthConfig[team.health];
          const HealthIcon = health.icon;

          return (
            <Card key={team.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <ExternalLink className="h-3 w-3" />
                        <a
                          href={team.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {team.repoUrl.replace("https://github.com/", "")}
                        </a>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`${health.color} text-white flex items-center gap-1`}
                    >
                      <HealthIcon className="h-3 w-3" />
                      {health.label}
                    </Badge>
                    <Button asChild>
                      <Link to={`/mentor/teams/${team.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>{team.members} members</span>
                  <span>Last activity: {team.lastActivity}</span>
                  <span>Current Score: {team.score}/100</span>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredTeams.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No teams found matching your search.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
