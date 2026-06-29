"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  Users,
  BadgeCheck,
  Receipt,
  Globe,
  TrendingUp,
  MoreVertical,
  Eye,
  Pencil,
  FileText,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Send,
  FilePlus2,
  Wallet,
  Upload as UploadIcon,
  FileDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import AIRailPanel from "@/components/ui/AIRailPanel";
import HealthGauge from "@/components/ui/HealthGauge";
import { Menu, MenuItem } from "@/components/ui/Menu";

import RevenueContributionDonut from "@/components/dashboard/customers/RevenueContributionDonut";
import CreateCustomerModal from "@/components/dashboard/customers/CreateCustomerModal";

import {
  customerTabs,
  topCustomers,
  type Customer,
  type CustomerStatus,
} from "@/data/customers";
import { downloadCsvTemplate } from "@/lib/exportCsv";
import { consumeCreate } from "@/lib/quickAction";
import UploadButton from "@/components/ui/UploadButton";
import DetailModal from "@/components/ui/DetailModal";
import { useToast } from "@/components/ui/Toast";

const customerCsvHeaders = [
  "Name", "GSTIN", "City", "Contact Name", "Email", "Phone", "Revenue", "Outstanding", "Status",
];

function customerInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[1][0]).toUpperCase();
}

function buildImportedCustomer(row: Record<string, string>): Customer | null {
  const name = (row["Name"] ?? row["name"] ?? "").trim();
  if (!name) return null;
  const rawStatus = (row["Status"] ?? "").trim();
  const status: CustomerStatus =
    rawStatus === "Inactive" || rawStatus === "Overdue" ? rawStatus : "Active";
  return {
    name,
    initials: customerInitials(name),
    vip: false,
    gstin: row["GSTIN"]?.trim() || "—",
    city: row["City"]?.trim() || "—",
    contactName: row["Contact Name"]?.trim() || row["Contact"]?.trim() || "—",
    email: row["Email"]?.trim() || "—",
    phone: row["Phone"]?.trim() || "—",
    revenue: row["Revenue"]?.trim() || "₹0",
    revenuePct: "0% of total",
    outstanding: row["Outstanding"]?.trim() || "₹0",
    outstandingNote: "Imported",
    status,
    isNew: true,
  };
}

const statusTone: Record<CustomerStatus, "success" | "neutral" | "danger"> = {
  Active: "success",
  Inactive: "neutral",
  Overdue: "danger",
};

function tabPredicate(tab: string, c: Customer): boolean {
  switch (tab) {
    case "VIP Customers":
      return c.vip;
    case "New Customers":
      return c.isNew;
    case "Overdue Payments":
      return c.status === "Overdue";
    case "Inactive Customers":
      return c.status === "Inactive";
    default:
      return true; // "All Customers"
  }
}

type Insight = { tone: "success" | "warning" | "info"; text: string };

const insights: Insight[] = [
  { tone: "success", text: "ABC Pvt Ltd purchases 25% more than average." },
  { tone: "warning", text: "2 customers have overdue invoices > 30 days." },
  { tone: "info", text: "3 customers have not placed any orders in the last 60 days." },
];

const insightIcon: Record<Insight["tone"], LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

const insightChip: Record<Insight["tone"], string> = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
};

type Check = { tone: "success" | "warning"; text: string };

const healthChecks: Check[] = [
  { tone: "success", text: "Low overdue rate" },
  { tone: "success", text: "High customer retention" },
  { tone: "warning", text: "5 customers inactive" },
  { tone: "warning", text: "2 customers overdue > 30 days" },
];

const checkIcon: Record<Check["tone"], LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
};

const checkColor: Record<Check["tone"], string> = {
  success: "text-success",
  warning: "text-warning",
};

const quickActions: { icon: LucideIcon; label: string }[] = [
  { icon: Send, label: "Send Statement" },
  { icon: FilePlus2, label: "Create Invoice" },
  { icon: Wallet, label: "Record Payment" },
  { icon: Sparkles, label: "Customer Analysis (AI)" },
  { icon: UploadIcon, label: "Import Customers" },
];

const getStarted: {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  variant: "bronze" | "outline";
  action: "create" | "none";
}[] = [
  {
    icon: Plus,
    title: "Create New Customer",
    description: "Add customer details manually in seconds.",
    cta: "Create Customer",
    variant: "bronze",
    action: "create",
  },
  {
    icon: UploadIcon,
    title: "Import from CSV",
    description: "Bulk import customers using a CSV file.",
    cta: "Import CSV",
    variant: "outline",
    action: "none",
  },
  {
    icon: FileDown,
    title: "Download Template",
    description: "Download our template and upload.",
    cta: "Download Template",
    variant: "outline",
    action: "none",
  },
];

type ApiCustomer = {
  id: number;
  name: string;
  initials: string | null;
  vip: boolean;
  gstin: string | null;
  city: string | null;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  revenue: string | null;
  revenuePct: string | null;
  outstanding: string | null;
  outstandingNote: string | null;
  status: string | null;
  isNew: boolean;
};

function mapApiCustomer(customer: ApiCustomer): Customer {
  return {
    name: customer.name,
    initials: customer.initials || customer.name.slice(0, 2).toUpperCase(),
    vip: customer.vip,
    gstin: customer.gstin || "—",
    city: customer.city || "—",
    contactName: customer.contactName || "—",
    email: customer.email || "—",
    phone: customer.phone || "—",
    revenue: customer.revenue || "₹0",
    revenuePct: customer.revenuePct || "0% of total",
    outstanding: customer.outstanding || "₹0",
    outstandingNote: customer.outstandingNote || "No invoices",
    status: (customer.status as CustomerStatus) || "Active",
    isNew: customer.isNew,
  };
}

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All Customers");
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(() => consumeCreate("customers"));
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [viewTarget, setViewTarget] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await fetch("/api/customers");
        if (!response.ok) {
          throw new Error("Failed to load customers");
        }
        const data = (await response.json()) as ApiCustomer[];
        setCustomers(data.map(mapApiCustomer));
      } catch {
        setCustomers([]);
      }
    }

    void loadCustomers();
  }, []);

  async function addCustomer(customer: Customer) {
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });

      if (!response.ok) {
        throw new Error("Failed to create customer");
      }

      const created = (await response.json()) as ApiCustomer;
      setCustomers((current) => [mapApiCustomer(created), ...current]);
      toast("Customer created successfully.");
    } catch {
      toast("Unable to create customer right now.");
    }
  }

  async function updateCustomer(item: Customer, patch: Partial<Customer>) {
    const updated = { ...item, ...patch };
    setCustomers((current) => current.map((entry) => (entry.name === item.name ? updated : entry)));
    toast("Customer updated.");
  }

  function removeCustomer(item: Customer) {
    setCustomers((current) => current.filter((entry) => entry.name !== item.name));
    toast("Customer removed from the current view.");
  }

  const q = query.trim().toLowerCase();
  const filtered = customers.filter((c) => {
    const matchesQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.contactName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.gstin.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q);
    return matchesQuery && tabPredicate(tab, c);
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Customers"
        description="Manage customer master data, GST details, receivable context, transactions, and ledgers."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadCsvTemplate("customers-template.csv", customerCsvHeaders, [
                  "Acme Pvt Ltd", "27ABCDE1234F1Z5", "Mumbai, Maharashtra",
                  "Rajesh Kumar", "rajesh@acme.com", "+91 98765 43210", "₹0", "₹0", "Active",
                ])
              }
            >
              <Download size={16} /> Download Template
            </Button>
            <UploadButton<Customer>
              label="Upload CSV"
              build={buildImportedCustomer}
              onImport={async (records) => {
                const imported = records.filter(Boolean);
                for (const record of imported) {
                  await addCustomer(record);
                }
              }}
            />
            <Button variant="bronze" size="sm" onClick={() => setCreateOpen(true)}>
              <Plus size={16} /> Create Customer
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          icon={Users}
          label="Total Customers"
          value="152"
          sublabel="Active Customers"
          tone="info"
          trend={{ dir: "up", text: "12 vs last month" }}
        />
        <StatCard
          icon={BadgeCheck}
          label="GST Registered"
          value="98"
          sublabel="64% of total"
          tone="success"
          trend={{ dir: "up", text: "8 vs last month" }}
        />
        <StatCard
          icon={Receipt}
          label="Outstanding Receivables"
          value="₹2.1M"
          sublabel="18 customers"
          tone="warning"
          trend={{ dir: "up", text: "5.6% vs last month" }}
        />
        <StatCard
          icon={Globe}
          label="Countries"
          value="5"
          sublabel="India, USA, UAE…"
          tone="bronze"
          trend={{ dir: "up", text: "1 vs last month" }}
        />
        <StatCard
          icon={TrendingUp}
          label="Lifetime Revenue"
          value="₹15.4M"
          sublabel="From 152 customers"
          tone="success"
          trend={{ dir: "up", text: "14.3% vs last month" }}
        />
      </div>

      {/* Top customers + donut + insights */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <Card className="xl:col-span-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-fg">Top Customers by Revenue</h2>
          </div>
          <ul className="mt-4 flex-1 space-y-3">
            {topCustomers.map((c) => (
              <li key={c.rank} className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    c.rank === 1 ? "bg-bronze text-on-bronze" : "bg-bronze-soft text-bronze"
                  }`}
                >
                  {c.rank}
                </span>
                <div className="min-w-0 flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-fg">{c.name}</p>
                  {c.vip && <StatusPill tone="neutral">VIP</StatusPill>}
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm font-semibold text-fg">{c.revenue}</p>
                  <p className="text-xs text-muted">{c.pct}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-bronze hover:opacity-80 transition"
          >
            View all top customers <ArrowRight size={14} />
          </button>
        </Card>

        <div className="xl:col-span-5">
          <RevenueContributionDonut />
        </div>

        <Card className="xl:col-span-3 flex flex-col">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-bronze" />
            <h2 className="text-base font-semibold text-fg">AI Insights</h2>
          </div>
          <ul className="mt-4 flex-1 space-y-3">
            {insights.map((ins) => {
              const Icon = insightIcon[ins.tone];
              return (
                <li
                  key={ins.text}
                  className="flex items-start gap-3 rounded-xl border border-line p-3"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${insightChip[ins.tone]}`}
                  >
                    <Icon size={16} />
                  </span>
                  <p className="text-sm text-fg-soft">{ins.text}</p>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-bronze hover:opacity-80 transition"
          >
            View all insights <ArrowRight size={14} />
          </button>
        </Card>
      </div>

      {/* Directory + right rail */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <Card padded={false} className="xl:col-span-9 p-5">
          {/* Tab bar */}
          <div className="flex flex-wrap items-center gap-2">
            {customerTabs.map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "border-bronze bg-bronze-soft text-bronze"
                      : "border-line text-fg-soft hover:bg-bronze-soft/50"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Search + filters */}
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 lg:max-w-md">
              <Search size={16} className="shrink-0 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, phone, GSTIN, city…"
                className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-fg-soft hover:bg-bronze-soft/50 transition"
              >
                <Filter size={14} /> Filters
              </button>
              <button
                type="button"
                aria-label="Collapse panel"
                className="inline-flex items-center justify-center rounded-lg border border-line px-2 py-1.5 text-muted hover:bg-bronze-soft/50 transition"
              >
                <PanelLeftClose size={16} />
              </button>
            </div>
          </div>

          <div className="my-5 h-px bg-line" />

          <h3 className="text-sm font-semibold text-fg">
            Customer Directory ({filtered.length})
          </h3>

          {/* Table */}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
                  <th className="py-2.5 pr-3 font-medium">Customer</th>
                  <th className="py-2.5 pr-3 font-medium">Contact</th>
                  <th className="py-2.5 pr-3 font-medium">Revenue</th>
                  <th className="py-2.5 pr-3 font-medium">Outstanding</th>
                  <th className="py-2.5 pr-3 font-medium">Status</th>
                  <th className="py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-muted">
                      No customers match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => {
                    const paid = c.outstanding === "₹0";
                    return (
                      <tr
                        key={c.name}
                        className="border-b border-line/60 hover:bg-bronze-soft/30 transition"
                      >
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bronze-soft text-xs font-semibold text-bronze">
                              {c.initials}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate font-medium text-fg">{c.name}</p>
                                {c.vip && <StatusPill tone="neutral">VIP</StatusPill>}
                              </div>
                              <p className="text-xs text-muted">GSTIN: {c.gstin}</p>
                              <p className="text-xs text-muted">{c.city}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-3">
                          <p className="font-medium text-fg">{c.contactName}</p>
                          <p className="text-xs text-muted">{c.email}</p>
                          <p className="text-xs text-muted">{c.phone}</p>
                        </td>
                        <td className="py-3 pr-3">
                          <p className="font-medium text-fg">{c.revenue}</p>
                          <p className="text-xs text-muted">{c.revenuePct}</p>
                        </td>
                        <td className="py-3 pr-3">
                          <p
                            className={`font-medium ${paid ? "text-muted" : "text-danger"}`}
                          >
                            {paid ? "Paid" : c.outstanding}
                          </p>
                          <p className="text-xs text-muted">{c.outstandingNote}</p>
                        </td>
                        <td className="py-3 pr-3">
                          <StatusPill tone={statusTone[c.status]}>{c.status}</StatusPill>
                        </td>
                        <td className="py-3 text-right">
                          <Menu
                            align="right"
                            widthClass="w-44"
                            trigger={
                              <button
                                type="button"
                                aria-label={`Actions for ${c.name}`}
                                className="text-muted hover:text-bronze transition"
                              >
                                <MoreVertical size={16} />
                              </button>
                            }
                          >
                            <MenuItem icon={Eye} onClick={() => setViewTarget(c)}>
                              View
                            </MenuItem>
                            <MenuItem icon={Pencil} onClick={() => setEditTarget(c)}>
                              Edit
                            </MenuItem>
                            <MenuItem
                              icon={FileText}
                              onClick={() => toast(`Statement sent to ${c.name}.`)}
                            >
                              Send Statement
                            </MenuItem>
                            <MenuItem icon={Trash2} danger onClick={() => setDeleteTarget(c)}>
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
              Showing 1 to {filtered.length} of {filtered.length} customers
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
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-fg-soft hover:bg-bronze-soft/50">
                  3
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

        {/* Right rail */}
        <div className="xl:col-span-3 space-y-6">
          {/* Customer Health */}
          <Card>
            <h2 className="text-base font-semibold text-fg">Customer Health</h2>
            <div className="mt-4 flex justify-center">
              <HealthGauge score={92} label="Excellent" />
            </div>
            <ul className="mt-5 space-y-2.5">
              {healthChecks.map((chk) => {
                const Icon = checkIcon[chk.tone];
                return (
                  <li key={chk.text} className="flex items-center gap-2 text-sm text-fg-soft">
                    <Icon size={16} className={`shrink-0 ${checkColor[chk.tone]}`} />
                    {chk.text}
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-bronze hover:opacity-80 transition"
            >
              View Health Report <ArrowRight size={14} />
            </button>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-base font-semibold text-fg">Quick Actions</h2>
            <div className="mt-3 space-y-1">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.label}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-fg-soft hover:bg-bronze-soft hover:text-bronze transition"
                  >
                    <Icon size={16} className="shrink-0" />
                    {a.label}
                  </button>
                );
              })}
            </div>
          </Card>

          <AIRailPanel
            title="Need help with customers?"
            greeting="Ask AI Copilot"
            prompts={[
              "Show top customers",
              "Who has overdue payments?",
              "Draft a payment reminder",
              "Customer revenue trends",
            ]}
          />
        </div>
      </div>

      {/* Get started */}
      <Card>
        <h2 className="text-lg font-semibold text-fg">
          Get started with your customer database
        </h2>
        <p className="mt-1 text-sm text-muted">
          Add customers manually or import from an existing file.
        </p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <Button
                  variant={g.variant}
                  size="sm"
                  className="mt-auto"
                  onClick={g.action === "create" ? () => setCreateOpen(true) : undefined}
                >
                  {g.cta}
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Modals */}
      <DetailModal
        open={viewTarget !== null}
        onClose={() => setViewTarget(null)}
        title={viewTarget?.name ?? "Customer"}
        description="Customer details"
        rows={
          viewTarget
            ? [
                { label: "GSTIN", value: viewTarget.gstin },
                { label: "City", value: viewTarget.city },
                { label: "Contact", value: viewTarget.contactName },
                { label: "Email", value: viewTarget.email },
                { label: "Phone", value: viewTarget.phone },
                { label: "Revenue", value: viewTarget.revenue },
                { label: "Outstanding", value: viewTarget.outstanding },
                { label: "Status", value: viewTarget.status },
              ]
            : []
        }
      />

      <CreateCustomerModal
        key={editTarget ? `edit-${editTarget.name}` : "create"}
        open={createOpen || editTarget !== null}
        editing={editTarget}
        onClose={() => {
          setCreateOpen(false);
          setEditTarget(null);
        }}
        onCreate={(customer) => {
          void addCustomer(customer);
        }}
        onUpdate={(item, patch) => {
          void updateCustomer(item, patch);
        }}
      />

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete customer?"
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
                if (deleteTarget) removeCustomer(deleteTarget);
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
          <span className="font-semibold text-fg">{deleteTarget?.name}</span>? Their
          transactions and ledger history will no longer be accessible.
        </p>
      </Modal>
    </div>
  );
}
