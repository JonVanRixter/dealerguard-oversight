import { useNavigate } from "react-router-dom";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import { lenders, dealers, manualReviewQueue, auditTrail } from "@/data/tcg";
import {
  Building2, Store, AlertTriangle, Activity, Clock, ArrowRight,
  TrendingUp, TrendingDown, ChevronRight, Users
} from "lucide-react";
import { format, isPast, parseISO } from "date-fns";

const TCGDashboard = () => {
  const { impersonationMode, impersonatedLender } = useImpersonation();
  const navigate = useNavigate();

  const activeLenders = lenders.filter(l => l.status === "Active");
  const totalDealers = activeLenders.reduce((sum, l) => sum + l.dealerCount, 0);
  const avgScore = activeLenders.length
    ? +(activeLenders.reduce((s, l) => s + (l.avgPortfolioScore ?? 0), 0) / activeLenders.filter(l => l.avgPortfolioScore !== null).length).toFixed(1)
    : 0;
  const pendingReviews = manualReviewQueue.filter(r => r.status === "Pending" || r.status === "In Progress");
  const overdueReviews = pendingReviews.filter(r => isPast(parseISO(r.slaDeadline)));

  const ragTotals = activeLenders.reduce(
    (acc, l) => ({
      Green: acc.Green + l.ragDistribution.Green,
      Amber: acc.Amber + l.ragDistribution.Amber,
      Red: acc.Red + l.ragDistribution.Red,
    }),
    { Green: 0, Amber: 0, Red: 0 }
  );

  const recentAudit = [...auditTrail].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);
  const topReviews = [...pendingReviews].sort((a, b) => new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime()).slice(0, 5);

  const stats = [
    { label: "Active Lenders", value: activeLenders.length, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Dealers", value: totalDealers, icon: Store, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Avg Portfolio Score", value: avgScore, icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
    { label: "Pending Reviews", value: pendingReviews.length, icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Overdue SLAs", value: overdueReviews.length, icon: Clock, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Overview</h2>
        <p className="text-muted-foreground">
          {impersonationMode ? `Showing data for ${impersonatedLender}` : "Platform-wide compliance summary"}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-lg border border-border p-4 flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* RAG Distribution Overview */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Platform RAG Distribution</h3>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-6 rounded-full overflow-hidden flex bg-muted">
            {ragTotals.Green > 0 && (
              <div
                className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ width: `${(ragTotals.Green / totalDealers) * 100}%` }}
              >
                {ragTotals.Green}
              </div>
            )}
            {ragTotals.Amber > 0 && (
              <div
                className="bg-amber-500 h-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ width: `${(ragTotals.Amber / totalDealers) * 100}%` }}
              >
                {ragTotals.Amber}
              </div>
            )}
            {ragTotals.Red > 0 && (
              <div
                className="bg-red-500 h-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ width: `${(ragTotals.Red / totalDealers) * 100}%` }}
              >
                {ragTotals.Red}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Green: {ragTotals.Green}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Amber: {ragTotals.Amber}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Red: {ragTotals.Red}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lender Activity Table */}
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Lender Activity</h3>
            <button
              onClick={() => navigate("/tcg/lenders")}
              className="text-xs text-accent hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-2 font-medium">Lender</th>
                  <th className="pb-2 font-medium text-center">Dealers</th>
                  <th className="pb-2 font-medium text-center">Avg Score</th>
                  <th className="pb-2 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {lenders.map(l => (
                  <tr
                    key={l.id}
                    onClick={() => navigate(`/tcg/lenders/${l.id}`)}
                    className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition"
                  >
                    <td className="py-2.5 font-medium text-foreground">{l.name}</td>
                    <td className="py-2.5 text-center">{l.dealerCount}</td>
                    <td className="py-2.5 text-center">{l.avgPortfolioScore ?? "—"}</td>
                    <td className="py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${l.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manual Review Queue */}
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Manual Review Queue</h3>
            <button
              onClick={() => navigate("/tcg/manual-review")}
              className="text-xs text-accent hover:underline flex items-center gap-1"
            >
              View Full Queue <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {topReviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending reviews</p>
          ) : (
            <div className="space-y-2">
              {topReviews.map(r => {
                const overdue = isPast(parseISO(r.slaDeadline));
                return (
                  <div
                    key={r.id}
                    onClick={() => navigate("/tcg/manual-review")}
                    className={`p-3 rounded-md border cursor-pointer hover:ring-1 hover:ring-accent/50 transition ${overdue ? "border-destructive/40 bg-destructive/5" : "border-border"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-foreground">{r.dealerName}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${overdue ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-600"}`}>
                        {overdue ? "OVERDUE" : format(parseISO(r.slaDeadline), "dd MMM HH:mm")}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{r.lenderName} · {r.checkName} — {r.reason.slice(0, 80)}…</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${r.priority === "High" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                        {r.priority}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{r.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
          <button
            onClick={() => navigate("/tcg/audit-trail")}
            className="text-xs text-accent hover:underline flex items-center gap-1"
          >
            Full Audit Trail <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {recentAudit.map(entry => (
            <div key={entry.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-foreground">
                  <span className="font-medium">{entry.user}</span>{" "}
                  <span className="text-muted-foreground">{entry.action.toLowerCase()}</span>{" "}
                  <span className="font-medium">{entry.entityType}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{entry.changes}</p>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {format(parseISO(entry.timestamp), "dd MMM HH:mm")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TCGDashboard;
