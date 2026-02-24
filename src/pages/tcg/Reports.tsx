import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { lenders, auditTrail } from "@/data/tcg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Download, Users, Building2, BarChart3, AlertTriangle, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const activeLenders = lenders.filter(l => l.status === "Active");
const totalDealers = lenders.reduce((s, l) => s + l.dealerCount, 0);
const platformAvg = activeLenders.length
  ? activeLenders.reduce((s, l) => s + (l.avgPortfolioScore ?? 0), 0) / activeLenders.filter(l => l.avgPortfolioScore != null).length
  : 0;

const ragChartData = activeLenders.map(l => ({
  name: l.name.split(" ").slice(0, 2).join(" "),
  Green: l.ragDistribution.Green,
  Amber: l.ragDistribution.Amber,
  Red: l.ragDistribution.Red,
}));

const TCGReports = () => {
  const navigate = useNavigate();
  const [selectedLender, setSelectedLender] = useState("");

  const lenderReport = useMemo(() => {
    if (!selectedLender) return null;
    const l = lenders.find(x => x.id === selectedLender);
    if (!l) return null;
    const auditEvents = auditTrail.filter(e => e.lender === l.name && e.entityType === "Audit").length;
    const alertAck = auditTrail.filter(e => e.lender === l.name && e.entityType === "Alert" && e.changes.includes("Acknowledged")).length;
    const alertPending = auditTrail.filter(e => e.lender === l.name && e.entityType === "Alert").length - alertAck;
    return { lender: l, auditEvents, alertAck, alertPending };
  }, [selectedLender]);

  const kpis = [
    { icon: Building2, label: "Active Lenders", value: activeLenders.length, route: "/tcg/lenders" },
    { icon: Users, label: "Total Dealers", value: totalDealers, route: "/tcg/dealers" },
    { icon: BarChart3, label: "Platform Avg Score", value: platformAvg.toFixed(1), route: "/tcg/lenders" },
    { icon: AlertTriangle, label: "Pending Alerts", value: 13, route: "/tcg/audit-trail" },
    { icon: ClipboardList, label: "Review Queue Pending", value: 4, route: "/tcg/manual-review" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Reports</h2>
        <p className="text-muted-foreground">Generate and export compliance and performance reports.</p>
      </div>

      {/* Section A — Lender Activity Report */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Lender Activity Report</h3>

        <select
          value={selectedLender}
          onChange={e => setSelectedLender(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm mb-4"
        >
          <option value="">Select a lender…</option>
          {lenders.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>

        {lenderReport && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <Card className="cursor-pointer hover:border-accent transition-colors" onClick={() => navigate("/tcg/dealers")}>
              <CardContent className="pt-5">
                <div className="text-2xl font-bold">{lenderReport.lender.dealerCount}</div>
                <div className="text-xs text-muted-foreground">Dealers Onboarded</div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-accent transition-colors" onClick={() => navigate("/tcg/audit-trail")}>
              <CardContent className="pt-5">
                <div className="text-2xl font-bold">{lenderReport.auditEvents}</div>
                <div className="text-xs text-muted-foreground">Audit Events</div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-accent transition-colors" onClick={() => navigate("/tcg/audit-trail")}>
              <CardContent className="pt-5">
                <div className="text-2xl font-bold">{lenderReport.alertAck}</div>
                <div className="text-xs text-muted-foreground">Alerts Acknowledged</div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-accent transition-colors" onClick={() => navigate("/tcg/audit-trail")}>
              <CardContent className="pt-5">
                <div className="text-2xl font-bold">{lenderReport.alertPending}</div>
                <div className="text-xs text-muted-foreground">Alerts Pending</div>
              </CardContent>
            </Card>
          </div>
        )}

        {lenderReport && (
          <Card className="mb-4">
            <CardHeader><CardTitle className="text-base">Document Expiry Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-600" /> Valid: {Math.max(lenderReport.lender.dealerCount - 3, 0)}</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500" /> Expiring Soon: 2</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-600" /> Expired: 1</div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedLender && (
          <Button variant="outline" className="gap-2" onClick={() => toast({ title: "PDF export available in full MVP" })}>
            <Download className="w-4 h-4" /> Download Lender Report
          </Button>
        )}
      </div>

      <Separator />

      {/* Section B — Platform Summary */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Platform Summary Report</h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {kpis.map(kpi => (
            <Card
              key={kpi.label}
              className="cursor-pointer hover:border-accent transition-colors"
              onClick={() => navigate(kpi.route)}
            >
              <CardContent className="pt-5 flex items-center gap-3">
                <kpi.icon className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <div className="text-[11px] text-muted-foreground">{kpi.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">RAG Distribution by Lender</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ragChartData} barCategoryGap="20%">
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Green" stackId="a" fill="#16a34a" />
                <Bar dataKey="Amber" stackId="a" fill="#f59e0b" />
                <Bar dataKey="Red" stackId="a" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lender</TableHead>
                  <TableHead>Dealers</TableHead>
                  <TableHead>Avg Score</TableHead>
                  <TableHead>Green</TableHead>
                  <TableHead>Amber</TableHead>
                  <TableHead>Red</TableHead>
                  <TableHead>Last Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lenders.map(l => (
                  <TableRow
                    key={l.id}
                    className={`cursor-pointer hover:bg-muted/50 ${l.status === "Inactive" ? "opacity-50" : ""}`}
                    onClick={() => navigate(`/tcg/lenders/${l.id}`)}
                  >
                    <TableCell className="font-medium">{l.name}</TableCell>
                    <TableCell>{l.dealerCount}</TableCell>
                    <TableCell>{l.avgPortfolioScore?.toFixed(1) ?? "—"}</TableCell>
                    <TableCell><Badge className="bg-green-600 hover:bg-green-600 text-white text-[10px]">{l.ragDistribution.Green}</Badge></TableCell>
                    <TableCell><Badge className="bg-amber-500 hover:bg-amber-500 text-white text-[10px]">{l.ragDistribution.Amber}</Badge></TableCell>
                    <TableCell><Badge className="bg-red-600 hover:bg-red-600 text-white text-[10px]">{l.ragDistribution.Red}</Badge></TableCell>
                    <TableCell className="text-xs">{l.lastLogin ? format(new Date(l.lastLogin), "dd MMM yyyy HH:mm") : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Button variant="outline" className="gap-2" onClick={() => toast({ title: "PDF export available in full MVP" })}>
          <Download className="w-4 h-4" /> Download Platform PDF
        </Button>
      </div>
    </div>
  );
};

export default TCGReports;
