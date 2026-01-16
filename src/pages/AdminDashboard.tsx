import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FolderGit2, Shield, Activity, TrendingUp, Database, Settings, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { user } = useAuth();

  const systemStats = [
    { label: "Total Users", value: "156", change: "+12%", icon: Users, color: "text-blue-500" },
    { label: "Total Projects", value: "324", change: "+8%", icon: FolderGit2, color: "text-green-500" },
    { label: "Active Mentors", value: "24", change: "+3", icon: Shield, color: "text-purple-500" },
    { label: "System Health", value: "99.8%", change: "Healthy", icon: Activity, color: "text-emerald-500" },
  ];

  const recentActivity = [
    { id: 1, type: "user", action: "New user registered", user: "john@example.com", time: "2m ago" },
    { id: 2, type: "project", action: "Project completed analysis", project: "Team Alpha - AI Bot", time: "15m ago" },
    { id: 3, type: "mentor", action: "Mentor assigned to team", mentor: "Dr. Smith", team: "Team Gamma", time: "1h ago" },
    { id: 4, type: "system", action: "Database backup completed", time: "2h ago" },
  ];

  const userBreakdown = [
    { role: "Students", count: 108, percentage: 69 },
    { role: "Mentors", count: 24, percentage: 15 },
    { role: "Admins", count: 8, percentage: 5 },
    { role: "Pending", count: 16, percentage: 11 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-lg text-muted-foreground mt-1">
              System Overview & Management
            </p>
          </div>
          <Badge variant="outline" className="px-4 py-2 text-sm font-semibold border-destructive/20 bg-destructive/5 text-destructive">
            Administrator
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat) => (
          <Card key={stat.label} className="border-border/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-success">{stat.change}</span> from last month
                  </p>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - 2 columns */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <CardDescription>Latest system events</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  {activity.type === "user" && <Users className="h-4 w-4" />}
                  {activity.type === "project" && <FolderGit2 className="h-4 w-4" />}
                  {activity.type === "mentor" && <Shield className="h-4 w-4" />}
                  {activity.type === "system" && <Database className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {activity.user || activity.project || activity.mentor || "System"}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* User Breakdown - 1 column */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">User Distribution</CardTitle>
            <CardDescription>By role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userBreakdown.map((item) => (
              <div key={item.role} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.role}</span>
                  <span className="text-muted-foreground">{item.count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <Card className="border-border/50 bg-gradient-to-br from-destructive/5 to-card">
        <CardHeader>
          <CardTitle className="text-xl">Admin Actions</CardTitle>
          <CardDescription>System management & configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-primary/5">
              <UserPlus className="h-5 w-5" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-primary/5">
              <Shield className="h-5 w-5" />
              <span>Assign Mentors</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-primary/5">
              <TrendingUp className="h-5 w-5" />
              <span>View Analytics</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-primary/5">
              <Settings className="h-5 w-5" />
              <span>System Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
