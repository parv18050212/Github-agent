import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Mock data
const mockTeams = [
  { id: "1", name: "Team Alpha", mentor: "Dr. Smith", health: "on_track", batch: "Fall 2024" },
  { id: "2", name: "Team Beta", mentor: "Prof. Johnson", health: "at_risk", batch: "Fall 2024" },
  { id: "3", name: "Team Gamma", mentor: null, health: "critical", batch: "Fall 2024" },
  { id: "4", name: "Team Delta", mentor: "Dr. Williams", health: "on_track", batch: "Fall 2024" },
];

const healthConfig = {
  on_track: { label: "On Track", color: "bg-green-500", icon: CheckCircle },
  at_risk: { label: "At Risk", color: "bg-yellow-500", icon: AlertTriangle },
  critical: { label: "Critical", color: "bg-red-500", icon: AlertTriangle },
};

export default function AdminTeams() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = mockTeams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Teams</h1>
        <p className="text-muted-foreground">View and manage all registered teams</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-4">
        {filteredTeams.map((team) => {
          const health = healthConfig[team.health as keyof typeof healthConfig];
          const HealthIcon = health.icon;

          return (
            <Card key={team.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <CardDescription>{team.batch}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`${health.color} text-white flex items-center gap-1`}
                    >
                      <HealthIcon className="h-3 w-3" />
                      {health.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Mentor: {team.mentor || <span className="text-yellow-500">Unassigned</span>}
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
