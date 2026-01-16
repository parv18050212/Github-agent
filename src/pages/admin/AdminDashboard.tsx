import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Users, UserCog, FolderGit2, AlertTriangle, CheckCircle, Clock } from "lucide-react";

// Mock data - will be replaced with useAdminOverview() hook
const mockStats = {
  totalTeams: 24,
  activeTeams: 20,
  inactiveTeams: 4,
  totalMentors: 8,
  unassignedTeams: 3,
  analysisQueue: 2,
  healthDistribution: {
    onTrack: 14,
    atRisk: 6,
    critical: 4,
  },
};

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            System overview and management
          </p>
        </div>
        <Badge variant="destructive" className="text-sm">
          Admin
        </Badge>
      </div>

      {/* Primary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <FolderGit2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalTeams}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.activeTeams} active, {mockStats.inactiveTeams} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mentors</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalMentors}</div>
            <p className="text-xs text-muted-foreground">
              Avg {Math.round(mockStats.totalTeams / mockStats.totalMentors)} teams/mentor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
            <Users className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.unassignedTeams}</div>
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
            <div className="text-2xl font-bold">{mockStats.analysisQueue}</div>
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
                <p className="text-2xl font-bold">{mockStats.healthDistribution.onTrack}</p>
                <p className="text-sm text-muted-foreground">On Track</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{mockStats.healthDistribution.atRisk}</p>
                <p className="text-sm text-muted-foreground">At Risk</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{mockStats.healthDistribution.critical}</p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
