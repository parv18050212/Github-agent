import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ExternalLink } from "lucide-react";

export default function Documentation() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <p className="text-muted-foreground mt-2">
          Learn how to use HackEval and understand the evaluation metrics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-muted-foreground">
          <h3 className="text-foreground">Overview</h3>
          <p>
            HackEval is an AI-powered hackathon project evaluation system that analyzes 
            GitHub repositories to provide comprehensive assessments of code quality, 
            security, originality, and more.
          </p>

          <h3 className="text-foreground">Evaluation Metrics</h3>
          <ul>
            <li><strong>Quality Score:</strong> Measures code quality, structure, and best practices</li>
            <li><strong>Security Score:</strong> Identifies vulnerabilities, exposed secrets, and security issues</li>
            <li><strong>Originality Score:</strong> Assesses the uniqueness of the implementation</li>
            <li><strong>Architecture Score:</strong> Evaluates system design and code organization</li>
            <li><strong>Documentation Score:</strong> Reviews comments, README, and inline documentation</li>
          </ul>

          <h3 className="text-foreground">Commit Forensics</h3>
          <p>
            The system analyzes commit patterns to detect:
          </p>
          <ul>
            <li>Contributor distribution and participation balance</li>
            <li>Commit timing and frequency patterns</li>
            <li>Last-minute burst commits (potential red flag)</li>
            <li>Code additions vs deletions trends</li>
          </ul>

          <h3 className="text-foreground">AI Detection</h3>
          <p>
            HackEval uses advanced heuristics to estimate the percentage of AI-generated 
            code in submissions. High AI usage may indicate less original work but is 
            not inherently penalized.
          </p>

          <h3 className="text-foreground">API Integration</h3>
          <p>
            When the backend is deployed, HackEval provides a REST API for:
          </p>
          <ul>
            <li><code>POST /evaluate</code> - Submit a single repository for evaluation</li>
            <li><code>POST /batch</code> - Submit multiple repositories via CSV</li>
            <li><code>GET /leaderboard</code> - Retrieve ranked evaluation results</li>
            <li><code>GET /report/:id</code> - Get detailed report for a specific project</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Useful Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <a 
            href="#" 
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <span>API Documentation</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
          <a 
            href="#" 
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <span>Evaluation Criteria Guide</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
          <a 
            href="#" 
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <span>CSV Format Template</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
