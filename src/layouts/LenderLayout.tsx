import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, LogOut } from "lucide-react";
import LenderSidebar from "@/components/lender/LenderSidebar";

const LenderLayout = () => {
  const { logout, userName } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-accent" />
          <h1 className="text-lg font-bold font-heading">DealerGuard — Lender Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-primary-foreground/80">{userName}</span>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-primary-foreground transition">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>
      <div className="flex flex-1">
        <LenderSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LenderLayout;
