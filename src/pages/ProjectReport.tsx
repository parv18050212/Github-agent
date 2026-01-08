import { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Download, Shield, GitBranch, Users, FileCode, AlertTriangle, CheckCircle, Cpu, Clock, Star, Sparkles } from "lucide-react";
import { usePDF } from "react-to-pdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { GaugeScore } from "@/components/GaugeScore";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { TechBadge } from "@/components/TechBadge";
import { getProjectById, getSeverityColor, getScoreColor } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

export default function ProjectReport() {
  const { id } = useParams<{ id: string }>();
  const project = getProjectById(id || "");

  const { toPDF, targetRef } = usePDF({
    filename: project ? `${project.teamName.replace(/\s+/g, '-')}-evaluation-report.pdf` : 'report.pdf',
  });

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The project you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/leaderboard">Back to Leaderboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const languageChartData = project.languages.map((lang) => ({
    name: lang.name,
    value: lang.percentage,
  }));

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
    "hsl(var(--info))",
    "hsl(var(--destructive))",
  ];

  const scoreBreakdown = [
    { name: "Quality", score: project.qualityScore },
    { name: "Security", score: project.securityScore },
    { name: "Originality", score: project.originalityScore },
    { name: "Architecture", score: project.architectureScore },
    { name: "Documentation", score: project.documentationScore },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="hover:bg-primary/10">
            <Link to="/leaderboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {project.teamName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                {project.repoUrl}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => toPDF()} 
            className="gap-2 gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Report Content - for PDF */}
      <div ref={targetRef}>
        {/* Score Overview - Premium Gauge Panel */}
        <Card className="glass-card gradient-border overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Score Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="col-span-2 md:col-span-1 lg:col-span-1 flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <GaugeScore score={project.totalScore} size="lg" label="Total Score" />
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <GaugeScore score={project.qualityScore} size="sm" label="Quality" />
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <GaugeScore score={project.securityScore} size="sm" label="Security" />
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <GaugeScore score={project.originalityScore} size="sm" label="Originality" />
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <GaugeScore score={project.architectureScore} size="sm" label="Architecture" />
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <GaugeScore score={project.documentationScore} size="sm" label="Docs" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Project Info */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <Card className="card-hover glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <FileCode className="h-4 w-4" />
                  </div>
                  Tech Stack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <div 
                      key={tech} 
                      className="stagger-item"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <TechBadge tech={tech} />
                    </div>
                  ))}
                </div>
                <Separator />
                <div>
                  <span className="text-sm font-medium">Architecture Pattern</span>
                  <p className="text-muted-foreground">{project.architecturePattern}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Frameworks</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.frameworks.map((fw) => (
                      <Badge key={fw} variant="secondary" className="bg-secondary/50">{fw}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Languages Breakdown */}
            <Card className="card-hover glass-card">
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={languageChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {languageChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                          boxShadow: "0 10px 40px -10px hsl(var(--primary) / 0.2)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {project.languages.map((lang, index) => (
                    <div key={lang.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full shadow-sm"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{lang.name}</span>
                      </div>
                      <span className="text-muted-foreground font-medium">{lang.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card className="card-hover glass-card score-card">
              <CardHeader>
                <CardTitle>Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Total Files</span>
                  <span className="font-bold text-lg">
                    <AnimatedNumber value={project.totalFiles} />
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Lines of Code</span>
                  <span className="font-bold text-lg">
                    <AnimatedNumber value={project.totalLinesOfCode} />
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Test Coverage</span>
                  <span className={cn("font-bold text-lg", getScoreColor(project.testCoverage))}>
                    <AnimatedNumber value={project.testCoverage} suffix="%" />
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Total Commits</span>
                  <span className="font-bold text-lg">
                    <AnimatedNumber value={project.totalCommits} />
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Commit Forensics & Security */}
          <div className="space-y-6">
            {/* Contributors */}
            <Card className="card-hover glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-info/10 text-info">
                    <Users className="h-4 w-4" />
                  </div>
                  Contributors
                </CardTitle>
                <CardDescription>
                  {project.contributors.length} team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.contributors.map((contributor, i) => (
                    <div 
                      key={contributor.name} 
                      className="space-y-2 stagger-item"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{contributor.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {contributor.commits} commits ({contributor.percentage}%)
                        </span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-1000"
                          style={{ width: `${contributor.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Commit Timeline */}
            <Card className="card-hover glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-success/10 text-success">
                    <GitBranch className="h-4 w-4" />
                  </div>
                  Commit Activity
                </CardTitle>
                {project.burstCommitWarning && (
                  <div className="flex items-center gap-2 text-warning text-sm bg-warning/10 px-3 py-1.5 rounded-full w-fit">
                    <AlertTriangle className="h-4 w-4" />
                    Burst commit pattern detected
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={project.commitPatterns}>
                      <defs>
                        <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString("en", { month: "short", day: "numeric" })}
                      />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                          boxShadow: "0 10px 40px -10px hsl(var(--primary) / 0.2)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="commits"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#commitGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm p-3 rounded-lg bg-muted/30">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last-minute commits:</span>
                  <span className={cn("font-bold", project.lastMinuteCommits > 10 ? "text-warning" : "text-foreground")}>
                    {project.lastMinuteCommits}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Security Issues */}
            <Card className="card-hover glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={cn(
                    "p-2 rounded-lg",
                    project.securityIssues.length === 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  )}>
                    <Shield className="h-4 w-4" />
                  </div>
                  Security Findings
                </CardTitle>
                <CardDescription>
                  {project.securityIssues.length === 0
                    ? "No security issues detected"
                    : `${project.securityIssues.length} issue(s) found`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.securityIssues.length === 0 ? (
                  <div className="flex items-center gap-2 text-success p-4 rounded-lg bg-success/10 border border-success/20">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">All security checks passed</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {project.securityIssues.map((issue, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "p-3 rounded-lg border-l-4 bg-card",
                          issue.severity === "high" && "border-l-destructive bg-destructive/5",
                          issue.severity === "medium" && "border-l-warning bg-warning/5",
                          issue.severity === "low" && "border-l-info bg-info/5"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getSeverityColor(issue.severity)}>
                            {issue.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                            {issue.file}:{issue.line}
                          </span>
                        </div>
                        <div className="font-medium text-sm">{issue.type}</div>
                        <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Analysis & Scores */}
          <div className="space-y-6">
            {/* AI Detection */}
            <Card className="card-hover glass-card gradient-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary animate-pulse-glow">
                    <Cpu className="h-4 w-4" />
                  </div>
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">AI-Generated Code</span>
                    <span className={cn(
                      "font-bold text-xl",
                      project.aiGeneratedPercentage > 40 ? "text-warning" : 
                      project.aiGeneratedPercentage > 20 ? "text-muted-foreground" : "text-success"
                    )}>
                      <AnimatedNumber value={project.aiGeneratedPercentage} suffix="%" />
                    </span>
                  </div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        project.aiGeneratedPercentage > 40 ? "bg-gradient-to-r from-warning to-warning/70" :
                        project.aiGeneratedPercentage > 20 ? "bg-gradient-to-r from-muted-foreground to-muted-foreground/70" :
                        "bg-gradient-to-r from-success to-success/70"
                      )}
                      style={{ width: `${project.aiGeneratedPercentage}%` }}
                    />
                  </div>
                </div>
                <Separator />
                <div className="p-4 rounded-xl bg-muted/30 border-l-4 border-primary">
                  <span className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Verdict
                  </span>
                  <p className="text-sm text-muted-foreground italic">&ldquo;{project.aiVerdict}&rdquo;</p>
                </div>
              </CardContent>
            </Card>

            {/* Score Breakdown Chart */}
            <Card className="card-hover glass-card">
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreBreakdown} layout="vertical">
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} width={90} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                          boxShadow: "0 10px 40px -10px hsl(var(--primary) / 0.2)",
                        }}
                      />
                      <Bar 
                        dataKey="score" 
                        fill="url(#barGradient)"
                        radius={[0, 6, 6, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Strengths & Improvements */}
            <Card className="card-hover glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-warning" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-success/5 border border-success/20">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="font-medium text-success">Strengths</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {project.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-success mt-1">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="font-medium text-warning">Areas for Improvement</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {project.improvements.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-warning mt-1">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}