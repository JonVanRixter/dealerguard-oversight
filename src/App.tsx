import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ImpersonationProvider } from "@/contexts/ImpersonationContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Lender Portal
import LenderLayout from "./layouts/LenderLayout";
import LenderDashboard from "./pages/LenderDashboard";
import LenderDealers from "./pages/lender/Dealers";
import LenderOnboarding from "./pages/lender/Onboarding";
import LenderDocuments from "./pages/lender/Documents";

// TCG Oversight
import TCGLayout from "./layouts/TCGLayout";
import TCGDashboard from "./pages/tcg/Dashboard";
import TCGLenders from "./pages/tcg/Lenders";
import LenderDetail from "./pages/tcg/LenderDetail";
import TCGDealers from "./pages/tcg/Dealers";
import DealerDetail from "./pages/tcg/DealerDetail";
import TCGManualReview from "./pages/tcg/ManualReview";
import TCGAuditTrail from "./pages/tcg/AuditTrail";
import TCGPlatformConfig from "./pages/tcg/PlatformConfig";
import TCGReports from "./pages/tcg/Reports";
import TCGQAHealthCheck from "./pages/tcg/QAHealthCheck";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ImpersonationProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />

              {/* Lender routes */}
              <Route element={<ProtectedRoute requiredRole="lender"><LenderLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<LenderDashboard />} />
                <Route path="/dealers" element={<LenderDealers />} />
                <Route path="/onboarding" element={<LenderOnboarding />} />
                <Route path="/documents" element={<LenderDocuments />} />
              </Route>

              {/* TCG routes */}
              <Route path="/tcg" element={<ProtectedRoute requiredRole="tcg_ops"><TCGLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/tcg/dashboard" replace />} />
                <Route path="dashboard" element={<TCGDashboard />} />
                <Route path="lenders" element={<TCGLenders />} />
                <Route path="lenders/:id" element={<LenderDetail />} />
                <Route path="dealers" element={<TCGDealers />} />
                <Route path="dealers/:id" element={<DealerDetail />} />
                <Route path="manual-review" element={<TCGManualReview />} />
                <Route path="audit-trail" element={<TCGAuditTrail />} />
                <Route path="platform-config" element={<TCGPlatformConfig />} />
                <Route path="reports" element={<TCGReports />} />
                <Route path="qa-health-check" element={<TCGQAHealthCheck />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </ImpersonationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
