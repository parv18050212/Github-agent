import { Link } from "react-router-dom";
import { ArrowRight, Search, Upload, Trophy, Shield, GitBranch, Cpu, FileCode, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProjects, getLeaderboard } from "@/lib/mockData";
import { TechBadge } from "@/components/TechBadge";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { cn } from "@/lib/utils";
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
  const leaderboard = getLeaderboard().slice(0, 5);
  const totalProjects = mockProjects.length;
  const averageScore = Math.round(
    mockProjects.reduce((acc, p) => acc + p.totalScore, 0) / totalProjects
  );
  const totalSecurityIssues = mockProjects.reduce((acc, p) => acc + p.securityIssues.length, 0);

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-12 shine">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              AI-Powered Evaluation
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            HackEval
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
            AI-powered hackathon project evaluation system. Analyze GitHub repositories for 
            code quality, security, originality, and more.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2 gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              <Link to="/analyze">
                <Search className="h-5 w-5" />
                Analyze Repository
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 glass hover:bg-primary/10 transition-all">
              <Link to="/leaderboard">
                <Trophy className="h-5 w-5" />
                View Leaderboard
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-20">
          <div className="h-96 w-96 rounded-full bg-primary blur-3xl animate-float" />
        </div>
        <div className="absolute bottom-0 left-1/4 translate-y-1/2 opacity-10">
          <div className="h-64 w-64 rounded-full bg-primary blur-3xl" />
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover glass-card score-card group">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Total Projects Evaluated</CardDescription>
              <TrendingUp className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">
              <AnimatedNumber value={totalProjects} />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover glass-card score-card group">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Average Score</CardDescription>
              <TrendingUp className="h-4 w-4 text-success opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn("text-4xl font-bold", getScoreColor(averageScore))}>
              <AnimatedNumber value={averageScore} suffix="/100" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover glass-card score-card group">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Security Issues Found</CardDescription>
              <Shield className="h-4 w-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-destructive">
              <AnimatedNumber value={totalSecurityIssues} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="group card-hover glass-card cursor-pointer overflow-hidden">
          <Link to="/analyze" className="block">
            <CardHeader className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between relative z-10">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Search className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <CardTitle className="mt-4 relative z-10">Single Repository Analysis</CardTitle>
              <CardDescription className="relative z-10">
                Submit a GitHub repository URL and team name for immediate evaluation.
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
        <Card className="group card-hover glass-card cursor-pointer overflow-hidden">
          <Link to="/batch" className="block">
            <CardHeader className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-info/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between relative z-10">
                <div className="p-3 rounded-xl bg-info/10 text-info group-hover:scale-110 transition-transform">
                  <Upload className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-info group-hover:translate-x-1 transition-all" />
              </div>
              <CardTitle className="mt-4 relative z-10">Batch Upload</CardTitle>
              <CardDescription className="relative z-10">
                Upload a CSV or Excel file with multiple teams for bulk evaluation.
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Evaluation Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="card-hover glass-card overflow-hidden stagger-item"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="relative">
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", feature.gradient)} />
                <div className={cn("p-3 rounded-xl w-fit mb-2 relative z-10", feature.iconBg)}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg relative z-10">{feature.title}</CardTitle>
                <CardDescription className="text-sm relative z-10">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Mini Leaderboard */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Top Performers
          </h2>
          <Button asChild variant="ghost" className="gap-2 hover:bg-primary/10">
            <Link to="/leaderboard">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {leaderboard.map((project, index) => (
                <Link
                  key={project.id}
                  to={`/project/${project.id}`}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-all group stagger-item"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-transform group-hover:scale-110",
                      index === 0 && "rank-gold",
                      index === 1 && "rank-silver",
                      index === 2 && "rank-bronze",
                      index > 2 && "bg-secondary text-secondary-foreground"
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {project.teamName}
                      </div>
                      <div className="flex gap-1 mt-1">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <TechBadge key={tech} tech={tech} className="text-xs" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={cn("text-2xl font-bold tabular-nums", getScoreColor(project.totalScore))}>
                      {project.totalScore}
                    </div>
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary hidden sm:block">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", getScoreBgColor(project.totalScore))}
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