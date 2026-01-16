import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { handleRoleRedirect } from "@/lib/auth/roleRedirect";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Users, Trophy, BarChart3, ClipboardList, Zap, Loader2 } from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      handleRoleRedirect(navigate);
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const features = [
    { icon: Trophy, title: "Leaderboard", description: "Real-time rankings & scores" },
    { icon: BarChart3, title: "Analytics", description: "Detailed performance reports" },
    { icon: ClipboardList, title: "Batch Evaluation", description: "Evaluate multiple projects" },
    { icon: Users, title: "Team Management", description: "Organize teams & mentors" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Logo & Branding */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 mb-6">
            <Zap className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Hack<span className="text-primary">Score</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-md mx-auto">
            End-to-End Hackathon Evaluation Platform
          </p>
        </div>

        {/* Login Buttons */}
        <Card className="w-full max-w-md p-8 border-border/50 shadow-2xl glass-card animate-scale-in">
          <div className="space-y-4">
            <h2 className="text-center text-lg font-medium text-foreground mb-6">
              Choose your portal
            </h2>
            
            <Button
              onClick={() => navigate("/login/admin")}
              variant="outline"
              size="lg"
              className="w-full h-14 text-base gap-3 border-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
            >
              <Shield className="h-5 w-5 text-primary" />
              <span>Admin Login</span>
            </Button>
            
            <Button
              onClick={() => navigate("/login/mentor")}
              size="lg"
              className="w-full h-14 text-base gap-3 gradient-primary hover:opacity-90 transition-all"
            >
              <Users className="h-5 w-5" />
              <span>Mentor Login</span>
            </Button>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto px-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center p-4 rounded-xl bg-card/50 border border-border/30 stagger-item"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
              <h3 className="font-medium text-sm text-foreground">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} HackScore. Built for hackathon excellence.</p>
      </footer>
    </div>
  );
}
