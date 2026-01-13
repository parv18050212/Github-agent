import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import type { ClearAllResponse } from "@/types/api";

export function useClearAllProjects() {
  const queryClient = useQueryClient();
  
  return useMutation<ClearAllResponse>({
    mutationFn: async () => {
      const { data } = await apiClient.delete<ClearAllResponse>("/api/projects/clear-all");
      return data;
    },
    onSuccess: () => {
      // Invalidate all project-related queries
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
