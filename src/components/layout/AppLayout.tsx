import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AppLayoutProps {
  children: React.ReactNode;
}

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/analyze": "Analyze Repository",
  "/batch": "Batch Upload",
  "/leaderboard": "Leaderboard",
  "/docs": "Documentation",
  "/settings": "Settings",
};

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  
  // Handle dynamic routes like /project/:id
  const isProjectPage = currentPath.startsWith("/project/");
  const pageTitle = isProjectPage ? "Project Report" : (routeTitles[currentPath] || "Page");

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 shadow-sm">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 hover:bg-primary/10 rounded-lg" />
              <Separator orientation="vertical" className="mr-2 h-5" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="hover:text-primary transition-colors">HackEval</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold">{pageTitle}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-3">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold leading-tight">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Signed in with Google</p>
                  </div>
                  <Avatar className="h-9 w-9 bg-primary/10 text-primary">
                    <AvatarFallback>{user.email?.slice(0, 2)?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button size="sm" onClick={signInWithGoogle} className="gap-2">
                  Continue with Google
                </Button>
              )}
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/10">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
