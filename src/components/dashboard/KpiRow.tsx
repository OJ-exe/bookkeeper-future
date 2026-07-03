"use client";

import { Wallet, ArrowDownToLine, ArrowUpFromLine, AlertCircle, type LucideIcon } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { useDashboardAnalytics } from "@/lib/useDashboardAnalytics";
import type { DashboardMetric } from "@/types/dashboard";

const iconMap: Record<string, LucideIcon> = {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertCircle,
};

const fallbackMetrics: DashboardMetric[] = [
  { label: "Cash Available", value: "₹0", sublabel: "Stable", tone: "success", icon: "Wallet" },
  { label: "Receivables", value: "₹0", sublabel: "No Overdue", tone: "info", icon: "ArrowDownToLine" },
  { label: "Payables", value: "₹0", sublabel: "Under Control", tone: "warning", icon: "ArrowUpFromLine" },
  { label: "Tasks Need Attention", value: "0", sublabel: "All Good", tone: "bronze", icon: "AlertCircle" },
];

export default function KpiRow() {
  const { data } = useDashboardAnalytics();
  const metrics = data?.metrics?.length ? data.metrics : fallbackMetrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {metrics.map((metric) => {
        const Icon = iconMap[metric.icon] ?? Wallet;
        return (
          <StatCard
            key={metric.label}
            icon={Icon}
            label={metric.label}
            value={metric.value}
            sublabel={metric.sublabel}
            tone={metric.tone as "success" | "info" | "warning" | "bronze"}
          />
        );
      })}
    </div>
  );
}
