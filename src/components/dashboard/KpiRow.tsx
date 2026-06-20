import { Wallet, ArrowDownToLine, ArrowUpFromLine, AlertCircle } from "lucide-react";
import StatCard from "@/components/ui/StatCard";

const kpis = [
  { icon: Wallet, label: "Cash Available", value: "₹0", sublabel: "Stable", tone: "success" as const },
  { icon: ArrowDownToLine, label: "Receivables", value: "₹0", sublabel: "No Overdue", tone: "info" as const },
  { icon: ArrowUpFromLine, label: "Payables", value: "₹0", sublabel: "Under Control", tone: "warning" as const },
  { icon: AlertCircle, label: "Tasks Need Attention", value: "0", sublabel: "All Good", tone: "bronze" as const },
];

export default function KpiRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {kpis.map((k) => (
        <StatCard
          key={k.label}
          icon={k.icon}
          label={k.label}
          value={k.value}
          sublabel={k.sublabel}
          tone={k.tone}
        />
      ))}
    </div>
  );
}
