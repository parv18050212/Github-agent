import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, AlertTriangle, BarChart3, GraduationCap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBatch } from "@/contexts/BatchContext";

// Mock data with batchId
const mockTeams = [
  { id: "1", name: "Team Alpha", mentor: "Dr. Smith", health: "on_track", batchId: "4th-sem-2024" },
  { id: "2", name: "Team Beta", mentor: "Prof. Johnson", health: "at_risk", batchId: "4th-sem-2024" },
  { id: "3", name: "Team Gamma", mentor: null, health: "critical", batchId: "4th-sem-2024" },
  { id: "4", name: "Team Delta", mentor: "Dr. Williams", health: "on_track", batchId: "4th-sem-2024" },
  { id: "5", name: "Team Epsilon", mentor: "Dr. Smith", health: "on_track", batchId: "6th-sem-2024" },
  { id: "6", name: "Team Zeta", mentor: "Prof. Brown", health: "at_risk", batchId: "6th-sem-2024" },
  { id: "7", name: "Team Eta", mentor: "Dr. Williams", health: "on_track", batchId: "6th-sem-2024" },
  { id: "8", name: "Team Theta", mentor: null, health: "critical", batchId: "4th-sem-2023" },
  { id: "9", name: "Team Iota", mentor: "Prof. Johnson", health: "on_track", batchId: "4th-sem-2023" },
  { id: "10", name: "Team Kappa", mentor: "Dr. Smith", health: "on_track", batchId: "6th-sem-2023" },
];

const healthConfig = {
  on_track: { label: "On Track", color: "bg-green-500", icon: CheckCircle },
  at_risk: { label: "At Risk", color: "bg-yellow-500", icon: AlertTriangle },
  critical: { label: "Critical", color: "bg-red-500", icon: AlertTriangle },
};

export default function AdminTeams() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { selectedBatch } = useBatch();

  // Filter teams by selected batch and search query
  const filteredTeams = mockTeams
    .filter((team) => selectedBatch ? team.batchId === selectedBatch.id : true)
    .filter((team) => team.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!selectedBatch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <GraduationCap className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">No Batch Selected</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Please select a batch from the dropdown in the header to view teams.
        </p>
        <Button onClick={() => navigate("/admin/batches")}>
          Go to Batches
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <Badge variant="secondary">{selectedBatch.semester} {selectedBatch.year}</Badge>
        </div>
        <p className="text-muted-foreground">
          {filteredTeams.length} teams in {selectedBatch.name}
        </p>
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
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={() => navigate(`/admin/teams/${team.id}/analytics`)}
                  >
                    <BarChart3 className="h-3 w-3" />
                    Analytics
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
