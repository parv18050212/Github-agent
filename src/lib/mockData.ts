// Mock data for HackEval - Hackathon Project Evaluation System

export interface Contributor {
  name: string;
  commits: number;
  additions: number;
  deletions: number;
  percentage: number;
}

export interface SecurityIssue {
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  file: string;
  line?: number;
  description: string;
}

export interface CommitPattern {
  date: string;
  commits: number;
  additions: number;
  deletions: number;
}

export interface ProjectEvaluation {
  id: string;
  teamName: string;
  repoUrl: string;
  submittedAt: string;
  status: "pending" | "analyzing" | "completed" | "failed";
  
  // Identity
  techStack: string[];
  languages: { name: string; percentage: number }[];
  architecturePattern: string;
  frameworks: string[];
  
  // Scores
  totalScore: number;
  qualityScore: number;
  securityScore: number;
  originalityScore: number;
  architectureScore: number;
  documentationScore: number;
  
  // Commit Forensics
  totalCommits: number;
  contributors: Contributor[];
  commitPatterns: CommitPattern[];
  burstCommitWarning: boolean;
  lastMinuteCommits: number;
  
  // Security
  securityIssues: SecurityIssue[];
  secretsDetected: number;
  
  // AI Analysis
  aiGeneratedPercentage: number;
  aiVerdict: string;
  strengths: string[];
  improvements: string[];
  
  // Meta
  totalFiles: number;
  totalLinesOfCode: number;
  testCoverage: number;
}

export const mockProjects: ProjectEvaluation[] = [
  {
    id: "proj-001",
    teamName: "CodeCrafters",
    repoUrl: "https://github.com/codecrafters/hackathon-2024",
    submittedAt: "2024-03-15T10:30:00Z",
    status: "completed",
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    languages: [
      { name: "TypeScript", percentage: 65 },
      { name: "JavaScript", percentage: 20 },
      { name: "CSS", percentage: 10 },
      { name: "HTML", percentage: 5 },
    ],
    architecturePattern: "Microservices",
    frameworks: ["React 18", "Express.js", "Prisma"],
    totalScore: 87,
    qualityScore: 85,
    securityScore: 90,
    originalityScore: 88,
    architectureScore: 86,
    documentationScore: 82,
    totalCommits: 156,
    contributors: [
      { name: "Alice Chen", commits: 67, additions: 4500, deletions: 1200, percentage: 43 },
      { name: "Bob Smith", commits: 52, additions: 3200, deletions: 800, percentage: 33 },
      { name: "Carol Davis", commits: 37, additions: 1800, deletions: 400, percentage: 24 },
    ],
    commitPatterns: [
      { date: "2024-03-01", commits: 12, additions: 800, deletions: 100 },
      { date: "2024-03-05", commits: 18, additions: 1200, deletions: 200 },
      { date: "2024-03-10", commits: 25, additions: 1800, deletions: 350 },
      { date: "2024-03-14", commits: 45, additions: 2500, deletions: 600 },
      { date: "2024-03-15", commits: 56, additions: 3200, deletions: 1150 },
    ],
    burstCommitWarning: false,
    lastMinuteCommits: 8,
    securityIssues: [
      { type: "Hardcoded Secret", severity: "high", file: "config/db.js", line: 12, description: "Database password exposed in config file" },
    ],
    secretsDetected: 1,
    aiGeneratedPercentage: 15,
    aiVerdict: "This project demonstrates strong original development with minimal AI assistance. The code shows consistent patterns indicating human authorship with some AI-assisted boilerplate generation.",
    strengths: ["Clean architecture", "Comprehensive testing", "Good documentation", "Consistent code style"],
    improvements: ["Add more inline comments", "Implement rate limiting", "Add CI/CD pipeline"],
    totalFiles: 89,
    totalLinesOfCode: 12500,
    testCoverage: 78,
  },
  {
    id: "proj-002",
    teamName: "ByteBuilders",
    repoUrl: "https://github.com/bytebuilders/ai-assistant",
    submittedAt: "2024-03-15T11:45:00Z",
    status: "completed",
    techStack: ["Python", "FastAPI", "React", "MongoDB"],
    languages: [
      { name: "Python", percentage: 55 },
      { name: "TypeScript", percentage: 30 },
      { name: "CSS", percentage: 10 },
      { name: "Other", percentage: 5 },
    ],
    architecturePattern: "Monolithic",
    frameworks: ["FastAPI", "React 18", "Tailwind CSS"],
    totalScore: 92,
    qualityScore: 94,
    securityScore: 88,
    originalityScore: 95,
    architectureScore: 90,
    documentationScore: 91,
    totalCommits: 203,
    contributors: [
      { name: "David Lee", commits: 95, additions: 6200, deletions: 1500, percentage: 47 },
      { name: "Emma Wilson", commits: 68, additions: 4100, deletions: 900, percentage: 33 },
      { name: "Frank Brown", commits: 40, additions: 2300, deletions: 500, percentage: 20 },
    ],
    commitPatterns: [
      { date: "2024-03-01", commits: 20, additions: 1200, deletions: 150 },
      { date: "2024-03-05", commits: 35, additions: 2100, deletions: 300 },
      { date: "2024-03-10", commits: 48, additions: 2800, deletions: 450 },
      { date: "2024-03-14", commits: 55, additions: 3100, deletions: 600 },
      { date: "2024-03-15", commits: 45, additions: 3400, deletions: 1400 },
    ],
    burstCommitWarning: false,
    lastMinuteCommits: 5,
    securityIssues: [],
    secretsDetected: 0,
    aiGeneratedPercentage: 8,
    aiVerdict: "Excellent original work with innovative approach to the problem. Very low AI generation detected, indicating strong technical skills and original thinking.",
    strengths: ["Innovative solution", "Excellent code quality", "Thorough testing", "Great UX design"],
    improvements: ["Could improve API documentation", "Add more error handling edge cases"],
    totalFiles: 124,
    totalLinesOfCode: 18200,
    testCoverage: 85,
  },
  {
    id: "proj-003",
    teamName: "QuantumCoders",
    repoUrl: "https://github.com/quantumcoders/blockchain-vote",
    submittedAt: "2024-03-15T09:15:00Z",
    status: "completed",
    techStack: ["Solidity", "React", "Node.js", "Ethereum"],
    languages: [
      { name: "Solidity", percentage: 40 },
      { name: "TypeScript", percentage: 35 },
      { name: "JavaScript", percentage: 20 },
      { name: "Other", percentage: 5 },
    ],
    architecturePattern: "Decentralized",
    frameworks: ["Hardhat", "React 18", "Ethers.js"],
    totalScore: 78,
    qualityScore: 75,
    securityScore: 72,
    originalityScore: 85,
    architectureScore: 80,
    documentationScore: 70,
    totalCommits: 89,
    contributors: [
      { name: "Grace Kim", commits: 45, additions: 3800, deletions: 900, percentage: 51 },
      { name: "Henry Zhang", commits: 44, additions: 3600, deletions: 850, percentage: 49 },
    ],
    commitPatterns: [
      { date: "2024-03-01", commits: 8, additions: 600, deletions: 50 },
      { date: "2024-03-05", commits: 12, additions: 1100, deletions: 150 },
      { date: "2024-03-10", commits: 18, additions: 1500, deletions: 250 },
      { date: "2024-03-14", commits: 22, additions: 1800, deletions: 400 },
      { date: "2024-03-15", commits: 29, additions: 2400, deletions: 900 },
    ],
    burstCommitWarning: true,
    lastMinuteCommits: 18,
    securityIssues: [
      { type: "Reentrancy Vulnerability", severity: "critical", file: "contracts/Voting.sol", line: 45, description: "Potential reentrancy attack vector in withdraw function" },
      { type: "API Key Exposed", severity: "high", file: ".env.example", line: 3, description: "Infura API key committed to repository" },
    ],
    secretsDetected: 2,
    aiGeneratedPercentage: 35,
    aiVerdict: "Moderate AI assistance detected, particularly in smart contract boilerplate and frontend components. Core logic appears to be original but some patterns suggest heavy AI scaffolding.",
    strengths: ["Innovative blockchain use case", "Good smart contract design", "Clean frontend"],
    improvements: ["Fix security vulnerabilities", "Add more tests", "Improve documentation", "Review AI-generated code for edge cases"],
    totalFiles: 56,
    totalLinesOfCode: 8900,
    testCoverage: 45,
  },
  {
    id: "proj-004",
    teamName: "DataDragons",
    repoUrl: "https://github.com/datadragons/ml-pipeline",
    submittedAt: "2024-03-15T12:00:00Z",
    status: "completed",
    techStack: ["Python", "TensorFlow", "Flask", "Redis"],
    languages: [
      { name: "Python", percentage: 85 },
      { name: "Shell", percentage: 8 },
      { name: "Dockerfile", percentage: 5 },
      { name: "Other", percentage: 2 },
    ],
    architecturePattern: "Pipeline",
    frameworks: ["TensorFlow 2.x", "Flask", "Celery"],
    totalScore: 83,
    qualityScore: 80,
    securityScore: 85,
    originalityScore: 82,
    architectureScore: 88,
    documentationScore: 79,
    totalCommits: 134,
    contributors: [
      { name: "Ivy Patel", commits: 78, additions: 5600, deletions: 1400, percentage: 58 },
      { name: "Jack Morgan", commits: 56, additions: 3200, deletions: 800, percentage: 42 },
    ],
    commitPatterns: [
      { date: "2024-03-01", commits: 15, additions: 1000, deletions: 100 },
      { date: "2024-03-05", commits: 22, additions: 1600, deletions: 200 },
      { date: "2024-03-10", commits: 30, additions: 2200, deletions: 400 },
      { date: "2024-03-14", commits: 35, additions: 2500, deletions: 600 },
      { date: "2024-03-15", commits: 32, additions: 1500, deletions: 900 },
    ],
    burstCommitWarning: false,
    lastMinuteCommits: 6,
    securityIssues: [
      { type: "Weak Encryption", severity: "medium", file: "utils/crypto.py", line: 28, description: "Using deprecated MD5 for hashing sensitive data" },
    ],
    secretsDetected: 0,
    aiGeneratedPercentage: 22,
    aiVerdict: "Good balance of original work with AI assistance for model architecture and data processing pipelines. The core ML implementation shows expertise and original thinking.",
    strengths: ["Strong ML architecture", "Good data pipeline design", "Efficient processing", "Docker containerization"],
    improvements: ["Update encryption methods", "Add API documentation", "Implement caching"],
    totalFiles: 67,
    totalLinesOfCode: 9800,
    testCoverage: 62,
  },
  {
    id: "proj-005",
    teamName: "CloudNinjas",
    repoUrl: "https://github.com/cloudninjas/serverless-cms",
    submittedAt: "2024-03-15T08:30:00Z",
    status: "completed",
    techStack: ["AWS Lambda", "React", "DynamoDB", "GraphQL"],
    languages: [
      { name: "TypeScript", percentage: 70 },
      { name: "JavaScript", percentage: 15 },
      { name: "YAML", percentage: 10 },
      { name: "Other", percentage: 5 },
    ],
    architecturePattern: "Serverless",
    frameworks: ["AWS CDK", "React 18", "Apollo GraphQL"],
    totalScore: 89,
    qualityScore: 91,
    securityScore: 86,
    originalityScore: 90,
    architectureScore: 92,
    documentationScore: 85,
    totalCommits: 178,
    contributors: [
      { name: "Kate Miller", commits: 72, additions: 5100, deletions: 1200, percentage: 40 },
      { name: "Leo Johnson", commits: 58, additions: 3800, deletions: 900, percentage: 33 },
      { name: "Mia Garcia", commits: 48, additions: 2900, deletions: 600, percentage: 27 },
    ],
    commitPatterns: [
      { date: "2024-03-01", commits: 18, additions: 1100, deletions: 100 },
      { date: "2024-03-05", commits: 28, additions: 1900, deletions: 250 },
      { date: "2024-03-10", commits: 40, additions: 2800, deletions: 500 },
      { date: "2024-03-14", commits: 48, additions: 3200, deletions: 700 },
      { date: "2024-03-15", commits: 44, additions: 2800, deletions: 1150 },
    ],
    burstCommitWarning: false,
    lastMinuteCommits: 7,
    securityIssues: [
      { type: "Missing Auth", severity: "medium", file: "lambda/public-api.ts", line: 15, description: "Public endpoint missing authentication middleware" },
    ],
    secretsDetected: 0,
    aiGeneratedPercentage: 12,
    aiVerdict: "Highly original serverless implementation with excellent cloud architecture. Minimal AI assistance detected, primarily in boilerplate CDK configurations.",
    strengths: ["Excellent cloud architecture", "Strong TypeScript usage", "Good separation of concerns", "Scalable design"],
    improvements: ["Add authentication to public endpoints", "Implement request validation", "Add more integration tests"],
    totalFiles: 98,
    totalLinesOfCode: 14200,
    testCoverage: 71,
  },
  {
    id: "proj-006",
    teamName: "PixelPioneers",
    repoUrl: "https://github.com/pixelpioneers/ar-shopping",
    submittedAt: "2024-03-15T13:20:00Z",
    status: "completed",
    techStack: ["Unity", "C#", "Firebase", "ARCore"],
    languages: [
      { name: "C#", percentage: 75 },
      { name: "ShaderLab", percentage: 15 },
      { name: "HLSL", percentage: 8 },
      { name: "Other", percentage: 2 },
    ],
    architecturePattern: "Component-Based",
    frameworks: ["Unity 2022", "ARCore", "Firebase SDK"],
    totalScore: 81,
    qualityScore: 78,
    securityScore: 82,
    originalityScore: 88,
    architectureScore: 79,
    documentationScore: 76,
    totalCommits: 112,
    contributors: [
      { name: "Nathan Park", commits: 62, additions: 4800, deletions: 1100, percentage: 55 },
      { name: "Olivia Wright", commits: 50, additions: 3500, deletions: 800, percentage: 45 },
    ],
    commitPatterns: [
      { date: "2024-03-01", commits: 10, additions: 800, deletions: 50 },
      { date: "2024-03-05", commits: 16, additions: 1400, deletions: 150 },
      { date: "2024-03-10", commits: 24, additions: 2100, deletions: 300 },
      { date: "2024-03-14", commits: 32, additions: 2500, deletions: 500 },
      { date: "2024-03-15", commits: 30, additions: 1500, deletions: 900 },
    ],
    burstCommitWarning: false,
    lastMinuteCommits: 9,
    securityIssues: [],
    secretsDetected: 0,
    aiGeneratedPercentage: 18,
    aiVerdict: "Creative AR implementation with good use of Unity best practices. Some AI assistance in shader code generation, but core AR logic is original.",
    strengths: ["Innovative AR features", "Smooth user experience", "Good performance optimization"],
    improvements: ["Add unit tests", "Improve code documentation", "Optimize asset loading"],
    totalFiles: 78,
    totalLinesOfCode: 11500,
    testCoverage: 35,
  },
  {
    id: "proj-007",
    teamName: "SecureSquad",
    repoUrl: "https://github.com/securesquad/zero-trust-auth",
    submittedAt: "2024-03-15T14:00:00Z",
    status: "completed",
    techStack: ["Go", "React", "PostgreSQL", "Redis"],
    languages: [
      { name: "Go", percentage: 60 },
      { name: "TypeScript", percentage: 30 },
      { name: "SQL", percentage: 8 },
      { name: "Other", percentage: 2 },
    ],
    architecturePattern: "Zero Trust",
    frameworks: ["Gin", "React 18", "GORM"],
    totalScore: 94,
    qualityScore: 96,
    securityScore: 98,
    originalityScore: 91,
    architectureScore: 95,
    documentationScore: 88,
    totalCommits: 189,
    contributors: [
      { name: "Peter Chen", commits: 82, additions: 5800, deletions: 1300, percentage: 43 },
      { name: "Quinn Taylor", commits: 65, additions: 4200, deletions: 950, percentage: 35 },
      { name: "Rachel Adams", commits: 42, additions: 2400, deletions: 500, percentage: 22 },
    ],
    commitPatterns: [
      { date: "2024-03-01", commits: 22, additions: 1400, deletions: 100 },
      { date: "2024-03-05", commits: 32, additions: 2200, deletions: 250 },
      { date: "2024-03-10", commits: 42, additions: 2900, deletions: 450 },
      { date: "2024-03-14", commits: 50, additions: 3200, deletions: 650 },
      { date: "2024-03-15", commits: 43, additions: 2700, deletions: 1300 },
    ],
    burstCommitWarning: false,
    lastMinuteCommits: 4,
    securityIssues: [],
    secretsDetected: 0,
    aiGeneratedPercentage: 5,
    aiVerdict: "Exceptional security-focused implementation with minimal AI assistance. This team demonstrates deep expertise in security best practices and original cryptographic implementations.",
    strengths: ["Outstanding security implementation", "Excellent Go code quality", "Comprehensive testing", "Well-documented APIs"],
    improvements: ["Could add more frontend polish", "Consider adding OAuth integrations"],
    totalFiles: 145,
    totalLinesOfCode: 16800,
    testCoverage: 92,
  },
  {
    id: "proj-008",
    teamName: "GreenTech",
    repoUrl: "https://github.com/greentech/carbon-tracker",
    submittedAt: "2024-03-15T10:00:00Z",
    status: "completed",
    techStack: ["Vue.js", "Python", "PostgreSQL", "Docker"],
    languages: [
      { name: "Python", percentage: 45 },
      { name: "Vue", percentage: 35 },
      { name: "TypeScript", percentage: 15 },
      { name: "Other", percentage: 5 },
    ],
    architecturePattern: "Layered",
    frameworks: ["Vue 3", "FastAPI", "SQLAlchemy"],
    totalScore: 76,
    qualityScore: 74,
    securityScore: 78,
    originalityScore: 80,
    architectureScore: 75,
    documentationScore: 73,
    totalCommits: 98,
    contributors: [
      { name: "Sam Green", commits: 55, additions: 4200, deletions: 1000, percentage: 56 },
      { name: "Tina Brooks", commits: 43, additions: 2800, deletions: 700, percentage: 44 },
    ],
    commitPatterns: [
      { date: "2024-03-01", commits: 10, additions: 700, deletions: 50 },
      { date: "2024-03-05", commits: 15, additions: 1100, deletions: 150 },
      { date: "2024-03-10", commits: 20, additions: 1500, deletions: 250 },
      { date: "2024-03-14", commits: 25, additions: 1800, deletions: 450 },
      { date: "2024-03-15", commits: 28, additions: 1900, deletions: 800 },
    ],
    burstCommitWarning: false,
    lastMinuteCommits: 10,
    securityIssues: [
      { type: "SQL Injection", severity: "high", file: "api/queries.py", line: 34, description: "Raw SQL query with user input without parameterization" },
      { type: "XSS Vulnerability", severity: "medium", file: "frontend/components/Comment.vue", line: 22, description: "User input rendered without sanitization" },
    ],
    secretsDetected: 0,
    aiGeneratedPercentage: 28,
    aiVerdict: "Good concept with moderate AI assistance in both frontend and backend. Some security issues need attention, likely from AI-generated code without proper review.",
    strengths: ["Good environmental impact focus", "Clean UI design", "Interesting data visualization"],
    improvements: ["Fix SQL injection vulnerability", "Sanitize user inputs", "Add input validation", "Increase test coverage"],
    totalFiles: 54,
    totalLinesOfCode: 7200,
    testCoverage: 42,
  },
  {
    id: "proj-009",
    teamName: "AIAlchemists",
    repoUrl: "https://github.com/aialchemists/llm-tutor",
    submittedAt: "2024-03-15T11:15:00Z",
    status: "completed",
    techStack: ["Python", "OpenAI", "Streamlit", "Pinecone"],
    languages: [
      { name: "Python", percentage: 90 },
      { name: "YAML", percentage: 5 },
      { name: "Shell", percentage: 3 },
      { name: "Other", percentage: 2 },
    ],
    architecturePattern: "RAG Pipeline",
    frameworks: ["LangChain", "Streamlit", "OpenAI SDK"],
    totalScore: 72,
    qualityScore: 70,
    securityScore: 68,
    originalityScore: 65,
    architectureScore: 78,
    documentationScore: 80,
    totalCommits: 76,
    contributors: [
      { name: "Uma Sharma", commits: 42, additions: 3200, deletions: 800, percentage: 55 },
      { name: "Victor Liu", commits: 34, additions: 2400, deletions: 600, percentage: 45 },
    ],
    commitPatterns: [
      { date: "2024-03-01", commits: 8, additions: 500, deletions: 30 },
      { date: "2024-03-05", commits: 12, additions: 900, deletions: 100 },
      { date: "2024-03-10", commits: 16, additions: 1200, deletions: 200 },
      { date: "2024-03-14", commits: 20, additions: 1600, deletions: 400 },
      { date: "2024-03-15", commits: 20, additions: 1400, deletions: 670 },
    ],
    burstCommitWarning: false,
    lastMinuteCommits: 8,
    securityIssues: [
      { type: "API Key in Code", severity: "critical", file: "main.py", line: 8, description: "OpenAI API key hardcoded in source file" },
      { type: "No Rate Limiting", severity: "medium", file: "api/routes.py", line: 15, description: "API endpoints vulnerable to abuse without rate limiting" },
    ],
    secretsDetected: 1,
    aiGeneratedPercentage: 55,
    aiVerdict: "High AI assistance detected throughout the codebase. While the concept is interesting, much of the implementation appears to be AI-generated boilerplate with minimal customization.",
    strengths: ["Good documentation", "Interesting use case", "Clean architecture"],
    improvements: ["Remove hardcoded API keys", "Add rate limiting", "Reduce AI-generated code", "Add more original features"],
    totalFiles: 32,
    totalLinesOfCode: 4500,
    testCoverage: 25,
  },
  {
    id: "proj-010",
    teamName: "MobileMinds",
    repoUrl: "https://github.com/mobileminds/fitness-companion",
    submittedAt: "2024-03-15T09:45:00Z",
    status: "completed",
    techStack: ["React Native", "TypeScript", "Firebase", "Node.js"],
    languages: [
      { name: "TypeScript", percentage: 80 },
      { name: "JavaScript", percentage: 12 },
      { name: "Java", percentage: 5 },
      { name: "Other", percentage: 3 },
    ],
    architecturePattern: "MVVM",
    frameworks: ["React Native", "Expo", "Firebase SDK"],
    totalScore: 85,
    qualityScore: 84,
    securityScore: 86,
    originalityScore: 83,
    architectureScore: 87,
    documentationScore: 85,
    totalCommits: 167,
    contributors: [
      { name: "Wendy Torres", commits: 72, additions: 5100, deletions: 1200, percentage: 43 },
      { name: "Xavier Hill", commits: 55, additions: 3600, deletions: 850, percentage: 33 },
      { name: "Yara Khan", commits: 40, additions: 2400, deletions: 550, percentage: 24 },
    ],
    commitPatterns: [
      { date: "2024-03-01", commits: 18, additions: 1200, deletions: 100 },
      { date: "2024-03-05", commits: 28, additions: 1900, deletions: 250 },
      { date: "2024-03-10", commits: 38, additions: 2600, deletions: 450 },
      { date: "2024-03-14", commits: 45, additions: 3100, deletions: 650 },
      { date: "2024-03-15", commits: 38, additions: 2300, deletions: 1150 },
    ],
    burstCommitWarning: false,
    lastMinuteCommits: 6,
    securityIssues: [],
    secretsDetected: 0,
    aiGeneratedPercentage: 14,
    aiVerdict: "Well-executed mobile application with minimal AI assistance. The team demonstrates strong React Native expertise and original feature implementations.",
    strengths: ["Polished mobile UI", "Good offline support", "Strong TypeScript usage", "Well-structured codebase"],
    improvements: ["Add more unit tests", "Implement push notifications", "Add accessibility features"],
    totalFiles: 112,
    totalLinesOfCode: 15600,
    testCoverage: 68,
  },
];

// Helper function to get a project by ID
export const getProjectById = (id: string): ProjectEvaluation | undefined => {
  return mockProjects.find((project) => project.id === id);
};

// Helper function to get leaderboard sorted by total score
export const getLeaderboard = (): ProjectEvaluation[] => {
  return [...mockProjects]
    .filter((p) => p.status === "completed")
    .sort((a, b) => b.totalScore - a.totalScore);
};

// Helper function to simulate analysis
export const simulateAnalysis = (repoUrl: string, teamName: string): Promise<ProjectEvaluation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a random project as mock result
      const randomProject = mockProjects[Math.floor(Math.random() * mockProjects.length)];
      resolve({
        ...randomProject,
        id: `proj-${Date.now()}`,
        teamName,
        repoUrl,
        submittedAt: new Date().toISOString(),
      });
    }, 3000);
  });
};

// Score color helper
export const getScoreColor = (score: number): string => {
  if (score >= 90) return "text-score-excellent";
  if (score >= 75) return "text-score-good";
  if (score >= 60) return "text-score-average";
  return "text-score-poor";
};

export const getScoreBgColor = (score: number): string => {
  if (score >= 90) return "bg-score-excellent";
  if (score >= 75) return "bg-score-good";
  if (score >= 60) return "bg-score-average";
  return "bg-score-poor";
};

export const getSeverityColor = (severity: SecurityIssue["severity"]): string => {
  switch (severity) {
    case "critical":
      return "bg-destructive text-destructive-foreground";
    case "high":
      return "bg-destructive/80 text-destructive-foreground";
    case "medium":
      return "bg-warning text-warning-foreground";
    case "low":
      return "bg-info text-info-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};
