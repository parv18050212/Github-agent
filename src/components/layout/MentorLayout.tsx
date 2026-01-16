import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { MentorSidebar } from "./MentorSidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
  "/mentor/dashboard": "Dashboard",
  "/mentor/teams": "My Teams",
  "/mentor/reports": "Reports",
};

export function MentorLayout() {
  const location = useLocation();
  
  // Handle dynamic routes like /mentor/teams/:teamId
  let pageTitle = routeTitles[location.pathname];
  if (!pageTitle) {
    if (location.pathname.startsWith("/mentor/teams/")) {
      pageTitle = "Team Details";
    } else if (location.pathname.startsWith("/mentor/reports/")) {
      pageTitle = "Team Report";
    } else {
      pageTitle = "Mentor";
    }
  }

  return (
    <SidebarProvider>
      <MentorSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
