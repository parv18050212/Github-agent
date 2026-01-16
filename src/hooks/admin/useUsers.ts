import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";

export interface User {
  id: string;
  email: string;
  role: "admin" | "mentor" | null;
  created_at: string;
  last_sign_in_at: string | null;
}

interface UsersResponse {
  users: User[];
}

export function useUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const response = await apiClient.get<UsersResponse>("/api/admin/users");
      return response.data.users;
    },
  });
}
