// API Response Types matching backend schema

export interface Contributor {
  name: string;
  email: string;
  commits: number;
  additions: number;
  deletions: number;
  percentage: number;
}

export interface SecurityIssue {
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  file: string;
  line: number;
  description: string;
}

export interface CommitPattern {
  date: string;
  commits: number;
  additions: number;
  deletions: number;
}

export interface Project {
  id: string;
  projectId: string;
  teamName: string;
  repoUrl: string;
  techStack: string[];
  languages: { name: string; percentage: number }[];
  frameworks: string[];
  architecturePattern: string;
  totalScore: number;
  qualityScore: number;
  securityScore: number;
  originalityScore: number;
  architectureScore: number;
  documentationScore: number;
  totalCommits: number;
  commitPatterns: CommitPattern[];
  burstCommitWarning: boolean;
  lastMinuteCommits: number;
  contributors: Contributor[];
  securityIssues: SecurityIssue[];
  secretsDetected: boolean;
  aiGeneratedPercentage: number;
  aiVerdict: string;
  strengths: string[];
  improvements: string[];
  totalFiles: number;
  totalLinesOfCode: number;
  testCoverage: number;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListItem {
  id: string;
  projectId: string;
  teamName: string;
  repoUrl: string;
  techStack: string[];
  totalScore: number;
  qualityScore: number;
  securityScore: number;
  originalityScore: number;
  architectureScore: number;
  documentationScore: number;
  securityIssuesCount: number;
  status: string;
}

export interface StatsResponse {
  totalProjects: number;
  averageScore: number;
  totalSecurityIssues: number;
  projectsAnalyzedToday: number;
  completedProjects: number;
  pendingProjects: number;
}

export interface AnalyzeRequest {
  repoUrl: string;
  teamName: string;
}

export interface AnalyzeResponse {
  jobId: string;
  message: string;
}

export interface JobStatusResponse {
  jobId: string;
  status: "pending" | "cloning" | "analyzing" | "scoring" | "completed" | "failed";
  progress: number;
  projectId?: string;
  error?: string;
}

export interface BatchUploadResponse {
  batchId: string;
  totalTeams: number;
  message: string;
}

export interface BatchStatusResponse {
  batchId: string;
  status: "processing" | "completed" | "failed";
  progress: number;
  results: {
    teamName: string;
    repoUrl: string;
    status: "pending" | "processing" | "completed" | "failed";
    projectId?: string;
    score?: number;
    error?: string;
  }[];
}

export interface LeaderboardParams {
  limit?: number;
  offset?: number;
  techFilter?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
