import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Download, Shield, GitBranch, Users, FileCode, AlertTriangle, CheckCircle, Cpu, Clock, Sparkles, Loader2, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GaugeScore } from "@/components/GaugeScore";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { TechBadge } from "@/components/TechBadge";
import { useProjectDetails, useDeleteProject } from "@/hooks/api";
import { useProjectCommits } from "@/hooks/api/useProjectCommits";
import { useProjectTree } from "@/hooks/api/useProjectTree";
import { getSeverityColor, getScoreColor } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function ProjectReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProjectDetails(id);
  const deleteProject = useDeleteProject();
  const [selectedContributor, setSelectedContributor] = useState<string | null>(null);
  const [expandedCommit, setExpandedCommit] = useState<string | null>(null);
  
  // Fetch individual commits when a contributor is selected
  const { data: authorCommits } = useProjectCommits(id, selectedContributor || undefined);
  
  // Fetch project tree structure
  const { data: projectTree } = useProjectTree(id);
  
  // Get contributor summary data
  const contributorData = selectedContributor && project 
    ? project.contributors.find(c => c.name === selectedContributor)
    : null;

  const handleExportPDF = () => {
    window.print();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      deleteProject.mutate(id!, {
        onSuccess: () => {
          navigate("/leaderboard");
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/leaderboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Card className="glass-card">
          <CardContent className="p-12 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !project) {
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

  const scoreBreakdown = [
    { name: "Quality", score: Math.round(project.qualityScore) },
    { name: "Security", score: Math.round(project.securityScore) },
    { name: "Originality", score: Math.round(project.originalityScore) },
    { name: "Architecture", score: Math.round(project.architectureScore) },
    { name: "Documentation", score: Math.round(project.documentationScore) },
  ];

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto pb-20">
      {/* Compact Header */}
      <div className="flex items-center justify-between gap-4 no-print bg-card/50 p-4 rounded-xl border border-border/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
            <Link to="/leaderboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              {project.teamName}
              <Badge variant="outline" className="font-mono text-xs font-normal">
                {project.totalFiles} files
              </Badge>
            </h1>
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              {project.repoUrl}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleDelete}
            size="sm"
            variant="destructive"
            className="gap-2 shadow-sm text-xs h-8"
            disabled={deleteProject.isPending}
          >
            {deleteProject.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Trash2 className="h-3 w-3" />
            )}
            Delete
          </Button>
          <Button
            onClick={handleExportPDF}
            size="sm"
            className="gap-2 gradient-primary text-primary-foreground shadow-sm text-xs h-8"
          >
            <Download className="h-3 w-3" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (Main Content) - 8 cols */}
        <div className="lg:col-span-8 space-y-4">

          {/* AI Analysis (Prominent) */}
          <Card className="glass-card gradient-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="p-3 rounded-lg bg-muted/30 text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground play-font">Verdict: </span>
                {project.aiVerdict}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Strengths */}
                {project.strengths.length > 0 && (
                  <div className="bg-success/5 p-3 rounded-lg border border-success/10">
                    <h4 className="text-xs font-semibold text-success mb-2 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Strengths
                    </h4>
                    <ul className="space-y-1">
                      {project.strengths.slice(0, 3).map((strength, i) => (
                        <li key={i} className="text-xs text-muted-foreground" title={strength}>
                          • {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Improvements */}
                {project.improvements.length > 0 && (
                  <div className="bg-warning/5 p-3 rounded-lg border border-warning/10">
                    <h4 className="text-xs font-semibold text-warning mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Improvements
                    </h4>
                    <ul className="space-y-1">
                      {project.improvements.slice(0, 3).map((imp, i) => (
                        <li key={i} className="text-xs text-muted-foreground" title={imp}>
                          • {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tech & Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tech Stack */}
            <Card className="glass-card">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileCode className="h-4 w-4 text-primary" />
                  Tech Stack
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.techStack.map((tech) => (
                    <TechBadge key={tech} tech={tech} /> // Assuming TechBadge handles size
                  ))}
                </div>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Architecture:</span>
                    <span className="font-medium text-foreground">{project.architecturePattern}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frameworks:</span>
                    <span className="font-medium text-foreground">{project.frameworks.join(", ")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commit Activity */}
            <Card className="glass-card">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <GitBranch className="h-4 w-4 text-info" />
                  Commit Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-2">
                  {project.commitPatterns.slice(0, 3).map((pattern) => (
                    <div key={pattern.date} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {new Date(pattern.date).toLocaleDateString("en", { month: "short", day: "numeric" })}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${Math.min(pattern.commits * 5, 100)}%` }}
                          />
                        </div>
                        <span className="font-mono">{pattern.commits}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs flex justify-between border-t border-border/50 pt-2">
                  <span className="text-muted-foreground">Total Commits</span>
                  <span className="font-bold">{project.totalCommits}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-violet-500" />
                Contributors
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-4">
                {project.contributors.map((contributor) => (
                  <button
                    key={contributor.name}
                    onClick={() => setSelectedContributor(contributor.name)}
                    className="flex items-center gap-3 bg-secondary/30 pr-5 pl-1.5 py-1.5 rounded-full border border-border/50 transition-all hover:bg-secondary/50 hover:border-primary/50 hover:scale-105 cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary border-2 border-background shadow-sm">
                      {contributor.name[0]}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium leading-none">{contributor.name}</span>
                      <span className="text-xs text-muted-foreground leading-none">
                        {contributor.commits} commits ({contributor.percentage}%)
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Code Structure Tree */}
          <Card className="glass-card">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileCode className="h-4 w-4 text-blue-500" />
                Code Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {projectTree?.tree && projectTree.tree !== "Repository structure not available" ? (
                <pre className="text-xs font-mono bg-secondary/30 p-3 rounded-lg overflow-x-auto max-h-96 overflow-y-auto whitespace-pre">
                  {projectTree.tree}
                </pre>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Repository structure not available
                </p>
              )}
            </CardContent>
          </Card>


        </div>

        {/* Right Column (Scores) - 4 cols */}
        <div className="lg:col-span-4 space-y-4">

          {/* Main Score Card */}
          <Card className="glass-card overflow-hidden bg-gradient-to-b from-card/90 to-card/50">
            <CardHeader className="pb-0 pt-6 px-0 text-center">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Total Score</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <div className="scale-90 origin-top">
                <GaugeScore score={project.totalScore} size="lg" showLabel={false} />
              </div>
            </CardContent>
          </Card>

          {/* Compact Score Breakdown List */}
          <Card className="glass-card">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm">Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {[
                { label: "Quality", score: Math.round(project.qualityScore) },
                { label: "Security", score: Math.round(project.securityScore) },
                { label: "Originality", score: Math.round(project.originalityScore) },
                { label: "Architecture", score: Math.round(project.architectureScore) },
                { label: "Docs", score: Math.round(project.documentationScore) },
              ].map((item) => (
                <div key={item.label} className="grid grid-cols-12 gap-2 items-center text-xs">
                  <span className="col-span-4 font-medium text-muted-foreground">{item.label}</span>
                  <div className="col-span-6 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", getScoreColor(item.score).replace("text-", "bg-"))}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="col-span-2 text-right font-mono">{item.score}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security Summary Badge */}
          <div className={cn(
            "p-3 rounded-xl border flex items-center gap-3",
            project.securityIssues.length === 0
              ? "bg-success/5 border-success/20 text-success-foreground"
              : "bg-destructive/5 border-destructive/20 text-destructive"
          )}>
            <Shield className="h-5 w-5" />
            <div>
              <div className="text-xs font-bold uppercase opacity-80">Security Status</div>
              <div className="text-sm font-medium">
                {project.securityIssues.length === 0 ? "Safe & Secure" : `${project.securityIssues.length} Issues Detected`}
              </div>
            </div>
          </div>

          {/* AI Code Pct */}
          <div className="p-3 rounded-xl border bg-card/50 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">AI Code Detected</span>
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full", project.aiGeneratedPercentage > 50 ? "bg-warning" : "bg-success")} />
              <span className="font-mono font-bold">{project.aiGeneratedPercentage}%</span>
            </div>
          </div>


        </div>
      </div>

      {/* Contributor Details Dialog */}
      <Dialog open={!!selectedContributor} onOpenChange={() => setSelectedContributor(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {authorCommits?.commits && authorCommits.commits.length > 0 
                ? `Commits by ${selectedContributor}`
                : `Contributor: ${selectedContributor}`
              }
            </DialogTitle>
            <DialogDescription>
              {authorCommits?.commits && authorCommits.commits.length > 0 
                ? "Complete commit history and file changes"
                : "Contribution summary"
              }
            </DialogDescription>
          </DialogHeader>
          
          {authorCommits?.commits && authorCommits.commits.length > 0 ? (
            <div className="space-y-3">
              {authorCommits.commits.map((commit) => {
                const isExpanded = expandedCommit === commit.hash;
                return (
                  <Card key={commit.hash} className="hover:bg-secondary/50 transition-colors">
                    <CardContent className="pt-4">
                      <button
                        onClick={() => setExpandedCommit(isExpanded ? null : commit.hash)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <ChevronDown className={cn(
                                "h-4 w-4 transition-transform",
                                isExpanded ? "" : "-rotate-90"
                              )} />
                              <code className="text-xs bg-secondary px-2 py-0.5 rounded font-mono">
                                {commit.short_hash}
                              </code>
                              <span className="text-xs text-muted-foreground">
                                {new Date(commit.date).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm font-medium mb-2 hover:text-primary transition-colors">{commit.message}</p>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-green-500">+{commit.additions}</span>
                              <span className="text-red-500">-{commit.deletions}</span>
                              <span className="text-muted-foreground">
                                {commit.files_changed.length} file{commit.files_changed.length !== 1 ? 's' : ''} changed
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                      {isExpanded && commit.files_changed.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Files Changed:</p>
                          <div className="space-y-1">
                            {commit.files_changed.map((file, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs bg-secondary/30 px-2 py-1 rounded">
                                <code className="text-muted-foreground truncate flex-1">{file.path}</code>
                                <div className="flex items-center gap-2 ml-2">
                                  <span className="text-green-500">+{file.additions}</span>
                                  <span className="text-red-500">-{file.deletions}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : contributorData ? (
            <div className="space-y-4">
              <div className="text-center py-4 bg-secondary/20 rounded-lg border border-border/50">
                <p className="text-sm text-muted-foreground mb-4">
                  Detailed commit history not available for this project.
                  <br />
                  <span className="text-xs">Re-analyze the repository to see individual commits.</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-secondary/20">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{contributorData.commits}</p>
                      <p className="text-xs text-muted-foreground">Total Commits</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/20">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-violet-500">{contributorData.percentage}%</p>
                      <p className="text-xs text-muted-foreground">Contribution</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No data available for this contributor.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
