import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import type { AnalyzeRequest, AnalyzeResponse, JobStatusResponse } from "@/types/api";

export function useAnalyzeRepository() {
  return useMutation<AnalyzeResponse, Error, { repoUrl: string; teamName?: string }>({
    mutationFn: async (request) => {
      // Transform camelCase to snake_case for API
      const apiRequest: AnalyzeRequest = {
        repo_url: request.repoUrl,
        team_name: request.teamName,
      };
      const { data } = await apiClient.post<any>("/api/analyze-repo", apiRequest);
      // Transform snake_case response to camelCase
      return {
        jobId: data.job_id || data.jobId,
        message: data.message,
      };
    },
  });
}

export function useJobStatus(jobId: string | null, options?: { enabled?: boolean }) {
  return useQuery<JobStatusResponse>({
    queryKey: ["jobStatus", jobId],
    queryFn: async () => {
      const { data } = await apiClient.get<any>(`/api/analysis/${jobId}`);
      // Transform snake_case response to camelCase
      return {
        jobId: data.job_id || data.jobId,
        status: data.status,
        progress: data.progress || 0,
        current_stage: data.current_stage,
        projectId: data.project_id || data.projectId,
        error: data.error_message || data.error,
      };
    },
    enabled: !!jobId && (options?.enabled ?? true),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed") {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
  });
}
