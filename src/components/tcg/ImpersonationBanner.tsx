import { useImpersonation } from "@/contexts/ImpersonationContext";

const ImpersonationBanner = () => {
  const { impersonationMode, impersonatedLender, stopImpersonation } = useImpersonation();

  if (!impersonationMode) return null;

  return (
    <div className="w-full bg-impersonation text-impersonation-foreground px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-medium">
      <span>👁 Viewing as <strong>{impersonatedLender}</strong> — read-only mode.</span>
      <button
        onClick={stopImpersonation}
        className="underline hover:no-underline font-semibold"
      >
        Exit Impersonation →
      </button>
    </div>
  );
};

export default ImpersonationBanner;
