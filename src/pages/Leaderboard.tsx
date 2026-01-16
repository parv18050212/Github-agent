import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpDown, ExternalLink, Filter, Trophy, TrendingUp, Shield, BarChart3, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TechBadge } from "@/components/TechBadge";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { useLeaderboard, useClearAllProjects } from "@/hooks/api";
import { getScoreColor, getScoreBgColor } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type SortField = "rank" | "totalScore" | "qualityScore" | "securityScore" | "originalityScore";
type SortOrder = "asc" | "desc";

export default function Leaderboard() {
  const { data: projects = [], isLoading } = useLeaderboard();
  const clearAllMutation = useClearAllProjects();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("totalScore");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [techFilter, setTechFilter] = useState<string>("all");

  const handleClearAll = async () => {
    await clearAllMutation.mutateAsync();
  };

  // Get unique tech stacks for filter
  const allTechStacks = useMemo(() => {
    const techs = new Set<string>();
    projects.forEach((p) => p.techStack.forEach((t) => techs.add(t)));
    return Array.from(techs).sort();
  }, [projects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.teamName.toLowerCase().includes(searchLower) ||
          p.techStack.some((t) => t.toLowerCase().includes(searchLower))
      );
    }

    // Tech filter
    if (techFilter !== "all") {
      result = result.filter((p) => p.techStack.includes(techFilter));
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField as keyof typeof a] ?? 0;
      const bVal = b[sortField as keyof typeof b] ?? 0;
      return sortOrder === "desc" ? Number(bVal) - Number(aVal) : Number(aVal) - Number(bVal);
    });

    return result;
  }, [projects, search, techFilter, sortField, sortOrder]);

  // Chart data for top 5
  const chartData = useMemo(() => {
    const top5 = filteredProjects.slice(0, 5);
    const metrics = ["Quality", "Security", "Originality", "Architecture", "Documentation"];
    
    return metrics.map((metric) => {
      const dataPoint: Record<string, string | number> = { metric };
      top5.forEach((p) => {
        const key = `${metric.toLowerCase()}Score` as keyof typeof p;
        dataPoint[p.teamName] = (p[key] as number) || 0;
      });
      return dataPoint;
    });
  }, [filteredProjects]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const highestScore = projects[0]?.totalScore || 0;
  const averageScore = projects.length > 0 
    ? Math.round(projects.reduce((a, p) => a + p.totalScore, 0) / projects.length)
    : 0;
  const totalSecurityIssues = projects.reduce((a, p) => a + (p.securityIssuesCount || 0), 0);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-warning/10">
            <Trophy className="h-8 w-8 text-warning" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Leaderboard</h1>
            <p className="text-muted-foreground mt-1 text-lg">Loading rankings...</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="rounded-2xl border-border/50">
              <CardContent className="pt-6">
                <div className="h-4 w-24 rounded bg-muted skeleton-shimmer mb-3" />
                <div className="h-10 w-20 rounded bg-muted skeleton-shimmer" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-12 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-warning/10">
          <Trophy className="h-8 w-8 text-warning" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Rankings of all evaluated projects
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-warning/5 to-card/50">
          <div className="absolute top-0 right-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-warning/20 blur-2xl" />
          <CardContent className="pt-6 relative z-10">
            <p className="text-sm font-medium text-muted-foreground mb-2">Highest Score</p>
            <p className={cn("text-3xl font-bold tabular-nums", getScoreColor(highestScore))}>
              <AnimatedNumber value={highestScore} />
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-primary/5 to-card/50">
          <div className="absolute top-0 right-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-2xl" />
          <CardContent className="pt-6 relative z-10">
            <p className="text-sm font-medium text-muted-foreground mb-2">Average Score</p>
            <p className={cn("text-3xl font-bold tabular-nums", getScoreColor(averageScore))}>
              <AnimatedNumber value={averageScore} />
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-info/5 to-card/50">
          <div className="absolute top-0 right-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-info/20 blur-2xl" />
          <CardContent className="pt-6 relative z-10">
            <p className="text-sm font-medium text-muted-foreground mb-2">Total Teams</p>
            <p className="text-3xl font-bold text-foreground tabular-nums">
              <AnimatedNumber value={projects.length} />
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-destructive/5 to-card/50">
          <div className="absolute top-0 right-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-destructive/20 blur-2xl" />
          <CardContent className="pt-6 relative z-10">
            <p className="text-sm font-medium text-muted-foreground mb-2">Security Issues</p>
            <p className="text-3xl font-bold text-destructive tabular-nums">
              <AnimatedNumber value={totalSecurityIssues} />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart - Top 5 Comparison */}
      {filteredProjects.length > 0 && (
        <Card className="overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Top 5 Score Comparison</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  />
                  {filteredProjects.slice(0, 5).map((project, index) => {
                    const colors = [
                      "hsl(var(--primary))",
                      "hsl(var(--success))",
                      "hsl(var(--warning))",
                      "hsl(var(--info))",
                      "hsl(var(--destructive))",
                    ];
                    return (
                      <Radar
                        key={project.id}
                        name={project.teamName}
                        dataKey={project.teamName}
                        stroke={colors[index]}
                        fill={colors[index]}
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    );
                  })}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-card to-card/50">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search teams or technologies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 rounded-xl border-border/50 bg-background/50 text-base focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <Select value={techFilter} onValueChange={setTechFilter}>
              <SelectTrigger className="w-full md:w-56 h-12 rounded-xl border-border/50 bg-background/50">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by tech" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Technologies</SelectItem>
                {allTechStacks.map((tech) => (
                  <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2 h-12 px-6 rounded-xl hover:shadow-lg transition-all">
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all {projects.length} projects from the database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearAll}
                    className="bg-destructive hover:bg-destructive/90 rounded-xl"
                    disabled={clearAllMutation.isPending}
                  >
                    {clearAllMutation.isPending ? "Clearing..." : "Clear All Projects"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Rankings Table */}
      <Card className="overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-card to-card/50">
        <CardContent className="p-0">
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No projects found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                    <TableHead className="w-20 font-semibold">Rank</TableHead>
                    <TableHead className="font-semibold">Team</TableHead>
                    <TableHead className="font-semibold">Tech Stack</TableHead>
                    <TableHead className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 -ml-2 hover:bg-primary/10 font-semibold"
                        onClick={() => toggleSort("totalScore")}
                      >
                        Total
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 -ml-2 hover:bg-primary/10 font-semibold"
                        onClick={() => toggleSort("qualityScore")}
                      >
                        Quality
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 -ml-2 hover:bg-primary/10 font-semibold"
                        onClick={() => toggleSort("securityScore")}
                      >
                        Security
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 -ml-2 hover:bg-primary/10 font-semibold"
                        onClick={() => toggleSort("originalityScore")}
                      >
                        Originality
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project, index) => (
                    <TableRow 
                      key={project.id} 
                      className="hover:bg-muted/20 transition-all border-b border-border/30 stagger-item group"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <TableCell>
                        <div className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold shadow-sm transition-transform group-hover:scale-110",
                          index === 0 && "rank-gold",
                          index === 1 && "rank-silver",
                          index === 2 && "rank-bronze",
                          index > 2 && "bg-secondary text-secondary-foreground"
                        )}>
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link 
                          to={`/project/${project.id}`}
                          className="font-semibold text-base hover:text-primary transition-colors"
                        >
                          {project.teamName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.slice(0, 3).map((tech) => (
                            <TechBadge key={tech} tech={tech} className="text-xs" />
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="text-xs text-muted-foreground font-medium px-2.5 py-1 bg-muted/50 rounded-full border border-border/30">
                              +{project.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-3">
                          <span className={cn("text-2xl font-bold tabular-nums", getScoreColor(project.totalScore))}>
                            {project.totalScore}
                          </span>
                          <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary/50 hidden xl:block">
                            <div
                              className={cn("h-full rounded-full transition-all duration-500", getScoreBgColor(project.totalScore))}
                              style={{ width: `${project.totalScore}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={cn("tabular-nums text-center font-semibold text-base", getScoreColor(project.qualityScore))}>
                        {Math.round(project.qualityScore)}
                      </TableCell>
                      <TableCell className={cn("tabular-nums text-center font-semibold text-base", getScoreColor(project.securityScore))}>
                        {Math.round(project.securityScore)}
                      </TableCell>
                      <TableCell className={cn("tabular-nums text-center font-semibold text-base", getScoreColor(project.originalityScore))}>
                        {Math.round(project.originalityScore)}
                      </TableCell>
                      <TableCell>
                        <Button asChild variant="ghost" size="icon" className="hover:bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/project/${project.id}`}>
                            <ExternalLink className="h-5 w-5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
