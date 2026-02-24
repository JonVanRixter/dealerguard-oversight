import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Store, ClipboardCheck, FileText } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Dealers", to: "/dealers", icon: Store },
  { label: "Onboarding", to: "/onboarding", icon: ClipboardCheck },
  { label: "Documents", to: "/documents", icon: FileText },
];

const LenderSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-56 min-h-screen bg-card border-r border-border flex flex-col shrink-0">
      <div className="px-4 pt-5 pb-2">
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Navigation</span>
      </div>
      <nav className="flex-1 px-2 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const active = location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
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

export default LenderSidebar;
