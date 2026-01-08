import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TeamEntry {
  id: string;
  teamName: string;
  repoUrl: string;
  status: "pending" | "processing" | "completed" | "failed";
  score?: number;
}

const mockParsedTeams: TeamEntry[] = [
  { id: "1", teamName: "Team Alpha", repoUrl: "https://github.com/alpha/project", status: "pending" },
  { id: "2", teamName: "Team Beta", repoUrl: "https://github.com/beta/hackathon", status: "pending" },
  { id: "3", teamName: "Team Gamma", repoUrl: "https://github.com/gamma/submission", status: "pending" },
  { id: "4", teamName: "Team Delta", repoUrl: "https://github.com/delta/app", status: "pending" },
  { id: "5", teamName: "Team Epsilon", repoUrl: "https://github.com/epsilon/code", status: "pending" },
];

export default function BatchUpload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [teams, setTeams] = useState<TeamEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".csv") || file.name.endsWith(".xlsx"))) {
      setUploadedFile(file);
      // Simulate parsing
      setTeams(mockParsedTeams);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Simulate parsing
      setTeams(mockParsedTeams);
    }
  };

  const startBatchAnalysis = async () => {
    setIsProcessing(true);
    setProgress(0);

    for (let i = 0; i < teams.length; i++) {
      setTeams((prev) =>
        prev.map((t, idx) =>
          idx === i ? { ...t, status: "processing" } : t
        )
      );

      await new Promise((r) => setTimeout(r, 1500));

      const success = Math.random() > 0.1;
      const score = success ? Math.floor(Math.random() * 30) + 70 : undefined;

      setTeams((prev) =>
        prev.map((t, idx) =>
          idx === i
            ? { ...t, status: success ? "completed" : "failed", score }
            : t
        )
      );

      setProgress(((i + 1) / teams.length) * 100);
    }

    setIsProcessing(false);
  };

  const clearAll = () => {
    setUploadedFile(null);
    setTeams([]);
    setProgress(0);
  };

  const completedCount = teams.filter((t) => t.status === "completed").length;
  const failedCount = teams.filter((t) => t.status === "failed").length;

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
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Drop your file here or click to upload
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
              />
              <Button asChild variant="outline">
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
              <Button variant="ghost" size="icon" onClick={clearAll}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Progress and Stats */}
      {teams.length > 0 && isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {completedCount + failedCount} of {teams.length} completed
              </span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
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
                {!isProcessing && completedCount === 0 && (
                  <Button onClick={startBatchAnalysis} className="gap-2">
                    <Loader2 className="h-4 w-4" />
                    Start Analysis
                  </Button>
                )}
                {completedCount > 0 && !isProcessing && (
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Results
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
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.teamName}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {team.repoUrl}
                    </TableCell>
                    <TableCell>
                      {team.status === "pending" && (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      {team.status === "processing" && (
                        <Badge variant="outline" className="gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Processing
                        </Badge>
                      )}
                      {team.status === "completed" && (
                        <Badge className="bg-success text-success-foreground gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Completed
                        </Badge>
                      )}
                      {team.status === "failed" && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Failed
                        </Badge>
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
              Your CSV or Excel file should contain the following columns:
            </p>
            <div className="bg-background rounded-lg p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">team_name, repo_url</div>
              <div>Team Alpha, https://github.com/alpha/project</div>
              <div>Team Beta, https://github.com/beta/hackathon</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
