import { useAuth } from "@/contexts/AuthContext";
import { Shield, LogOut } from "lucide-react";

const LenderDashboard = () => {
  const { logout, userName } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-accent" />
          <h1 className="text-lg font-bold">DealerGuard — Lender Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-primary-foreground/80">{userName}</span>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-primary-foreground transition">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>
      <main className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Lender Dashboard</h2>
        <p className="text-muted-foreground">Welcome to the DealerGuard Lender Portal. Your compliance overview will appear here.</p>
      </main>
    </div>
  );
};

export default LenderDashboard;
