"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Upload,
  Scale,
  FileCheck,
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  FileDown,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowUpRight,
  ClipboardCheck,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import Card from "@/components/ui/Card";
import CardSelect from "@/components/ui/CardSelect";
import HealthGauge from "@/components/ui/HealthGauge";
import AIRailPanel from "@/components/ui/AIRailPanel";
import { Menu, MenuItem, MenuLabel, MenuDivider } from "@/components/ui/Menu";

import GstBreakdownDonut from "@/components/dashboard/taxes/GstBreakdownDonut";
import GstTrendChart from "@/components/dashboard/taxes/GstTrendChart";
import ReceivablesTaxDonut from "@/components/dashboard/taxes/ReceivablesTaxDonut";

import {
  taxTabs,
  itcSummary,
  upcomingTaxEvents,
  taxAlerts,
  taxRecords,
  taxSourceFilters,
  type TaxStatus,
} from "@/data/taxes";

const statusTone: Record<TaxStatus, "success" | "warning" | "danger" | "info" | "neutral"> = {
  Filed: "success",
  Ready: "info",
  Utilized: "neutral",
  Pending: "warning",
};

type Tone = "success" | "info" | "warning" | "danger";

const dotByTone: Record<Tone, string> = {
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  danger: "bg-danger",
};

const iconColorByTone: Record<Tone, string> = {
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  danger: "text-danger",
};

const alertIcon: Record<Tone, LucideIcon> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  danger: AlertTriangle,
};

type Check = { tone: "success" | "warning"; text: string };

const complianceChecks: Check[] = [
  { tone: "success", text: "GST returns ready" },
  { tone: "success", text: "No mismatches found" },
  { tone: "success", text: "TDS reconciled" },
  { tone: "warning", text: "2 invoices missing GSTIN" },
];

const miniStats: { value: string; label: string; sub?: string }[] = [
  { value: "152", label: "Total Invoices" },
  { value: "42", label: "Recurring", sub: "28% of total" },
  { value: "110", label: "Direct", sub: "72% of total" },
  { value: "23", label: "Converted", sub: "15% of total" },
  { value: "₹2.1M", label: "Net Receivable" },
  { value: "₹1.24M", label: "Open Tax Invoices" },
];

const filingSteps: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ClipboardCheck,
    title: "Review Transactions",
    description: "All documents auto-categorized",
  },
  {
    icon: ShieldCheck,
    title: "Validate & Reconcile",
    description: "AI checks mismatches",
  },
  {
    icon: FileCheck,
    title: "File with Confidence",
    description: "Generate returns in one click",
  },
];

const copilotPrompts = [
  "Why is GST payable higher?",
  "Explain IGST transactions",
  "Show tax-saving opportunities",
  "Generate GST summary",
  "Check ITC eligibility",
];

export default function TaxesScreen() {
  const [tab, setTab] = useState("GST Dashboard");
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("All Sources");

  const q = query.trim().toLowerCase();
  const filtered = taxRecords.filter((r) => {
    const matchesSource = source === "All Sources" || r.category === source;
    const matchesQuery =
      !q ||
      r.document.toLowerCase().includes(q) ||
      r.party.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q);
    return matchesSource && matchesQuery;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tax Command Center"
        description="Monitor GST, TDS, tax liabilities, filing readiness and compliance health."
        showStar={false}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-muted">Active View</span>
              <CardSelect options={["GST", "TDS"]} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-muted">Period</span>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-canvas px-3 py-1.5 text-xs font-medium text-fg-soft hover:border-line-strong transition"
              >
                01-06-2026 to 15-06-2026
                <Calendar size={14} className="text-muted" />
              </button>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-muted">Status</span>
              <div className="py-1">
                <StatusPill tone="success">Ready</StatusPill>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download size={16} /> Download CSV
            </Button>
          </div>
        }
      />

      {/* Stat row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={ArrowUpRight}
          label="Output GST"
          value="₹1,82,000"
          sublabel="Collected"
          tone="success"
          trend={{ dir: "up", text: "12% vs last period" }}
        />
        <StatCard
          icon={Download}
          label="Input GST"
          value="₹58,000"
          sublabel="Credit Available"
          tone="info"
          trend={{ dir: "up", text: "8% vs last period" }}
        />
        <StatCard
          icon={Scale}
          label="Net GST"
          value="₹1,24,000"
          sublabel="Payable"
          sublabelTone="muted"
          tone="warning"
          trend={{ dir: "up", text: "15% vs last period" }}
        />
        <StatCard
          icon={FileCheck}
          label="Filing Status"
          value="Ready"
          sublabel="June 2026 · Due in 12 days"
          sublabelTone="muted"
          tone="bronze"
        />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-line">
        {taxTabs.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "border-bronze text-bronze"
                  : "border-transparent text-muted hover:text-fg-soft"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Donut + trend + compliance health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GstBreakdownDonut />
        <GstTrendChart />

        <Card className="flex h-full flex-col">
          <h2 className="text-base font-semibold text-fg">Compliance Health</h2>
          <div className="mt-4 flex flex-1 items-center gap-5">
            <HealthGauge score={96} label="Excellent" size={96} />
            <ul className="flex-1 space-y-3">
              {complianceChecks.map((chk) => {
                const Icon = chk.tone === "success" ? CheckCircle2 : AlertTriangle;
                const color = chk.tone === "success" ? "text-success" : "text-warning";
                return (
                  <li key={chk.text} className="flex items-center gap-2.5 text-sm text-fg-soft">
                    <Icon size={16} className={`shrink-0 ${color}`} />
                    <span className="min-w-0">{chk.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-bronze hover:opacity-80 transition"
          >
            View Compliance Report <ChevronRight size={14} />
          </button>
        </Card>
      </div>

      {/* Receivables + ITC + events + copilot */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-3">
          <ReceivablesTaxDonut />
        </div>

        <Card className="xl:col-span-3 flex h-full flex-col">
          <h2 className="text-base font-semibold text-fg">Input Tax Credit Summary</h2>
          <ul className="mt-4 space-y-3">
            {itcSummary.map((row) => (
              <li key={row.label} className="flex items-center gap-2.5">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotByTone[row.tone]}`} />
                <span className="min-w-0 truncate text-sm text-fg-soft">{row.label}</span>
                <span className="ml-auto text-sm font-semibold text-fg">{row.amount}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-fg-soft">ITC Utilization</span>
              <span className="font-semibold text-fg">75%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bronze-soft">
              <div className="h-full rounded-full bg-bronze" style={{ width: "75%" }} />
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-3 flex h-full flex-col">
          <h2 className="text-base font-semibold text-fg">Upcoming Tax Events</h2>
          <ul className="mt-4 space-y-3">
            {upcomingTaxEvents.map((ev) => (
              <li key={ev.title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bronze-soft text-bronze">
                  <CalendarDays size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{ev.title}</p>
                  <p className="text-xs text-muted">{ev.date}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-warning">{ev.due}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-bronze hover:opacity-80 transition"
          >
            View All Events <ChevronRight size={14} />
          </button>
        </Card>

        <div className="xl:col-span-3">
          <AIRailPanel
            title="AI Tax Copilot"
            greeting="Ask anything about taxes"
            placeholder="Ask anything about taxes…"
            prompts={copilotPrompts}
          />
        </div>
      </div>

      {/* Records table + alerts rail */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <Card padded={false} className="xl:col-span-9 p-5">
          {/* Controls */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-muted">Source Filter</span>
                <div className="relative">
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="appearance-none rounded-lg border border-line bg-canvas text-fg-soft text-xs font-medium pl-3 pr-7 py-1.5 outline-none hover:border-line-strong focus:border-bronze transition cursor-pointer"
                  >
                    {taxSourceFilters.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <ChevronRight
                    size={14}
                    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-muted"
                  />
                </div>
              </div>
              <div className="flex min-w-[16rem] flex-1 items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 lg:max-w-md">
                <Search size={16} className="shrink-0 text-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search invoice, customer, GSTIN, document…"
                  className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-fg-soft hover:bg-bronze-soft/50 transition"
              >
                <Filter size={14} /> Filters
              </button>
            </div>

            <Menu
              align="right"
              widthClass="w-48"
              trigger={
                <button
                  type="button"
                  aria-label="More actions"
                  className="inline-flex items-center justify-center rounded-lg border border-line px-2 py-1.5 text-muted hover:bg-bronze-soft/50 transition"
                >
                  <MoreVertical size={16} />
                </button>
              }
            >
              <MenuLabel>Actions</MenuLabel>
              <MenuItem icon={FileDown}>Export</MenuItem>
              <MenuDivider />
              <MenuItem icon={Printer}>Print</MenuItem>
            </Menu>
          </div>

          {/* Mini stat strip */}
          <div className="mt-5 grid grid-cols-2 md:grid-cols-6 gap-4">
            {miniStats.map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-canvas px-3 py-3">
                <p className="text-lg font-bold text-fg">{s.value}</p>
                <p className="text-xs text-muted">{s.label}</p>
                {s.sub && <p className="mt-0.5 text-xs text-success font-medium">{s.sub}</p>}
              </div>
            ))}
          </div>

          <div className="my-5 h-px bg-line" />

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
                  <th className="py-2.5 pr-3 font-medium">Date</th>
                  <th className="py-2.5 pr-3 font-medium">Document</th>
                  <th className="py-2.5 pr-3 font-medium">Type</th>
                  <th className="py-2.5 pr-3 font-medium">GST Category</th>
                  <th className="py-2.5 pr-3 font-medium">Party</th>
                  <th className="py-2.5 pr-3 font-medium text-right">Taxable</th>
                  <th className="py-2.5 pr-3 font-medium text-right">CGST</th>
                  <th className="py-2.5 pr-3 font-medium text-right">SGST</th>
                  <th className="py-2.5 pr-3 font-medium text-right">IGST</th>
                  <th className="py-2.5 pr-3 font-medium text-right">Total GST</th>
                  <th className="py-2.5 pr-3 font-medium">Status</th>
                  <th className="py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-10 text-center text-muted">
                      No tax records to show here yet.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr
                      key={r.document}
                      className="border-b border-line/60 transition hover:bg-bronze-soft/30"
                    >
                      <td className="py-3 pr-3 text-fg-soft">{r.date}</td>
                      <td className="py-3 pr-3 font-medium text-fg">{r.document}</td>
                      <td className="py-3 pr-3 text-fg-soft">{r.type}</td>
                      <td className="py-3 pr-3 text-fg-soft">{r.category}</td>
                      <td className="py-3 pr-3 text-fg-soft">{r.party}</td>
                      <td className="py-3 pr-3 text-right font-medium text-fg">{r.taxable}</td>
                      <td className="py-3 pr-3 text-right text-fg-soft">{r.cgst}</td>
                      <td className="py-3 pr-3 text-right text-fg-soft">{r.sgst}</td>
                      <td className="py-3 pr-3 text-right text-fg-soft">{r.igst}</td>
                      <td className="py-3 pr-3 text-right font-medium text-fg">{r.totalGst}</td>
                      <td className="py-3 pr-3">
                        <StatusPill tone={statusTone[r.status]}>{r.status}</StatusPill>
                      </td>
                      <td className="py-3 text-right">
                        <Menu
                          align="right"
                          widthClass="w-44"
                          trigger={
                            <button
                              type="button"
                              aria-label={`Actions for ${r.document}`}
                              className="text-muted hover:text-bronze transition"
                            >
                              <MoreVertical size={16} />
                            </button>
                          }
                        >
                          <MenuItem icon={Eye}>View</MenuItem>
                          <MenuItem icon={FileDown}>Download</MenuItem>
                          <MenuItem icon={CheckCircle2}>Mark Filed</MenuItem>
                        </Menu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
            <span className="text-muted">
              Showing 1 to {filtered.length} of {filtered.length} records
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted hover:bg-bronze-soft/50"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={15} />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-bronze-soft font-medium text-bronze">
                  1
                </button>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted hover:bg-bronze-soft/50"
                  aria-label="Next page"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
              <span className="text-muted">10</span>
            </div>
          </div>
        </Card>

        {/* Right rail */}
        <div className="xl:col-span-3 space-y-6">
          <Card className="flex flex-col">
            <h2 className="text-base font-semibold text-fg">Tax Alerts</h2>
            <ul className="mt-4 space-y-3">
              {taxAlerts.map((a) => {
                const Icon = alertIcon[a.tone];
                return (
                  <li key={a.title} className="flex items-start gap-3">
                    <Icon size={18} className={`mt-0.5 shrink-0 ${iconColorByTone[a.tone]}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-fg">{a.title}</p>
                      <p className="text-xs text-muted">{a.note}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-bronze hover:opacity-80 transition"
            >
              View All Alerts <ChevronRight size={14} />
            </button>
          </Card>
        </div>
      </div>

      {/* Filing-ready steps */}
      <Card>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-fg">Get Filing Ready in 3 Easy Steps</h2>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              {filingSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative">
                    <div className="flex flex-col items-start gap-3 rounded-2xl border border-line p-5">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-bronze-soft text-bronze">
                        <Icon size={20} />
                      </span>
                      <div>
                        <p className="font-semibold text-fg">{step.title}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                          <CheckCircle2 size={14} className="text-success" />
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {i < filingSteps.length - 1 && (
                      <ChevronRight
                        size={18}
                        className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-muted md:block"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full shrink-0 rounded-2xl border border-line bg-canvas p-5 lg:w-72">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-bronze" />
              <p className="font-semibold text-fg">Filing Readiness</p>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-fg">92%</span>
              <span className="text-sm text-success font-medium">Ready</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bronze-soft">
              <div className="h-full rounded-full bg-bronze" style={{ width: "92%" }} />
            </div>
            <Button variant="bronze" size="sm" className="mt-4 w-full">
              <Upload size={16} /> Go to Filing Center <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
