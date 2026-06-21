import { Activity, TrendingUp, EyeOff, Clock, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Card from "@/components/ui/Card";

type Row = {
  icon: LucideIcon;
  tone: "success" | "warning" | "info" | "neutral";
  label: string;
  primary: string;
  value: string;
  link?: string;
};

const iconTone: Record<Row["tone"], string> = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  neutral: "bg-bronze-soft text-bronze",
};

const rows: Row[] = [
  { icon: Activity, tone: "success", label: "Most Active Account", primary: "Sales", value: "₹8,40,000" },
  { icon: TrendingUp, tone: "warning", label: "Highest Balance", primary: "HDFC 1234", value: "₹3,85,000" },
  { icon: EyeOff, tone: "info", label: "Unused Accounts", primary: "3", value: "", link: "View list" },
  { icon: Clock, tone: "neutral", label: "Recently Added", primary: "Diesel", value: "2 days ago" },
];

export default function AccountInsights() {
  return (
    <Card padded={false} className="p-5">
      <h3 className="font-semibold text-fg">Insights</h3>
      <ul className="mt-4 space-y-4">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <li key={row.label} className="flex items-center gap-3">
              <span className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${iconTone[row.tone]}`}>
                <Icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted">{row.label}</p>
                <p className="text-sm font-medium text-fg truncate">{row.primary}</p>
              </div>
              {row.link ? (
                <button className="text-xs font-medium text-bronze hover:opacity-80 transition">
                  {row.link}
                </button>
              ) : (
                <span className="text-sm font-semibold text-fg">{row.value}</span>
              )}
            </li>
          );
        })}
      </ul>
      <button className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-bronze hover:opacity-80 transition">
        View All Insights
        <ArrowRight size={15} />
      </button>
    </Card>
  );
}
