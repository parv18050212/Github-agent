import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, CheckCircle, GitBranch, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { simulateAnalysis } from "@/lib/mockData";

type AnalysisStep = "idle" | "cloning" | "analyzing" | "scoring" | "complete" | "error";

const stepMessages: Record<AnalysisStep, string> = {
  idle: "Ready to analyze",
  cloning: "Cloning repository...",
  analyzing: "Analyzing code patterns...",
  scoring: "Calculating scores...",
  complete: "Analysis complete!",
  error: "Analysis failed",
};

const stepProgress: Record<AnalysisStep, number> = {
  idle: 0,
  cloning: 25,
  analyzing: 50,
  scoring: 75,
  complete: 100,
  error: 0,
};

export default function AnalyzeRepo() {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");
  const [teamName, setTeamName] = useState("");
  const [step, setStep] = useState<AnalysisStep>("idle");
  const [error, setError] = useState<string | null>(null);

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

    if (!isValidUrl(repoUrl)) {
      setError("Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)");
      return;
    }

    if (!teamName.trim()) {
      setError("Please enter a team name");
      return;
    }

    // Simulate analysis steps
    setStep("cloning");
    await new Promise((r) => setTimeout(r, 1000));
    
    setStep("analyzing");
    await new Promise((r) => setTimeout(r, 1500));
    
    setStep("scoring");
    await new Promise((r) => setTimeout(r, 1000));

    try {
      const result = await simulateAnalysis(repoUrl, teamName);
      setStep("complete");
      
      // Navigate to results after a brief delay
      setTimeout(() => {
        navigate(`/project/${result.id}`);
      }, 1000);
    } catch {
      setStep("error");
      setError("Failed to analyze repository. Please try again.");
    }
  };

  const isAnalyzing = step !== "idle" && step !== "complete" && step !== "error";

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

            <Button type="submit" className="w-full gap-2" disabled={isAnalyzing}>
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : step === "complete" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {step === "idle" ? "Start Analysis" : stepMessages[step]}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Progress Section */}
      {step !== "idle" && step !== "error" && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={stepProgress[step]} className="h-2" />
            <div className="space-y-3">
              {(["cloning", "analyzing", "scoring", "complete"] as AnalysisStep[]).map((s) => (
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
