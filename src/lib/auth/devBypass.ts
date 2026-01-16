// Development bypass configuration
// This allows skipping authentication in development mode for faster testing

export const DEV_BYPASS_ENABLED = 
  import.meta.env.DEV && import.meta.env.VITE_DEV_AUTH_BYPASS === "true";

export type DevRole = "admin" | "mentor";

export const DEV_USERS = {
  admin: {
    id: "dev-admin-001",
    email: "admin@hackscore.dev",
    role: "admin" as const,
  },
  mentor: {
    id: "dev-mentor-001",
    email: "mentor@hackscore.dev",
    role: "mentor" as const,
  },
};

export function getDevUser(role: DevRole) {
  return DEV_USERS[role];
}

// Check if we should bypass auth for a specific role
export function shouldBypassAuth(): boolean {
  return DEV_BYPASS_ENABLED;
}
