"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  TrendingUp,
  FileText,
  ClipboardList,
  RotateCcw,
  CircleCheck,
  Sparkles,
  Bell,
  Eye,
  FileDown,
  Send,
  Trash2,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Info,
  FilePlus2,
  Repeat,
  PackageCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import Card from "@/components/ui/Card";
import CardSelect from "@/components/ui/CardSelect";
import Modal from "@/components/ui/Modal";
import { Menu, MenuItem, MenuLabel, MenuDivider } from "@/components/ui/Menu";

import RevenueTrendChart from "@/components/dashboard/sales/RevenueTrendChart";
import ReceivablesAgingDonut from "@/components/dashboard/sales/ReceivablesAgingDonut";
import InvoicePipeline from "@/components/dashboard/sales/InvoicePipeline";
import CreateInvoiceModal from "@/components/dashboard/sales/CreateInvoiceModal";

import {
  docTabs,
  topCustomersBySales,
  type Invoice,
  type InvoiceStatus,
} from "@/data/salesDocuments";
import { useCollection } from "@/lib/store/dataStore";
import { exportCsv } from "@/lib/exportCsv";

const statusTone: Record<InvoiceStatus, "success" | "warning" | "danger" | "info" | "neutral"> = {
  Sent: "info",
  Viewed: "warning",
  Paid: "success",
  Overdue: "danger",
  Recurring: "neutral",
};

function tabPredicate(tab: string, inv: Invoice): boolean {
  switch (tab) {
    case "Tax Invoices":
      return inv.status !== "Recurring";
    case "Recurring Invoices":
      return inv.status === "Recurring";
    case "Overdue":
      return inv.status === "Overdue";
    case "Sales Return":
    case "Pro Forma Invoices":
    case "Order Book":
    case "Drafts":
      return false;
    default:
      return true; // "All"
  }
}

type Insight = { tone: "success" | "warning" | "info" | "bronze"; text: string };

const insights: Insight[] = [
  { tone: "success", text: "Revenue grew 18% this month compared to last month." },
  { tone: "warning", text: "4 invoices are overdue for more than 30 days." },
  { tone: "info", text: "ABC Pvt Ltd contributes 32% of total revenue." },
  { tone: "bronze", text: "Recurring invoices account for 28% of total revenue." },
];

const insightIcon: Record<Insight["tone"], LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
  bronze: Sparkles,
};

const insightChip: Record<Insight["tone"], string> = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  bronze: "bg-bronze-soft text-bronze",
};

const miniStats: { value: string; label: string; sub?: string }[] = [
  { value: "152", label: "Total Invoices" },
  { value: "42", label: "Recurring", sub: "28% of total" },
  { value: "110", label: "Direct", sub: "72% of total" },
  { value: "23", label: "Converted from Orders", sub: "15% of total" },
  { value: "₹2.1M", label: "Net Receivable" },
  { value: "₹2.1M", label: "Open Tax Invoice" },
];

const getStarted: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: FilePlus2, title: "Create Invoice", description: "Generate GST invoices in seconds." },
  { icon: Repeat, title: "Set Recurring", description: "Automate recurring billing and reminders." },
  { icon: PackageCheck, title: "Track Orders", description: "Convert orders to invoices seamlessly." },
  { icon: Send, title: "Send & Collect", description: "Send invoices and track payments." },
];

export default function SalesScreen() {
  const { items: invoices, add, remove } = useCollection<Invoice>("invoices");
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);

  const q = query.trim().toLowerCase();
  const filtered = invoices.filter((inv) => {
    const matchesQuery =
      !q ||
      inv.number.toLowerCase().includes(q) ||
      inv.customer.toLowerCase().includes(q) ||
      inv.source.toLowerCase().includes(q) ||
      inv.status.toLowerCase().includes(q);
    return matchesQuery && tabPredicate(tab, inv);
  });

  const allSelected = filtered.length > 0 && filtered.every((inv) => selected.has(inv.number));

  function toggleOne(number: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(number)) next.delete(number);
      else next.add(number);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        filtered.forEach((inv) => next.delete(inv.number));
      } else {
        filtered.forEach((inv) => next.add(inv.number));
      }
      return next;
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sales Documents"
        description="Tax invoices, recurring templates, sales returns, pro forma invoices, and order book in one workspace."
        showStar={false}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download size={16} /> Download Template
            </Button>
            <Button variant="outline" size="sm">
              <Upload size={16} /> Upload CSV
            </Button>
            <Menu
              align="right"
              widthClass="w-52"
              trigger={
                <Button variant="bronze" size="sm">
                  <Plus size={16} /> Create Tax Invoice <ChevronDown size={16} />
                </Button>
              }
            >
              <MenuItem icon={FileText} onClick={() => setCreateOpen(true)}>
                Create Tax Invoice
              </MenuItem>
              <MenuItem icon={Repeat}>Create Recurring</MenuItem>
              <MenuItem icon={FileText}>Create Pro Forma</MenuItem>
              <MenuItem icon={ClipboardList}>Create Order</MenuItem>
            </Menu>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          icon={TrendingUp}
          label="Revenue (This FY)"
          value="₹15.4M"
          tone="bronze"
          trend={{ dir: "up", text: "18% vs last month" }}
        />
        <StatCard
          icon={FileText}
          label="Open Invoices"
          value="₹2.1M"
          sublabel="18 customers"
          tone="warning"
        />
        <StatCard
          icon={ClipboardList}
          label="Open Orders"
          value="₹850K"
          sublabel="23 orders"
          tone="info"
        />
        <StatCard
          icon={RotateCcw}
          label="Returns (This Month)"
          value="₹42K"
          tone="danger"
          trend={{ dir: "up", text: "6% vs last month" }}
        />
        <StatCard
          icon={CircleCheck}
          label="Collection Rate"
          value="92%"
          sublabel="Excellent"
          tone="success"
        />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-line">
        {docTabs.map((t) => {
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

      {/* Revenue trend + AI insights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RevenueTrendChart />

        <Card className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-bronze" />
              <h2 className="text-base font-semibold text-fg">AI Insights</h2>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-bronze hover:opacity-80 transition"
            >
              View all
            </button>
          </div>
          <div className="mt-4 grid flex-1 grid-cols-1 sm:grid-cols-2 gap-3">
            {insights.map((ins) => {
              const Icon = insightIcon[ins.tone];
              return (
                <div
                  key={ins.text}
                  className="flex items-start gap-3 rounded-xl border border-line p-3"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${insightChip[ins.tone]}`}
                  >
                    <Icon size={16} />
                  </span>
                  <p className="text-sm text-fg-soft">{ins.text}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Aging + pipeline + top customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReceivablesAgingDonut />
        <InvoicePipeline />

        <Card className="flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-fg">Top Customers by Revenue</h2>
            <button
              type="button"
              className="text-sm font-medium text-bronze hover:opacity-80 transition"
            >
              View all
            </button>
          </div>
          <ul className="mt-4 flex-1 space-y-3">
            {topCustomersBySales.map((c) => (
              <li key={c.rank} className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    c.rank === 1 ? "bg-bronze text-on-bronze" : "bg-bronze-soft text-bronze"
                  }`}
                >
                  {c.rank}
                </span>
                <p className="min-w-0 truncate text-sm font-medium text-fg">{c.name}</p>
                <div className="ml-auto text-right">
                  <p className="text-sm font-semibold text-fg">{c.revenue}</p>
                  <p className="text-xs text-muted">{c.pct}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Quick action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)}>
          <Plus size={16} /> Create Invoice
        </Button>
        <Button variant="outline" size="sm">
          <Plus size={16} /> Create Order
        </Button>
        <Button variant="outline" size="sm">
          <Plus size={16} /> Create Recurring
        </Button>
        <Button variant="outline" size="sm">
          <RotateCcw size={16} /> Record Return
        </Button>
        <Button variant="outline" size="sm">
          <Bell size={16} /> Send Reminder
        </Button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-bronze-soft px-3 text-sm font-medium text-bronze shadow-[var(--shadow-xs)] hover:opacity-90 transition"
        >
          <Sparkles size={16} /> AI Revenue Report
        </button>
      </div>

      {/* Invoice workspace */}
      <Card padded={false} className="p-5">
        {/* Controls */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <CardSelect options={["All Sources", "Direct", "Recurring", "Order"]} />
            <div className="flex min-w-[16rem] flex-1 items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 lg:max-w-md">
              <Search size={16} className="shrink-0 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search invoice, customer, date, status…"
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

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">{selected.size} selected</span>
            <Button variant="outline" size="sm" disabled={selected.size === 0}>
              <Printer size={16} /> Print Selected
            </Button>
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
              <MenuLabel>Export</MenuLabel>
              <MenuItem
                icon={FileDown}
                onClick={() =>
                  exportCsv<Invoice>(
                    "invoices.csv",
                    [
                      { key: "number", header: "Number" },
                      { key: "date", header: "Date" },
                      { key: "due", header: "Due" },
                      { key: "customer", header: "Customer" },
                      { key: "source", header: "Source" },
                      { key: "status", header: "Status" },
                      { key: "grandTotal", header: "Grand Total" },
                      { key: "netReceivable", header: "Net Receivable" },
                      { key: "open", header: "Open" },
                    ],
                    filtered
                  )
                }
              >
                Export as CSV
              </MenuItem>
              <MenuItem icon={FileDown}>Export as Excel</MenuItem>
              <MenuDivider />
              <MenuItem icon={Printer}>Print All</MenuItem>
            </Menu>
          </div>
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
                <th className="py-2.5 pr-3 font-medium">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all invoices"
                    className="h-4 w-4 cursor-pointer accent-bronze align-middle"
                  />
                </th>
                <th className="py-2.5 pr-3 font-medium">Invoice Number</th>
                <th className="py-2.5 pr-3 font-medium">Invoice Date</th>
                <th className="py-2.5 pr-3 font-medium">Due Date</th>
                <th className="py-2.5 pr-3 font-medium">Customer</th>
                <th className="py-2.5 pr-3 font-medium">Associated Source</th>
                <th className="py-2.5 pr-3 font-medium">Status</th>
                <th className="py-2.5 pr-3 font-medium text-right">Grand Total</th>
                <th className="py-2.5 pr-3 font-medium text-right">Net Receivable</th>
                <th className="py-2.5 pr-3 font-medium text-right">Open</th>
                <th className="py-2.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-muted">
                    No documents to show here yet.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const isSelected = selected.has(inv.number);
                  return (
                    <tr
                      key={inv.number}
                      className={`border-b border-line/60 transition ${
                        isSelected ? "bg-bronze-soft/30" : "hover:bg-bronze-soft/30"
                      }`}
                    >
                      <td className="py-3 pr-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(inv.number)}
                          aria-label={`Select ${inv.number}`}
                          className="h-4 w-4 cursor-pointer accent-bronze align-middle"
                        />
                      </td>
                      <td className="py-3 pr-3 font-medium text-fg">{inv.number}</td>
                      <td className="py-3 pr-3 text-fg-soft">{inv.date}</td>
                      <td className="py-3 pr-3 text-fg-soft">{inv.due}</td>
                      <td className="py-3 pr-3 text-fg-soft">{inv.customer}</td>
                      <td className="py-3 pr-3 text-fg-soft">{inv.source}</td>
                      <td className="py-3 pr-3">
                        <StatusPill tone={statusTone[inv.status]}>{inv.status}</StatusPill>
                      </td>
                      <td className="py-3 pr-3 text-right font-medium text-fg">{inv.grandTotal}</td>
                      <td className="py-3 pr-3 text-right text-fg-soft">{inv.netReceivable}</td>
                      <td className="py-3 pr-3 text-right text-fg-soft">{inv.open}</td>
                      <td className="py-3 text-right">
                        <Menu
                          align="right"
                          widthClass="w-44"
                          trigger={
                            <button
                              type="button"
                              aria-label={`Actions for ${inv.number}`}
                              className="text-muted hover:text-bronze transition"
                            >
                              <MoreVertical size={16} />
                            </button>
                          }
                        >
                          <MenuItem icon={Eye}>View</MenuItem>
                          <MenuItem icon={FileDown}>Download PDF</MenuItem>
                          <MenuItem icon={Bell}>Send Reminder</MenuItem>
                          <MenuItem icon={Trash2} danger onClick={() => setDeleteTarget(inv)}>
                            Delete
                          </MenuItem>
                        </Menu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
          <span className="text-muted">
            Showing 1 to {filtered.length} of {filtered.length} invoices
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
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-fg-soft hover:bg-bronze-soft/50">
                2
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

      {/* Get started */}
      <Card>
        <h2 className="text-lg font-semibold text-fg">
          Create. Send. Get Paid. All in one place.
        </h2>
        <p className="mt-1 text-sm text-muted">
          Manage your entire sales cycle from one intelligent workspace.
        </p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
          {getStarted.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.title}
                className="flex flex-col items-start gap-3 rounded-2xl border border-line p-5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-bronze-soft text-bronze">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-semibold text-fg">{g.title}</p>
                  <p className="mt-1 text-sm text-muted">{g.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <CreateInvoiceModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(invoice) => add(invoice)}
      />

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete invoice?"
        description="This action cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <button
              type="button"
              onClick={() => {
                if (deleteTarget) remove(deleteTarget);
                setDeleteTarget(null);
              }}
              className="h-11 px-5 rounded-xl bg-danger text-white text-sm font-medium hover:opacity-90 transition"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-fg-soft">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-fg">{deleteTarget?.number}</span>? This invoice will
          no longer be accessible.
        </p>
      </Modal>
    </div>
  );
}
