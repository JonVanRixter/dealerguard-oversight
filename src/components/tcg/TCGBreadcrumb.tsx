import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

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
  const label = ROUTE_LABELS[location.pathname];

  if (location.pathname === "/tcg/dashboard") return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground px-6 py-3 border-b border-border bg-muted/30">
      <span className="hover:text-foreground cursor-pointer">Overview</span>
      {label && (
        <>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">{label}</span>
        </>
      )}
    </nav>
  );
};

export default TCGBreadcrumb;
