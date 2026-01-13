import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";

export function useDeleteProject() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (projectId: string) => {
            await apiClient.delete(`/api/projects/${projectId}`);
        },
        onSuccess: () => {
            toast({
                title: "Project deleted",
                description: "The project has been successfully removed.",
            });
            // Invalidate queries to refresh lists
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
        },
        onError: (error: Error) => {
            toast({
                title: "Delete failed",
                description: error.message || "Failed to delete project. Please try again.",
                variant: "destructive",
            });
        },
    });
}
