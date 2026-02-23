import { useState, useMemo, useRef } from "react";
import { dealers } from "@/data/tcg/dealers";
import { lenders, manualReviewQueue, type ManualReviewItem } from "@/data/tcg";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  ArrowUpDown, Clock, FileText, Upload, CheckCircle2, XCircle, MessageSquare,
  AlertTriangle, BarChart3, ShieldCheck,
} from "lucide-react";
import { format, formatDistanceToNow, differenceInHours, isPast } from "date-fns";

const TCG_USERS = ["Tom Griffiths", "Amara Osei", "Rachel Burrows"];

const ragColor: Record<string, string> = {
  Green: "bg-green-600 hover:bg-green-600 text-white",
  Amber: "bg-amber-500 hover:bg-amber-500 text-white",
  Red: "bg-red-600 hover:bg-red-600 text-white",
};

function slaDisplay(deadline: string) {
  const d = new Date(deadline);
  const now = new Date();
  const hoursLeft = differenceInHours(d, now);
  const past = isPast(d);

  let colorClass = "text-green-600";
  if (past) colorClass = "text-red-600 font-semibold";
  else if (hoursLeft < 24) colorClass = "text-amber-600 font-medium";

  const label = past
    ? `Overdue (${formatDistanceToNow(d)} ago)`
    : `${formatDistanceToNow(d, { addSuffix: false })} left`;

  return { colorClass, label, formatted: format(d, "dd MMM yyyy HH:mm") };
}

type SortKey = "dealerName" | "slaDeadline" | "priority" | "status";

const TCGManualReview = () => {
  const [items, setItems] = useState<ManualReviewItem[]>([...manualReviewQueue]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [lenderFilter, setLenderFilter] = useState("All Lenders");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("slaDeadline");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Modal-local editable state
  const [editNotes, setEditNotes] = useState("");
  const [editAssigned, setEditAssigned] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selected = selectedId ? items.find(i => i.id === selectedId) ?? null : null;
  const dealer = selected ? dealers.find(d => d.id === selected.dealerId) : null;

  const openItem = (item: ManualReviewItem) => {
    setSelectedId(item.id);
    setEditNotes(item.internalNotes);
    setEditAssigned(item.assignedTo);
  };

  const closeModal = () => {
    // auto-save notes + assignment before closing
    if (selected) {
      setItems(prev =>
        prev.map(i => (i.id === selected.id ? { ...i, internalNotes: editNotes, assignedTo: editAssigned } : i))
      );
    }
    setSelectedId(null);
  };

  const resolveItem = (outcome: string) => {
    if (!selected) return;
    const newStatus = outcome === "Request More Info" ? "Pending Info" : "Resolved";
    setItems(prev =>
      prev.map(i =>
        i.id === selected.id
          ? { ...i, status: newStatus, outcome: outcome === "Request More Info" ? null : outcome, internalNotes: editNotes, assignedTo: editAssigned }
          : i
      )
    );
    setSelectedId(null);

    const msgs: Record<string, string> = {
      "Approve (Pass)": `${selected.dealerName} — ${selected.checkName} approved. Lender notified.`,
      "Flag (Fail)": `${selected.dealerName} — ${selected.checkName} flagged. Lender notified.`,
      "Request More Info": "Lender has been notified (POC only).",
    };
    toast({ title: outcome, description: msgs[outcome] });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selected || !e.target.files?.length) return;
    const name = e.target.files[0].name;
    setItems(prev =>
      prev.map(i => (i.id === selected.id ? { ...i, evidenceFiles: [...i.evidenceFiles, name] } : i))
    );
    toast({ title: "File uploaded", description: `${name} added to evidence.` });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let list = [...items];
    if (statusFilter !== "All") list = list.filter(i => i.status === statusFilter);
    if (lenderFilter !== "All Lenders") list = list.filter(i => i.lenderName === lenderFilter);
    if (priorityFilter !== "All") list = list.filter(i => i.priority === priorityFilter);
    list.sort((a, b) => {
      const av: any = a[sortKey];
      const bv: any = b[sortKey];
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return list;
  }, [items, statusFilter, lenderFilter, priorityFilter, sortKey, sortDir]);

  const SortHeader = ({ label, col }: { label: string; col: SortKey }) => (
    <button onClick={() => toggleSort(col)} className="flex items-center gap-1 hover:text-foreground transition">
      {label} <ArrowUpDown className="w-3.5 h-3.5" />
    </button>
  );

  // Re-read selected from items in case it was updated
  const currentSelected = selectedId ? items.find(i => i.id === selectedId) ?? null : null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">Manual Review Queue</h2>
        <p className="text-muted-foreground">Compliance exceptions requiring TCG investigation.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="All">All Statuses</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Pending Info</option>
        </select>
        <select value={lenderFilter} onChange={e => setLenderFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option>All Lenders</option>
          {lenders.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="All">All Priorities</option>
          <option>High</option>
          <option>Normal</option>
        </select>
      </div>

      {/* Queue Table */}
      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><SortHeader label="Dealer" col="dealerName" /></TableHead>
              <TableHead>Lender</TableHead>
              <TableHead>Check</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead><SortHeader label="Status" col="status" /></TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead><SortHeader label="Priority" col="priority" /></TableHead>
              <TableHead><SortHeader label="SLA Deadline" col="slaDeadline" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(item => {
              const sla = slaDisplay(item.slaDeadline);
              return (
                <TableRow key={item.id} className="cursor-pointer" onClick={() => openItem(item)}>
                  <TableCell className="font-medium">{item.dealerName}</TableCell>
                  <TableCell className="text-xs">{item.lenderName}</TableCell>
                  <TableCell>{item.checkName}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground text-xs" title={item.reason}>
                    {item.reason.length > 80 ? item.reason.slice(0, 80) + "…" : item.reason}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      item.status === "Resolved" ? "secondary" :
                      item.status === "In Progress" ? "default" :
                      "outline"
                    }>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">{item.assignedTo ?? "—"}</TableCell>
                  <TableCell>
                    <Badge className={item.priority === "High" ? "bg-red-600 hover:bg-red-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted"}>
                      {item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className={`text-xs ${sla.colorClass}`}>
                      <div>{sla.formatted}</div>
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {sla.label}</div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No items match your filters.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!currentSelected} onOpenChange={open => { if (!open) closeModal(); }}>
        {currentSelected && (
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {currentSelected.dealerName} — {currentSelected.checkName}
                <Badge className={currentSelected.priority === "High" ? "bg-red-600 hover:bg-red-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted"}>
                  {currentSelected.priority}
                </Badge>
              </DialogTitle>
              <DialogDescription>Review exception and take action.</DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-2">
              {/* Section 1: Dealer Summary */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Dealer Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 rounded-md p-3">
                  <div><span className="text-muted-foreground">Dealer:</span> {currentSelected.dealerName}</div>
                  <div><span className="text-muted-foreground">Lender:</span> {currentSelected.lenderName}</div>
                  {dealer && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Score:</span> {dealer.latestScore}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">RAG:</span>
                        <Badge className={ragColor[dealer.ragStatus]}>{dealer.ragStatus}</Badge>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Section 2: Review Details */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Review Details</h4>
                <div className="text-sm space-y-2">
                  <div><span className="text-muted-foreground">Reason:</span> {currentSelected.reason}</div>
                  <div><span className="text-muted-foreground">Created:</span> {format(new Date(currentSelected.createdDate), "dd MMM yyyy")}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">SLA Deadline:</span>
                    {(() => {
                      const sla = slaDisplay(currentSelected.slaDeadline);
                      return <span className={sla.colorClass}>{sla.formatted} ({sla.label})</span>;
                    })()}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Section 3: Evidence Files */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><FileText className="w-4 h-4" /> Evidence Files</h4>
                {currentSelected.evidenceFiles.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No evidence files attached.</p>
                ) : (
                  <ul className="space-y-1">
                    {currentSelected.evidenceFiles.map((f, i) => (
                      <li key={i}>
                        <button
                          onClick={() => toast({ title: "File preview not available in POC", description: f })}
                          className="text-sm text-primary hover:underline flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" /> {f}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-2">
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
                  <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload Evidence
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Section 4: Internal Notes */}
              <div>
                <h4 className="text-sm font-semibold mb-1 flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> TCG Internal Notes</h4>
                <p className="text-[11px] text-muted-foreground italic mb-2">Internal — not visible to lender</p>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="Add internal notes…"
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <Separator />

              {/* Section 5: Assign To */}
              <div>
                <Label className="text-sm font-semibold">Assign To</Label>
                <select
                  value={editAssigned ?? ""}
                  onChange={e => setEditAssigned(e.target.value || null)}
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Unassigned</option>
                  {TCG_USERS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              <Separator />

              {/* Section 6: Outcome */}
              {currentSelected.status !== "Resolved" && (
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Outcome</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => resolveItem("Approve (Pass)")} className="gap-1.5 bg-green-600 hover:bg-green-700 text-white">
                      <CheckCircle2 className="w-4 h-4" /> Approve (Pass)
                    </Button>
                    <Button variant="destructive" onClick={() => resolveItem("Flag (Fail)")} className="gap-1.5">
                      <XCircle className="w-4 h-4" /> Flag (Fail)
                    </Button>
                    <Button variant="outline" onClick={() => resolveItem("Request More Info")} className="gap-1.5">
                      <MessageSquare className="w-4 h-4" /> Request More Info
                    </Button>
                  </div>
                </div>
              )}

              {currentSelected.status === "Resolved" && currentSelected.outcome && (
                <div className="bg-muted/50 rounded-md p-3 text-sm">
                  <span className="text-muted-foreground">Outcome:</span>{" "}
                  <Badge variant={currentSelected.outcome.includes("Pass") ? "default" : "destructive"}>
                    {currentSelected.outcome}
                  </Badge>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default TCGManualReview;
