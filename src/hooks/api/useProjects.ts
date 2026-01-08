import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import type { ProjectListItem } from "@/types/api";

interface UseProjectsParams {
  limit?: number;
  offset?: number;
}

export function useProjects(params?: UseProjectsParams) {
  return useQuery<ProjectListItem[]>({
    queryKey: ["projects", params],
    queryFn: async () => {
      const { data } = await apiClient.get<ProjectListItem[]>("/api/projects", {
        params,
      });
      return data;
    },
    staleTime: 30000,
  });
}
