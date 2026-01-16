import { Link } from "react-router-dom";
import { ArrowRight, Search, Upload, Trophy, Shield, GitBranch, Cpu, FileCode, Sparkles, TrendingUp, Loader2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TechBadge } from "@/components/TechBadge";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useStats, useLeaderboard } from "@/hooks/api";
import { getScoreColor, getScoreBgColor } from "@/lib/mockData";

const features = [
  {
    icon: FileCode,
    title: "Tech Stack Detection",
    description: "Automatically identifies languages, frameworks, and architecture patterns used in the project.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconBg: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: GitBranch,
    title: "Commit Forensics",
    description: "Analyzes commit patterns, contributor distribution, and detects suspicious last-minute bursts.",
    gradient: "from-emerald-500/20 to-green-500/20",
    iconBg: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: Shield,
    title: "Security Scanning",
    description: "Identifies exposed secrets, API keys, and common security vulnerabilities in the codebase.",
    gradient: "from-red-500/20 to-orange-500/20",
    iconBg: "bg-red-500/10 text-red-500",
  },
  {
    icon: Cpu,
    title: "AI Detection",
    description: "Uses advanced heuristics to estimate AI-generated code percentage and authenticity.",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconBg: "bg-purple-500/10 text-purple-500",
  },
];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: leaderboardData, isLoading: leaderboardLoading } = useLeaderboard({ limit: 5 });

  const leaderboard = leaderboardData || [];
  const totalProjects = stats?.totalProjects || 0;
  const averageScore = stats?.averageScore || 0;
  const totalSecurityIssues = stats?.totalSecurityIssues || 0;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Hero Section - Redesigned */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/5 via-background to-background p-8 md:p-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="absolute top-0 right-0 h-96 w-96 -translate-y-1/4 translate-x-1/4 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <Sparkles className="h-6 w-6 text-primary" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="h-6 w-6 text-primary opacity-30" />
              </div>
            </div>
            <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              AI-Powered Evaluation
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            HackEval
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            AI-powered hackathon project evaluation system. Analyze GitHub repositories for 
            code quality, security, originality, and more.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 rounded-xl h-12 px-6">
              <Link to="/analyze">
                <Search className="h-5 w-5" />
                Analyze Repository
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 border-2 hover:bg-primary/5 hover:border-primary/50 transition-all rounded-xl h-12 px-6">
              <Link to="/leaderboard">
                <Trophy className="h-5 w-5" />
                View Leaderboard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Cards - Redesigned */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative group overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-card via-card to-card/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Total Projects Evaluated</CardDescription>
              <div className="p-2 rounded-lg bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {statsLoading ? (
              <div className="h-12 w-20 rounded-lg bg-muted skeleton-shimmer" />
            ) : (
              <div className="text-5xl font-bold text-foreground">
                <AnimatedNumber value={totalProjects} />
              </div>
            )}
            <div className="mt-2 text-xs text-muted-foreground">Across all teams</div>
          </CardContent>
        </Card>

        <Card className="relative group overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-card via-card to-card/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Average Score</CardDescription>
              <div className="p-2 rounded-lg bg-success/10 text-success opacity-0 group-hover:opacity-100 transition-opacity">
                <BarChart3 className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {statsLoading ? (
              <div className="h-12 w-24 rounded-lg bg-muted skeleton-shimmer" />
            ) : (
              <div className={cn("text-5xl font-bold", getScoreColor(averageScore))}>
                <AnimatedNumber value={Math.round(averageScore)} suffix="/100" />
              </div>
            )}
            <div className="mt-2 text-xs text-muted-foreground">System-wide average</div>
          </CardContent>
        </Card>

        <Card className="relative group overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-card via-card to-card/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Security Issues Found</CardDescription>
              <div className="p-2 rounded-lg bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                <Shield className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {statsLoading ? (
              <div className="h-12 w-16 rounded-lg bg-muted skeleton-shimmer" />
            ) : (
              <div className="text-5xl font-bold text-destructive">
                <AnimatedNumber value={totalSecurityIssues} />
              </div>
            )}
            <div className="mt-2 text-xs text-muted-foreground">Detected vulnerabilities</div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions - Redesigned */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="group relative overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-card to-card/50 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <Link to="/analyze" className="block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                  <Search className="h-7 w-7" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <CardTitle className="text-2xl mb-2">Single Repository Analysis</CardTitle>
              <CardDescription className="text-base">
                Submit a GitHub repository URL and team name for immediate, comprehensive evaluation.
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="group relative overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-card to-card/50 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <Link to="/batch" className="block">
            <div className="absolute inset-0 bg-gradient-to-br from-info/10 via-info/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-info/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 rounded-2xl bg-info/10 text-info group-hover:scale-110 transition-transform shadow-lg shadow-info/5">
                  <Upload className="h-7 w-7" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-info group-hover:translate-x-1 transition-all" />
              </div>
              <CardTitle className="text-2xl mb-2">Batch Upload</CardTitle>
              <CardDescription className="text-base">
                Upload a CSV or Excel file with multiple teams for efficient bulk evaluation.
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </section>

      {/* Features Grid - Redesigned */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Evaluation Capabilities
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group relative overflow-hidden rounded-2xl border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 stagger-item"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-30", feature.gradient)} />
              <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />
              <CardHeader className="relative z-10">
                <div className={cn("p-3 rounded-xl w-fit mb-3 shadow-lg transition-transform group-hover:scale-110", feature.iconBg)}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Mini Leaderboard - Redesigned */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-warning/10">
              <Trophy className="h-5 w-5 text-warning" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Top Performers
            </h2>
          </div>
          <Button asChild variant="ghost" className="gap-2 hover:bg-primary/10 hover:text-primary rounded-xl">
            <Link to="/leaderboard">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Card className="overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-0">
            {leaderboardLoading ? (
              <div className="p-12 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="p-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No projects evaluated yet</p>
                <p className="text-muted-foreground/70 text-sm mt-2">Start by analyzing your first repository</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {leaderboard.map((project, index) => (
                  <Link
                    key={project.id}
                    to={`/project/${project.id}`}
                    className="flex items-center justify-between p-5 hover:bg-muted/30 transition-all group stagger-item"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl text-base font-bold transition-all group-hover:scale-110 shadow-md",
                        index === 0 && "rank-gold",
                        index === 1 && "rank-silver",
                        index === 2 && "rank-bronze",
                        index > 2 && "bg-secondary text-secondary-foreground"
                      )}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {project.teamName}
                        </div>
                        <div className="flex gap-1.5 mt-1.5">
                          {project.techStack.slice(0, 3).map((tech) => (
                            <TechBadge key={tech} tech={tech} className="text-xs" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className={cn("text-3xl font-bold tabular-nums", getScoreColor(project.totalScore))}>
                        {project.totalScore}
                      </div>
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-secondary/50 hidden sm:block">
                        <div
                          className={cn("h-full rounded-full transition-all duration-500", getScoreBgColor(project.totalScore))}
                          style={{ width: `${project.totalScore}%` }}
                        />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
