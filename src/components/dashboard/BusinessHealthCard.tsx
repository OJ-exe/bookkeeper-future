import { MoreVertical, ArrowUp } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusPill from "@/components/ui/StatusPill";

const metrics = [
  { label: "Cash Flow", pct: 80 },
  { label: "Collections", pct: 90 },
  { label: "Taxes", pct: 70 },
  { label: "Profitability", pct: 75 },
];

const fillClass = { success: "bg-success", warning: "bg-warning", danger: "bg-danger" };

function toneFor(pct: number): keyof typeof fillClass {
  if (pct >= 80) return "success";
  if (pct >= 60) return "warning";
  return "danger";
}

export default function BusinessHealthCard() {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fg">Business Health</h2>
        <MoreVertical size={16} className="text-muted" aria-hidden="true" />
      </div>

      <div className="mt-3 flex items-end gap-2">
        <span className="text-5xl font-bold text-fg leading-none">82</span>
        <span className="text-muted text-sm mb-1">/100</span>
        <span className="ml-auto mb-1">
          <StatusPill tone="success">Good</StatusPill>
        </span>
      </div>

      <p className="mt-2 inline-flex items-center gap-1 text-success text-xs font-medium">
        <ArrowUp size={12} />8 pts vs last month
      </p>

      <div className="mt-5 space-y-3.5">
        {metrics.map((m) => {
          const tone = toneFor(m.pct);
          return (
            <div key={m.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-fg-soft">{m.label}</span>
                <span className="text-muted font-medium">{m.pct}%</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-bronze-soft">
                <div
                  className={`h-2 rounded-full ${fillClass[tone]}`}
                  style={{ width: `${m.pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="outline" className="mt-5 w-full">
        View Full Report
      </Button>
    </Card>
  );
}
