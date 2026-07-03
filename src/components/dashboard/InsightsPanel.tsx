"use client";

import { CheckCircle2, RefreshCw, AlertTriangle, FileText } from "lucide-react";
import Card from "@/components/ui/Card";
import InsightsList, { type Insight } from "@/components/ui/InsightsList";
import { useDashboardAnalytics } from "@/lib/useDashboardAnalytics";

const fallbackItems: Insight[] = [
  {
    icon: CheckCircle2,
    tone: "success",
    title: "No overdue invoices",
    subtitle: "All customers are paying on time.",
  },
  {
    icon: RefreshCw,
    tone: "info",
    title: "Bank not reconciled",
    subtitle: "0 transactions pending reconciliation.",
  },
  {
    icon: AlertTriangle,
    tone: "warning",
    title: "Complete company setup",
    subtitle: "You're 38% done. Keep going!",
  },
  {
    icon: FileText,
    tone: "info",
    title: "Set up GST to unlock tax reports",
    subtitle: "Configure GST to generate returns.",
  },
];

export default function InsightsPanel() {
  const { data } = useDashboardAnalytics();
  const items = (data?.insights ?? fallbackItems).map((item) => ({
    ...item,
    icon: item.tone === "warning" ? AlertTriangle : item.tone === "success" ? CheckCircle2 : RefreshCw,
  }));

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fg">Insights</h2>
        <button type="button" className="text-xs font-medium text-bronze hover:underline">
          View All
        </button>
      </div>

      <div className="mt-4">
        <InsightsList items={items as Insight[]} />
      </div>
    </Card>
  );
}
