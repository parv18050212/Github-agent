import { Link } from "react-router-dom";
import { ArrowRight, Search, Upload, Trophy, Shield, GitBranch, Cpu, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProjects, getLeaderboard } from "@/lib/mockData";
import { TechBadge } from "@/components/TechBadge";
import { cn } from "@/lib/utils";
import { getScoreColor, getScoreBgColor } from "@/lib/mockData";

const features = [
  {
    icon: FileCode,
    title: "Tech Stack Detection",
    description: "Automatically identifies languages, frameworks, and architecture patterns used in the project.",
  },
  {
    icon: GitBranch,
    title: "Commit Forensics",
    description: "Analyzes commit patterns, contributor distribution, and detects suspicious last-minute bursts.",
  },
  {
    icon: Shield,
    title: "Security Scanning",
    description: "Identifies exposed secrets, API keys, and common security vulnerabilities in the codebase.",
  },
  {
    icon: Cpu,
    title: "AI Detection",
    description: "Uses advanced heuristics to estimate AI-generated code percentage and authenticity.",
  },
];

export default function Dashboard() {
  const leaderboard = getLeaderboard().slice(0, 5);
  const totalProjects = mockProjects.length;
  const averageScore = Math.round(
    mockProjects.reduce((acc, p) => acc + p.totalScore, 0) / totalProjects
  );

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border p-8 md:p-12">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            HackEval
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
            AI-powered hackathon project evaluation system. Analyze GitHub repositories for 
            code quality, security, originality, and more.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/analyze">
                <Search className="h-5 w-5" />
                Analyze Repository
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/leaderboard">
                <Trophy className="h-5 w-5" />
                View Leaderboard
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10">
          <div className="h-96 w-96 rounded-full bg-primary blur-3xl" />
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Projects Evaluated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{totalProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={cn("text-4xl font-bold", getScoreColor(averageScore))}>
              {averageScore}/100
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Security Issues Found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-destructive">
              {mockProjects.reduce((acc, p) => acc + p.securityIssues.length, 0)}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
          <Link to="/analyze" className="block">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Search className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <CardTitle className="mt-4">Single Repository Analysis</CardTitle>
              <CardDescription>
                Submit a GitHub repository URL and team name for immediate evaluation.
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
        <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
          <Link to="/batch" className="block">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Upload className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <CardTitle className="mt-4">Batch Upload</CardTitle>
              <CardDescription>
                Upload a CSV or Excel file with multiple teams for bulk evaluation.
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Evaluation Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card">
              <CardHeader>
                <div className="p-3 rounded-lg bg-secondary text-secondary-foreground w-fit mb-2">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Mini Leaderboard */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Top Performers</h2>
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/leaderboard">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {leaderboard.map((project, index) => (
                <Link
                  key={project.id}
                  to={`/project/${project.id}`}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                      index === 0 && "bg-warning/20 text-warning",
                      index === 1 && "bg-muted text-muted-foreground",
                      index === 2 && "bg-warning/10 text-warning/80",
                      index > 2 && "bg-secondary text-secondary-foreground"
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{project.teamName}</div>
                      <div className="flex gap-1 mt-1">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <TechBadge key={tech} tech={tech} className="text-xs" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={cn("text-2xl font-bold", getScoreColor(project.totalScore))}>
                      {project.totalScore}
                    </div>
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary hidden sm:block">
                      <div
                        className={cn("h-full rounded-full", getScoreBgColor(project.totalScore))}
                        style={{ width: `${project.totalScore}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
