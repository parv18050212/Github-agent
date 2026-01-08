import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpDown, ExternalLink, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TechBadge } from "@/components/TechBadge";
import { getLeaderboard, getScoreColor, getScoreBgColor } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";

type SortField = "rank" | "totalScore" | "qualityScore" | "securityScore" | "originalityScore";
type SortOrder = "asc" | "desc";

export default function Leaderboard() {
  const projects = getLeaderboard();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("totalScore");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [techFilter, setTechFilter] = useState<string>("all");

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
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">
          Rankings of all evaluated hackathon projects
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{projects.length}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-score-excellent">{projects[0]?.totalScore || 0}</div>
            <div className="text-sm text-muted-foreground">Highest Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {Math.round(projects.reduce((a, p) => a + p.totalScore, 0) / projects.length)}
            </div>
            <div className="text-sm text-muted-foreground">Average Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {projects.reduce((a, p) => a + p.securityIssues.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Security Issues</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart - Top 5 Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Score Comparison</CardTitle>
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
                      fillOpacity={0.1}
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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams or technologies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={techFilter} onValueChange={setTechFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by tech" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technologies</SelectItem>
                {allTechStacks.map((tech) => (
                  <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rankings Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Tech Stack</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 -ml-3"
                    onClick={() => toggleSort("totalScore")}
                  >
                    Total
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 -ml-3"
                    onClick={() => toggleSort("qualityScore")}
                  >
                    Quality
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 -ml-3"
                    onClick={() => toggleSort("securityScore")}
                  >
                    Security
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 -ml-3"
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
                <TableRow key={project.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                      index === 0 && "bg-warning/20 text-warning",
                      index === 1 && "bg-muted text-muted-foreground",
                      index === 2 && "bg-warning/10 text-warning/80",
                      index > 2 && "bg-secondary text-secondary-foreground"
                    )}>
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link 
                      to={`/project/${project.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {project.teamName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <TechBadge key={tech} tech={tech} className="text-xs" />
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={cn("font-bold", getScoreColor(project.totalScore))}>
                        {project.totalScore}
                      </span>
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary hidden lg:block">
                        <div
                          className={cn("h-full rounded-full", getScoreBgColor(project.totalScore))}
                          style={{ width: `${project.totalScore}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={getScoreColor(project.qualityScore)}>
                    {project.qualityScore}
                  </TableCell>
                  <TableCell className={getScoreColor(project.securityScore)}>
                    {project.securityScore}
                  </TableCell>
                  <TableCell className={getScoreColor(project.originalityScore)}>
                    {project.originalityScore}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="icon">
                      <Link to={`/project/${project.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
