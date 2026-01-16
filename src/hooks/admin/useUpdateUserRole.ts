import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { toast } from "sonner";

type Role = "admin" | "mentor" | null;

interface UpdateRoleParams {
  userId: string;
  role: Role;
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: UpdateRoleParams) => {
      const response = await apiClient.patch(`/api/admin/users/${userId}/role`, { role });
      return response.data;
    },
    onSuccess: (_, { role }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "No role";
      toast.success(`User role updated to ${roleLabel}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user role");
    },
  });
}
