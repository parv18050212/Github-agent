import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import type { AnalyzeRequest, AnalyzeResponse, JobStatusResponse } from "@/types/api";

export function useAnalyzeRepository() {
  return useMutation<AnalyzeResponse, Error, AnalyzeRequest>({
    mutationFn: async (request) => {
      const { data } = await apiClient.post<AnalyzeResponse>("/api/analyze", request);
      return data;
    },
  });
}

export function useJobStatus(jobId: string | null, options?: { enabled?: boolean }) {
  return useQuery<JobStatusResponse>({
    queryKey: ["jobStatus", jobId],
    queryFn: async () => {
      const { data } = await apiClient.get<JobStatusResponse>(`/api/analysis/${jobId}`);
      return data;
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
