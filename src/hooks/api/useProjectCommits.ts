import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import type { ProjectCommitsResponse } from "@/types/api";

export function useProjectCommits(projectId: string | undefined, author?: string) {
  return useQuery<ProjectCommitsResponse>({
    queryKey: ["projectCommits", projectId, author],
    queryFn: async () => {
      const params = author ? { author } : {};
      const { data } = await apiClient.get<ProjectCommitsResponse>(
        `/api/projects/${projectId}/commits`,
        { params }
      );
      return data;
    },
    enabled: !!projectId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
