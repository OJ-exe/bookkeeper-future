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

type Status = "Completed" | "In Progress" | "Pending";

const statusTone: Record<Status, "success" | "info" | "neutral"> = {
  Completed: "success",
  "In Progress": "info",
  Pending: "neutral",
};

const steps: { icon: LucideIcon; name: string; status: Status }[] = [
  { icon: Building2, name: "Company Profile", status: "Completed" },
  { icon: Receipt, name: "GST & Tax Settings", status: "Completed" },
  { icon: Landmark, name: "Bank Connections", status: "In Progress" },
  { icon: Users, name: "Customers", status: "Pending" },
  { icon: Truck, name: "Vendors", status: "Pending" },
  { icon: UserCog, name: "Employees", status: "Pending" },
  { icon: FileText, name: "Document Templates", status: "Pending" },
  { icon: BarChart3, name: "Reports Ready", status: "Pending" },
];

const PROGRESS = 38;

export default function SetupWorkbench() {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fg">Setup Workbench</h2>
        <span className="text-xs text-muted">3 of 8 steps completed</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-bronze-soft">
          <div
            className="h-2 rounded-full bg-bronze"
            style={{ width: `${PROGRESS}%` }}
          />
        </div>
        <span className="text-xs font-medium text-bronze">{PROGRESS}%</span>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-3">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.name}
              className="rounded-2xl border border-line bg-canvas p-3 flex flex-col gap-2"
            >
              <Icon size={18} className="text-bronze" aria-hidden="true" />
              <p className="text-xs font-medium text-fg leading-snug">{s.name}</p>
              <StatusPill tone={statusTone[s.status]}>{s.status}</StatusPill>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-5 flex items-center justify-between">
        <Button variant="bronze" size="sm">
          Continue Setup <ArrowRight size={14} />
        </Button>
        <button
          type="button"
          className="text-xs font-medium text-bronze hover:underline"
        >
          View All Steps
        </button>
      </div>
    </Card>
  );
}
