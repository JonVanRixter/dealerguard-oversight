import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { onboardingApplications, type OnboardingApplication, type OnboardingSection } from "@/data/tcg/onboardingApplications";
import { dealers as dealersList } from "@/data/tcg/dealers";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  ClipboardCheck, Plus, CheckCircle2, XCircle, Clock, AlertCircle,
  ChevronDown, ChevronRight, Info, Store
} from "lucide-react";

const statusPill: Record<string, string> = {
  "Draft": "bg-muted text-muted-foreground",
  "In Progress": "bg-blue-500/10 text-blue-600",
  "Pending Approval": "bg-amber-500/10 text-amber-600",
  "Approved": "bg-green-500/10 text-green-600",
  "Rejected": "bg-red-500/10 text-red-600",
  "Pending Info": "bg-orange-500/10 text-orange-600",
};

const sectionStatusIcon = (status: string) => {
  if (status === "Complete") return <CheckCircle2 className="w-4 h-4 text-green-600" />;
  if (status === "In Progress") return <Clock className="w-4 h-4 text-blue-600" />;
  return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
};

const LenderOnboarding = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState<OnboardingApplication[]>([...onboardingApplications]);
  const [workflowAppId, setWorkflowAppId] = useState<string | null>(null);
  const [approvalAppId, setApprovalAppId] = useState<string | null>(null);
  const [rejectAppId, setRejectAppId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("Failed compliance checks");
  const [rejectNotes, setRejectNotes] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const workflowApp = workflowAppId ? apps.find(a => a.id === workflowAppId) : null;
  const approvalApp = approvalAppId ? apps.find(a => a.id === approvalAppId) : null;
  const rejectApp = rejectAppId ? apps.find(a => a.id === rejectAppId) : null;

  const lenderApps = useMemo(() => apps.filter(a => a.lenderId === "l001"), [apps]);
  const activeApps = lenderApps.filter(a => !["Approved", "Rejected"].includes(a.status));
  const completedCount = (sections: OnboardingSection[]) => sections.filter(s => s.status === "Complete").length;

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const updateSectionInApp = (appId: string, sectionId: string, updates: Partial<OnboardingSection>) => {
    setApps(prev => prev.map(a => {
      if (a.id !== appId) return a;
      return {
        ...a,
        sections: a.sections.map(s => s.id === sectionId ? { ...s, ...updates } : s),
      };
    }));
  };

  const submitForApproval = (appId: string) => {
    setApps(prev => prev.map(a =>
      a.id === appId ? { ...a, status: "Pending Approval" as const, submittedDate: new Date().toISOString().slice(0, 10) } : a
    ));
    setWorkflowAppId(null);
    toast({ title: "Application submitted", description: "Application is now pending your approval decision." });
  };

  const handleApprove = () => {
    if (!approvalApp) return;
    setApps(prev => prev.map(a =>
      a.id === approvalApp.id ? { ...a, status: "Approved" as const, approvedBy: "Sarah Jenkins", approvedDate: new Date().toISOString().slice(0, 10) } : a
    ));
    setApprovalAppId(null);
    toast({ title: "✅ Dealer approved", description: `${approvalApp.companyName} has been added to your portfolio.` });
  };

  const handleReject = () => {
    if (!rejectApp) return;
    setApps(prev => prev.map(a =>
      a.id === rejectApp.id ? { ...a, status: "Rejected" as const, rejectionReason: `${rejectReason}: ${rejectNotes}` } : a
    ));
    setRejectAppId(null);
    setRejectReason("Failed compliance checks");
    setRejectNotes("");
    toast({ title: "Application rejected", description: `${rejectApp.companyName} has been rejected.` });
  };

  const handleRequestInfo = (appId: string) => {
    setApps(prev => prev.map(a =>
      a.id === appId ? { ...a, status: "Pending Info" as const } : a
    ));
    setApprovalAppId(null);
    toast({ title: "Request sent", description: "Additional information requested (POC only)." });
  };

  const avgScore = (sections: OnboardingSection[]) => {
    const scored = sections.filter(s => s.score !== null);
    if (!scored.length) return 0;
    return Math.round(scored.reduce((sum, s) => sum + (s.score ?? 0), 0) / scored.length);
  };

  const projectedRag = (score: number) => {
    if (score >= 75) return "Green";
    if (score >= 50) return "Amber";
    return "Red";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-blue-600" /> Dealer Onboarding
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Manage dealer applications and portfolio additions.</p>
        </div>
        <Button className="gap-2" onClick={() => toast({ title: "Coming soon", description: "New dealer application form available in full MVP." })}>
          <Plus className="w-4 h-4" /> Add New Dealer
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Applications</TabsTrigger>
          <TabsTrigger value="approved">Approved Dealers</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="bg-card rounded-lg border border-border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App Ref</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Trading Name</TableHead>
                  <TableHead>Initiated By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeApps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No active applications.</TableCell>
                  </TableRow>
                ) : activeApps.map(app => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium text-xs">{app.applicationRef}</TableCell>
                    <TableCell className="font-medium">{app.companyName}</TableCell>
                    <TableCell>{app.tradingName}</TableCell>
                    <TableCell className="text-sm">{app.initiatedBy}</TableCell>
                    <TableCell className="text-sm">{format(new Date(app.initiatedDate), "dd MMM yyyy")}</TableCell>
                    <TableCell className="text-sm">{completedCount(app.sections)} of {app.sections.length}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusPill[app.status] || ""}`}>
                        {app.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {app.status === "In Progress" && (
                        <Button size="sm" variant="outline" onClick={() => { setWorkflowAppId(app.id); setExpandedSections(new Set()); }}>
                          Continue
                        </Button>
                      )}
                      {app.status === "Pending Approval" && (
                        <Button size="sm" variant="outline" className="text-amber-600" onClick={() => setApprovalAppId(app.id)}>
                          Review & Decide
                        </Button>
                      )}
                      {app.status === "Pending Info" && (
                        <Button size="sm" variant="outline" onClick={() => { setWorkflowAppId(app.id); setExpandedSections(new Set()); }}>
                          Continue
                        </Button>
                      )}
                      {["Approved", "Rejected"].includes(app.status) && (
                        <Button size="sm" variant="ghost" onClick={() => setApprovalAppId(app.id)}>
                          View Summary
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="mt-4 p-4 bg-muted/30 rounded-lg border text-sm text-muted-foreground flex items-center gap-2">
            <Store className="w-4 h-4" />
            Dealers below have completed onboarding and are active in your portfolio.
            <Link to="/dealers" className="text-primary hover:underline ml-1">View Dealer Directory →</Link>
          </div>
        </TabsContent>
      </Tabs>

      {/* Onboarding Workflow Modal */}
      <Dialog open={!!workflowApp} onOpenChange={open => { if (!open) setWorkflowAppId(null); }}>
        {workflowApp && (
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-blue-600" />
                {workflowApp.companyName}
              </DialogTitle>
              <DialogDescription>{workflowApp.applicationRef}</DialogDescription>
            </DialogHeader>

            {/* Info banner */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-2 text-sm">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <span className="text-blue-800 dark:text-blue-200">
                <strong>This is your dealer onboarding application.</strong> Once submitted and approved, this dealer will be added to your active portfolio. Ongoing compliance audits happen separately after approval.
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="text-sm font-medium">{completedCount(workflowApp.sections)} of {workflowApp.sections.length} sections complete</div>
              <Progress value={(completedCount(workflowApp.sections) / workflowApp.sections.length) * 100} className="h-2" />
            </div>

            {/* Sections */}
            <div className="space-y-2">
              {workflowApp.sections.map(section => {
                const isExpanded = expandedSections.has(section.id) || section.status !== "Complete";
                return (
                  <div key={section.id} className="border rounded-lg">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-muted/50 transition"
                    >
                      <span className="flex items-center gap-2">
                        {sectionStatusIcon(section.status)}
                        {section.name}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          section.status === "Complete" ? "bg-green-500/10 text-green-600" :
                          section.status === "In Progress" ? "bg-blue-500/10 text-blue-600" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {section.status}
                        </span>
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="px-3 pb-3 space-y-3 border-t">
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div>
                            <Label className="text-xs">Result</Label>
                            <select
                              value={section.result ?? ""}
                              onChange={e => updateSectionInApp(workflowApp.id, section.id, {
                                result: (e.target.value || null) as any,
                                status: e.target.value ? "Complete" as const : "In Progress" as const,
                              })}
                              className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                            >
                              <option value="">Select...</option>
                              <option value="Pass">Pass</option>
                              <option value="Fail">Fail</option>
                              <option value="Pending">Pending</option>
                            </select>
                          </div>
                          <div>
                            <Label className="text-xs">Score</Label>
                            <Input
                              type="number" min={0} max={100}
                              value={section.score ?? ""}
                              onChange={e => updateSectionInApp(workflowApp.id, section.id, { score: e.target.value ? Number(e.target.value) : null })}
                              className="mt-1 h-9"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Notes</Label>
                          <textarea
                            value={section.notes}
                            onChange={e => updateSectionInApp(workflowApp.id, section.id, { notes: e.target.value })}
                            className="mt-1 w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="Section notes..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setWorkflowAppId(null)}>Save & Close</Button>
              <Button
                disabled={completedCount(workflowApp.sections) < workflowApp.sections.length}
                onClick={() => submitForApproval(workflowApp.id)}
                className="gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Submit for Approval
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Approval Modal */}
      <Dialog open={!!approvalApp} onOpenChange={open => { if (!open) setApprovalAppId(null); }}>
        {approvalApp && (
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Application — {approvalApp.companyName}</DialogTitle>
              <DialogDescription>{approvalApp.applicationRef}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {approvalApp.sections.map(s => (
                <div key={s.id} className="flex items-center justify-between text-sm border rounded-md p-3">
                  <span className="flex items-center gap-2">
                    {sectionStatusIcon(s.status)} {s.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${s.result === "Pass" ? "text-green-600" : s.result === "Fail" ? "text-red-600" : "text-muted-foreground"}`}>
                      {s.result ?? "—"}
                    </span>
                    <span className="text-sm font-bold">{s.score ?? "—"}</span>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Overall Application Score</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{avgScore(approvalApp.sections)}</span>
                <Badge className={
                  projectedRag(avgScore(approvalApp.sections)) === "Green" ? "bg-green-600 text-white" :
                  projectedRag(avgScore(approvalApp.sections)) === "Amber" ? "bg-amber-500 text-white" :
                  "bg-red-600 text-white"
                }>
                  Projected: {projectedRag(avgScore(approvalApp.sections))}
                </Badge>
              </div>
            </div>

            {approvalApp.status !== "Approved" && approvalApp.status !== "Rejected" && (
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button onClick={() => handleRequestInfo(approvalApp.id)} variant="outline" className="gap-1.5 text-amber-600 border-amber-300">
                  <AlertCircle className="w-4 h-4" /> Request More Info
                </Button>
                <Button onClick={() => { setApprovalAppId(null); setRejectAppId(approvalApp.id); }} variant="destructive" className="gap-1.5">
                  <XCircle className="w-4 h-4" /> Reject
                </Button>
                <Button onClick={handleApprove} className="gap-1.5 bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle2 className="w-4 h-4" /> Approve — Add to Portfolio
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        )}
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={!!rejectApp} onOpenChange={open => { if (!open) setRejectAppId(null); }}>
        {rejectApp && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reject Application — {rejectApp.companyName}</DialogTitle>
              <DialogDescription>Please provide a reason for rejection.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Reason</Label>
                <select value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option>Failed compliance checks</option>
                  <option>Insufficient evidence</option>
                  <option>Commercial decision</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <Label>Notes</Label>
                <textarea value={rejectNotes} onChange={e => setRejectNotes(e.target.value)} placeholder="Additional notes..." className="mt-1 w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectAppId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleReject}>Confirm Rejection</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default LenderOnboarding;
