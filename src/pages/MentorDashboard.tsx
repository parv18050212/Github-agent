import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FolderGit2, MessageSquare, Award, TrendingUp, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MentorDashboard() {
  const { user } = useAuth();

  const teams = [
    { id: 1, name: "Team Alpha", members: 4, projects: 2, status: "active" },
    { id: 2, name: "Team Beta", members: 5, projects: 3, status: "active" },
    { id: 3, name: "Team Gamma", members: 3, projects: 1, status: "pending" },
  ];

  const recentProjects = [
    { id: 1, team: "Team Alpha", repo: "ai-chatbot", score: 87, status: "completed" },
    { id: 2, team: "Team Beta", repo: "blockchain-wallet", score: 0, status: "analyzing" },
    { id: 3, team: "Team Gamma", repo: "iot-dashboard", score: 92, status: "completed" },
  ];

  const stats = [
    { label: "Total Teams", value: "3", icon: Users, color: "text-blue-500" },
    { label: "Active Projects", value: "6", icon: FolderGit2, color: "text-green-500" },
    { label: "Pending Reviews", value: "2", icon: MessageSquare, color: "text-orange-500" },
    { label: "Avg Team Score", value: "89.5", icon: Award, color: "text-purple-500" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Mentor Dashboard</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Welcome back, {user?.email?.split("@")[0]}
            </p>
          </div>
          <Badge variant="outline" className="px-4 py-2 text-sm font-semibold border-primary/20 bg-primary/5 text-primary">
            Mentor
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-muted/50 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teams Overview */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">My Teams</CardTitle>
                <CardDescription>Teams you're mentoring</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {teams.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{team.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {team.members} members · {team.projects} projects
                    </p>
                  </div>
                </div>
                <Badge variant={team.status === "active" ? "default" : "secondary"}>
                  {team.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Projects</CardTitle>
                <CardDescription>Latest team submissions</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <FolderGit2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold font-mono text-sm">{project.repo}</p>
                    <p className="text-sm text-muted-foreground">{project.team}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {project.status === "completed" ? (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      {project.score}/100
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                      <Clock className="h-3 w-3 mr-1" />
                      Analyzing
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-card">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription>Common mentor tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <MessageSquare className="h-5 w-5" />
              <span>Review Comments</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>View Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="h-5 w-5" />
              <span>Manage Teams</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
