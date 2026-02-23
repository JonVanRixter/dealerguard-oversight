import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { dealers, multiLenderData } from "@/data/tcg/dealers";
import { lenders } from "@/data/tcg";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, ArrowUpDown, Layers } from "lucide-react";
import { format } from "date-fns";

type SortKey = "name" | "lenderName" | "latestScore" | "ragStatus" | "status" | "lastAuditDate";
type SortDir = "asc" | "desc";

const ragColor: Record<string, string> = {
  Green: "bg-green-600 hover:bg-green-600 text-white",
  Amber: "bg-amber-500 hover:bg-amber-500 text-white",
  Red: "bg-red-600 hover:bg-red-600 text-white",
};

const TCGDealers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [lenderFilter, setLenderFilter] = useState("All Lenders");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [multiLenderModal, setMultiLenderModal] = useState<string | null>(null);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let list = [...dealers];
    if (search) list = list.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
    if (lenderFilter !== "All Lenders") list = list.filter(d => d.lenderName === lenderFilter);
    list.sort((a, b) => {
      const av: any = a[sortKey];
      const bv: any = b[sortKey];
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return list;
  }, [search, lenderFilter, sortKey, sortDir]);

  const SortHeader = ({ label, col }: { label: string; col: SortKey }) => (
    <button onClick={() => toggleSort(col)} className="flex items-center gap-1 hover:text-foreground transition">
      {label}
      <ArrowUpDown className="w-3.5 h-3.5" />
    </button>
  );

  const multiLenderDealer = multiLenderModal ? multiLenderData[multiLenderModal] : null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">Dealer Directory</h2>
        <p className="text-muted-foreground">Cross-lender dealer directory and risk monitoring.</p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by dealer name…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={lenderFilter}
          onChange={e => setLenderFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option>All Lenders</option>
          {lenders.map(l => (
            <option key={l.id} value={l.name}>{l.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><SortHeader label="Dealer Name" col="name" /></TableHead>
              <TableHead><SortHeader label="Lender" col="lenderName" /></TableHead>
              <TableHead><SortHeader label="Score" col="latestScore" /></TableHead>
              <TableHead><SortHeader label="RAG" col="ragStatus" /></TableHead>
              <TableHead><SortHeader label="Status" col="status" /></TableHead>
              <TableHead><SortHeader label="Last Audit" col="lastAuditDate" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(d => (
              <TableRow key={d.id} className="cursor-pointer" onClick={() => navigate(`/tcg/dealers/${d.id}`)}>
                <TableCell className="font-medium">
                  <span className="flex items-center gap-2">
                    {d.name}
                    {d.multiLender && (
                      <button
                        title="Multi-Lender"
                        onClick={e => { e.stopPropagation(); setMultiLenderModal(d.id); }}
                        className="text-primary hover:text-primary/80 transition"
                      >
                        <Layers className="w-4 h-4" />
                      </button>
                    )}
                  </span>
                </TableCell>
                <TableCell>{d.lenderName}</TableCell>
                <TableCell>{d.latestScore}</TableCell>
                <TableCell><Badge className={ragColor[d.ragStatus]}>{d.ragStatus}</Badge></TableCell>
                <TableCell>
                  <Badge variant={d.status === "Active" ? "default" : d.status === "Under Review" ? "destructive" : "secondary"}>
                    {d.status}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(d.lastAuditDate), "dd MMM yyyy")}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No dealers found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Multi-Lender Modal */}
      <Dialog open={!!multiLenderModal} onOpenChange={() => setMultiLenderModal(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Layers className="w-5 h-5" /> Multi-Lender Dealer</DialogTitle>
            <DialogDescription>This dealer appears in multiple lender portfolios.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {multiLenderDealer?.map(entry => (
              <div key={entry.lenderId} className="flex items-center justify-between text-sm border rounded-md p-3">
                <span className="font-medium">{entry.lenderName}</span>
                <Badge className={ragColor[entry.ragStatus]}>{entry.ragStatus}</Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TCGDealers;
