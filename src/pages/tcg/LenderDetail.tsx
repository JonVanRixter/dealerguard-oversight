import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lenders, type Lender } from "@/data/tcg";
import { auditTrail } from "@/data/tcg";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Eye, Ban, Users, BarChart3, ShieldCheck, Clock } from "lucide-react";
import { format } from "date-fns";

const LenderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { startImpersonation } = useImpersonation();

  const [allLenders, setAllLenders] = useState<Lender[]>(lenders);
  const lender = allLenders.find(l => l.id === id);

  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState("");

  const recentActivity = useMemo(() => {
    if (!lender) return [];
    return auditTrail
      .filter(e => e.lender === lender.name)
      .slice(0, 10);
  }, [lender]);

  if (!lender) {
    return <div className="text-center py-12 text-muted-foreground">Lender not found.</div>;
  }

  const handleViewAsLender = () => {
    startImpersonation(lender.name);
    navigate("/dashboard");
  };

  const handleDeactivate = () => {
    const idx = allLenders.findIndex(l => l.id === lender.id);
    if (idx !== -1) {
      const updated = [...allLenders];
      updated[idx] = { ...updated[idx], status: "Inactive" };
      setAllLenders(updated);
      // Also mutate the source for consistency within session
      (lenders as any)[idx].status = "Inactive";
    }
    setDeactivateOpen(false);
    setDeactivateReason("");
    toast({ title: "Lender deactivated", description: `${lender.name} has been set to Inactive.` });
  };

  const rag = lender.ragThresholds;
  const css = lender.cssThresholds;

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-xl">{lender.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{lender.contactName} · {lender.contactEmail}</p>
          </div>
          <Badge variant={lender.status === "Active" ? "default" : "secondary"} className="text-xs">{lender.status}</Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted-foreground">Billing Address:</span> {lender.billingAddress}</div>
          <div><span className="text-muted-foreground">Created:</span> {format(new Date(lender.createdDate), "dd MMM yyyy")}</div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Users className="w-5 h-5 text-muted-foreground" />
            <div>
              <div className="text-2xl font-bold">{lender.dealerCount}</div>
              <div className="text-xs text-muted-foreground">Dealers</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
            <div>
              <div className="text-2xl font-bold">{lender.avgPortfolioScore != null ? lender.avgPortfolioScore.toFixed(1) : "—"}</div>
              <div className="text-xs text-muted-foreground">Avg Score</div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardContent className="pt-6 flex items-center gap-4">
            <ShieldCheck className="w-5 h-5 text-muted-foreground" />
            <div className="flex gap-2">
              <Badge className="bg-green-600 hover:bg-green-600 text-white">{lender.ragDistribution.Green} Green</Badge>
              <Badge className="bg-amber-500 hover:bg-amber-500 text-white">{lender.ragDistribution.Amber} Amber</Badge>
              <Badge className="bg-red-600 hover:bg-red-600 text-white">{lender.ragDistribution.Red} Red</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thresholds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">RAG Thresholds</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-1">
            <div><span className="inline-block w-3 h-3 rounded-full bg-green-600 mr-2" />Green ≥ {rag.green}</div>
            <div><span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-2" />Amber {rag.amber}–{rag.green - 1}</div>
            <div><span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2" />Red &lt; {rag.amber}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">CSS Thresholds</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-1">
            <div>Reward ≥ {css.reward}</div>
            <div>Oversight &lt; {css.oversight}</div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader><CardTitle className="text-base">Team Members</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lender.teamMembers.map(m => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.role}</TableCell>
                  <TableCell><Badge variant={m.status === "Active" ? "default" : "secondary"}>{m.status}</Badge></TableCell>
                  <TableCell>{m.lastLogin ? format(new Date(m.lastLogin), "dd MMM yyyy HH:mm") : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="w-4 h-4" /> Recent Activity</CardTitle></CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity recorded for this lender.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map(e => (
                  <TableRow key={e.id}>
                    <TableCell className="whitespace-nowrap">{format(new Date(e.timestamp), "dd MMM yyyy HH:mm")}</TableCell>
                    <TableCell>{e.user}</TableCell>
                    <TableCell><Badge variant="outline">{e.action}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-xs max-w-xs truncate">{e.changes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleViewAsLender} className="gap-2">
          <Eye className="w-4 h-4" /> View As Lender
        </Button>
        <Button variant="destructive" onClick={() => setDeactivateOpen(true)} disabled={lender.status === "Inactive"} className="gap-2">
          <Ban className="w-4 h-4" /> Deactivate Lender
        </Button>
      </div>

      {/* Deactivate Modal */}
      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deactivate {lender.name}?</DialogTitle>
            <DialogDescription>This will set the lender to Inactive. They will lose platform access.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Reason</Label>
            <Input value={deactivateReason} onChange={e => setDeactivateReason(e.target.value)} placeholder="Reason for deactivation…" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeactivate} disabled={!deactivateReason.trim()}>Confirm Deactivation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LenderDetail;
