import { LucideIcon } from "lucide-react";

export type Insight = {
  icon: LucideIcon;
  tone: "success" | "warning" | "danger" | "info";
  title: string;
  subtitle?: string;
};

const toneColor: Record<Insight["tone"], string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
};

export default function InsightsList({ items }: { items: Insight[] }) {
  return (
    <ul className="space-y-4">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <li key={i} className="flex gap-3">
            <Icon size={18} className={`mt-0.5 shrink-0 ${toneColor[it.tone]}`} />
            <div>
              <p className="text-sm font-medium text-fg">{it.title}</p>
              {it.subtitle && <p className="text-xs text-muted mt-0.5">{it.subtitle}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
