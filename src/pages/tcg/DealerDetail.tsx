import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { dealers, multiLenderData } from "@/data/tcg/dealers";
import { lenders } from "@/data/tcg";
import { manualReviewQueue } from "@/data/tcg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  AlertTriangle, ExternalLink, Layers, Building2, MapPin, User, Mail, Hash,
  Calendar, ShieldCheck, BarChart3, ClipboardCheck, Search, CheckCircle2,
  ChevronDown, ChevronRight, Eye
} from "lucide-react";
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
  const [onboardingOpen, setOnboardingOpen] = useState(false);

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

  const ob = dealer.onboarding;

  return (
    <div className="space-y-6">
      {/* Manual Review Banner */}
      {pendingReviews.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              ⚠️ {pendingReviews.length} pending audit review item(s) for this dealer.
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

      {/* SECTION 1: Onboarding Record (collapsible) */}
      <Collapsible open={onboardingOpen} onOpenChange={setOnboardingOpen}>
        <div className="border rounded-lg">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-foreground">ONBOARDING RECORD</div>
                  <div className="text-xs text-muted-foreground">
                    Status: {ob.status} {ob.status === "Approved" && "✅"} · Approved by: {ob.approvedBy ?? "—"} · Date: {ob.approvedDate ? format(new Date(ob.approvedDate), "dd MMM yyyy") : "—"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] gap-1"><Eye className="w-3 h-3" /> Oversight only</Badge>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ob.status === "Approved" ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}>
                  {ob.status}
                </span>
                {onboardingOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-2 border-t">
              <div className="text-sm space-y-1 mt-3">
                <div><span className="text-muted-foreground">Application Ref:</span> {ob.applicationRef}</div>
                <div><span className="text-muted-foreground">Initiated by:</span> {ob.initiatedBy} on {format(new Date(ob.initiatedDate), "dd MMM yyyy")}</div>
                {ob.submittedDate && <div><span className="text-muted-foreground">Submitted:</span> {format(new Date(ob.submittedDate), "dd MMM yyyy")}</div>}
                {ob.approvedDate && <div><span className="text-muted-foreground">Approved:</span> {format(new Date(ob.approvedDate), "dd MMM yyyy")} by {ob.approvedBy}</div>}
              </div>
              <p className="text-xs text-muted-foreground italic">Onboarding details are read-only from TCG oversight. Full section results available in the lender portal.</p>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* SECTION 2: Compliance Audit (expanded by default) */}
      <div className="border rounded-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-[hsl(var(--sidebar-primary))]" />
            <div>
              <div className="text-sm font-semibold text-foreground">COMPLIANCE AUDIT</div>
              <div className="text-xs text-muted-foreground">
                Last audited: {format(new Date(dealer.lastAuditDate), "dd MMM yyyy")} · Overall Score: {dealer.latestScore}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[hsl(var(--sidebar-primary))]/10 text-[hsl(var(--sidebar-primary))] hover:bg-[hsl(var(--sidebar-primary))]/10 text-[10px] gap-1">
              <Search className="w-3 h-3" /> TCG Quality Assurance Active
            </Badge>
            <Badge className={ragColor[dealer.ragStatus]}>{dealer.ragStatus}</Badge>
          </div>
        </div>

        {/* Dealer Profile inside audit section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{dealer.name}</h3>
            <div className="flex items-center gap-2">
              <Badge className={ragColor[dealer.ragStatus]}>{dealer.ragStatus}</Badge>
              <Badge variant={dealer.status === "Active" ? "default" : dealer.status === "Under Review" ? "destructive" : "secondary"}>
                {dealer.status}
              </Badge>
            </div>
          </div>

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
        </div>
      </div>

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
