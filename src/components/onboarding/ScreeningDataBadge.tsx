import { CheckCircle2 } from "lucide-react";

interface Props {
  label: string;
  value: string | null | undefined;
}

export function ScreeningDataBadge({ label, value }: Props) {
  if (!value) return null;
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1">
      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
      <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
        <span className="font-medium">{label}: </span>
        <span>{value}</span>
      </span>
    </div>
  );
}
