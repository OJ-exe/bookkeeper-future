import { Check, AlertTriangle, ArrowRight } from "lucide-react";
import Card from "@/components/ui/Card";
import HealthGauge from "@/components/ui/HealthGauge";

const good = ["No duplicate accounts", "GST mappings complete", "Payroll accounts configured"];
const warn = ["2 accounts not used in 90+ days", "Vendor Advances not linked"];

export default function AccountHealthCard() {
  return (
    <Card padded={false} className="p-5">
      <h3 className="font-semibold text-fg">Account Health</h3>
      <div className="mt-4 flex items-center justify-center gap-4">
        <HealthGauge score={92} label="Excellent" size={96} />
      </div>
      <ul className="mt-5 space-y-2.5">
        {good.map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-sm text-fg-soft">
            <Check size={16} className="shrink-0 text-success" />
            {item}
          </li>
        ))}
        {warn.map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-sm text-fg-soft">
            <AlertTriangle size={16} className="shrink-0 text-warning" />
            {item}
          </li>
        ))}
      </ul>
      <button className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-bronze hover:opacity-80 transition">
        View Health Report
        <ArrowRight size={15} />
      </button>
    </Card>
  );
}
