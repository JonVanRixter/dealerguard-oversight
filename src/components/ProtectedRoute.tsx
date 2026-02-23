import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { ReactNode } from "react";

type UserRole = "lender" | "tcg_ops";

export const ProtectedRoute = ({ children, requiredRole }: { children: ReactNode; requiredRole: UserRole }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated || userRole !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
