import React, { createContext, useContext, useState, useCallback } from "react";

type UserRole = "lender" | "tcg_ops" | null;

interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole;
  userEmail: string | null;
  userName: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => { success: boolean; redirect: string } | { success: false; error: string };
  logout: () => void;
}

const CREDENTIALS = [
  { email: "test@lender.com", password: "password123", role: "lender" as UserRole, name: "Lender Admin", redirect: "/dashboard" },
  { email: "tcg@thecomplianceguys.co.uk", password: "TCGAdmin2026", role: "tcg_ops" as UserRole, name: "TCG Operations", redirect: "/tcg/dashboard" },
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const stored = sessionStorage.getItem("dealerguard_auth");
    if (stored) return JSON.parse(stored);
    return { isAuthenticated: false, userRole: null, userEmail: null, userName: null };
  });

  const login = useCallback((email: string, password: string) => {
    const match = CREDENTIALS.find(c => c.email === email && c.password === password);
    if (!match) return { success: false as const, error: "Invalid credentials" };
    const state: AuthState = { isAuthenticated: true, userRole: match.role, userEmail: match.email, userName: match.name };
    setAuth(state);
    sessionStorage.setItem("dealerguard_auth", JSON.stringify(state));
    return { success: true as const, redirect: match.redirect };
  }, []);

  const logout = useCallback(() => {
    setAuth({ isAuthenticated: false, userRole: null, userEmail: null, userName: null });
    sessionStorage.removeItem("dealerguard_auth");
  }, []);

  return <AuthContext.Provider value={{ ...auth, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
