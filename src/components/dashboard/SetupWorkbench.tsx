"use client";

import {
  Building2,
  Receipt,
  Landmark,
  Users,
  Truck,
  UserCog,
  FileText,
  BarChart3,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusPill from "@/components/ui/StatusPill";
import { useDashboardAnalytics } from "@/lib/useDashboardAnalytics";

type Status = "Completed" | "In Progress" | "Pending";

const statusTone: Record<Status, "success" | "info" | "neutral"> = {
  Completed: "success",
  "In Progress": "info",
  Pending: "neutral",
};

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Receipt,
  Landmark,
  Users,
  Truck,
  UserCog,
  FileText,
  BarChart3,
};

const fallbackSteps: { icon: keyof typeof iconMap; name: string; status: Status }[] = [
  { icon: "Building2", name: "Company Profile", status: "Completed" },
  { icon: "Receipt", name: "GST & Tax Settings", status: "Completed" },
  { icon: "Landmark", name: "Bank Connections", status: "In Progress" },
  { icon: "Users", name: "Customers", status: "Pending" },
  { icon: "Truck", name: "Vendors", status: "Pending" },
  { icon: "UserCog", name: "Employees", status: "Pending" },
  { icon: "FileText", name: "Document Templates", status: "Pending" },
  { icon: "BarChart3", name: "Reports Ready", status: "Pending" },
];

export default function SetupWorkbench() {
  const { data } = useDashboardAnalytics();
  const steps = data?.setupTasks?.length ? data.setupTasks : fallbackSteps;
  const completedCount = steps.filter((step) => step.status === "Completed").length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fg">Setup Workbench</h2>
        <span className="text-xs text-muted">{completedCount} of {steps.length} steps completed</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-bronze-soft">
          <div className="h-2 rounded-full bg-bronze" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-medium text-bronze">{progress}%</span>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-3">
        {steps.map((s) => {
          const Icon = iconMap[s.icon as keyof typeof iconMap] ?? FileText;
          return (
            <div
              key={s.name}
              className="rounded-2xl border border-line bg-canvas p-3 flex flex-col gap-2"
            >
              <Icon size={18} className="text-bronze" aria-hidden="true" />
              <p className="text-xs font-medium text-fg leading-snug">{s.name}</p>
              <StatusPill tone={statusTone[s.status as Status]}>{s.status}</StatusPill>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-5 flex items-center justify-between">
        <Button variant="bronze" size="sm">
          Continue Setup <ArrowRight size={14} />
        </Button>
        <button type="button" className="text-xs font-medium text-bronze hover:underline">
          View All Steps
        </button>
      </div>
    </Card>
  );
}
