import { useNavigate, Link } from "react-router-dom";
import { dealers } from "@/data/tcg/dealers";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ClipboardCheck } from "lucide-react";

const ragColor: Record<string, string> = {
  Green: "bg-green-600 hover:bg-green-600 text-white",
  Amber: "bg-amber-500 hover:bg-amber-500 text-white",
  Red: "bg-red-600 hover:bg-red-600 text-white",
};

const LenderDealers = () => {
  const navigate = useNavigate();
  // POC: show all dealers for l001
  const portfolio = dealers.filter(d => d.lenderId === "l001" && d.onboarding.status === "Approved");

  return (
    <div>
      <div className="mb-1">
        <h2 className="text-2xl font-bold text-foreground">Dealers</h2>
      </div>
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Active Portfolio</span> — These dealers have completed onboarding and are approved in your portfolio. To add a new dealer, go to{" "}
        <Link to="/onboarding" className="text-blue-600 hover:underline inline-flex items-center gap-1">
          <ClipboardCheck className="w-3.5 h-3.5" /> Onboarding →
        </Link>
      </div>

      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dealer Name</TableHead>
              <TableHead>Trading As</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>RAG</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Audit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolio.map(d => (
              <TableRow key={d.id} className="cursor-pointer" onClick={() => navigate(`/dealers/${d.id}`)}>
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell>{d.tradingAs}</TableCell>
                <TableCell>{d.latestScore}</TableCell>
                <TableCell><Badge className={ragColor[d.ragStatus]}>{d.ragStatus}</Badge></TableCell>
                <TableCell><Badge variant="default">{d.status}</Badge></TableCell>
                <TableCell>{format(new Date(d.lastAuditDate), "dd MMM yyyy")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LenderDealers;
