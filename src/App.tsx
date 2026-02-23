import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ImpersonationProvider } from "@/contexts/ImpersonationContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Login from "./pages/Login";
import LenderDashboard from "./pages/LenderDashboard";
import NotFound from "./pages/NotFound";

import TCGLayout from "./layouts/TCGLayout";
import TCGDashboard from "./pages/tcg/Dashboard";
import TCGLenders from "./pages/tcg/Lenders";
import TCGDealers from "./pages/tcg/Dealers";
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
              <Route path="/dashboard" element={<ProtectedRoute requiredRole="lender"><LenderDashboard /></ProtectedRoute>} />

              {/* TCG routes */}
              <Route path="/tcg" element={<ProtectedRoute requiredRole="tcg_ops"><TCGLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/tcg/dashboard" replace />} />
                <Route path="dashboard" element={<TCGDashboard />} />
                <Route path="lenders" element={<TCGLenders />} />
                <Route path="dealers" element={<TCGDealers />} />
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
