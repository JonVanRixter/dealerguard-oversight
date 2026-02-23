import { useState, useMemo } from "react";
import { doNotDealList, type DoNotDealEntry, auditTrail } from "@/data/tcg";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

const SECTIONS = [
  "Governance & Oversight",
  "Training & Competence",
  "Customer Outcomes",
  "Complaints Handling",
  "Financial Promotions",
  "Data Protection",
  "KYC & AML",
  "Financial Risk",
];

const TCGPlatformConfig = () => {
  // Section 1 — RAG Thresholds
  const [greenThreshold, setGreenThreshold] = useState(75);
  const [amberThreshold, setAmberThreshold] = useState(50);
  const [ragConfirmOpen, setRagConfirmOpen] = useState(false);

  // Section 2 — CSS Thresholds
  const [cssReward, setCssReward] = useState(75);
  const [cssOversight, setCssOversight] = useState(75);

  // Section 3 — Section Weights
  const [weights, setWeights] = useState<number[]>(SECTIONS.map(() => 12.5));
  const weightTotal = useMemo(() => weights.reduce((s, w) => s + w, 0), [weights]);

  // Section 4 — DND
  const [dndList, setDndList] = useState<DoNotDealEntry[]>([...doNotDealList]);
  const [addDndOpen, setAddDndOpen] = useState(false);
  const [newDndName, setNewDndName] = useState("");
  const [newDndType, setNewDndType] = useState("Dealer");
  const [newDndCH, setNewDndCH] = useState("");
  const [newDndReason, setNewDndReason] = useState("");
  const [newDndJustification, setNewDndJustification] = useState("");

  const [removeTarget, setRemoveTarget] = useState<DoNotDealEntry | null>(null);
  const [removeReason, setRemoveReason] = useState("");

  const updateWeight = (idx: number, val: string) => {
    const n = parseFloat(val) || 0;
    setWeights(prev => prev.map((w, i) => (i === idx ? n : w)));
  };

  const handleRagSave = () => setRagConfirmOpen(true);
  const confirmRagSave = () => {
    setRagConfirmOpen(false);
    toast({ title: "RAG thresholds updated", description: "Platform defaults have been saved." });
  };

  const handleCssSave = () => {
    toast({ title: "CSS thresholds updated", description: `Reward ≥ ${cssReward}, Oversight < ${cssOversight}` });
  };

  const handleWeightSave = () => {
    if (Math.abs(weightTotal - 100) > 0.01) return;
    toast({ title: "Section weights updated", description: "Platform defaults have been saved." });
  };

  const handleAddDnd = () => {
    if (!newDndName.trim() || !newDndReason.trim() || !newDndJustification.trim()) return;
    const entry: DoNotDealEntry = {
      id: `pdnd${String(dndList.length + 1).padStart(3, "0")}`,
      entityName: newDndName.trim(),
      entityType: newDndType,
      companiesHouseNumber: newDndCH.trim() || null,
      reason: newDndReason.trim(),
      addedBy: "TCG Operations",
      dateAdded: new Date().toISOString().slice(0, 10),
      visibleToAllLenders: true,
    };
    setDndList(prev => [...prev, entry]);
    setAddDndOpen(false);
    setNewDndName(""); setNewDndType("Dealer"); setNewDndCH(""); setNewDndReason(""); setNewDndJustification("");
    toast({ title: "Entity added to Do Not Deal list", description: `${entry.entityName} is now visible to ALL lenders.` });
  };

  const handleRemoveDnd = () => {
    if (!removeTarget || !removeReason.trim()) return;
    setDndList(prev => prev.filter(e => e.id !== removeTarget.id));
    // Append to audit trail state
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Platform Config</h2>
        <p className="text-muted-foreground">System-wide settings, thresholds, and configurations.</p>
      </div>

      {/* Section 1 — RAG Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Default RAG Thresholds</CardTitle>
          <CardDescription>Platform defaults — lenders inherit these unless customised.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Green Threshold (≥)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  value={[greenThreshold]}
                  onValueChange={([v]) => { setGreenThreshold(v); if (v <= amberThreshold) setAmberThreshold(v - 1); }}
                  min={1} max={100} step={1} className="flex-1"
                />
                <span className="text-sm font-mono w-10 text-right">{greenThreshold}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm">Amber Threshold (≥)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  value={[amberThreshold]}
                  onValueChange={([v]) => { if (v < greenThreshold) setAmberThreshold(v); }}
                  min={1} max={99} step={1} className="flex-1"
                />
                <span className="text-sm font-mono w-10 text-right">{amberThreshold}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Badge className="bg-green-600 hover:bg-green-600 text-white">Green ≥ {greenThreshold}</Badge>
            <Badge className="bg-amber-500 hover:bg-amber-500 text-white">Amber {amberThreshold}–{greenThreshold - 1}</Badge>
            <Badge className="bg-red-600 hover:bg-red-600 text-white">Red &lt; {amberThreshold}</Badge>
          </div>
          <Button onClick={handleRagSave}>Save Defaults</Button>
        </CardContent>
      </Card>

      {/* Section 2 — CSS Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">CSS Oversight / Reward Thresholds</CardTitle>
          <CardDescription>
            Dealers with CSS ≥ {cssReward} are eligible for recognition. Dealers with CSS &lt; {cssOversight} are placed under enhanced oversight.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Reward Threshold (≥)</Label>
              <Input type="number" min={0} max={100} value={cssReward} onChange={e => setCssReward(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label>Oversight Threshold (&lt;)</Label>
              <Input type="number" min={0} max={100} value={cssOversight} onChange={e => setCssOversight(Number(e.target.value))} />
            </div>
          </div>
          <Button onClick={handleCssSave}>Save Thresholds</Button>
        </CardContent>
      </Card>

      {/* Section 3 — Section Weights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Section Weighting Defaults</CardTitle>
          <CardDescription>Configure the default weight for each compliance section. Weights must total 100%.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {SECTIONS.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <span className="text-sm flex-1">{s}</span>
                <Input
                  type="number" min={0} max={100} step={0.5}
                  value={weights[i]}
                  onChange={e => updateWeight(i, e.target.value)}
                  className="w-24 text-right"
                />
                <span className="text-xs text-muted-foreground w-4">%</span>
              </div>
            ))}
          </div>
          <div className={`flex items-center gap-2 text-sm font-medium ${Math.abs(weightTotal - 100) > 0.01 ? "text-red-600" : "text-green-600"}`}>
            {Math.abs(weightTotal - 100) > 0.01 && <AlertTriangle className="w-4 h-4" />}
            Total: {weightTotal.toFixed(1)}%
            {Math.abs(weightTotal - 100) > 0.01 && " — must equal 100%"}
          </div>
          <Button onClick={handleWeightSave} disabled={Math.abs(weightTotal - 100) > 0.01}>Save Weights</Button>
        </CardContent>
      </Card>

      {/* Section 4 — Do Not Deal List */}
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Platform-Wide Do Not Deal List</CardTitle>
            <CardDescription>Entities flagged across all lenders on the platform.</CardDescription>
          </div>
          <Button size="sm" onClick={() => setAddDndOpen(true)} className="gap-1.5">
            <Plus className="w-4 h-4" /> Add to Platform DND
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entity Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Added By</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dndList.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.entityName}</TableCell>
                  <TableCell><Badge variant="outline">{entry.entityType}</Badge></TableCell>
                  <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground" title={entry.reason}>
                    {entry.reason.length > 80 ? entry.reason.slice(0, 80) + "…" : entry.reason}
                  </TableCell>
                  <TableCell className="text-xs">{entry.addedBy}</TableCell>
                  <TableCell className="text-xs">{format(new Date(entry.dateAdded), "dd MMM yyyy")}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" onClick={() => setRemoveTarget(entry)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {dndList.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">No entries.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* RAG Confirm Modal */}
      <Dialog open={ragConfirmOpen} onOpenChange={setRagConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Default RAG Thresholds?</DialogTitle>
            <DialogDescription>Updating defaults will apply to all lenders who have not customised their thresholds. Continue?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRagConfirmOpen(false)}>Cancel</Button>
            <Button onClick={confirmRagSave}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add DND Modal */}
      <Dialog open={addDndOpen} onOpenChange={setAddDndOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Platform Do Not Deal List</DialogTitle>
            <DialogDescription>This entity will be visible to ALL lenders on the platform.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
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
            <Button onClick={handleAddDnd} disabled={!newDndName.trim() || !newDndReason.trim() || !newDndJustification.trim()}>Add Entity</Button>
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
