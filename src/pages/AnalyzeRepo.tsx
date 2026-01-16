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

  // Restore analysis state from localStorage on mount
  useEffect(() => {
    const savedJobId = localStorage.getItem("currentAnalysisJobId");
    const savedRepoUrl = localStorage.getItem("currentAnalysisRepoUrl");
    const savedTeamName = localStorage.getItem("currentAnalysisTeamName");
    
    if (savedJobId) {
      setJobId(savedJobId);
      setStep("pending");
      if (savedRepoUrl) setRepoUrl(savedRepoUrl);
      if (savedTeamName) setTeamName(savedTeamName);
    }
  }, []);

  // Map backend status to UI step
  useEffect(() => {
    if (jobStatus) {
      let newStep: AnalysisStep;
      
      // Backend uses 'running' status with current_stage to indicate progress
      if (jobStatus.status === "running" || jobStatus.status === "queued" || jobStatus.status === "pending") {
        // Map current_stage to UI steps based on backend's STAGE_PROGRESS
        const stage = (jobStatus.current_stage || "").toLowerCase();
        const progress = jobStatus.progress || 0;
        
        // Backend stages: starting, cloning, stack_detection, structure_analysis, 
        // maturity_check, commit_forensics, quality_check, security_scan, 
        // forensic_analysis, ai_judge, aggregation, completed
        
        if (stage === "starting" || stage === "cloning" || progress <= 10) {
          newStep = "cloning";
        } else if (stage === "ai_judge" || stage === "aggregation" || progress >= 85) {
          newStep = "scoring";
        } else if (progress > 10) {
          // Any stage between cloning and ai_judge
          newStep = "analyzing";
        } else {
          newStep = "pending";
        }
      } else if (jobStatus.status === "completed") {
        newStep = "completed";
      } else if (jobStatus.status === "failed") {
        newStep = "failed";
      } else {
        newStep = "analyzing";
      }
      
      setStep(newStep);

      if (jobStatus.status === "completed" && jobStatus.projectId) {
        // Clear localStorage when completed
        localStorage.removeItem("currentAnalysisJobId");
        localStorage.removeItem("currentAnalysisRepoUrl");
        localStorage.removeItem("currentAnalysisTeamName");
        
        setTimeout(() => {
          navigate(`/project/${jobStatus.projectId}`);
        }, 1000);
      }

      if (jobStatus.status === "failed") {
        setError(jobStatus.error || "Analysis failed. Please try again.");
        setJobId(null);
        
        // Clear localStorage on failure
        localStorage.removeItem("currentAnalysisJobId");
        localStorage.removeItem("currentAnalysisRepoUrl");
        localStorage.removeItem("currentAnalysisTeamName");
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
      
      // Save to localStorage for persistence across reloads
      setJobId(result.jobId);
      localStorage.setItem("currentAnalysisJobId", result.jobId);
      localStorage.setItem("currentAnalysisRepoUrl", repoUrl);
      localStorage.setItem("currentAnalysisTeamName", teamName.trim());
    } catch (err: any) {
      setStep("failed");
      // Handle error properly - check for API error response
      if (err?.response?.data?.detail) {
        // FastAPI validation error format
        if (Array.isArray(err.response.data.detail)) {
          const errors = err.response.data.detail.map((e: any) => e.msg).join(", ");
          setError(`Validation error: ${errors}`);
        } else {
          setError(err.response.data.detail);
        }
      } else {
        setError(err instanceof Error ? err.message : "Failed to start analysis. Please try again.");
      }
    }
  };

  const isAnalyzing = step !== "idle" && step !== "completed" && step !== "failed";

  const handleReset = () => {
    setStep("idle");
    setJobId(null);
    setError(null);
    setRepoUrl("");
    setTeamName("");
    
    // Clear localStorage
    localStorage.removeItem("currentAnalysisJobId");
    localStorage.removeItem("currentAnalysisRepoUrl");
    localStorage.removeItem("currentAnalysisTeamName");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Analyze Repository
        </h1>
        <p className="text-lg text-muted-foreground">
          Submit a GitHub repository for comprehensive AI-powered evaluation
        </p>
      </div>

      {/* Main Form Card */}
      <Card className="overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-card to-card/50">
        <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <GitBranch className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">Repository Details</CardTitle>
              <CardDescription className="text-base mt-1">
                {isAnalyzing 
                  ? "Analysis in progress for the repository below"
                  : "Enter the GitHub repository URL and team name for evaluation"
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 pb-8">
          {isAnalyzing && (
            <div className="mb-8 p-6 rounded-xl bg-primary/5 border border-primary/20 backdrop-blur-sm">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Repository</p>
                  <p className="text-sm font-mono text-foreground break-all bg-background/50 px-3 py-2 rounded-lg">{repoUrl}</p>
                </div>
                {teamName && (
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Team Name</p>
                    <p className="text-sm text-foreground bg-background/50 px-3 py-2 rounded-lg">{teamName}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="repoUrl" className="text-base font-semibold">GitHub Repository URL</Label>
              <Input
                id="repoUrl"
                type="url"
                placeholder="https://github.com/owner/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                disabled={isAnalyzing}
                className="font-mono h-12 text-base rounded-xl border-border/50 focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="teamName" className="text-base font-semibold">Team Name</Label>
              <Input
                id="teamName"
                type="text"
                placeholder="Enter your team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                disabled={isAnalyzing}
                className="h-12 text-base rounded-xl border-border/50 focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button 
                type="submit" 
                className="flex-1 gap-2 h-12 text-base rounded-xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5" 
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {stepMessages[step]}
                  </>
                ) : step === "completed" ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Completed
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Start Analysis
                  </>
                )}
              </Button>
              {step === "failed" && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleReset}
                  className="h-12 px-6 rounded-xl border-2 hover:bg-primary/5"
                >
                  Try Again
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Progress Section */}
      {step !== "idle" && step !== "failed" && (
        <Card className="overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
            <CardTitle className="text-xl">Analysis Progress</CardTitle>
            <CardDescription>Real-time progress tracking</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-base">
                  {jobStatus?.current_stage ? jobStatus.current_stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : stepMessages[step]}
                </span>
                <span className="text-2xl font-bold text-primary tabular-nums">{jobStatus?.progress || stepProgress[step]}%</span>
              </div>
              <Progress value={jobStatus?.progress || stepProgress[step]} className="h-3 rounded-full" />
            </div>
            <div className="space-y-3 pt-2">
              {(["pending", "cloning", "analyzing", "scoring", "completed"] as AnalysisStep[]).map((s) => (
                <div
                  key={s}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                    stepProgress[step] >= stepProgress[s]
                      ? "bg-primary/5 border border-primary/20"
                      : "bg-muted/30"
                  }`}
                >
                  <div className="shrink-0">
                    {stepProgress[step] >= stepProgress[s] ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    ) : stepProgress[step] >= stepProgress[s] - 25 ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/30" />
                    )}
                  </div>
                  <span className={`font-medium ${
                    stepProgress[step] >= stepProgress[s]
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}>
                    {stepMessages[s]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-primary/5 to-card/50">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Search className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg">What We Analyze</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Tech stack & architecture patterns</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Commit history & contributor statistics</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Security vulnerabilities & exposed secrets</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">AI-generated code detection</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-gradient-to-br from-info/5 to-card/50">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-info/10 text-info">
                <AlertCircle className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg">Requirements</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-info shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Public GitHub repository</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-info shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Valid repository URL</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-info shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Repository must be accessible</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-info shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Team name for identification</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
