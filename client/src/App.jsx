import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";

// Candidate Pages
import CandidateLayout from "./pages/candidate/CandidateLayout";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateJobs from "./pages/candidate/CandidateJobs";
import CandidateJobDetails from "./pages/candidate/CandidateJobDetails";
import CandidateApplications from "./pages/candidate/CandidateApplications";
import CandidateProfile from "./pages/candidate/CandidateProfile";

// Recruiter Pages
import RecruiterLayout from "./pages/recruiter/RecruiterLayout";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import RecruiterJobApplicants from "./pages/recruiter/RecruiterJobApplicants";
import RecruiterSearch from "./pages/recruiter/RecruiterSearch";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";

import NotFound from "./pages/NotFound";
import CandidateMessages from "./pages/candidate/CandidateMessages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />

            {/* Candidate Routes */}
            <Route
              path="/candidate"
              element={
                <ProtectedRoute requiredRole="candidate">
                  <CandidateLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<CandidateDashboard />} />
              <Route path="jobs" element={<CandidateJobs />} />
              <Route path="applications" element={<CandidateApplications />} />
              <Route path="messages" element={<CandidateMessages />} />
              <Route path="profile" element={<CandidateProfile />} />
            </Route>

            <Route
              path="/candidate/jobs/:id"
              element={
                <ProtectedRoute requiredRole="candidate">
                  <CandidateLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<CandidateJobDetails />} />
            </Route>

            {/* Recruiter Routes */}
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <RecruiterLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<RecruiterDashboard />} />
              <Route path="jobs" element={<RecruiterJobs />} />
              <Route path="search" element={<RecruiterSearch />} />
              <Route path="profile" element={<RecruiterProfile />} />
            </Route>

            <Route
              path="/recruiter/jobs/:id/applicants"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <RecruiterLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<RecruiterJobApplicants />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
