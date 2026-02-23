import { useState, useMemo } from "react";
import { doNotDealList, type DoNotDealEntry, auditTrail } from "@/data/tcg";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
import { format } from "date-fns";

type DndStatus = "Pending Review" | "Verified" | "Rejected";

interface DndEntry extends DoNotDealEntry {
  submittedBy: string;
  submittedDate: string;
  verificationStatus: DndStatus;
  verifiedBy: string | null;
  verifiedDate: string | null;
  rejectionReason: string | null;
}

const seedEntries = (): DndEntry[] =>
  doNotDealList.map(e => ({
    ...e,
    submittedBy: e.addedBy,
    submittedDate: e.dateAdded,
    verificationStatus: "Verified" as DndStatus,
    verifiedBy: "Tom Griffiths (TCG)",
    verifiedDate: e.dateAdded,
    rejectionReason: null,
  }));

const TCGPlatformConfig = () => {
  const [dndList, setDndList] = useState<DndEntry[]>(seedEntries);

  // Add DND
  const [addDndOpen, setAddDndOpen] = useState(false);
  const [newDndName, setNewDndName] = useState("");
  const [newDndType, setNewDndType] = useState("Dealer");
  const [newDndCH, setNewDndCH] = useState("");
  const [newDndReason, setNewDndReason] = useState("");
  const [newDndJustification, setNewDndJustification] = useState("");
  const [newDndSubmitter, setNewDndSubmitter] = useState("");

  // Review modal
  const [reviewTarget, setReviewTarget] = useState<DndEntry | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Remove modal
  const [removeTarget, setRemoveTarget] = useState<DndEntry | null>(null);
  const [removeReason, setRemoveReason] = useState("");

  const pendingCount = dndList.filter(e => e.verificationStatus === "Pending Review").length;

  const handleAddDnd = () => {
    if (!newDndName.trim() || !newDndReason.trim() || !newDndJustification.trim() || !newDndSubmitter.trim()) return;
    const entry: DndEntry = {
      id: `pdnd${String(dndList.length + 1).padStart(3, "0")}`,
      entityName: newDndName.trim(),
      entityType: newDndType,
      companiesHouseNumber: newDndCH.trim() || null,
      reason: newDndReason.trim(),
      addedBy: "Pending — " + newDndSubmitter.trim(),
      dateAdded: new Date().toISOString().slice(0, 10),
      visibleToAllLenders: false,
      submittedBy: newDndSubmitter.trim(),
      submittedDate: new Date().toISOString().slice(0, 10),
      verificationStatus: "Pending Review",
      verifiedBy: null,
      verifiedDate: null,
      rejectionReason: null,
    };
    setDndList(prev => [entry, ...prev]);
    setAddDndOpen(false);
    setNewDndName(""); setNewDndType("Dealer"); setNewDndCH(""); setNewDndReason(""); setNewDndJustification(""); setNewDndSubmitter("");
    toast({ title: "DND submission received", description: `${entry.entityName} is pending TCG verification before broadcast.` });
  };

  const handleVerify = () => {
    if (!reviewTarget) return;
    setDndList(prev => prev.map(e =>
      e.id === reviewTarget.id
        ? { ...e, verificationStatus: "Verified" as DndStatus, verifiedBy: "TCG Operations", verifiedDate: new Date().toISOString().slice(0, 10), visibleToAllLenders: true, addedBy: e.submittedBy }
        : e
    ));
    toast({ title: "DND entry verified", description: `${reviewTarget.entityName} is now broadcast to all lenders.` });
    setReviewTarget(null);
  };

  const handleReject = () => {
    if (!reviewTarget || !rejectionReason.trim()) return;
    setDndList(prev => prev.map(e =>
      e.id === reviewTarget.id
        ? { ...e, verificationStatus: "Rejected" as DndStatus, rejectionReason: rejectionReason.trim(), verifiedBy: "TCG Operations", verifiedDate: new Date().toISOString().slice(0, 10) }
        : e
    ));
    toast({ title: "DND entry rejected", description: `${reviewTarget.entityName} will not be broadcast.` });
    setReviewTarget(null);
    setRejectionReason("");
  };

  const handleRemoveDnd = () => {
    if (!removeTarget || !removeReason.trim()) return;
    setDndList(prev => prev.filter(e => e.id !== removeTarget.id));
    (auditTrail as any[]).unshift({
      id: `at${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "TCG Operations",
      role: "tcg_ops",
      lender: "Platform",
      entityType: "DND",
      entityId: removeTarget.id,
      action: "Removed",
      changes: `${removeTarget.entityName} removed from Platform DND. Reason: ${removeReason.trim()}`,
    });
    toast({ title: "Entity removed", description: `${removeTarget.entityName} has been removed from the Do Not Deal list.` });
    setRemoveTarget(null);
    setRemoveReason("");
  };

  const statusBadge = (status: DndStatus) => {
    switch (status) {
      case "Pending Review":
        return <Badge variant="outline" className="gap-1 text-amber-600 border-amber-400"><Clock className="w-3 h-3" /> Pending Review</Badge>;
      case "Verified":
        return <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-400"><CheckCircle2 className="w-3 h-3" /> Verified</Badge>;
      case "Rejected":
        return <Badge variant="outline" className="gap-1 text-destructive border-destructive"><XCircle className="w-3 h-3" /> Rejected</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Platform Configuration</h2>
        <p className="text-muted-foreground">
          Manage the platform-wide Do Not Deal list. RAG thresholds, CSS thresholds, and section weightings are configured per-lender during onboarding.
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-blue-300 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
        <CardContent className="pt-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Note:</strong> RAG thresholds, CSS Oversight/Reward thresholds, and compliance section weightings are lender-specific settings configured during lender onboarding. They can be viewed and edited on each <span className="font-medium text-foreground">Lender Detail</span> page.
        </CardContent>
      </Card>

      {/* Pending Review Alert */}
      {pendingCount > 0 && (
        <Card className="border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-700">
          <CardContent className="pt-5 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="font-semibold text-foreground">{pendingCount} DND {pendingCount === 1 ? "submission" : "submissions"} awaiting verification</div>
              <p className="text-xs text-muted-foreground">Lender-submitted entries require TCG review before broadcast.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DND List */}
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Platform-Wide Do Not Deal List</CardTitle>
            <CardDescription>Lenders submit entries → TCG verifies → then broadcast to all lenders.</CardDescription>
          </div>
          <Button size="sm" onClick={() => setAddDndOpen(true)} className="gap-1.5">
            <Plus className="w-4 h-4" /> Submit DND Entry
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entity Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dndList.map(entry => (
                <TableRow key={entry.id} className={entry.verificationStatus === "Rejected" ? "opacity-50" : ""}>
                  <TableCell className="font-medium">{entry.entityName}</TableCell>
                  <TableCell><Badge variant="outline">{entry.entityType}</Badge></TableCell>
                  <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground" title={entry.reason}>
                    {entry.reason.length > 80 ? entry.reason.slice(0, 80) + "…" : entry.reason}
                  </TableCell>
                  <TableCell className="text-xs">{entry.submittedBy}</TableCell>
                  <TableCell className="text-xs">{format(new Date(entry.submittedDate), "dd MMM yyyy")}</TableCell>
                  <TableCell>{statusBadge(entry.verificationStatus)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {entry.verificationStatus === "Pending Review" && (
                        <Button size="icon" variant="ghost" onClick={() => setReviewTarget(entry)} title="Review">
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {entry.verificationStatus === "Verified" && (
                        <Button size="icon" variant="ghost" onClick={() => setRemoveTarget(entry)} className="text-destructive hover:text-destructive" title="Remove">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {dndList.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-6 text-muted-foreground">No entries.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Submit DND Modal */}
      <Dialog open={addDndOpen} onOpenChange={setAddDndOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Do Not Deal Entry</DialogTitle>
            <DialogDescription>This submission will be reviewed by TCG before being broadcast to all lenders.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Submitted By (Lender)</Label>
              <Input value={newDndSubmitter} onChange={e => setNewDndSubmitter(e.target.value)} placeholder="e.g. Apex Motor Finance Ltd" />
            </div>
            <div className="space-y-1.5">
              <Label>Entity Name</Label>
              <Input value={newDndName} onChange={e => setNewDndName(e.target.value)} placeholder="Company or person name" />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <select value={newDndType} onChange={e => setNewDndType(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option>Dealer</option>
                <option>Director</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Companies House Number (optional)</Label>
              <Input value={newDndCH} onChange={e => setNewDndCH(e.target.value)} placeholder="e.g. 12345678" />
            </div>
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <textarea value={newDndReason} onChange={e => setNewDndReason(e.target.value)} placeholder="Reason for listing…"
                className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <Label>Justification (required)</Label>
              <textarea value={newDndJustification} onChange={e => setNewDndJustification(e.target.value)} placeholder="Justification for platform-wide listing…"
                className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDndOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDnd} disabled={!newDndName.trim() || !newDndReason.trim() || !newDndJustification.trim() || !newDndSubmitter.trim()}>Submit for Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      <Dialog open={!!reviewTarget} onOpenChange={open => { if (!open) { setReviewTarget(null); setRejectionReason(""); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review DND Submission</DialogTitle>
            <DialogDescription>Verify this entry before broadcasting to all lenders.</DialogDescription>
          </DialogHeader>
          {reviewTarget && (
            <div className="space-y-3 py-2 text-sm">
              <div><span className="text-muted-foreground">Entity:</span> <strong>{reviewTarget.entityName}</strong> ({reviewTarget.entityType})</div>
              <div><span className="text-muted-foreground">Submitted by:</span> {reviewTarget.submittedBy}</div>
              <div><span className="text-muted-foreground">Reason:</span> {reviewTarget.reason}</div>
              {reviewTarget.companiesHouseNumber && (
                <div><span className="text-muted-foreground">CH Number:</span> {reviewTarget.companiesHouseNumber}</div>
              )}
              <div className="pt-2 border-t border-border space-y-1.5">
                <Label>Rejection Reason (only if rejecting)</Label>
                <Input value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder="Reason for rejection…" />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>Reject</Button>
            <Button onClick={handleVerify} className="gap-1.5"><CheckCircle2 className="w-4 h-4" /> Verify & Broadcast</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove DND Confirm Modal */}
      <Dialog open={!!removeTarget} onOpenChange={open => { if (!open) { setRemoveTarget(null); setRemoveReason(""); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove from Do Not Deal List?</DialogTitle>
            <DialogDescription>Remove "{removeTarget?.entityName}" from the platform-wide list. An audit record will be created.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <Label>Audit Reason</Label>
            <Input value={removeReason} onChange={e => setRemoveReason(e.target.value)} placeholder="Reason for removal…" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRemoveTarget(null); setRemoveReason(""); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemoveDnd} disabled={!removeReason.trim()}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TCGPlatformConfig;
