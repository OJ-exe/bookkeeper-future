import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

type Tone = "bronze" | "success" | "info" | "warning" | "danger";

const chipTone: Record<Tone, string> = {
  bronze: "bg-bronze-soft text-bronze",
  success: "bg-success-soft text-success",
  info: "bg-info-soft text-info",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  trend,
  tone = "bronze",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sublabel?: string;
  trend?: { dir: "up" | "down"; text: string };
  tone?: Tone;
}) {
  const trendColor = trend?.dir === "down" ? "text-danger" : "text-success";
  const TrendIcon = trend?.dir === "down" ? ArrowDownRight : ArrowUpRight;
  return (
    <div className="bg-surface border border-line rounded-2xl p-5 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition flex flex-col h-full">
      <div className="flex items-start justify-between">
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${chipTone[tone]}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={14} />
            {trend.text}
          </span>
        )}
      </div>
      <div className="mt-auto pt-5">
        <h3 className="text-2xl font-bold text-fg">{value}</h3>
        <p className="text-muted text-sm mt-1">{label}</p>
        {sublabel && <p className="text-xs text-success mt-2 font-medium">{sublabel}</p>}
      </div>
    </div>
  );
}
