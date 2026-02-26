import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { dealers } from "@/data/tcg/dealers";
import { onboardingApplications } from "@/data/tcg/onboardingApplications";
import { Store, ClipboardCheck, BarChart3 } from "lucide-react";

const LenderDashboard = () => {
  const { userName } = useAuth();
  const portfolio = dealers.filter(d => d.lenderId === "l001" && d.onboarding.status === "Approved");
  const activeApps = onboardingApplications.filter(a => a.lenderId === "l001" && !["Approved", "Rejected"].includes(a.status));

  const greenCount = portfolio.filter(d => d.ragStatus === "Green").length;
  const amberCount = portfolio.filter(d => d.ragStatus === "Amber").length;
  const redCount = portfolio.filter(d => d.ragStatus === "Red").length;
  const avgScore = portfolio.length ? Math.round(portfolio.reduce((s, d) => s + d.latestScore, 0) / portfolio.length) : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Welcome, {userName}</h2>
      <p className="text-muted-foreground mb-6">Your compliance overview at a glance.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link to="/dealers" className="bg-card rounded-lg border border-border p-5 hover:ring-1 hover:ring-primary/30 transition flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Store className="w-5 h-5 text-emerald-600" /></div>
          <div>
            <div className="text-2xl font-bold">{portfolio.length}</div>
            <div className="text-xs text-muted-foreground">Active Dealers</div>
          </div>
        </Link>
        <Link to="/dealers/onboarding" className="bg-card rounded-lg border border-border p-5 hover:ring-1 hover:ring-blue-500/30 transition flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><ClipboardCheck className="w-5 h-5 text-blue-600" /></div>
          <div>
            <div className="text-2xl font-bold">{activeApps.length}</div>
            <div className="text-xs text-muted-foreground">Active Onboarding Applications</div>
          </div>
        </Link>
        <div className="bg-card rounded-lg border border-border p-5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-accent" /></div>
          <div>
            <div className="text-2xl font-bold">{avgScore}</div>
            <div className="text-xs text-muted-foreground">Avg Portfolio Score</div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Portfolio RAG Distribution</h3>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-6 rounded-full overflow-hidden flex bg-muted">
            {greenCount > 0 && <div className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-bold text-white" style={{ width: `${(greenCount / portfolio.length) * 100}%` }}>{greenCount}</div>}
            {amberCount > 0 && <div className="bg-amber-500 h-full flex items-center justify-center text-[10px] font-bold text-white" style={{ width: `${(amberCount / portfolio.length) * 100}%` }}>{amberCount}</div>}
            {redCount > 0 && <div className="bg-red-500 h-full flex items-center justify-center text-[10px] font-bold text-white" style={{ width: `${(redCount / portfolio.length) * 100}%` }}>{redCount}</div>}
          </div>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Green: {greenCount}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Amber: {amberCount}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Red: {redCount}</span>
        </div>
      </div>
    </div>
  );
};

export default LenderDashboard;
