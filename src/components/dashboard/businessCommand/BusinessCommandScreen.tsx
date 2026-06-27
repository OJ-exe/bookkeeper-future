"use client";

import {
  TrendingUp,
  TrendingDown,
  Percent,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
  Landmark,
  Download,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  FileText,
  Link2,
  IdCard,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import CardSelect from "@/components/ui/CardSelect";
import HealthGauge from "@/components/ui/HealthGauge";
import InsightsList, { type Insight } from "@/components/ui/InsightsList";

import CashRunwayChart from "@/components/dashboard/businessCommand/CashRunwayChart";

const healthMetrics = [
  { label: "Cash Flow", pct: 84 },
  { label: "Collections", pct: 88 },
  { label: "Profitability", pct: 76 },
  { label: "Compliance", pct: 80 },
];

const fillClass = { success: "bg-success", warning: "bg-warning", danger: "bg-danger" };

function barTone(pct: number): keyof typeof fillClass {
  if (pct >= 80) return "success";
  if (pct >= 60) return "warning";
  return "danger";
}

const keySignals: Insight[] = [
  { icon: CheckCircle2, tone: "success", title: "Revenue up 18% vs last month" },
  { icon: AlertTriangle, tone: "warning", title: "Receivables ageing rising in 31-60 bucket" },
  { icon: XCircle, tone: "danger", title: "2 customers overdue > ₹50k" },
  { icon: Info, tone: "info", title: "GST filing due in 12 days" },
  { icon: CheckCircle2, tone: "success", title: "Cash runway healthy at 8+ months" },
];

type Exception = { icon: LucideIcon; tone: "warning" | "danger" | "info"; label: string };

const exceptionChip: Record<Exception["tone"], string> = {
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
};

const exceptions: Exception[] = [
  { icon: FileText, tone: "warning", label: "3 invoices pending approval" },
  { icon: Link2, tone: "danger", label: "1 bank txn unmatched > ₹1L" },
  { icon: IdCard, tone: "info", label: "2 vendors missing GSTIN" },
];

const topCustomers = [
  { name: "ABC Pvt Ltd", value: "₹3.8M", pct: "25%" },
  { name: "XYZ Industries", value: "₹2.9M", pct: "19%" },
  { name: "Tech Solutions", value: "₹2.1M", pct: "14%" },
  { name: "Global Traders", value: "₹1.6M", pct: "10%" },
  { name: "Sunrise Enterprises", value: "₹1.2M", pct: "8%" },
];

const topExpenses = [
  { name: "Purchases", value: "₹2.4M" },
  { name: "Salaries", value: "₹1.2M" },
  { name: "Rent", value: "₹0.4M" },
  { name: "Utilities", value: "₹0.2M" },
  { name: "Marketing", value: "₹0.18M" },
];

const obligations = [
  { name: "GST", value: "₹1.24M", due: "Due 20 Jul" },
  { name: "TDS", value: "₹85k", due: "Due 07 Jul" },
  { name: "Payroll", value: "₹3.2L", due: "Due 30 Jun" },
];

export default function BusinessCommandScreen() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Business Command"
        description="Daily signals and MIS summaries for the company owner's view."
        showStar={false}
        actions={
          <>
            <CardSelect options={["This Month", "This Quarter", "This Financial Year"]} />
            <Button variant="outline" size="sm">
              <Download size={16} /> Export MIS
            </Button>
            <Button variant="outline" size="sm">
              <Sparkles size={16} /> Explain with AI
            </Button>
          </>
        }
      />

      {/* MIS KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={TrendingUp}
          label="Revenue"
          value="₹15.4M"
          tone="success"
          trend={{ dir: "up", text: "18%" }}
        />
        <StatCard
          icon={TrendingDown}
          label="Expenses"
          value="₹6.2M"
          sublabel="vs last period"
          sublabelTone="muted"
          tone="warning"
        />
        <StatCard icon={Percent} label="Gross Margin" value="59%" tone="info" />
        <StatCard icon={Percent} label="Net Margin" value="22%" tone="bronze" />
        <StatCard
          icon={ArrowDownToLine}
          label="Receivables"
          value="₹2.1M"
          sublabel="18 customers"
          sublabelTone="muted"
          tone="warning"
        />
        <StatCard
          icon={ArrowUpFromLine}
          label="Payables"
          value="₹1.4M"
          sublabel="12 vendors"
          sublabelTone="muted"
          tone="info"
        />
        <StatCard icon={Wallet} label="Cash Position" value="₹6.8L" tone="success" />
        <StatCard
          icon={Landmark}
          label="Bank Balance"
          value="₹5.9L"
          sublabel="3 accounts"
          sublabelTone="muted"
          tone="bronze"
        />
      </div>

      {/* Cash runway + health */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <CashRunwayChart />
        </div>

        <Card className="xl:col-span-4 flex flex-col">
          <h2 className="text-base font-semibold text-fg">Business Health</h2>
          <div className="mt-4 flex justify-center">
            <HealthGauge score={82} label="Good" />
          </div>
          <div className="mt-6 space-y-3.5">
            {healthMetrics.map((m) => {
              const tone = barTone(m.pct);
              return (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-fg-soft">{m.label}</span>
                    <span className="font-medium text-muted">{m.pct}%</span>
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
        </Card>
      </div>

      {/* Signals + exceptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-bronze" />
            <h2 className="text-base font-semibold text-fg">Key Signals</h2>
          </div>
          <div className="mt-5">
            <InsightsList items={keySignals} />
          </div>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-base font-semibold text-fg">Exceptions &amp; Approvals</h2>
          <ul className="mt-5 space-y-3">
            {exceptions.map((ex) => {
              const Icon = ex.icon;
              return (
                <li
                  key={ex.label}
                  className="flex items-center gap-3 rounded-xl border border-line p-3"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${exceptionChip[ex.tone]}`}
                  >
                    <Icon size={16} />
                  </span>
                  <p className="min-w-0 flex-1 text-sm font-medium text-fg">{ex.label}</p>
                  <Button variant="ghost" size="sm">
                    Review
                  </Button>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col">
          <h2 className="text-base font-semibold text-fg">Top Customers</h2>
          <ul className="mt-4 space-y-3">
            {topCustomers.map((c, i) => (
              <li key={c.name} className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    i === 0 ? "bg-bronze text-on-bronze" : "bg-bronze-soft text-bronze"
                  }`}
                >
                  {i + 1}
                </span>
                <p className="min-w-0 truncate text-sm font-medium text-fg">{c.name}</p>
                <div className="ml-auto text-right">
                  <p className="text-sm font-semibold text-fg">{c.value}</p>
                  <p className="text-xs text-muted">{c.pct}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-base font-semibold text-fg">Top Expenses</h2>
          <ul className="mt-4 space-y-3">
            {topExpenses.map((e) => (
              <li key={e.name} className="flex items-center justify-between">
                <p className="text-sm font-medium text-fg">{e.name}</p>
                <p className="text-sm font-semibold text-fg-soft">{e.value}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col">
          <h2 className="text-base font-semibold text-fg">Upcoming Obligations</h2>
          <ul className="mt-4 space-y-3">
            {obligations.map((o) => (
              <li
                key={o.name}
                className="flex items-center justify-between rounded-xl border border-line p-3"
              >
                <div>
                  <p className="text-sm font-medium text-fg">{o.name}</p>
                  <p className="text-xs text-muted">{o.due}</p>
                </div>
                <p className="text-sm font-semibold text-fg">{o.value}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
