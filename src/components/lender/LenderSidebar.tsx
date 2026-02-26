import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Store, ClipboardCheck, FileText, FileSearch, FolderOpen } from "lucide-react";

const MAIN_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Documents", to: "/documents", icon: FileText },
];

const DEALER_ITEMS = [
  { label: "Portfolio", to: "/dealers", icon: Store, exact: true },
  { label: "Pre-Onboarding", to: "/dealers/pre-onboarding", icon: FileSearch },
  { label: "Onboarding", to: "/dealers/onboarding", icon: ClipboardCheck },
];

const LenderSidebar = () => {
  const location = useLocation();

  const linkClass = (to: string) => {
    const active = location.pathname.startsWith(to);
    return `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;
  };

  return (
    <aside className="w-56 min-h-screen bg-card border-r border-border flex flex-col shrink-0">
      <div className="px-4 pt-5 pb-2">
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Navigation</span>
      </div>
      <nav className="flex-1 px-2 space-y-0.5">
        {MAIN_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} className={linkClass(item.to)}>
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}

        {/* Dealers & Onboarding — dealer-centric group */}
        <div className="pt-4 pb-1 px-1">
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Dealers</span>
          </div>
          <div className="ml-1 border-l-2 border-primary/20 pl-2 space-y-0.5">
            {DEALER_ITEMS.map(item => (
              <NavLink key={item.to} to={item.to} className={linkClass(item.to)}>
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default LenderSidebar;
