import {
  Wallet,
  Landmark,
  ReceiptText,
  FileText,
  Clock,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import Card from "@/components/ui/Card";

type Stat = {
  icon: LucideIcon;
  label: string;
  value: string;
  note: string;
};

const stats: Stat[] = [
  { icon: Wallet, label: "Cash Position", value: "₹0.00", note: "as of today" },
  { icon: Landmark, label: "Bank Balance", value: "₹0.00", note: "in 1 account" },
  { icon: ReceiptText, label: "GST Payable", value: "₹0.00", note: "No action required" },
  { icon: FileText, label: "TDS Payable", value: "₹0.00", note: "No action required" },
];

export default function BottomStats() {
  return (
    <Card>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-start gap-3">
              <span className="h-9 w-9 shrink-0 rounded-xl bg-bronze-soft flex items-center justify-center">
                <Icon size={16} className="text-bronze" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted">{s.label}</p>
                <p className="text-sm font-semibold text-fg">{s.value}</p>
                <p className="text-xs text-muted">{s.note}</p>
              </div>
            </div>
          );
        })}

        <div className="flex items-start gap-3">
          <span className="h-9 w-9 shrink-0 rounded-xl bg-bronze-soft flex items-center justify-center">
            <Clock size={16} className="text-bronze" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-muted">Last Updated</p>
            <p className="text-sm font-semibold text-fg">2 mins ago</p>
            <button
              type="button"
              className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-bronze hover:underline"
            >
              <RefreshCw size={12} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
