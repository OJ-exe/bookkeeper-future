"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Play,
  Download,
  FileText,
  BadgeDollarSign,
  Wallet,
  Scissors,
  UserCheck,
  CalendarClock,
  MoreVertical,
  Eye,
  FileDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import Card from "@/components/ui/Card";
import { Menu, MenuItem } from "@/components/ui/Menu";

import RunPayrollModal from "@/components/dashboard/payroll/RunPayrollModal";

import {
  payrollRuns,
  payrollTabs,
  type PayrollRun,
  type PayrollStatus,
} from "@/data/payroll";

const statusTone: Record<PayrollStatus, "success" | "info" | "warning" | "neutral"> = {
  Paid: "success",
  Processing: "info",
  Pending: "warning",
  Draft: "neutral",
};

function tabPredicate(tab: string, run: PayrollRun): boolean {
  switch (tab) {
    case "Paid":
      return run.status === "Paid";
    case "Processing":
      return run.status === "Processing";
    case "Pending":
      return run.status === "Pending";
    case "Drafts":
      return run.status === "Draft";
    default:
      return true; // "All Runs"
  }
}

export default function PayrollScreen() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All Runs");
  const [runOpen, setRunOpen] = useState(false);

  const q = query.trim().toLowerCase();
  const filtered = payrollRuns.filter((run) => {
    const matchesQuery =
      !q ||
      run.id.toLowerCase().includes(q) ||
      run.period.toLowerCase().includes(q) ||
      run.status.toLowerCase().includes(q);
    return matchesQuery && tabPredicate(tab, run);
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payroll"
        description="Run payroll, review salary workings, manage deductions, and track payouts."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download size={16} /> Export
            </Button>
            <Button variant="outline" size="sm">
              <FileText size={16} /> Salary Report
            </Button>
            <Button variant="bronze" size="sm" onClick={() => setRunOpen(true)}>
              <Play size={16} /> Run Payroll
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          icon={BadgeDollarSign}
          label="Net Pay (This Month)"
          value="₹32.1L"
          tone="bronze"
        />
        <StatCard
          icon={Wallet}
          label="Gross"
          value="₹38.4L"
          sublabel="Before deductions"
          sublabelTone="muted"
          tone="info"
        />
        <StatCard
          icon={Scissors}
          label="Deductions"
          value="₹6.3L"
          sublabel="TDS, PF, ESI"
          sublabelTone="muted"
          tone="warning"
        />
        <StatCard
          icon={UserCheck}
          label="Employees Paid"
          value="44"
          sublabel="of 48"
          tone="success"
        />
        <StatCard
          icon={CalendarClock}
          label="Next Pay Run"
          value="Jul 01"
          sublabel="Scheduled"
          sublabelTone="muted"
          tone="bronze"
        />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-line">
        {payrollTabs.map((t) => {
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

      {/* Payroll runs */}
      <Card padded={false} className="p-5">
        {/* Controls */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 lg:max-w-md">
            <Search size={16} className="shrink-0 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search run ID, period, status…"
              className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-fg-soft hover:bg-bronze-soft/50 transition"
          >
            <Filter size={14} /> Filters
          </button>
        </div>

        <div className="my-5 h-px bg-line" />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
                <th className="py-2.5 pr-3 font-medium">Run ID</th>
                <th className="py-2.5 pr-3 font-medium">Period</th>
                <th className="py-2.5 pr-3 font-medium text-right">Employees</th>
                <th className="py-2.5 pr-3 font-medium text-right">Gross</th>
                <th className="py-2.5 pr-3 font-medium text-right">Deductions</th>
                <th className="py-2.5 pr-3 font-medium text-right">Net Pay</th>
                <th className="py-2.5 pr-3 font-medium">Status</th>
                <th className="py-2.5 pr-3 font-medium">Pay Date</th>
                <th className="py-2.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-muted">
                    No payroll runs match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((run) => (
                  <tr
                    key={run.id}
                    className="border-b border-line/60 hover:bg-bronze-soft/30 transition"
                  >
                    <td className="py-3 pr-3 font-medium text-fg">{run.id}</td>
                    <td className="py-3 pr-3 text-fg-soft">{run.period}</td>
                    <td className="py-3 pr-3 text-right text-fg-soft">{run.employees}</td>
                    <td className="py-3 pr-3 text-right text-fg-soft">{run.gross}</td>
                    <td className="py-3 pr-3 text-right text-fg-soft">{run.deductions}</td>
                    <td className="py-3 pr-3 text-right font-medium text-fg">{run.netPay}</td>
                    <td className="py-3 pr-3">
                      <StatusPill tone={statusTone[run.status]}>{run.status}</StatusPill>
                    </td>
                    <td className="py-3 pr-3 text-fg-soft">{run.payDate}</td>
                    <td className="py-3 text-right">
                      <Menu
                        align="right"
                        widthClass="w-48"
                        trigger={
                          <button
                            type="button"
                            aria-label={`Actions for ${run.id}`}
                            className="text-muted hover:text-bronze transition"
                          >
                            <MoreVertical size={16} />
                          </button>
                        }
                      >
                        <MenuItem icon={Eye}>View Workings</MenuItem>
                        <MenuItem icon={FileDown}>Download Payslips</MenuItem>
                        <MenuItem icon={RefreshCw}>Reprocess</MenuItem>
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
            Showing 1 to {filtered.length} of {filtered.length} runs
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
            <span className="text-muted">10 / page</span>
          </div>
        </div>
      </Card>

      <RunPayrollModal open={runOpen} onClose={() => setRunOpen(false)} />
    </div>
  );
}
