import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContributionHeatmap } from "@/components/analytics/ContributionHeatmap";
import { ActivityTimeline } from "@/components/analytics/ActivityTimeline";
import { MemberActivityCard } from "@/components/analytics/MemberActivityCard";
import { 
  ArrowLeft, 
  ExternalLink, 
  GitCommit, 
  Users, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  FileCode,
  Activity
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Generate mock contribution data for the heatmap
function generateMockContributionData(seed: number = 1): { date: string; count: number }[] {
  const data: { date: string; count: number }[] = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 364);
  
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    // Create patterns - more activity in recent months
    const daysAgo = Math.floor((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    const recentMultiplier = Math.max(0.2, 1 - daysAgo / 400);
    const dayOfWeek = currentDate.getDay();
    const weekendPenalty = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 1;
    
    const baseChance = 0.3 * recentMultiplier * weekendPenalty;
    const count = Math.random() < baseChance 
      ? Math.floor(Math.random() * 12 * recentMultiplier * seed) + 1 
      : 0;
    
    data.push({
      date: currentDate.toISOString().split("T")[0],
      count,
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}

// Mock data for the team analytics
const mockTeamAnalytics = {
  id: "1",
  name: "Team Alpha",
  repoUrl: "https://github.com/team-alpha/hackathon-project",
  techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  createdAt: "2024-01-15",
  totalCommits: 342,
  totalAdditions: 15420,
  totalDeletions: 3280,
  activeDays: 45,
  avgCommitsPerDay: 7.6,
  contributors: [
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      commits: 128,
      additions: 6200,
      deletions: 1400,
      percentage: 37,
      activeDays: 38,
      avgCommitsPerDay: 3.4,
      topFileTypes: [".tsx", ".ts", ".css"],
      contributionData: generateMockContributionData(1.2),
      lastActive: "2 hours ago",
      streak: 12,
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      commits: 98,
      additions: 4800,
      deletions: 980,
      percentage: 29,
      activeDays: 32,
      avgCommitsPerDay: 3.1,
      topFileTypes: [".ts", ".json", ".md"],
      contributionData: generateMockContributionData(0.9),
      lastActive: "5 hours ago",
      streak: 8,
    },
    {
      name: "Charlie Davis",
      email: "charlie@example.com",
      commits: 72,
      additions: 2800,
      deletions: 520,
      percentage: 21,
      activeDays: 28,
      avgCommitsPerDay: 2.6,
      topFileTypes: [".tsx", ".test.ts", ".css"],
      contributionData: generateMockContributionData(0.7),
      lastActive: "1 day ago",
      streak: 5,
    },
    {
      name: "Diana Lee",
      email: "diana@example.com",
      commits: 44,
      additions: 1620,
      deletions: 380,
      percentage: 13,
      activeDays: 18,
      avgCommitsPerDay: 2.4,
      topFileTypes: [".md", ".tsx", ".ts"],
      contributionData: generateMockContributionData(0.5),
      lastActive: "3 days ago",
      streak: 2,
    },
  ],
  commitActivity: [
    { week: "Week 1", commits: 12, additions: 450, deletions: 80 },
    { week: "Week 2", commits: 28, additions: 1200, deletions: 220 },
    { week: "Week 3", commits: 45, additions: 2100, deletions: 380 },
    { week: "Week 4", commits: 38, additions: 1800, deletions: 420 },
    { week: "Week 5", commits: 52, additions: 2400, deletions: 510 },
    { week: "Week 6", commits: 67, additions: 3200, deletions: 680 },
    { week: "Week 7", commits: 58, additions: 2800, deletions: 540 },
    { week: "Week 8", commits: 42, additions: 1470, deletions: 450 },
  ],
  hourlyActivity: [
    { hour: "00:00", commits: 2 },
    { hour: "02:00", commits: 1 },
    { hour: "04:00", commits: 0 },
    { hour: "06:00", commits: 3 },
    { hour: "08:00", commits: 12 },
    { hour: "10:00", commits: 28 },
    { hour: "12:00", commits: 18 },
    { hour: "14:00", commits: 35 },
    { hour: "16:00", commits: 42 },
    { hour: "18:00", commits: 38 },
    { hour: "20:00", commits: 25 },
    { hour: "22:00", commits: 15 },
  ],
  recentActivities: [
    { id: "1", type: "commit" as const, title: "Add authentication flow", description: "Implemented OAuth2 login with Google", author: "Alice", date: "2 hours ago", metadata: { additions: 245, deletions: 12 } },
    { id: "2", type: "commit" as const, title: "Fix database connection pool", author: "Bob", date: "5 hours ago", metadata: { additions: 38, deletions: 15 } },
    { id: "3", type: "pr" as const, title: "Feature: User dashboard", description: "Added dashboard with activity charts", author: "Charlie", date: "1 day ago" },
    { id: "4", type: "commit" as const, title: "Update README documentation", author: "Diana", date: "1 day ago", metadata: { additions: 120, deletions: 45 } },
    { id: "5", type: "branch" as const, title: "Created branch: feature/notifications", author: "Alice", date: "2 days ago" },
    { id: "6", type: "commit" as const, title: "Refactor API endpoints", author: "Bob", date: "2 days ago", metadata: { additions: 380, deletions: 290 } },
    { id: "7", type: "comment" as const, title: "Code review feedback", description: "Suggested improvements for error handling", author: "Alice", date: "3 days ago" },
  ],
  warnings: [
    { type: "burst", message: "58% of commits were made in the last 2 days", severity: "medium" },
    { type: "inactive", message: "Diana hasn't committed in 3 days", severity: "low" },
  ],
  languageBreakdown: [
    { name: "TypeScript", value: 62, color: "#3178c6" },
    { name: "JavaScript", value: 18, color: "#f7df1e" },
    { name: "CSS", value: 12, color: "#264de4" },
    { name: "Other", value: 8, color: "#6b7280" },
  ],
};

// Generate team-wide contribution data
const teamContributionData = generateMockContributionData(2);

export default function TeamAnalytics() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  
  const team = mockTeamAnalytics; // Will use API hook later

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{team.name} Analytics</h1>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <ExternalLink className="h-4 w-4" />
              <a
                href={team.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {team.repoUrl.replace("https://github.com/", "")}
              </a>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {team.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {team.warnings.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {team.warnings.map((warning, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                warning.severity === "medium"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              {warning.message}
            </div>
          ))}
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
            <GitCommit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.totalCommits}</div>
            <p className="text-xs text-muted-foreground">
              ~{team.avgCommitsPerDay} per day
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lines Changed</CardTitle>
            <FileCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className="text-emerald-500">+{team.totalAdditions.toLocaleString()}</span>
              {" / "}
              <span className="text-red-500">-{team.totalDeletions.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">net +{(team.totalAdditions - team.totalDeletions).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contributors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.contributors.length}</div>
            <p className="text-xs text-muted-foreground">team members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.activeDays}</div>
            <p className="text-xs text-muted-foreground">days with commits</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Age</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.ceil((new Date().getTime() - new Date(team.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 7))} weeks
            </div>
            <p className="text-xs text-muted-foreground">since {team.createdAt}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="h-4 w-4" />
            Team Overview
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2">
            <Users className="h-4 w-4" />
            Individual Members
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2">
            <GitCommit className="h-4 w-4" />
            Activity Timeline
          </TabsTrigger>
        </TabsList>

        {/* Team Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Team Contribution Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Team Contribution Activity</CardTitle>
              <CardDescription>Combined activity from all team members</CardDescription>
            </CardHeader>
            <CardContent>
              <ContributionHeatmap data={teamContributionData} title="Team Activity" colorScheme="green" />
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Commit Activity Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Commit Activity</CardTitle>
                <CardDescription>Commits and code changes per week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={team.commitActivity}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="week" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="commits"
                        stackId="1"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Hourly Activity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Commit Time Distribution</CardTitle>
                <CardDescription>When does the team typically commit?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={team.hourlyActivity}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="hour" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="commits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Language Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Language Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={team.languageBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {team.languageBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {team.languageBreakdown.map((lang) => (
                    <div key={lang.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: lang.color }} />
                        <span>{lang.name}</span>
                      </div>
                      <span className="font-medium">{lang.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contribution Distribution */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Contribution Distribution</CardTitle>
                <CardDescription>Work distribution across team members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {team.contributors.map((member, index) => (
                  <div key={member.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {index === 0 && <Badge className="bg-amber-500 text-xs">Top</Badge>}
                        <span className="font-medium">{member.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {member.commits} commits • {member.percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${member.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Individual Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {team.contributors.map((member, index) => (
              <MemberActivityCard
                key={member.email}
                member={member}
                rank={index + 1}
                colorScheme={index === 0 ? "green" : index === 1 ? "blue" : "purple"}
              />
            ))}
          </div>
        </TabsContent>

        {/* Activity Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest commits, branches, and pull requests</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={team.recentActivities} maxItems={20} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
