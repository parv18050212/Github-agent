import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { handleRoleRedirect } from "@/lib/auth/roleRedirect";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Completing sign-in...");

  const params = useMemo(() => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);

    // Supabase may return params in hash for some flows
    if (!searchParams.has("code") && url.hash.includes("code=")) {
      const hashParams = new URLSearchParams(url.hash.replace(/^#/u, ""));
      hashParams.forEach((value, key) => searchParams.set(key, value));
    }

    return searchParams;
  }, []);

  useEffect(() => {
    const handleCallback = async () => {
      const hasCode = params.has("code");

      if (!hasCode) {
        setError("Missing auth code. Please retry sign-in.");
        return;
      }

      try {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }

        // Fetch role and redirect accordingly
        setStatus("Checking permissions...");
        await handleRoleRedirect(navigate);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication failed");
      }
    };

    handleCallback();
  }, [navigate, params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <Card className="w-full max-w-md border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">{status}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <div className="space-y-4">
              <p className="text-destructive">{error}</p>
              <Button onClick={() => navigate("/", { replace: true })}>Back to Login</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Exchanging credentials...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
