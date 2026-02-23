import { useState } from "react";
import { Shield, Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useImpersonation } from "@/contexts/ImpersonationContext";

const LENDERS = ["All Lenders", "Alpha Finance", "Beta Capital", "Gamma Lending", "Delta Credit"];

const TCGHeader = () => {
  const { userName, logout } = useAuth();
  const { startImpersonation, stopImpersonation, impersonationMode } = useImpersonation();
  const [selectedLender, setSelectedLender] = useState("All Lenders");
  const [showLenderDropdown, setShowLenderDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLenderSelect = (lender: string) => {
    setSelectedLender(lender);
    setShowLenderDropdown(false);
    if (lender === "All Lenders") {
      stopImpersonation();
    } else {
      startImpersonation(lender);
    }
  };

  return (
    <header className="bg-primary text-primary-foreground px-6 py-3 flex items-center justify-between relative z-30">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <Shield className="w-7 h-7 text-accent" />
        <div>
          <h1 className="text-base font-bold leading-tight">DealerGuard — Oversight Panel</h1>
        </div>
      </div>

      {/* Centre: Lender Filter */}
      <div className="relative">
        <button
          onClick={() => setShowLenderDropdown(!showLenderDropdown)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/20 transition text-sm font-medium"
        >
          {selectedLender}
          <ChevronDown className="w-4 h-4" />
        </button>
        {showLenderDropdown && (
          <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-card text-card-foreground rounded-md shadow-xl border border-border min-w-[200px] py-1 z-50">
            {LENDERS.map(l => (
              <button
                key={l}
                onClick={() => handleLenderSelect(l)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition ${l === selectedLender ? "bg-muted font-semibold" : ""}`}
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-4">
        <button className="relative p-1.5 rounded-md hover:bg-primary-foreground/10 transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-accent rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 hover:bg-primary-foreground/10 px-3 py-1.5 rounded-md transition"
          >
            <div className="w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium leading-tight">{userName}</div>
              <div className="text-[10px] font-semibold text-accent leading-tight">TCG Operations</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-1 bg-card text-card-foreground rounded-md shadow-xl border border-border min-w-[160px] py-1 z-50">
              <button
                onClick={() => { setShowProfileMenu(false); logout(); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TCGHeader;
