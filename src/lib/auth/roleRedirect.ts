import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import apiClient from "@/lib/api/client";

export type Role = "admin" | "mentor";

interface UserRoleResponse {
  role: Role | null;
}

export async function fetchUserRole(): Promise<Role | null> {
  try {
    const response = await apiClient.get<UserRoleResponse>("/api/auth/me");
    return response.data.role;
  } catch (error) {
    console.error("[Auth] Failed to fetch user role:", error);
    return null;
  }
}

export function getRoleRedirectPath(role: Role | null): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "mentor":
      return "/mentor/dashboard";
    default:
      return "/login";
  }
}

export async function handleRoleRedirect(navigate: NavigateFunction): Promise<void> {
  const role = await fetchUserRole();
  
  if (!role) {
    // No valid role - sign out and redirect to login
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
    return;
  }
  
  const redirectPath = getRoleRedirectPath(role);
  navigate(redirectPath, { replace: true });
}
