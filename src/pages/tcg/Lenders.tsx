import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { lenders, type Lender } from "@/data/tcg";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Search, Plus, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

type SortKey = "name" | "contactEmail" | "dealerCount" | "avgPortfolioScore" | "status" | "createdDate";
type SortDir = "asc" | "desc";

const TCGLenders = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [allLenders, setAllLenders] = useState<Lender[]>(lenders);
  const [modalOpen, setModalOpen] = useState(false);

  // Onboard form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [inheritDefaults, setInheritDefaults] = useState(true);
  const [customGreen, setCustomGreen] = useState("75");
  const [customAmber, setCustomAmber] = useState("50");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let list = [...allLenders];
    if (search) list = list.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));
    list.sort((a, b) => {
      let av: any = a[sortKey];
      let bv: any = b[sortKey];
      if (av == null) av = sortDir === "asc" ? Infinity : -Infinity;
      if (bv == null) bv = sortDir === "asc" ? Infinity : -Infinity;
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return list;
  }, [allLenders, search, sortKey, sortDir]);

  const handleOnboard = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    const newLender: Lender = {
      id: `l${String(allLenders.length + 1).padStart(3, "0")}`,
      name: newName.trim(),
      contactEmail: newEmail.trim(),
      contactName: "",
      billingAddress: newAddress.trim(),
      dealerCount: 0,
      avgPortfolioScore: null,
      ragDistribution: { Green: 0, Amber: 0, Red: 0 },
      ragThresholds: inheritDefaults ? { green: 75, amber: 50 } : { green: Number(customGreen), amber: Number(customAmber) },
      cssThresholds: { reward: 75, oversight: 75 },
      status: "Active",
      createdDate: new Date().toISOString().slice(0, 10),
      lastLogin: "",
      teamMembers: [],
    };
    setAllLenders(prev => [...prev, newLender]);
    setModalOpen(false);
    setNewName(""); setNewEmail(""); setNewAddress(""); setInheritDefaults(true);
    toast({ title: "Invitation sent (POC only)", description: `${newLender.name} has been onboarded.` });
  };

  const SortHeader = ({ label, col }: { label: string; col: SortKey }) => (
    <button onClick={() => toggleSort(col)} className="flex items-center gap-1 hover:text-foreground transition">
      {label}
      <ArrowUpDown className="w-3.5 h-3.5" />
    </button>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Lenders</h2>
          <p className="text-muted-foreground">Manage and monitor all onboarded lenders.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Onboard New Lender
        </Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by lender name…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><SortHeader label="Lender Name" col="name" /></TableHead>
              <TableHead><SortHeader label="Contact Email" col="contactEmail" /></TableHead>
              <TableHead><SortHeader label="Dealers" col="dealerCount" /></TableHead>
              <TableHead><SortHeader label="Avg Score" col="avgPortfolioScore" /></TableHead>
              <TableHead><SortHeader label="Status" col="status" /></TableHead>
              <TableHead><SortHeader label="Created" col="createdDate" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(l => (
              <TableRow
                key={l.id}
                className={`cursor-pointer ${l.status === "Inactive" ? "opacity-50" : ""}`}
                onClick={() => navigate(`/tcg/lenders/${l.id}`)}
              >
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell>{l.contactEmail}</TableCell>
                <TableCell>{l.dealerCount}</TableCell>
                <TableCell>{l.avgPortfolioScore != null ? l.avgPortfolioScore.toFixed(1) : "—"}</TableCell>
                <TableCell>
                  <Badge variant={l.status === "Active" ? "default" : "secondary"}>{l.status}</Badge>
                </TableCell>
                <TableCell>{format(new Date(l.createdDate), "dd MMM yyyy")}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No lenders found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Onboard Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Onboard New Lender</DialogTitle>
            <DialogDescription>Add a new lender organisation to the platform.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Organisation Name</Label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Acme Finance Ltd" />
            </div>
            <div className="space-y-1.5">
              <Label>Contact Email</Label>
              <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="compliance@acme.co.uk" />
            </div>
            <div className="space-y-1.5">
              <Label>Billing Address</Label>
              <Input value={newAddress} onChange={e => setNewAddress(e.target.value)} placeholder="1 Main Street, London" />
            </div>
            <div className="space-y-2">
              <Label>RAG Thresholds</Label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" checked={inheritDefaults} onChange={() => setInheritDefaults(true)} className="accent-primary" />
                  Inherit defaults (Green ≥ 75, Amber ≥ 50)
                </label>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" checked={!inheritDefaults} onChange={() => setInheritDefaults(false)} className="accent-primary" />
                  Custom
                </label>
                {!inheritDefaults && (
                  <div className="flex gap-2 ml-2">
                    <Input className="w-20" placeholder="Green ≥" value={customGreen} onChange={e => setCustomGreen(e.target.value)} />
                    <Input className="w-20" placeholder="Amber ≥" value={customAmber} onChange={e => setCustomAmber(e.target.value)} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleOnboard} disabled={!newName.trim() || !newEmail.trim()}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TCGLenders;
