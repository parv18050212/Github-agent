// HackEval - Hackathon Project Evaluation System
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import AnalyzeRepo from "./pages/AnalyzeRepo";
import BatchUpload from "./pages/BatchUpload";
import Leaderboard from "./pages/Leaderboard";
import ProjectReport from "./pages/ProjectReport";
import Documentation from "./pages/Documentation";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analyze" element={<AnalyzeRepo />} />
              <Route path="/batch" element={<BatchUpload />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/project/:id" element={<ProjectReport />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
