import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import type { Project } from "@/types/api";

export function useProjectDetails(id: string | undefined) {
  return useQuery<Project>({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data } = await apiClient.get<Project>(`/api/projects/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 60000, // 1 minute
  });
}
