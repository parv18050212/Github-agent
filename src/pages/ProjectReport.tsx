import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Download, Shield, GitBranch, Users, FileCode, AlertTriangle, CheckCircle, Cpu, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScoreCard } from "@/components/ScoreCard";
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/leaderboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.teamName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                {project.repoUrl}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <ScoreCard label="Total Score" score={project.totalScore} size="lg" icon={<Star className="h-4 w-4" />} />
        <ScoreCard label="Quality" score={project.qualityScore} />
        <ScoreCard label="Security" score={project.securityScore} icon={<Shield className="h-4 w-4" />} />
        <ScoreCard label="Originality" score={project.originalityScore} />
        <ScoreCard label="Architecture" score={project.architectureScore} />
        <ScoreCard label="Documentation" score={project.documentationScore} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Project Info */}
        <div className="space-y-6">
          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <TechBadge key={tech} tech={tech} />
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
                    <Badge key={fw} variant="secondary">{fw}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages Breakdown */}
          <Card>
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
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{lang.name}</span>
                    </div>
                    <span className="text-muted-foreground">{lang.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Project Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Files</span>
                <span className="font-medium">{project.totalFiles}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lines of Code</span>
                <span className="font-medium">{project.totalLinesOfCode.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Test Coverage</span>
                <span className={cn("font-medium", getScoreColor(project.testCoverage))}>
                  {project.testCoverage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Commits</span>
                <span className="font-medium">{project.totalCommits}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Commit Forensics & Security */}
        <div className="space-y-6">
          {/* Contributors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contributors
              </CardTitle>
              <CardDescription>
                {project.contributors.length} team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.contributors.map((contributor) => (
                  <div key={contributor.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{contributor.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {contributor.commits} commits ({contributor.percentage}%)
                      </span>
                    </div>
                    <Progress value={contributor.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Commit Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Commit Activity
              </CardTitle>
              {project.burstCommitWarning && (
                <div className="flex items-center gap-2 text-warning text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Burst commit pattern detected
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={project.commitPatterns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="commits"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last-minute commits:</span>
                  <span className={cn("font-medium", project.lastMinuteCommits > 10 ? "text-warning" : "")}>
                    {project.lastMinuteCommits}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
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
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-5 w-5" />
                  <span>All security checks passed</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {project.securityIssues.map((issue, index) => (
                    <div key={index} className="p-3 rounded-lg border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getSeverityColor(issue.severity)}>
                          {issue.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">AI-Generated Code</span>
                  <span className={cn(
                    "font-bold",
                    project.aiGeneratedPercentage > 40 ? "text-warning" : 
                    project.aiGeneratedPercentage > 20 ? "text-muted-foreground" : "text-success"
                  )}>
                    {project.aiGeneratedPercentage}%
                  </span>
                </div>
                <Progress 
                  value={project.aiGeneratedPercentage} 
                  className="h-3"
                />
              </div>
              <Separator />
              <div>
                <span className="text-sm font-medium">AI Verdict</span>
                <p className="text-sm text-muted-foreground mt-2">{project.aiVerdict}</p>
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} width={90} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar 
                      dataKey="score" 
                      fill="hsl(var(--primary))" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Strengths & Improvements */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-medium">Strengths</span>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {project.strengths.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="font-medium">Areas for Improvement</span>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {project.improvements.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
