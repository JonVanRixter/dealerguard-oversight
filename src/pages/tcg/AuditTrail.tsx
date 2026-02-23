import { useState, useMemo } from "react";
import { auditTrail, lenders } from "@/data/tcg";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Search, CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

const ENTITY_TYPES = ["All", "Alert", "Audit", "Document", "DND", "Lender", "Report", "Review Queue", "Session"];
const ACTIONS = ["All", "Created", "Updated", "Deleted", "Exported", "Login", "Uploaded", "Removed", "Failed Login"];

const TCGAuditTrail = () => {
  const [tab, setTab] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [lenderFilter, setLenderFilter] = useState("All");
  const [entityFilter, setEntityFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");
  const [entityIdSearch, setEntityIdSearch] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...auditTrail];

    // Tab-level filter
    if (tab === "sessions") list = list.filter(e => e.entityType === "Session");

    // Entity ID lookup
    if (entityIdSearch.trim()) {
      const q = entityIdSearch.trim().toLowerCase();
      list = list.filter(e => e.entityId.toLowerCase().includes(q) || e.changes.toLowerCase().includes(q));
    }

    if (userSearch.trim()) {
      const q = userSearch.trim().toLowerCase();
      list = list.filter(e => e.user.toLowerCase().includes(q));
    }
    if (lenderFilter !== "All") list = list.filter(e => e.lender === lenderFilter);
    if (entityFilter !== "All") list = list.filter(e => e.entityType === entityFilter);
    if (actionFilter !== "All") list = list.filter(e => e.action === actionFilter);
    if (fromDate) list = list.filter(e => !isBefore(new Date(e.timestamp), startOfDay(fromDate)));
    if (toDate) list = list.filter(e => !isAfter(new Date(e.timestamp), endOfDay(toDate)));

    // Sort newest first
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return list;
  }, [tab, userSearch, lenderFilter, entityFilter, actionFilter, entityIdSearch, fromDate, toDate]);

  const toggleExpand = (id: string) => setExpandedRow(prev => (prev === id ? null : id));

  const lenderOptions = ["All", "Platform", ...lenders.map(l => l.name)];

  const DatePicker = ({ date, onChange, label }: { date?: Date; onChange: (d?: Date) => void; label: string }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-[140px] justify-start text-left text-xs font-normal", !date && "text-muted-foreground")}>
          <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
          {date ? format(date, "dd MMM yyyy") : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
      </PopoverContent>
    </Popover>
  );

  const renderTable = () => (
    <div className="bg-card rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            {tab !== "sessions" && <TableHead>Lender</TableHead>}
            {tab !== "sessions" && <TableHead>Entity Type</TableHead>}
            {tab !== "sessions" && <TableHead>Entity ID</TableHead>}
            <TableHead>Action</TableHead>
            <TableHead>Changes</TableHead>
            <TableHead className="w-8"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(entry => {
            const isExpanded = expandedRow === entry.id;
            const isFailedLogin = entry.action === "Failed Login";
            const truncated = entry.changes.length > 60;
            return (
              <TableRow
                key={entry.id}
                className={cn("cursor-pointer", isFailedLogin && "bg-red-50 dark:bg-red-950/20")}
                onClick={() => truncated && toggleExpand(entry.id)}
              >
                <TableCell className="whitespace-nowrap text-xs">{format(new Date(entry.timestamp), "dd MMM yyyy HH:mm")}</TableCell>
                <TableCell className="text-sm font-medium">{entry.user}</TableCell>
                <TableCell><Badge variant="outline" className="text-[10px]">{entry.role}</Badge></TableCell>
                {tab !== "sessions" && <TableCell className="text-xs">{entry.lender}</TableCell>}
                {tab !== "sessions" && <TableCell><Badge variant="secondary" className="text-[10px]">{entry.entityType}</Badge></TableCell>}
                {tab !== "sessions" && <TableCell className="font-mono text-xs text-muted-foreground">{entry.entityId}</TableCell>}
                <TableCell>
                  <Badge variant={
                    entry.action === "Created" ? "default" :
                    entry.action === "Deleted" || entry.action === "Removed" ? "destructive" :
                    "outline"
                  } className="text-[10px]">{entry.action}</Badge>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <span className="font-mono text-xs text-muted-foreground">
                    {isExpanded ? entry.changes : (truncated ? entry.changes.slice(0, 60) + "…" : entry.changes)}
                  </span>
                  {truncated && !isExpanded && (
                    <button className="ml-1 text-primary text-[10px] hover:underline" onClick={e => { e.stopPropagation(); toggleExpand(entry.id); }}>
                      Show more
                    </button>
                  )}
                </TableCell>
                <TableCell>
                  {truncated && (
                    isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={tab === "sessions" ? 5 : 9} className="text-center py-8 text-muted-foreground">No entries match your filters.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Audit Trail</h2>
        <p className="text-muted-foreground">Chronological log of all platform actions and changes.</p>
      </div>

      {/* Entity ID Lookup */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Find changes for entity ID (e.g. d010, mrq001)…"
          value={entityIdSearch}
          onChange={e => setEntityIdSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="sessions">User Activity</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mt-4 mb-4">
          <div className="relative max-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="Filter by user…" value={userSearch} onChange={e => setUserSearch(e.target.value)} className="pl-8 h-9 text-xs" />
          </div>
          <select value={lenderFilter} onChange={e => setLenderFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-2.5 text-xs">
            {lenderOptions.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          {tab !== "sessions" && (
            <>
              <select value={entityFilter} onChange={e => setEntityFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-2.5 text-xs">
                {ENTITY_TYPES.map(t => <option key={t} value={t}>{t === "All" ? "All Entity Types" : t}</option>)}
              </select>
              <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-2.5 text-xs">
                {ACTIONS.map(a => <option key={a} value={a}>{a === "All" ? "All Actions" : a}</option>)}
              </select>
            </>
          )}
          <DatePicker date={fromDate} onChange={setFromDate} label="From" />
          <DatePicker date={toDate} onChange={setToDate} label="To" />
          {(userSearch || lenderFilter !== "All" || entityFilter !== "All" || actionFilter !== "All" || fromDate || toDate || entityIdSearch) && (
            <Button size="sm" variant="ghost" className="text-xs" onClick={() => {
              setUserSearch(""); setLenderFilter("All"); setEntityFilter("All"); setActionFilter("All");
              setFromDate(undefined); setToDate(undefined); setEntityIdSearch("");
            }}>
              Clear filters
            </Button>
          )}
        </div>

        <TabsContent value="all">{renderTable()}</TabsContent>
        <TabsContent value="sessions">{renderTable()}</TabsContent>
      </Tabs>
    </div>
  );
};

export default TCGAuditTrail;
