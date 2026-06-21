import { ChevronRight, ArrowRight } from "lucide-react";

import Card from "@/components/ui/Card";
import { invoicePipeline } from "@/data/salesDocuments";

const countColor: Record<string, string> = {
  Draft: "text-muted",
  Sent: "text-info",
  Viewed: "text-bronze",
  Overdue: "text-danger",
  Paid: "text-success",
};

export default function InvoicePipeline() {
  return (
    <Card className="flex h-full flex-col">
      <h2 className="text-base font-semibold text-fg">Invoice Pipeline</h2>

      <div className="mt-4 flex flex-1 items-center gap-1 overflow-x-auto">
        {invoicePipeline.map((stage, i) => (
          <div key={stage.stage} className="flex items-center gap-1">
            <div className="min-w-[72px] rounded-xl border border-line bg-canvas px-3 py-2 text-center">
              <p className={`text-lg font-bold ${countColor[stage.stage] ?? "text-fg"}`}>
                {stage.count}
              </p>
              <p className="text-xs text-muted">{stage.stage}</p>
              <p className="mt-0.5 text-xs text-fg-soft">{stage.amount}</p>
            </div>
            {i < invoicePipeline.length - 1 && (
              <ChevronRight size={16} className="shrink-0 text-muted" />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-bronze hover:opacity-80 transition"
      >
        View Pipeline <ArrowRight size={14} />
      </button>
    </Card>
  );
}
