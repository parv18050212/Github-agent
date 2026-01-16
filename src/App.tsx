// HackEval - Hackathon Project Evaluation System
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Auth pages
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

// Layouts
import { MentorLayout } from "./components/layout/MentorLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

// Mentor pages
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorTeams from "./pages/mentor/MentorTeams";
import TeamDetails from "./pages/mentor/TeamDetails";
import MentorReports from "./pages/mentor/MentorReports";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBatches from "./pages/admin/AdminBatches";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminMentors from "./pages/admin/AdminMentors";
import AdminAssignments from "./pages/admin/AdminAssignments";
import AdminMentorViewList from "./pages/admin/AdminMentorViewList";
import AdminMentorViewPage from "./pages/admin/AdminMentorViewPage";
import AdminReports from "./pages/admin/AdminReports";
import AdminUsers from "./pages/admin/AdminUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Root redirect - will be handled by role after login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Mentor routes */}
              <Route
                path="/mentor"
                element={
                  <ProtectedRoute requiredRole="mentor">
                    <MentorLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/mentor/dashboard" replace />} />
                <Route path="dashboard" element={<MentorDashboard />} />
                <Route path="teams" element={<MentorTeams />} />
                <Route path="teams/:teamId" element={<TeamDetails />} />
                <Route path="reports" element={<MentorReports />} />
                <Route path="reports/:teamId" element={<MentorReports />} />
              </Route>

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="batches" element={<AdminBatches />} />
                <Route path="teams" element={<AdminTeams />} />
                <Route path="mentors" element={<AdminMentors />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="assignments" element={<AdminAssignments />} />
                <Route path="mentor-view" element={<AdminMentorViewList />} />
                <Route path="mentor/:mentorId" element={<AdminMentorViewPage />} />
                <Route path="reports" element={<AdminReports />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
