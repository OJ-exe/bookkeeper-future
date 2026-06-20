import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sublabel?: string;
  trend?: { dir: "up" | "down"; text: string };
}) {
  const trendColor = trend?.dir === "down" ? "text-danger" : "text-success";
  const TrendIcon = trend?.dir === "down" ? ArrowDownRight : ArrowUpRight;
  return (
    <div className="bg-surface border border-line rounded-2xl p-5 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition">
      <div className="flex items-start justify-between">
        <div className="h-11 w-11 rounded-xl bg-bronze-soft flex items-center justify-center">
          <Icon size={20} className="text-bronze" />
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={14} />
            {trend.text}
          </span>
        )}
      </div>
      <p className="text-muted text-sm mt-4">{label}</p>
      <h3 className="text-2xl font-bold text-fg mt-1">{value}</h3>
      {sublabel && <p className="text-xs text-muted mt-1">{sublabel}</p>}
    </div>
  );
}
