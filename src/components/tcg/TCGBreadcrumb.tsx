import { useLocation, useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { lenders } from "@/data/tcg";
import { dealers } from "@/data/tcg/dealers";

const ROUTE_LABELS: Record<string, string> = {
  "/tcg/dashboard": "Overview",
  "/tcg/lenders": "Lenders",
  "/tcg/dealers": "Dealers",
  "/tcg/manual-review": "Manual Review Queue",
  "/tcg/audit-trail": "Audit Trail",
  "/tcg/platform-config": "Platform Config",
  "/tcg/reports": "Reports",
  "/tcg/qa-health-check": "QA Health Check",
};

const TCGBreadcrumb = () => {
  const location = useLocation();
  const path = location.pathname;

  if (path === "/tcg/dashboard") return null;

  // Build crumbs
  const crumbs: { label: string; to?: string }[] = [{ label: "Overview", to: "/tcg/dashboard" }];

  // Check for lender detail
  const lenderMatch = path.match(/^\/tcg\/lenders\/(.+)$/);
  if (lenderMatch) {
    crumbs.push({ label: "Lenders", to: "/tcg/lenders" });
    const lender = lenders.find(l => l.id === lenderMatch[1]);
    crumbs.push({ label: lender?.name ?? lenderMatch[1] });
  }
  // Check for dealer detail
  else if (path.match(/^\/tcg\/dealers\/(.+)$/)) {
    const dealerMatch = path.match(/^\/tcg\/dealers\/(.+)$/)!;
    crumbs.push({ label: "Dealers", to: "/tcg/dealers" });
    const dealer = dealers.find(d => d.id === dealerMatch[1]);
    crumbs.push({ label: dealer?.name ?? dealerMatch[1] });
  }
  // Standard route
  else {
    const label = ROUTE_LABELS[path];
    if (label) crumbs.push({ label });
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground px-6 py-3 border-b border-border bg-muted/30">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
          {c.to ? (
            <Link to={c.to} className="hover:text-foreground transition">{c.label}</Link>
          ) : (
            <span className="text-foreground font-medium">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default TCGBreadcrumb;
