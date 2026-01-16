import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { DEV_BYPASS_ENABLED } from "@/lib/auth/devBypass";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Role = "admin" | "mentor";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Role;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    // Dev bypass: skip role fetching entirely
    if (DEV_BYPASS_ENABLED) {
      setUserRole(requiredRole || "admin");
      setRoleLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      if (!user) {
        setRoleLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<{ role: Role | null }>("/api/auth/me");
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setUserRole(null);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user, requiredRole]);

  // Dev bypass: skip all auth checks
  if (DEV_BYPASS_ENABLED) {
    return (
      <>
        <Alert className="rounded-none border-x-0 border-t-0 bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <AlertDescription className="text-center text-sm font-medium">
            🔧 DEV MODE: Authentication bypassed — Acting as {requiredRole || "admin"}
          </AlertDescription>
        </Alert>
        {children}
      </>
    );
  }

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to landing page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // No valid role - redirect to landing page (students get kicked out)
  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  // Role mismatch - redirect to their correct dashboard
  if (requiredRole && userRole !== requiredRole) {
    const redirectPath = userRole === "admin" ? "/admin/dashboard" : "/mentor/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
