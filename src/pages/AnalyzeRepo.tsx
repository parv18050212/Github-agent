import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, CheckCircle, GitBranch, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAnalyzeRepository, useJobStatus } from "@/hooks/api";

type AnalysisStep = "idle" | "pending" | "cloning" | "analyzing" | "scoring" | "completed" | "failed";

const stepMessages: Record<AnalysisStep, string> = {
  idle: "Ready to analyze",
  pending: "Submitting request...",
  cloning: "Cloning repository...",
  analyzing: "Analyzing code patterns...",
  scoring: "Calculating scores...",
  completed: "Analysis complete!",
  failed: "Analysis failed",
};

const stepProgress: Record<AnalysisStep, number> = {
  idle: 0,
  pending: 10,
  cloning: 25,
  analyzing: 50,
  scoring: 75,
  completed: 100,
  failed: 0,
};

export default function AnalyzeRepo() {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");
  const [teamName, setTeamName] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [step, setStep] = useState<AnalysisStep>("idle");
  const [error, setError] = useState<string | null>(null);

  const analyzeMutation = useAnalyzeRepository();
  const { data: jobStatus } = useJobStatus(jobId, { enabled: !!jobId });

  // Map backend status to UI step
  useEffect(() => {
    if (jobStatus) {
      const statusMap: Record<string, AnalysisStep> = {
        pending: "pending",
        cloning: "cloning",
        analyzing: "analyzing",
        scoring: "scoring",
        completed: "completed",
        failed: "failed",
      };
      
      const newStep = statusMap[jobStatus.status] || "analyzing";
      setStep(newStep);

      if (jobStatus.status === "completed" && jobStatus.projectId) {
        setTimeout(() => {
          navigate(`/project/${jobStatus.projectId}`);
        }, 1000);
      }

      if (jobStatus.status === "failed") {
        setError(jobStatus.error || "Analysis failed. Please try again.");
        setJobId(null);
      }
    }
  }, [jobStatus, navigate]);

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname === "github.com" && parsed.pathname.split("/").filter(Boolean).length >= 2;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setJobId(null);

    if (!isValidUrl(repoUrl)) {
      setError("Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)");
      return;
    }

    if (!teamName.trim()) {
      setError("Please enter a team name");
      return;
    }

    setStep("pending");

    try {
      const result = await analyzeMutation.mutateAsync({
        repoUrl,
        teamName: teamName.trim(),
      });
      setJobId(result.jobId);
    } catch (err) {
      setStep("failed");
      setError(err instanceof Error ? err.message : "Failed to start analysis. Please try again.");
    }
  };

  const isAnalyzing = step !== "idle" && step !== "completed" && step !== "failed";

  const handleReset = () => {
    setStep("idle");
    setJobId(null);
    setError(null);
    setRepoUrl("");
    setTeamName("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analyze Repository</h1>
        <p className="text-muted-foreground mt-2">
          Submit a GitHub repository for AI-powered evaluation
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Repository Details
          </CardTitle>
          <CardDescription>
            Enter the GitHub repository URL and team name for evaluation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="repoUrl">GitHub Repository URL</Label>
              <Input
                id="repoUrl"
                type="url"
                placeholder="https://github.com/owner/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                disabled={isAnalyzing}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                type="text"
                placeholder="Enter your team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1 gap-2" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : step === "completed" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {step === "idle" ? "Start Analysis" : stepMessages[step]}
              </Button>
              {step === "failed" && (
                <Button type="button" variant="outline" onClick={handleReset}>
                  Try Again
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Progress Section */}
      {step !== "idle" && step !== "failed" && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={stepProgress[step]} className="h-2" />
            <div className="space-y-3">
              {(["pending", "cloning", "analyzing", "scoring", "completed"] as AnalysisStep[]).map((s) => (
                <div
                  key={s}
                  className={`flex items-center gap-3 text-sm ${
                    stepProgress[step] >= stepProgress[s]
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {stepProgress[step] >= stepProgress[s] ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : stepProgress[step] >= stepProgress[s] - 25 ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted" />
                  )}
                  {stepMessages[s]}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">What We Analyze</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li>• Tech stack & architecture patterns</li>
              <li>• Commit history & contributor stats</li>
              <li>• Security vulnerabilities</li>
              <li>• AI-generated code detection</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Requirements</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li>• Public GitHub repository</li>
              <li>• Valid repository URL</li>
              <li>• Repository must be accessible</li>
              <li>• Team name for identification</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
