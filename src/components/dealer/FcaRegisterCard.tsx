import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, Loader2, Building2, Users, ShieldCheck,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, XCircle, ExternalLink,
} from "lucide-react";

/* ── Mock FCA data ── */
const MOCK_FIRMS: Record<string, {
  firm: Record<string, unknown>;
  individuals: { Name: string; IRN: string; Status: string }[];
  permissions: string[];
}> = {
  "812345": {
    firm: {
      "Organisation Name": "Hartley Motor Group Ltd",
      "Current Status": "Authorised",
      "Status Effective Date": "2019-03-15",
      "Firm Reference Number": "812345",
      "Companies House Number": "09876543",
      "Firm Type": "Appointed Representative",
      "Address": { line1: "Hartley Road", city: "Wakefield", postcode: "WF1 3LX" },
    },
    individuals: [
      { Name: "James Hartley", IRN: "JHH0012", Status: "Active" },
      { Name: "Claire Hartley", IRN: "CHH0013", Status: "Active" },
      { Name: "David Pearson", IRN: "DPP0045", Status: "Active" },
    ],
    permissions: [
      "Advising on regulated mortgage contracts",
      "Agreeing to carry on a regulated activity",
      "Arranging (bringing about) deals in investments",
      "Credit broking",
      "Debt adjusting",
    ],
  },
  "798234": {
    firm: {
      "Organisation Name": "Birchwood Cars Ltd",
      "Current Status": "Authorised",
      "Status Effective Date": "2020-07-22",
      "Firm Reference Number": "798234",
      "Companies House Number": "12345890",
      "Firm Type": "Directly Authorised",
      "Address": { line1: "Birchwood Lane", city: "Stockport", postcode: "SK4 2PL" },
    },
    individuals: [
      { Name: "Mark Davies", IRN: "MDD0078", Status: "Active" },
      { Name: "Rebecca Lowe", IRN: "RLL0099", Status: "Active" },
    ],
    permissions: [
      "Credit broking",
      "Debt adjusting",
      "Debt counselling",
    ],
  },
  "654321": {
    firm: {
      "Organisation Name": "Apex Premium Cars Ltd",
      "Current Status": "No Longer Authorised",
      "Status Effective Date": "2025-09-01",
      "Firm Reference Number": "654321",
      "Companies House Number": "10987654",
      "Firm Type": "Appointed Representative",
      "Address": { line1: "45 High Street", city: "Birmingham", postcode: "B2 4RG" },
    },
    individuals: [
      { Name: "Derek T. Horne", IRN: "DTH0034", Status: "Inactive" },
    ],
    permissions: ["Credit broking"],
  },
};

const MOCK_SEARCH_MAP: Record<string, string> = {
  hartley: "812345",
  birchwood: "798234",
  apex: "654321",
};

interface FirmData { [key: string]: unknown; }
interface IndividualData { Name?: string; IRN?: string; Status?: string; [key: string]: unknown; }

interface Props {
  dealerName: string;
  fcaRef?: string;
  onDataLoaded?: (data: {
    firmName: string; frn: string; status: string; statusDate?: string;
    firmType?: string; companiesHouseNumber?: string; address?: string;
    individuals: { name: string; irn?: string; status?: string }[];
    permissions: string[];
  }) => void;
}

export function FcaRegisterCard({ dealerName, fcaRef, onDataLoaded }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [firmData, setFirmData] = useState<FirmData | null>(null);
  const [individuals, setIndividuals] = useState<IndividualData[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(fcaRef || "");
  const [searched, setSearched] = useState(false);
  const [showIndividuals, setShowIndividuals] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoSearched = useRef(false);

  useEffect(() => {
    if (fcaRef && !autoSearched.current) {
      autoSearched.current = true;
      lookupFirm(fcaRef);
    }
  }, [fcaRef]);

  const lookupFirm = async (frn: string) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

    const mockData = MOCK_FIRMS[frn];
    if (!mockData) {
      setError(`No firm found with FRN ${frn}.`);
      setFirmData(null);
      setLoading(false);
      return;
    }

    const firm = mockData.firm;
    setFirmData(firm);
    setIndividuals(mockData.individuals);
    setPermissions(mockData.permissions);

    const addr = firm["Address"] as Record<string, string> | undefined;
    onDataLoaded?.({
      firmName: (firm["Organisation Name"] as string) || "Unknown",
      frn: (firm["Firm Reference Number"] as string) || frn,
      status: (firm["Current Status"] as string) || "Unknown",
      statusDate: firm["Status Effective Date"] as string,
      firmType: firm["Firm Type"] as string,
      companiesHouseNumber: firm["Companies House Number"] as string,
      address: addr ? Object.values(addr).filter(Boolean).join(", ") : undefined,
      individuals: mockData.individuals.map(ind => ({ name: ind.Name || "Unknown", irn: ind.IRN, status: ind.Status })),
      permissions: mockData.permissions,
    });
    setLoading(false);
  };

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) return;
    if (/^\d+$/.test(query)) return lookupFirm(query);

    setLoading(true);
    setError(null);
    setSearched(true);
    await new Promise(r => setTimeout(r, 500));

    const lowerQ = query.toLowerCase();
    const matchedFrn = Object.entries(MOCK_SEARCH_MAP).find(([key]) => lowerQ.includes(key))?.[1];
    if (matchedFrn) {
      await lookupFirm(matchedFrn);
    } else {
      // Default to first mock firm for demo
      await lookupFirm("812345");
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    const lower = status.toLowerCase();
    if (lower.includes("authorised") || lower.includes("registered"))
      return <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-600/30"><CheckCircle2 className="w-3 h-3" />{status}</Badge>;
    if (lower.includes("no longer") || lower.includes("cancelled") || lower.includes("revoked"))
      return <Badge variant="outline" className="gap-1 text-destructive border-destructive/30"><XCircle className="w-3 h-3" />{status}</Badge>;
    return <Badge variant="outline" className="gap-1 text-amber-600 border-amber-600/30"><AlertTriangle className="w-3 h-3" />{status}</Badge>;
  };

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">FCA Register Check</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Search the Financial Services Register by name or FRN</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Enter firm name or FRN..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="bg-background" />
          <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()} className="gap-1.5 shrink-0">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Search
          </Button>
        </div>

        {error && searched && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/5 border border-destructive/20">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {firmData && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{(firmData["Organisation Name"] as string) || "Unknown Firm"}</h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                    {firmData["Firm Reference Number"] && <span>FRN: <span className="font-medium text-foreground">{firmData["Firm Reference Number"] as string}</span></span>}
                    {firmData["Companies House Number"] && <span>CH: <span className="font-medium text-foreground">{firmData["Companies House Number"] as string}</span></span>}
                  </div>
                </div>
                <div className="shrink-0">{getStatusBadge(firmData["Current Status"] as string)}</div>
              </div>
              {firmData["Firm Reference Number"] && (
                <a href={`https://register.fca.org.uk/s/firm?id=${firmData["Firm Reference Number"]}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  View on FCA Register <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {individuals.length > 0 && (
              <Collapsible open={showIndividuals} onOpenChange={setShowIndividuals}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Users className="w-4 h-4 text-primary" /> Approved Individuals ({individuals.length})
                    </div>
                    {showIndividuals ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                    {individuals.map((ind, i) => (
                      <div key={i} className="px-4 py-2.5 flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium text-foreground">{ind.Name || "Unknown"}</p>
                          {ind.IRN && <p className="text-xs text-muted-foreground">IRN: {ind.IRN}</p>}
                        </div>
                        {ind.Status && getStatusBadge(ind.Status)}
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {permissions.length > 0 && (
              <Collapsible open={showPermissions} onOpenChange={setShowPermissions}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <ShieldCheck className="w-4 h-4 text-primary" /> Permissions ({permissions.length})
                    </div>
                    {showPermissions ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-lg border border-border">
                    {permissions.map((p, i) => <Badge key={i} variant="secondary" className="text-xs">{p}</Badge>)}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}

        {loading && !firmData && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-3">
              <Skeleton className="h-4 w-48" />
              <div className="flex gap-4"><Skeleton className="h-3 w-24" /><Skeleton className="h-3 w-20" /></div>
            </div>
          </div>
        )}

        {!searched && !firmData && !loading && (
          <div className="text-center py-4">
            <Building2 className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Search the FCA Financial Services Register to check firm authorisation status.</p>
          </div>
        )}
      </div>
    </div>
  );
}
