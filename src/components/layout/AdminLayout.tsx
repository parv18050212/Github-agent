import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/batches": "Batches / Semesters",
  "/admin/teams": "Teams",
  "/admin/mentors": "Mentors",
  "/admin/assignments": "Assign Teams",
  "/admin/mentor-view": "Access Mentor View",
  "/admin/reports": "Reports",
};

export function AdminLayout() {
  const location = useLocation();
  
  // Handle dynamic routes
  let pageTitle = routeTitles[location.pathname];
  if (!pageTitle) {
    if (location.pathname.startsWith("/admin/mentor/")) {
      pageTitle = "Viewing Mentor";
    } else {
      pageTitle = "Admin";
    }
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
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
