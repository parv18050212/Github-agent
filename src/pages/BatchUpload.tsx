import { useState, useCallback, useEffect } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Trash2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useBatchUpload, useBatchStatus } from "@/hooks/api";

interface TeamEntry {
  id: string;
  teamName: string;
  repoUrl: string;
  status: "pending" | "processing" | "completed" | "failed";
  score?: number;
  projectId?: string;
  error?: string;
}

export default function BatchUpload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [teams, setTeams] = useState<TeamEntry[]>([]);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [batchId, setBatchId] = useState<string | null>(null);

  const batchUploadMutation = useBatchUpload();
  const { data: batchStatus } = useBatchStatus(batchId, { enabled: !!batchId });

  // Update team statuses based on batch progress
  useEffect(() => {
    if (batchStatus && teams.length > 0) {
      const { currentIndex, completed, failed, status: batchStatusValue } = batchStatus;

      setTeams(prevTeams => {
        return prevTeams.map((team, index) => {
          const teamIndex = index + 1; // 1-indexed

          // Failed during parsing (error set on upload)
          if (team.error) return team;

          if (teamIndex < currentIndex) {
            // Already processed
            // Check if this team is in the completed count
            if (teamIndex <= completed) {
              return { ...team, status: "completed" as const };
            } else {
              return { ...team, status: "failed" as const };
            }
          } else if (teamIndex === currentIndex && batchStatusValue === "processing") {
            // Currently being analyzed
            return { ...team, status: "processing" as const };
          } else if (batchStatusValue === "completed" || batchStatusValue === "failed") {
            // Batch is done - mark remaining based on their position
            if (teamIndex <= completed) {
              return { ...team, status: "completed" as const };
            } else if (team.status === "pending") {
              return { ...team, status: "failed" as const };
            }
          }

          return team;
        });
      });
    }
  }, [batchStatus, teams.length]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".csv") || file.name.endsWith(".xlsx"))) {
      await uploadFile(file);
    }
  }, []);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setUploadedFile(file);
    setUploadComplete(false);
    setBatchId(null);

    try {
      const result = await batchUploadMutation.mutateAsync(file);

      // Store batch ID for tracking
      if (result.batchId) {
        setBatchId(result.batchId);
      }

      const allTeams: TeamEntry[] = [];

      // Add queued entries
      if (result.queued && result.queued.length > 0) {
        allTeams.push(...result.queued.map((item, i) => ({
          id: String(i + 1),
          teamName: item.teamName,
          repoUrl: item.repoUrl,
          status: "pending" as const,
          projectId: item.projectId,
        })));
      }

      // Add failed entries (from parsing)
      if (result.errors && result.errors.length > 0) {
        allTeams.push(...result.errors.map((err, i) => ({
          id: String(allTeams.length + i + 1),
          teamName: err.teamName || `Row ${err.row}`,
          repoUrl: err.repoUrl || "Invalid",
          status: "failed" as const,
          error: err.error,
        })));
      }

      setTeams(allTeams);
      setUploadComplete(true);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadedFile(null);
    }
  };

  const clearAll = () => {
    setUploadedFile(null);
    setTeams([]);
    setUploadComplete(false);
    setBatchId(null);
  };

  const pendingCount = teams.filter((t) => t.status === "pending" || t.status === "processing").length;
  const completedCount = teams.filter((t) => t.status === "completed").length;
  const failedCount = teams.filter((t) => t.status === "failed").length;

  // Calculate progress percentage
  const progressPercent = batchStatus
    ? Math.round(((batchStatus.completed + batchStatus.failed) / batchStatus.total) * 100)
    : 0;

  const isProcessing = batchStatus?.status === "processing";
  const isBatchComplete = batchStatus?.status === "completed" || batchStatus?.status === "failed";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Batch Upload</h1>
        <p className="text-muted-foreground mt-2">
          Upload a CSV or Excel file to evaluate multiple repositories at once
        </p>
      </div>

      {/* Upload Area */}
      {!uploadedFile ? (
        <Card>
          <CardContent className="p-8">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {batchUploadMutation.isPending ? (
                <Loader2 className="h-12 w-12 mx-auto text-primary mb-4 animate-spin" />
              ) : (
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              )}
              <h3 className="text-lg font-semibold mb-2">
                {batchUploadMutation.isPending ? "Uploading..." : "Drop your file here or click to upload"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supports CSV and Excel files (.csv, .xlsx)
              </p>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
                disabled={batchUploadMutation.isPending}
              />
              <Button asChild variant="outline" disabled={batchUploadMutation.isPending}>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Select File
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{uploadedFile.name}</CardTitle>
                  <CardDescription>
                    {teams.length} teams parsed from file
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={clearAll} disabled={batchUploadMutation.isPending || isProcessing}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Live Progress Card */}
      {uploadComplete && batchId && batchStatus && (
        <Card className={isProcessing ? "border-primary" : isBatchComplete ? "border-green-500" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isProcessing && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
              {isBatchComplete && <CheckCircle className="h-5 w-5 text-green-500" />}
              {isProcessing ? "Analyzing Repositories..." : "Analysis Complete"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Progress: {batchStatus.completed + batchStatus.failed} / {batchStatus.total}
                </span>
                <span className="font-medium">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            {/* Current Repo Being Analyzed */}
            {isProcessing && batchStatus.currentTeam && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PlayCircle className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">Currently Analyzing</span>
                </div>
                <p className="font-semibold">{batchStatus.currentTeam}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {batchStatus.currentRepo}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Repository {batchStatus.currentIndex} of {batchStatus.total}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-6 text-sm pt-2">
              <span className="text-green-600">
                <span className="font-medium">{batchStatus.completed}</span> completed
              </span>
              {batchStatus.failed > 0 && (
                <span className="text-destructive">
                  <span className="font-medium">{batchStatus.failed}</span> failed
                </span>
              )}
              {isProcessing && (
                <span className="text-muted-foreground">
                  <span className="font-medium">{batchStatus.total - batchStatus.completed - batchStatus.failed}</span> pending
                </span>
              )}
            </div>

            {isBatchComplete && (
              <div className="pt-2">
                <Button variant="outline" className="gap-2" asChild>
                  <a href="/projects">View All Projects</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legacy Summary (only show if no batch tracking) */}
      {uploadComplete && teams.length > 0 && !batchId && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 text-sm">
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{pendingCount}</span> queued for analysis
              </span>
              {failedCount > 0 && (
                <span className="text-destructive">
                  <span className="font-medium">{failedCount}</span> failed
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Analysis will run in the background. View progress on the Dashboard or Projects page.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Teams Table */}
      {teams.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Teams</CardTitle>
              <div className="flex gap-2">
                {isBatchComplete && completedCount > 0 && (
                  <Button variant="outline" className="gap-2" asChild>
                    <a href="/projects">View Projects</a>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Repository URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id} className={team.status === "processing" ? "bg-primary/5" : ""}>
                    <TableCell className="font-medium">
                      {team.teamName}
                      {team.status === "processing" && (
                        <span className="ml-2 text-xs text-primary">(analyzing...)</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {team.repoUrl}
                    </TableCell>
                    <TableCell>
                      {team.status === "pending" && (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      {team.status === "processing" && (
                        <Badge variant="outline" className="gap-1 border-primary text-primary">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Processing
                        </Badge>
                      )}
                      {team.status === "completed" && (
                        <Badge className="bg-green-600 text-white gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Completed
                        </Badge>
                      )}
                      {team.status === "failed" && (
                        <div className="flex flex-col gap-1">
                          <Badge variant="destructive" className="gap-1 w-fit">
                            <AlertCircle className="h-3 w-3" />
                            Failed
                          </Badge>
                          {team.error && (
                            <span className="text-xs text-destructive font-medium max-w-[200px] truncate" title={team.error}>
                              {team.error}
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {team.score !== undefined ? (
                        <span className="font-bold">{team.score}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* File Format Info */}
      {!uploadedFile && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Expected File Format</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your CSV file should contain the following columns:
            </p>
            <div className="bg-background rounded-lg p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">teamName, repoUrl</div>
              <div>Team Alpha, https://github.com/alpha/project</div>
              <div>Team Beta, https://github.com/beta/hackathon</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
