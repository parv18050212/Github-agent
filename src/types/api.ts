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
  repo_url: string;
  team_name?: string;
}

export interface AnalyzeResponse {
  jobId: string;
  message: string;
}

export interface JobStatusResponse {
  jobId: string;
  status: "queued" | "pending" | "running" | "completed" | "failed";
  progress: number;
  current_stage?: string;
  projectId?: string;
  error?: string;
}

export interface BatchUploadResponse {
  batchId: string | null;  // NEW: for tracking batch progress
  success: number;
  failed: number;
  total: number;
  message: string;
  queued: {
    row: number;
    teamName: string;
    repoUrl: string;
    jobId: string;
    projectId: string;
  }[];
  errors: {
    row: number;
    teamName?: string;
    repoUrl?: string;
    error: string;
  }[];
}

export interface BatchStatusResponse {
  batchId: string;
  status: "pending" | "processing" | "completed" | "failed";
  total: number;
  completed: number;
  failed: number;
  currentIndex: number;
  currentRepo?: string;
  currentTeam?: string;
  createdAt?: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface LeaderboardParams {
  limit?: number;
  offset?: number;
  techFilter?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ProjectTreeResponse {
  projectId: string;
  tree: string;
}

export interface CommitAuthor {
  author: string;
  commits: number;
  linesChanged: number;
  activeDays: number;
  topFileTypes: string;
}

export interface CommitDetail {
  hash: string;
  short_hash: string;
  author: string;
  email: string;
  message: string;
  date: string;
  additions: number;
  deletions: number;
  files_changed: Array<{
    path: string;
    additions: number;
    deletions: number;
  }>;
}

export interface ProjectCommitsResponse {
  projectId: string;
  totalCommits?: number;
  authors?: CommitAuthor[];
  author?: string;
  commits?: CommitDetail[];
}

export interface ClearAllResponse {
  success: boolean;
  deleted: number;
  failed: number;
  message: string;
}
