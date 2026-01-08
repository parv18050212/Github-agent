import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import type { ProjectListItem, LeaderboardParams } from "@/types/api";

export function useLeaderboard(params?: LeaderboardParams) {
  return useQuery<ProjectListItem[]>({
    queryKey: ["leaderboard", params],
    queryFn: async () => {
      const { data } = await apiClient.get<ProjectListItem[]>("/api/leaderboard", {
        params,
      });
      return data;
    },
    staleTime: 30000,
  });
}
