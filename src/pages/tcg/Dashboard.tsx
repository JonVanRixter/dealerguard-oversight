import { useImpersonation } from "@/contexts/ImpersonationContext";
import { LayoutDashboard, Building2, Store, AlertTriangle, Activity } from "lucide-react";

const stats = [
  { label: "Active Lenders", value: "12", icon: Building2 },
  { label: "Active Dealers", value: "847", icon: Store },
  { label: "Pending Reviews", value: "23", icon: AlertTriangle },
  { label: "Alerts Today", value: "7", icon: Activity },
];

const TCGDashboard = () => {
  const { impersonationMode, impersonatedLender } = useImpersonation();

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-1">Overview</h2>
      <p className="text-muted-foreground mb-6">
        {impersonationMode ? `Showing data for ${impersonatedLender}` : "Platform-wide compliance summary"}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-lg border border-border p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TCGDashboard;
