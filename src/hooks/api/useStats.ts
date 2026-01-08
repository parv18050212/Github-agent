import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import type { StatsResponse } from "@/types/api";

export function useStats() {
  return useQuery<StatsResponse>({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data } = await apiClient.get<StatsResponse>("/api/stats");
      return data;
    },
    staleTime: 30000, // 30 seconds
  });
}
