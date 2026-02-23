import { useState, useMemo } from "react";
import { platformLogs } from "@/data/tcg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Search, CalendarIcon } from "lucide-react";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

const SERVICES = [
  { name: "API Gateway", status: "operational", emoji: "🟢", detail: "Response time: 142ms avg" },
  { name: "Database", status: "operational", emoji: "🟢", detail: "PostgreSQL — POC placeholder" },
  { name: "Job Queue", status: "degraded", emoji: "🟡", detail: "3 jobs pending (alert digests)" },
  { name: "Companies House API", status: "poc", emoji: "🔵", detail: "No live calls — manual entry" },
  { name: "FCA Register API", status: "poc", emoji: "🔵", detail: "No live calls — manual entry" },
  { name: "CreditSafe API", status: "down", emoji: "🔴", detail: "503 error — manual fallback active" },
  { name: "Error Rate (24h)", status: "operational", emoji: "🟢", detail: "2 warnings, 1 error" },
];

const statusColor: Record<string, string> = {
  operational: "border-green-500/30 bg-green-50 dark:bg-green-950/20",
  degraded: "border-amber-500/30 bg-amber-50 dark:bg-amber-950/20",
  down: "border-red-500/30 bg-red-50 dark:bg-red-950/20",
  poc: "border-blue-500/30 bg-blue-50 dark:bg-blue-950/20",
};

const statusLabel: Record<string, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Unavailable",
  poc: "POC Mode",
};

const severityBadge: Record<string, string> = {
  Error: "bg-red-600 hover:bg-red-600 text-white",
  Warning: "bg-amber-500 hover:bg-amber-500 text-white",
  Info: "bg-muted text-muted-foreground hover:bg-muted",
};

const TCGQAHealthCheck = () => {
  const [severityFilter, setSeverityFilter] = useState("All");
  const [logSearch, setLogSearch] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const filteredLogs = useMemo(() => {
    let list = [...platformLogs];
    if (severityFilter !== "All") list = list.filter(l => l.severity === severityFilter);
    if (logSearch.trim()) {
      const q = logSearch.trim().toLowerCase();
      list = list.filter(l => l.message.toLowerCase().includes(q));
    }
    if (fromDate) list = list.filter(l => !isBefore(new Date(l.timestamp), startOfDay(fromDate)));
    if (toDate) list = list.filter(l => !isAfter(new Date(l.timestamp), endOfDay(toDate)));
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return list;
  }, [severityFilter, logSearch, fromDate, toDate]);

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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">QA Health Check</h2>
        <p className="text-muted-foreground">Platform health monitoring and quality assurance checks.</p>
      </div>

      {/* Health Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SERVICES.map(s => (
          <Card key={s.name} className={cn("border-2", statusColor[s.status])}>
            <CardContent className="pt-5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{s.name}</span>
                <span className="text-lg">{s.emoji}</span>
              </div>
              <div className="text-xs font-medium">{statusLabel[s.status]}</div>
              <div className="text-xs text-muted-foreground">{s.detail}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">System Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative max-w-[220px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search messages…" value={logSearch} onChange={e => setLogSearch(e.target.value)} className="pl-8 h-9 text-xs" />
            </div>
            <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-2.5 text-xs">
              <option value="All">All Severities</option>
              <option>Error</option>
              <option>Warning</option>
              <option>Info</option>
            </select>
            <DatePicker date={fromDate} onChange={setFromDate} label="From" />
            <DatePicker date={toDate} onChange={setToDate} label="To" />
            {(severityFilter !== "All" || logSearch || fromDate || toDate) && (
              <Button size="sm" variant="ghost" className="text-xs" onClick={() => { setSeverityFilter("All"); setLogSearch(""); setFromDate(undefined); setToDate(undefined); }}>
                Clear
              </Button>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-xs">{format(new Date(log.timestamp), "dd MMM yyyy HH:mm")}</TableCell>
                  <TableCell><Badge className={cn("text-[10px]", severityBadge[log.severity])}>{log.severity}</Badge></TableCell>
                  <TableCell className="text-xs">{log.source}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.message}</TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No logs match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TCGQAHealthCheck;
