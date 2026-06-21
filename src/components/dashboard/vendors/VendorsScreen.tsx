"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Users,
  BadgeCheck,
  Receipt,
  Boxes,
  TrendingUp,
  MoreVertical,
  Eye,
  Pencil,
  Wallet,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Star,
  Send,
  FilePlus2,
  Upload as UploadIcon,
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

import CreateVendorModal from "@/components/dashboard/vendors/CreateVendorModal";

import {
  vendors,
  vendorTabs,
  topVendors,
  type Vendor,
  type VendorStatus,
} from "@/data/vendors";

const statusTone: Record<VendorStatus, "success" | "neutral" | "danger"> = {
  Active: "success",
  Inactive: "neutral",
  Overdue: "danger",
};

function tabPredicate(tab: string, v: Vendor): boolean {
  switch (tab) {
    case "Preferred":
      return v.preferred;
    case "New":
      return v.isNew;
    case "Overdue Payables":
      return v.status === "Overdue";
    case "Inactive":
      return v.status === "Inactive";
    default:
      return true; // "All Vendors"
  }
}

type Check = { tone: "success" | "warning"; text: string };

const healthChecks: Check[] = [
  { tone: "success", text: "On-time payment rate high" },
  { tone: "success", text: "Strong preferred vendor coverage" },
  { tone: "warning", text: "1 vendor inactive" },
  { tone: "warning", text: "12 vendors with open payables" },
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
  { icon: Send, label: "Send Payment Advice" },
  { icon: FilePlus2, label: "Create Bill" },
  { icon: Wallet, label: "Record Payment" },
  { icon: Sparkles, label: "Vendor Analysis (AI)" },
  { icon: UploadIcon, label: "Import Vendors" },
];

export default function VendorsScreen() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All Vendors");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Vendor | null>(null);

  const q = query.trim().toLowerCase();
  const filtered = vendors.filter((v) => {
    const matchesQuery =
      !q ||
      v.name.toLowerCase().includes(q) ||
      v.contactName.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      v.gstin.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q);
    return matchesQuery && tabPredicate(tab, v);
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Vendors"
        description="Manage vendor master data, GST details, payable context, purchase commitments, and ledgers."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download size={16} /> Download Template
            </Button>
            <Button variant="outline" size="sm">
              <Upload size={16} /> Upload CSV
            </Button>
            <Button variant="bronze" size="sm" onClick={() => setCreateOpen(true)}>
              <Plus size={16} /> Create Vendor
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          icon={Users}
          label="Total Vendors"
          value="86"
          sublabel="Active Vendors"
          tone="info"
          trend={{ dir: "up", text: "6 vs last month" }}
        />
        <StatCard
          icon={BadgeCheck}
          label="GST Registered"
          value="64"
          sublabel="74% of total"
          tone="success"
        />
        <StatCard
          icon={Receipt}
          label="Outstanding Payables"
          value="₹1.4M"
          sublabel="12 vendors"
          tone="warning"
        />
        <StatCard
          icon={Boxes}
          label="Categories"
          value="8"
          sublabel="Across spend"
          tone="bronze"
        />
        <StatCard
          icon={TrendingUp}
          label="Lifetime Spend"
          value="₹9.2M"
          sublabel="From 86 vendors"
          tone="success"
          trend={{ dir: "up", text: "11.2% vs last month" }}
        />
      </div>

      {/* Top vendors */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <Card className="xl:col-span-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-fg">Top Vendors by Spend</h2>
          </div>
          <ul className="mt-4 flex-1 space-y-3">
            {topVendors.map((v) => (
              <li key={v.rank} className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    v.rank === 1 ? "bg-bronze text-on-bronze" : "bg-bronze-soft text-bronze"
                  }`}
                >
                  {v.rank}
                </span>
                <div className="min-w-0 flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-fg">{v.name}</p>
                  {v.preferred && <StatusPill tone="neutral">Preferred</StatusPill>}
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm font-semibold text-fg">{v.spend}</p>
                  <p className="text-xs text-muted">{v.pct}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-bronze hover:opacity-80 transition"
          >
            View all top vendors <ArrowRight size={14} />
          </button>
        </Card>

        <Card className="xl:col-span-8 flex flex-col">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-bronze" />
            <h2 className="text-base font-semibold text-fg">AI Insights</h2>
          </div>
          <div className="mt-4 grid flex-1 grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 rounded-xl border border-line p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success-soft text-success">
                <CheckCircle2 size={16} />
              </span>
              <p className="text-sm text-fg-soft">
                Sharma Supplies accounts for 26% of total purchase spend.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-line p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning-soft text-warning">
                <AlertTriangle size={16} />
              </span>
              <p className="text-sm text-fg-soft">
                1 vendor has payables overdue more than 30 days.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-line p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-info-soft text-info">
                <Users size={16} />
              </span>
              <p className="text-sm text-fg-soft">
                2 vendors have not been billed in the last 60 days.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-line p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bronze-soft text-bronze">
                <Sparkles size={16} />
              </span>
              <p className="text-sm text-fg-soft">
                Consolidating logistics could save an estimated 8% on spend.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Directory + right rail */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <Card padded={false} className="xl:col-span-9 p-5">
          {/* Tab bar */}
          <div className="flex flex-wrap items-center gap-2">
            {vendorTabs.map((t) => {
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
                placeholder="Search name, contact, email, GSTIN, city…"
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
            Vendor Directory ({filtered.length})
          </h3>

          {/* Table */}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
                  <th className="py-2.5 pr-3 font-medium">Vendor</th>
                  <th className="py-2.5 pr-3 font-medium">Contact</th>
                  <th className="py-2.5 pr-3 font-medium">Spend</th>
                  <th className="py-2.5 pr-3 font-medium">Payable</th>
                  <th className="py-2.5 pr-3 font-medium">Status</th>
                  <th className="py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-muted">
                      No vendors match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((v) => {
                    const paid = v.payable === "₹0";
                    return (
                      <tr
                        key={v.name}
                        className="border-b border-line/60 hover:bg-bronze-soft/30 transition"
                      >
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bronze-soft text-xs font-semibold text-bronze">
                              {v.initials}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate font-medium text-fg">{v.name}</p>
                                {v.preferred && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-bronze-soft px-2 py-0.5 text-[11px] font-medium text-bronze">
                                    <Star size={11} className="fill-bronze" /> Preferred
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted">GSTIN: {v.gstin}</p>
                              <p className="text-xs text-muted">{v.city}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-3">
                          <p className="font-medium text-fg">{v.contactName}</p>
                          <p className="text-xs text-muted">{v.email}</p>
                          <p className="text-xs text-muted">{v.phone}</p>
                        </td>
                        <td className="py-3 pr-3">
                          <p className="font-medium text-fg">{v.spend}</p>
                          <p className="text-xs text-muted">{v.spendPct}</p>
                        </td>
                        <td className="py-3 pr-3">
                          <p
                            className={`font-medium ${paid ? "text-muted" : "text-danger"}`}
                          >
                            {paid ? "Paid" : v.payable}
                          </p>
                          <p className="text-xs text-muted">{v.payableNote}</p>
                        </td>
                        <td className="py-3 pr-3">
                          <StatusPill tone={statusTone[v.status]}>{v.status}</StatusPill>
                        </td>
                        <td className="py-3 text-right">
                          <Menu
                            align="right"
                            widthClass="w-44"
                            trigger={
                              <button
                                type="button"
                                aria-label={`Actions for ${v.name}`}
                                className="text-muted hover:text-bronze transition"
                              >
                                <MoreVertical size={16} />
                              </button>
                            }
                          >
                            <MenuItem icon={Eye}>View</MenuItem>
                            <MenuItem icon={Pencil}>Edit</MenuItem>
                            <MenuItem icon={Wallet}>Record Payment</MenuItem>
                            <MenuItem icon={Trash2} danger onClick={() => setDeleteTarget(v)}>
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
              Showing 1 to {filtered.length} of {filtered.length} vendors
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
          {/* Vendor Health */}
          <Card>
            <h2 className="text-base font-semibold text-fg">Vendor Health</h2>
            <div className="mt-4 flex justify-center">
              <HealthGauge score={88} label="Strong" />
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
            title="Need help with vendors?"
            greeting="Ask AI Copilot"
            prompts={[
              "Show top vendors by spend",
              "Who has overdue payables?",
              "Draft a payment advice",
              "Vendor spend trends",
            ]}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateVendorModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete vendor?"
        description="This action cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="h-11 px-5 rounded-xl bg-danger text-white text-sm font-medium hover:opacity-90 transition"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-fg-soft">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-fg">{deleteTarget?.name}</span>? Their bills and
          ledger history will no longer be accessible.
        </p>
      </Modal>
    </div>
  );
}
