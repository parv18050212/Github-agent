import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, GitCommit, Users, Shield, FileCode, Star } from "lucide-react";
import { useState } from "react";

// Mock data - will be replaced with useTeamDetails() hook
const mockTeamDetails = {
  id: "1",
  name: "Team Alpha",
  repoUrl: "https://github.com/team-alpha/hackathon-project",
  createdAt: "2024-01-15",
  techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  members: [
    { name: "Alice", commits: 45, additions: 2500, deletions: 800, percentage: 35 },
    { name: "Bob", commits: 38, additions: 2100, deletions: 600, percentage: 30 },
    { name: "Charlie", commits: 25, additions: 1500, deletions: 400, percentage: 20 },
    { name: "Diana", commits: 20, additions: 1000, deletions: 300, percentage: 15 },
  ],
  commits: [
    { hash: "abc123", message: "Add authentication flow", author: "Alice", date: "2 hours ago" },
    { hash: "def456", message: "Fix database connection", author: "Bob", date: "5 hours ago" },
    { hash: "ghi789", message: "Update UI components", author: "Charlie", date: "1 day ago" },
  ],
  qualityScores: {
    structure: 85,
    documentation: 72,
    security: 68,
    testing: 45,
    codeStyle: 80,
    complexity: 75,
  },
  securityIssues: [
    { severity: "high", description: "Hardcoded API key in config.js", file: "src/config.js", line: 12 },
    { severity: "medium", description: "Missing input validation", file: "src/api/users.js", line: 45 },
  ],
  aiSummary: "This team demonstrates solid technical skills with consistent commit patterns. The project structure is well-organized with clear separation of concerns. Main areas for improvement include test coverage and security practices.",
};

export default function TeamDetails() {
  const { teamId } = useParams();
  const [vivaScore, setVivaScore] = useState("");
  const [comments, setComments] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const team = mockTeamDetails; // Will use useTeamDetails(teamId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
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
        <div className="flex gap-2">
          {team.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <GitCommit className="h-4 w-4" />
            GitHub Activity
          </TabsTrigger>
          <TabsTrigger value="contribution" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contribution
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Code & Quality
          </TabsTrigger>
          <TabsTrigger value="evaluation" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Evaluation
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Repository Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{team.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Members</span>
                  <span>{team.members.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Commits</span>
                  <span>{team.members.reduce((sum, m) => sum + m.commits, 0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{team.aiSummary}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* GitHub Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Commits</CardTitle>
              <CardDescription>Latest activity in the repository</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.commits.map((commit) => (
                  <div key={commit.hash} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <GitCommit className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">{commit.message}</p>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span>{commit.author}</span>
                        <span>•</span>
                        <span>{commit.date}</span>
                        <span>•</span>
                        <code className="text-xs bg-muted px-1 rounded">{commit.hash}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contribution Tab */}
        <TabsContent value="contribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Member Contributions</CardTitle>
              <CardDescription>Individual contribution breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.members.map((member) => (
                  <div key={member.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{member.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {member.commits} commits • +{member.additions} / -{member.deletions}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          member.percentage >= 20 ? "bg-green-500" : "bg-yellow-500"
                        }`}
                        style={{ width: `${member.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      {member.percentage}% of total
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code & Quality Tab */}
        <TabsContent value="quality" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quality Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(team.qualityScores).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span>{value}/100</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          value >= 70 ? "bg-green-500" : value >= 50 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Issues</CardTitle>
                <CardDescription>{team.securityIssues.length} issues found</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {team.securityIssues.map((issue, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={issue.severity === "high" ? "destructive" : "secondary"}>
                        {issue.severity}
                      </Badge>
                    </div>
                    <p className="text-sm">{issue.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {issue.file}:{issue.line}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Evaluation Tab */}
        <TabsContent value="evaluation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mentor Evaluation</CardTitle>
              <CardDescription>Submit your evaluation for this team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="viva-score">Viva Score (0-100)</Label>
                  <Input
                    id="viva-score"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter score"
                    value={vivaScore}
                    onChange={(e) => setVivaScore(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recommendation">Final Recommendation</Label>
                  <Select value={recommendation} onValueChange={setRecommendation}>
                    <SelectTrigger id="recommendation">
                      <SelectValue placeholder="Select recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent - Top Performer</SelectItem>
                      <SelectItem value="good">Good - Meets Expectations</SelectItem>
                      <SelectItem value="satisfactory">Satisfactory - Needs Improvement</SelectItem>
                      <SelectItem value="unsatisfactory">Unsatisfactory - Below Expectations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Comments & Feedback</Label>
                <Textarea
                  id="comments"
                  placeholder="Enter your detailed evaluation comments..."
                  rows={5}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Save Draft</Button>
                <Button>Submit Evaluation</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
