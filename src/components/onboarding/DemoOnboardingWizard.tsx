import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingDocUpload } from "@/components/onboarding/OnboardingDocUpload";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Loader2, CheckCircle2, XCircle, AlertTriangle,
  ArrowRight, ArrowLeft, FileUp, Send,
} from "lucide-react";

interface FieldResult { label: string; value: string; source: string; }
interface SearchResults { fields: FieldResult[]; companyNumber: string; dealerName: string; }

function getCreditSafeRag(field: FieldResult): "green" | "amber" | "red" | null {
  if (field.source !== "CreditSafe") return null;
  const v = field.value.toLowerCase();
  if (field.label === "Credit Score") { const num = parseInt(v, 10); if (isNaN(num)) return null; return num >= 60 ? "green" : num >= 40 ? "amber" : "red"; }
  if (field.label === "Risk Rating") { return v.includes("low") ? "green" : v.includes("medium") ? "amber" : "red"; }
  if (field.label === "CCJs") { const num = parseInt(v, 10); return isNaN(num) || num === 0 ? "green" : num <= 2 ? "amber" : "red"; }
  if (field.label === "Days Beyond Terms (DBT)") { const num = parseInt(v, 10); if (isNaN(num)) return null; return num <= 14 ? "green" : num <= 30 ? "amber" : "red"; }
  return null;
}

const ragStyles = {
  green: { border: "border-emerald-500/30", bg: "bg-emerald-500/5", text: "text-emerald-600" },
  amber: { border: "border-amber-500/30", bg: "bg-amber-500/5", text: "text-amber-600" },
  red: { border: "border-destructive/30", bg: "bg-destructive/5", text: "text-destructive" },
};

function StepSearch({ onResults }: { onResults: (r: SearchResults) => void }) {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"name" | "postcode" | "frn">("name");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");

  const runSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true); setProgress(0);
    setProgressLabel("Searching Companies House…"); setProgress(15);
    await new Promise(r => setTimeout(r, 600));
    setProgress(40); setProgressLabel("Searching FCA Register…");
    await new Promise(r => setTimeout(r, 600));
    setProgress(70); setProgressLabel("Compiling results…");
    await new Promise(r => setTimeout(r, 400));
    setProgress(100); setProgressLabel("Search complete");

    const dealerName = query.trim();
    const fields: FieldResult[] = [
      { label: "Company Name", value: `${dealerName} Motors Ltd`, source: "Companies House" },
      { label: "Company Number", value: "09876543", source: "Companies House" },
      { label: "Company Status", value: "Active", source: "Companies House" },
      { label: "Registered Address", value: "Unit 4, Riverside Business Park, Manchester, M1 2AB", source: "Companies House" },
      { label: "FCA FRN", value: "654321", source: "FCA Register" },
      { label: "FCA Status", value: "Authorised", source: "FCA Register" },
      { label: "Credit Score", value: "72 / 100", source: "CreditSafe" },
      { label: "Risk Rating", value: "Low", source: "CreditSafe" },
      { label: "Credit Limit", value: "£250,000", source: "CreditSafe" },
      { label: "CCJs", value: "0 (None found)", source: "CreditSafe" },
      { label: "Days Beyond Terms (DBT)", value: "12 days", source: "CreditSafe" },
      { label: "VAT Registration", value: "", source: "" },
      { label: "Trading Address", value: "", source: "" },
      { label: "Insurance Details", value: "", source: "" },
    ];
    onResults({ fields, companyNumber: "09876543", dealerName });
    toast({ title: "Search Complete", description: `Found ${fields.filter(f => f.value).length} fields, ${fields.filter(f => !f.value).length} missing.` });
    setLoading(false);
  }, [query, onResults, toast]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2"><Search className="w-5 h-5 text-primary" /><CardTitle>Step 1: Company Search</CardTitle></div>
        <CardDescription>Search by company name, postcode, or FCA FRN to automatically retrieve data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {([{ key: "name", label: "Company Name" }, { key: "postcode", label: "Postcode" }, { key: "frn", label: "FCA FRN" }] as const).map((t) => (
            <Button key={t.key} variant={searchType === t.key ? "default" : "outline"} size="sm" onClick={() => setSearchType(t.key)}>{t.label}</Button>
          ))}
        </div>
        <div className="flex gap-3">
          <Input placeholder={searchType === "name" ? "Enter company name…" : searchType === "postcode" ? "Enter postcode…" : "Enter FCA FRN…"}
            value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runSearch()} className="flex-1" />
          <Button onClick={runSearch} disabled={loading || !query.trim()} className="gap-2 shrink-0">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Search
          </Button>
        </div>
        {loading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{progressLabel}</span><span>{progress}%</span></div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StepResults({ results }: { results: SearchResults }) {
  const found = results.fields.filter(f => f.value);
  const missing = results.fields.filter(f => !f.value);
  const creditSafeRags = found.map(getCreditSafeRag).filter(Boolean) as ("green" | "amber" | "red")[];
  const overallRisk: "green" | "amber" | "red" = creditSafeRags.includes("red") ? "red" : creditSafeRags.includes("amber") ? "amber" : "green";
  const riskConfig = {
    green: { label: "Low Risk", desc: "All CreditSafe indicators within acceptable thresholds.", Icon: CheckCircle2 },
    amber: { label: "Medium Risk", desc: "Some CreditSafe indicators require attention.", Icon: AlertTriangle },
    red: { label: "High Risk", desc: "Critical CreditSafe indicators flagged.", Icon: XCircle },
  };
  const rc = riskConfig[overallRisk];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /><CardTitle>Step 2: Search Results</CardTitle></div>
        <CardDescription>Data from Companies House, FCA Register, and CreditSafe. Missing fields highlighted.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {creditSafeRags.length > 0 && (
          <div className={`rounded-lg border ${ragStyles[overallRisk].border} ${ragStyles[overallRisk].bg} p-4 flex items-center gap-3`}>
            <rc.Icon className={`w-6 h-6 ${ragStyles[overallRisk].text} shrink-0`} />
            <div>
              <p className={`text-sm font-semibold ${ragStyles[overallRisk].text}`}>Overall Risk: {rc.label}</p>
              <p className="text-xs text-muted-foreground">{rc.desc}</p>
            </div>
          </div>
        )}
        <div className="flex gap-4 text-sm">
          <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 gap-1"><CheckCircle2 className="w-3 h-3" /> {found.length} Found</Badge>
          {missing.length > 0 && <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> {missing.length} Missing</Badge>}
        </div>
        <div className="space-y-1.5">
          {found.map((f, i) => {
            const rag = getCreditSafeRag(f);
            const style = rag ? ragStyles[rag] : null;
            return (
              <div key={i} className={`flex items-start justify-between gap-3 rounded-md border px-3 py-2 ${style ? `${style.border} ${style.bg}` : "border-emerald-500/30 bg-emerald-500/5"}`}>
                <div className="flex-1"><p className="text-xs text-muted-foreground">{f.label}</p><p className={`text-sm font-medium ${style ? style.text : ""}`}>{f.value}</p></div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-[10px]">{f.source}</Badge>
                  {rag === "red" ? <AlertTriangle className="w-4 h-4 text-destructive" /> : rag === "amber" ? <AlertTriangle className="w-4 h-4 text-amber-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
              </div>
            );
          })}
        </div>
        {missing.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-destructive flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Missing — requires manual input</p>
            {missing.map((f, i) => (
              <div key={i} className="flex items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
                <div><p className="text-xs text-muted-foreground">{f.label}</p><p className="text-sm font-medium text-destructive">NOT FOUND</p></div>
                <XCircle className="w-4 h-4 text-destructive shrink-0" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StepCompletionForm({ results, onComplete }: { results: SearchResults; onComplete: () => void }) {
  const missing = results.fields.filter(f => !f.value);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const filledCount = Object.values(overrides).filter(v => v.trim()).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2"><FileUp className="w-5 h-5 text-primary" /><CardTitle>Step 3: Complete Missing Information</CardTitle></div>
        <CardDescription>Fill in any fields that couldn't be found automatically and upload supporting documents.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {missing.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm font-medium">Missing Fields ({filledCount}/{missing.length} completed)</p>
            <Progress value={missing.length > 0 ? (filledCount / missing.length) * 100 : 100} className="h-2" />
            <div className="grid gap-3 sm:grid-cols-2">
              {missing.map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <Label className="text-xs">{f.label}</Label>
                  <Input placeholder={`Enter ${f.label.toLowerCase()}…`} value={overrides[f.label] || ""} onChange={(e) => setOverrides(prev => ({ ...prev, [f.label]: e.target.value }))} />
                </div>
              ))}
            </div>
          </div>
        )}
        {missing.length === 0 && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">All fields found automatically — no manual input needed.</p>
          </div>
        )}
        <div className="space-y-2"><Label>Additional Notes</Label><Textarea placeholder="Any additional information…" className="min-h-[80px]" /></div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><FileUp className="w-4 h-4" /> Upload Supporting Documents</Label>
          {results.dealerName ? <OnboardingDocUpload dealerName={results.dealerName} category="Onboarding" compact /> : <p className="text-xs text-muted-foreground">Run a search first.</p>}
        </div>
        <Button onClick={onComplete} className="gap-2 w-full sm:w-auto"><Send className="w-4 h-4" /> Submit Application</Button>
      </CardContent>
    </Card>
  );
}

export function DemoOnboardingWizard() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [results, setResults] = useState<SearchResults | null>(null);

  const handleResults = (r: SearchResults) => { setResults(r); setStep(2); };
  const handleComplete = () => { toast({ title: "Application Submitted", description: "Demo application has been submitted successfully." }); setStep(1); setResults(null); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {[{ n: 1, label: "Company Search" }, { n: 2, label: "Review Results" }, { n: 3, label: "Complete & Upload" }].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            {i > 0 && <div className={`h-px w-8 ${step >= s.n ? "bg-primary" : "bg-border"}`} />}
            <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              step === s.n ? "bg-primary text-primary-foreground" : step > s.n ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"
            }`} onClick={() => { if (s.n === 1) setStep(1); if (s.n === 2 && results) setStep(2); if (s.n === 3 && results) setStep(3); }}>
              {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : <span>{s.n}</span>}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {step === 1 && <StepSearch onResults={handleResults} />}
      {step === 2 && results && (
        <>
          <StepResults results={results} />
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)} className="gap-2"><ArrowLeft className="w-4 h-4" /> New Search</Button>
            <Button onClick={() => setStep(3)} className="gap-2">Continue to Form <ArrowRight className="w-4 h-4" /></Button>
          </div>
        </>
      )}
      {step === 3 && results && (
        <>
          <StepCompletionForm results={results} onComplete={handleComplete} />
          <div className="flex justify-start"><Button variant="outline" onClick={() => setStep(2)} className="gap-2"><ArrowLeft className="w-4 h-4" /> Back to Results</Button></div>
        </>
      )}
    </div>
  );
}
