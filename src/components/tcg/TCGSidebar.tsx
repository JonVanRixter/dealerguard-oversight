import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Building2, Store, ClipboardList,
  FileText, Settings, BarChart3, HeartPulse
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", to: "/tcg/dashboard", icon: LayoutDashboard },
  { label: "Lenders", to: "/tcg/lenders", icon: Building2 },
  { label: "Dealers", to: "/tcg/dealers", icon: Store },
  { label: "Manual Review Queue", to: "/tcg/manual-review", icon: ClipboardList },
  { label: "Audit Trail", to: "/tcg/audit-trail", icon: FileText },
  { label: "Platform Config", to: "/tcg/platform-config", icon: Settings },
  { label: "Reports", to: "/tcg/reports", icon: BarChart3 },
  { label: "QA Health Check", to: "/tcg/qa-health-check", icon: HeartPulse },
];

const TCGSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-60 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col shrink-0">
      <div className="px-4 pt-5 pb-2">
        <span className="text-xs uppercase tracking-widest text-sidebar-foreground/50 font-semibold">Navigation</span>
      </div>
      <nav className="flex-1 px-2 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default TCGSidebar;
