import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { dealers, multiLenderData } from "@/data/tcg/dealers";
import { lenders } from "@/data/tcg";
import { manualReviewQueue } from "@/data/tcg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, ExternalLink, Layers, Building2, MapPin, User, Mail, Hash, Calendar, ShieldCheck, BarChart3 } from "lucide-react";
import { format } from "date-fns";

const ragColor: Record<string, string> = {
  Green: "bg-green-600 hover:bg-green-600 text-white",
  Amber: "bg-amber-500 hover:bg-amber-500 text-white",
  Red: "bg-red-600 hover:bg-red-600 text-white",
};

const DealerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dealer = dealers.find(d => d.id === id);
  const [internalNotes, setInternalNotes] = useState("");

  const lender = dealer ? lenders.find(l => l.id === dealer.lenderId) : null;

  const pendingReviews = useMemo(() => {
    if (!dealer) return [];
    return manualReviewQueue.filter(
      r => r.dealerId === dealer.id && (r.status === "Pending" || r.status === "In Progress")
    );
  }, [dealer]);

  const crossLender = dealer?.multiLender ? multiLenderData[dealer.id] : null;

  if (!dealer) {
    return <div className="text-center py-12 text-muted-foreground">Dealer not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Manual Review Banner */}
      {pendingReviews.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              ⚠️ {pendingReviews.length} pending review item(s) for this dealer.
            </span>
          </div>
          <Button size="sm" variant="outline" onClick={() => navigate("/tcg/manual-review")} className="gap-1.5">
            Go to Review Queue <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Lender Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Building2 className="w-4 h-4" /> Lender Information</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-muted-foreground">Lender: </span>
              <span className="font-medium">{dealer.lenderName}</span>
            </div>
            {lender && (
              <Link to={`/tcg/lenders/${lender.id}`} className="text-primary text-xs hover:underline flex items-center gap-1">
                View Lender <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
          {lender && (
            <div><span className="text-muted-foreground">Contact: </span>{lender.contactName} ({lender.contactEmail})</div>
          )}
        </CardContent>
      </Card>

      {/* Cross-Lender Comparison */}
      {crossLender && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /> Cross-Lender Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {crossLender.map(entry => {
                const entryLender = lenders.find(l => l.id === entry.lenderId);
                const thresholds = entryLender?.ragThresholds;
                return (
                  <div key={entry.lenderId} className="border rounded-lg p-4 space-y-2">
                    <div className="font-medium text-sm">{entry.lenderName}</div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">{entry.score}</span>
                      <Badge className={ragColor[entry.ragStatus]}>{entry.ragStatus}</Badge>
                    </div>
                    {thresholds && (
                      <div className="text-xs text-muted-foreground">
                        Thresholds: Green ≥ {thresholds.green}, Amber ≥ {thresholds.amber}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {crossLender.length === 2 && (
              <p className="text-xs text-muted-foreground mt-3">
                Score difference: {Math.abs(crossLender[0].score - crossLender[1].score)} points.
                {crossLender[0].ragStatus === crossLender[1].ragStatus
                  ? " Same RAG status across both lenders."
                  : " Different RAG status — threshold configuration may differ."}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dealer Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{dealer.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={ragColor[dealer.ragStatus]}>{dealer.ragStatus}</Badge>
              <Badge variant={dealer.status === "Active" ? "default" : dealer.status === "Under Review" ? "destructive" : "secondary"}>
                {dealer.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-muted-foreground" /> Trading as: {dealer.tradingAs}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /> {dealer.address}</div>
              <div className="flex items-center gap-2"><Hash className="w-4 h-4 text-muted-foreground" /> CH: {dealer.companiesHouseNumber} · FCA: {dealer.fcaNumber}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /> {dealer.principalName}</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> {dealer.principalEmail}</div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /> Onboarded: {format(new Date(dealer.onboardedDate), "dd MMM yyyy")}</div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{dealer.latestScore}</div>
                <div className="text-xs text-muted-foreground">Latest Score</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{format(new Date(dealer.lastAuditDate), "dd MMM yyyy")}</div>
                <div className="text-xs text-muted-foreground">Last Audit</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{format(new Date(dealer.nextAuditDue), "dd MMM yyyy")}</div>
                <div className="text-xs text-muted-foreground">Next Audit Due</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TCG Internal Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">TCG Internal Notes</CardTitle>
          <p className="text-xs text-muted-foreground italic">Internal — not visible to lender</p>
        </CardHeader>
        <CardContent>
          <textarea
            value={internalNotes}
            onChange={e => setInternalNotes(e.target.value)}
            placeholder="Add internal notes about this dealer…"
            className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DealerDetail;
