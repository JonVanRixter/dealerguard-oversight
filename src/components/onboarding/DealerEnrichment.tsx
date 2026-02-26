import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Search, Loader2, CheckCircle2, AlertTriangle, XCircle,
  Building2, PoundSterling, Users, FileText,
  ChevronDown, ChevronUp, ExternalLink, Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface EnrichmentResult {
  business_info: Record<string, string>;
  financial_info: Record<string, string | Record<string, string>>;
  directors_and_shareholders: Record<string, string | any[]>;
  supporting_docs: Record<string, string>;
  missing_fields: string[];
}

interface Props {
  dealerName: string;
  companyNumber?: string;
  autoTrigger?: boolean;
  onEnriched?: (result: EnrichmentResult, screeningMap: Record<string, string>) => void;
}

const NOT_FOUND = "NOT FOUND";

function fieldDisplay(value: unknown): string {
  if (value === NOT_FOUND || value === null || value === undefined || value === "") return NOT_FOUND;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function FieldRow({ label, value }: { label: string; value: unknown }) {
  const display = fieldDisplay(value);
  const missing = display === NOT_FOUND;
  return (
    <div className="flex items-start justify-between gap-3 py-2 px-3 rounded-md bg-muted/20">
      <span className="text-xs text-muted-foreground shrink-0 w-44">{label}</span>
      <div className="flex items-center gap-2 flex-1 justify-end text-right">
        {missing ? (
          <>
            <span className="text-xs text-destructive font-medium">{display}</span>
            <Badge variant="destructive" className="text-[9px] px-1 py-0 h-auto">MISSING</Badge>
          </>
        ) : (
          <>
            <span className="text-xs font-medium text-foreground break-all">{display}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          </>
        )}
      </div>
    </div>
  );
}

/* ── Mock enrichment data keyed by dealer name fragment ── */
function getMockEnrichment(dealerName: string, companyNumber?: string): { enriched: EnrichmentResult; screeningMap: Record<string, string> } {
  const lower = dealerName.toLowerCase();

  const enriched: EnrichmentResult = {
    business_info: {
      registered_name: dealerName.includes("Ltd") ? dealerName : `${dealerName} Ltd`,
      trading_names: dealerName.replace(/ Ltd$/i, ""),
      registered_address: lower.includes("hartley") ? "Hartley Road, Wakefield, WF1 3LX" :
        lower.includes("birchwood") ? "Birchwood Lane, Stockport, SK4 2PL" :
          "Unit 12, Enterprise Way, Leeds, LS10 1AG",
      trading_address: lower.includes("hartley") ? "Hartley Road, Wakefield, WF1 3LX" :
        lower.includes("birchwood") ? "Birchwood Lane, Stockport, SK4 2PL" :
          "Unit 12, Enterprise Way, Leeds, LS10 1AG",
      company_number: companyNumber || (lower.includes("hartley") ? "09876543" : lower.includes("birchwood") ? "12345890" : "11234567"),
      fca_frn: lower.includes("hartley") ? "812345" : lower.includes("birchwood") ? "798234" : "654321",
      fca_permissions_summary: "Credit broking; Debt adjusting; Arranging deals in investments",
      vat_number: `GB ${Math.floor(100000000 + Math.random() * 900000000)}`,
      incorporation_date: "2017-04-12",
      sic_codes: "45111 — Sale of cars and light motor vehicles",
    },
    financial_info: {
      credit_score: lower.includes("apex") ? "31 / 100" : lower.includes("birchwood") ? "54 / 100" : "72 / 100",
      risk_band: lower.includes("apex") ? "High Risk" : lower.includes("birchwood") ? "Medium Risk" : "Low Risk",
      credit_limit: lower.includes("apex") ? "£50,000" : lower.includes("birchwood") ? "£120,000" : "£250,000",
      average_payment_behaviour_dbt: lower.includes("apex") ? "45 days" : lower.includes("birchwood") ? "28 days" : "12 days",
      last_3_years_accounts: [
        { year: "2025-03-31", turnover: "£4,200,000", profit: "£310,000", assets: "£1,800,000", liabilities: "£950,000" },
        { year: "2024-03-31", turnover: "£3,850,000", profit: "£275,000", assets: "£1,650,000", liabilities: "£870,000" },
        { year: "2023-03-31", turnover: "£3,400,000", profit: "£240,000", assets: "£1,500,000", liabilities: "£800,000" },
      ] as any,
    },
    directors_and_shareholders: {
      active_directors: lower.includes("hartley") ? [
        { name: "James Hartley", role: "Director", appointed_on: "2017-04-12", dob: "3/1982", nationality: "British" },
        { name: "Claire Hartley", role: "Director", appointed_on: "2017-04-12", dob: "7/1985", nationality: "British" },
        { name: "David Pearson", role: "Company Secretary", appointed_on: "2019-01-15", dob: "11/1978", nationality: "British" },
      ] : lower.includes("birchwood") ? [
        { name: "Mark Davies", role: "Director", appointed_on: "2018-06-01", dob: "5/1980", nationality: "British" },
        { name: "Rebecca Lowe", role: "Director", appointed_on: "2020-02-14", dob: "9/1987", nationality: "British" },
      ] : [
        { name: "Derek T. Horne", role: "Director", appointed_on: "2016-11-30", dob: "1/1975", nationality: "British" },
      ],
      persons_of_significant_control: [
        { name: lower.includes("hartley") ? "James Hartley" : lower.includes("birchwood") ? "Mark Davies" : "Derek T. Horne", natures_of_control: ["ownership-of-shares-75-to-100-percent"], notified_on: "2017-04-12" },
      ],
    },
    supporting_docs: {
      fca_authorisation_link: `https://register.fca.org.uk/s/firm?id=${lower.includes("hartley") ? "812345" : lower.includes("birchwood") ? "798234" : "654321"}`,
      companies_house_profile_link: `https://find-and-update.company-information.service.gov.uk/company/${companyNumber || "09876543"}`,
      filing_history_link: `https://find-and-update.company-information.service.gov.uk/company/${companyNumber || "09876543"}/filing-history`,
    },
    missing_fields: [],
  };

  // Intentionally leave some fields missing for realism
  if (!lower.includes("hartley")) {
    enriched.business_info.vat_number = NOT_FOUND;
    enriched.missing_fields.push("business_info.vat_number");
  }

  const screeningMap: Record<string, string> = {
    companyName: enriched.business_info.registered_name,
    registeredAddress: enriched.business_info.registered_address,
    companyRegNo: enriched.business_info.company_number,
    companyStatus: "Active",
    fcaFrn: `FRN: ${enriched.business_info.fca_frn} — Authorised`,
    fcaPermissions: "Credit broking, Debt adjusting, Arranging deals",
    creditScore: enriched.financial_info.credit_score as string,
    fcaIndividuals: Array.isArray(enriched.directors_and_shareholders.active_directors)
      ? enriched.directors_and_shareholders.active_directors.map((d: any) => d.name).join(", ")
      : "",
  };

  return { enriched, screeningMap };
}

export function DealerEnrichment({ dealerName, companyNumber, autoTrigger = false, onEnriched }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [result, setResult] = useState<EnrichmentResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    business: true, financial: true, directors: true, docs: true,
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEnrichedName = useRef("");

  const toggleSection = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    if (!autoTrigger || !dealerName || dealerName.length < 3) return;
    if (dealerName === lastEnrichedName.current) return;
    if (loading) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      lastEnrichedName.current = dealerName;
      runEnrichmentFn();
    }, 1500);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [dealerName, autoTrigger, loading]);

  const runEnrichmentFn = useCallback(async () => {
    if (!dealerName) return;
    setLoading(true);
    setProgress(0);
    setResult(null);

    const steps = [
      { label: "Searching Companies House…", pct: 15 },
      { label: "Fetching company profile…", pct: 30 },
      { label: "Retrieving officers & PSCs…", pct: 45 },
      { label: "Searching FCA Register…", pct: 60 },
      { label: "Fetching FCA permissions…", pct: 70 },
      { label: "Fetching CreditSafe data…", pct: 80 },
      { label: "Compiling credit report…", pct: 90 },
      { label: "Computing results…", pct: 95 },
    ];

    for (const step of steps) {
      setProgressLabel(step.label);
      setProgress(step.pct);
      await new Promise(r => setTimeout(r, 300 + Math.random() * 200));
    }

    const { enriched, screeningMap } = getMockEnrichment(dealerName, companyNumber);

    setResult(enriched);
    onEnriched?.(enriched, screeningMap);
    setProgress(100);
    setProgressLabel("Complete");
    toast({ title: "Enrichment Complete", description: `${enriched.missing_fields.length} field(s) marked as MISSING.` });
    setLoading(false);
  }, [dealerName, companyNumber, onEnriched, toast]);

  const copyJson = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    toast({ title: "Copied", description: "Enrichment JSON copied to clipboard." });
  };

  const SECTIONS = [
    { key: "business", title: "Business Information", icon: Building2, data: result?.business_info,
      fields: [["Registered Name", "registered_name"], ["Trading Name(s)", "trading_names"], ["Registered Address", "registered_address"],
        ["Trading Address", "trading_address"], ["Company Number", "company_number"], ["FCA FRN", "fca_frn"],
        ["FCA Permissions", "fca_permissions_summary"], ["VAT Number", "vat_number"], ["Incorporation Date", "incorporation_date"], ["SIC Codes", "sic_codes"]] },
    { key: "financial", title: "Financial Information", icon: PoundSterling, data: result?.financial_info,
      fields: [["Credit Score", "credit_score"], ["Risk Band", "risk_band"], ["Credit Limit", "credit_limit"],
        ["Avg Payment Behaviour (DBT)", "average_payment_behaviour_dbt"], ["Last 3 Years' Accounts", "last_3_years_accounts"]] },
    { key: "directors", title: "Directors & Shareholders", icon: Users, data: result?.directors_and_shareholders,
      fields: [["Active Directors", "active_directors"], ["Persons of Significant Control", "persons_of_significant_control"]] },
    { key: "docs", title: "Supporting Documents", icon: FileText, data: result?.supporting_docs,
      fields: [["FCA Authorisation Link", "fca_authorisation_link"], ["Companies House Profile", "companies_house_profile_link"], ["Filing History", "filing_history_link"]] },
  ];

  return (
    <div className="space-y-4">
      {!result && (
        <div className="space-y-3">
          <Button onClick={runEnrichmentFn} disabled={loading || !dealerName} className="gap-2 w-full sm:w-auto" size="lg">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? "Enriching…" : "Run Full Enrichment"}
          </Button>
          {loading && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{progressLabel}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold">Enrichment Complete</p>
                <p className="text-xs text-muted-foreground">{result.missing_fields.length} missing field(s) flagged</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={copyJson}>
                <Copy className="w-3 h-3" /> Copy JSON
              </Button>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setResult(null); setProgress(0); }}>
                Re-run
              </Button>
            </div>
          </div>

          {SECTIONS.map((section) => (
            <Collapsible key={section.key} open={expandedSections[section.key]} onOpenChange={() => toggleSection(section.key)}>
              <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <section.icon className="w-4 h-4 text-primary" />
                    {section.title}
                  </div>
                  <div className="flex items-center gap-2">
                    {section.data && (
                      <Badge variant="outline" className="text-[10px]">
                        {section.fields.filter(([, k]) => fieldDisplay((section.data as any)?.[k]) !== NOT_FOUND).length}/{section.fields.length} found
                      </Badge>
                    )}
                    {expandedSections[section.key] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1">
                <div className="rounded-lg border border-border p-3 space-y-1">
                  {section.fields.map(([label, key]) => {
                    const val = (section.data as any)?.[key];
                    if (Array.isArray(val)) {
                      return (
                        <div key={key} className="space-y-1">
                          <p className="text-[10px] text-muted-foreground px-3 pt-2 font-medium">{label}</p>
                          {val.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 py-1.5 px-3 rounded-md bg-muted/20 text-xs">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="font-medium">{item.name || JSON.stringify(item)}</span>
                              {item.role && <Badge variant="secondary" className="text-[9px]">{item.role}</Badge>}
                            </div>
                          ))}
                        </div>
                      );
                    }
                    if (typeof val === "string" && val.startsWith("http")) {
                      return (
                        <div key={key} className="flex items-start justify-between gap-3 py-2 px-3 rounded-md bg-muted/20">
                          <span className="text-xs text-muted-foreground shrink-0 w-44">{label}</span>
                          <a href={val} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      );
                    }
                    if (key === "last_3_years_accounts" && Array.isArray(val)) {
                      return (
                        <div key={key} className="space-y-1">
                          <p className="text-[10px] text-muted-foreground px-3 pt-2 font-medium">{label}</p>
                          {val.map((yr: any, i: number) => (
                            <div key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-1.5 px-3 rounded-md bg-muted/20 text-xs">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="font-medium">{yr.year}</span>
                              <span>Turnover: {yr.turnover ?? "N/A"}</span>
                              <span>P&L: {yr.profit ?? "N/A"}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return <FieldRow key={key} label={label} value={val} />;
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}

          {result.missing_fields.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <p className="text-sm font-semibold text-destructive">Missing Fields ({result.missing_fields.length})</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.missing_fields.map((f) => (
                  <Badge key={f} variant="outline" className="text-[10px] text-destructive border-destructive/30">{f}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
