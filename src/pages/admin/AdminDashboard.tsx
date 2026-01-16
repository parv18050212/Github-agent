import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useBatch } from "@/contexts/BatchContext";
import { Users, UserCog, FolderGit2, AlertTriangle, CheckCircle, Clock, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data per batch - will be replaced with useAdminOverview() hook
const mockStatsByBatch: Record<string, {
  totalTeams: number;
  activeTeams: number;
  inactiveTeams: number;
  totalMentors: number;
  unassignedTeams: number;
  analysisQueue: number;
  healthDistribution: { onTrack: number; atRisk: number; critical: number };
}> = {
  "4th-sem-2024": {
    totalTeams: 12,
    activeTeams: 10,
    inactiveTeams: 2,
    totalMentors: 4,
    unassignedTeams: 2,
    analysisQueue: 1,
    healthDistribution: { onTrack: 7, atRisk: 3, critical: 2 },
  },
  "6th-sem-2024": {
    totalTeams: 10,
    activeTeams: 9,
    inactiveTeams: 1,
    totalMentors: 3,
    unassignedTeams: 1,
    analysisQueue: 0,
    healthDistribution: { onTrack: 6, atRisk: 3, critical: 1 },
  },
  "4th-sem-2023": {
    totalTeams: 8,
    activeTeams: 8,
    inactiveTeams: 0,
    totalMentors: 3,
    unassignedTeams: 0,
    analysisQueue: 0,
    healthDistribution: { onTrack: 5, atRisk: 2, critical: 1 },
  },
  "6th-sem-2023": {
    totalTeams: 6,
    activeTeams: 6,
    inactiveTeams: 0,
    totalMentors: 2,
    unassignedTeams: 0,
    analysisQueue: 0,
    healthDistribution: { onTrack: 4, atRisk: 1, critical: 1 },
  },
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const { selectedBatch } = useBatch();
  const navigate = useNavigate();

  // Get stats for selected batch or show empty state
  const stats = selectedBatch ? mockStatsByBatch[selectedBatch.id] : null;

  if (!selectedBatch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <GraduationCap className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">No Batch Selected</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Please select a batch from the dropdown in the header or go to the Batches page to choose one.
        </p>
        <Button onClick={() => navigate("/admin/batches")}>
          Go to Batches
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {selectedBatch.semester} {selectedBatch.year}
            </h1>
            <Badge variant="secondary">{selectedBatch.status}</Badge>
          </div>
          <p className="text-muted-foreground">
            Dashboard overview for {selectedBatch.name}
          </p>
        </div>
        <Badge variant="destructive" className="text-sm">
          Admin
        </Badge>
      </div>

      {/* Primary Stats */}
      {stats && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
                <FolderGit2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTeams}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeTeams} active, {stats.inactiveTeams} inactive
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Mentors</CardTitle>
                <UserCog className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMentors}</div>
                <p className="text-xs text-muted-foreground">
                  Avg {Math.round(stats.totalTeams / stats.totalMentors)} teams/mentor
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
                <Users className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.unassignedTeams}</div>
                <p className="text-xs text-muted-foreground">
                  Teams need mentors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Analysis Queue</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.analysisQueue}</div>
                <p className="text-xs text-muted-foreground">
                  Pending analysis
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Health Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Team Health Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.healthDistribution.onTrack}</p>
                    <p className="text-sm text-muted-foreground">On Track</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.healthDistribution.atRisk}</p>
                    <p className="text-sm text-muted-foreground">At Risk</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.healthDistribution.critical}</p>
                    <p className="text-sm text-muted-foreground">Critical</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
