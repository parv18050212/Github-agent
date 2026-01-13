import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import type { ProjectTreeResponse } from "@/types/api";

export function useProjectTree(projectId: string | undefined) {
  return useQuery<ProjectTreeResponse>({
    queryKey: ["projectTree", projectId],
    queryFn: async () => {
      const { data } = await apiClient.get<ProjectTreeResponse>(
        `/api/projects/${projectId}/tree`
      );
      return data;
    },
    enabled: !!projectId,
    staleTime: 1000 * 60 * 60, // 1 hour (tree doesn't change)
  });
}
