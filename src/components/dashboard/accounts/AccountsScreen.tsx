"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Link2,
  MoreVertical,
  BookText,
  Download,
  FileDown,
  Upload,
  Layers,
  Wallet,
  Scale,
  TrendingUp,
  Percent,
  Receipt,
  Pencil,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import AIRailPanel from "@/components/ui/AIRailPanel";
import { Menu, MenuItem } from "@/components/ui/Menu";

import AccountHealthCard from "@/components/dashboard/accounts/AccountHealthCard";
import AccountInsights from "@/components/dashboard/accounts/AccountInsights";
import CreateAccountModal from "@/components/dashboard/accounts/CreateAccountModal";

import {
  accountTree,
  typeChips,
  type Account,
  type AccountType,
} from "@/data/accounts";
import { useCollection } from "@/lib/store/dataStore";
import { exportCsv } from "@/lib/exportCsv";

const typeIcon: Record<AccountType, LucideIcon> = {
  Asset: Wallet,
  Liability: Scale,
  Income: TrendingUp,
  Expense: Receipt,
};

const typeTone: Record<AccountType, "success" | "warning" | "info" | "danger"> = {
  Asset: "success",
  Liability: "warning",
  Income: "info",
  Expense: "danger",
};

function chipPredicate(chip: string, a: Account): boolean {
  switch (chip) {
    case "Assets":
      return a.type === "Asset";
    case "Liabilities":
      return a.type === "Liability";
    case "Income":
      return a.type === "Income";
    case "Expenses":
      return a.type === "Expense";
    case "Banking":
      return a.subtype === "Cash & Cash Equivalents";
    case "Tax":
      return a.name.includes("GST") || a.name.includes("TDS");
    case "Payroll":
      return a.subtype === "Salary Expense";
    case "Inventory":
      return a.subtype === "Inventory";
    default:
      return true; // "All Types"
  }
}

export default function AccountsScreen() {
  const { items: accounts, add, remove } = useCollection<Account>("accounts");
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState("All Types");
  const [group, setGroup] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null);

  function selectChip(c: string) {
    setChip(c);
    setGroup(null);
  }
  function selectGroup(label: string) {
    setGroup((g) => (g === label ? null : label));
    setChip("All Types");
  }

  const q = query.trim().toLowerCase();
  const filtered = accounts.filter((a) => {
    const matchesQuery =
      !q ||
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.subtype.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q);
    const matchesFilter = group ? a.subtype === group : chipPredicate(chip, a);
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Chart of Accounts"
        description="Manage your financial structure, tax mappings, payroll accounts, inventory ledgers and reporting accounts."
        actions={
          <>
            <Button variant="outline" size="sm">
              <BookText size={16} /> Accounts Register
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportCsv<Account>(
                  "chart-of-accounts.csv",
                  [
                    { key: "code", header: "Code" },
                    { key: "name", header: "Name" },
                    { key: "type", header: "Type" },
                    { key: "subtype", header: "Subtype" },
                    { key: "balance", header: "Balance" },
                    { key: "linked", header: "Linked" },
                  ],
                  filtered
                )
              }
            >
              <Download size={16} /> Export Accounts
            </Button>
            <Button variant="outline" size="sm">
              <FileDown size={16} /> Download Template
            </Button>
            <Button variant="outline" size="sm">
              <Upload size={16} /> Upload CSV
            </Button>
            <Button variant="bronze" size="sm" onClick={() => setCreateOpen(true)}>
              <Plus size={16} /> Create Account
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard icon={Layers} label="Total Accounts" value="20" sublabel="Active" tone="bronze" />
        <StatCard icon={Wallet} label="Assets" value="8" sublabel="Well Mapped" tone="success" />
        <StatCard icon={Scale} label="Liabilities" value="7" sublabel="No Issues" tone="warning" />
        <StatCard icon={TrendingUp} label="P&L Accounts" value="5" sublabel="Reporting Ready" tone="info" />
        <StatCard icon={Percent} label="Tax Mapping" value="100%" sublabel="Fully Mapped" tone="success" />
      </div>

      {/* Main + rail */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <Card padded={false} className="xl:col-span-9 p-5">
          {/* Search + chips */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 w-full lg:max-w-xs bg-canvas border border-line rounded-xl px-3 py-2">
              <Search size={16} className="text-muted shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search code, name, type, subtype…"
                className="w-full outline-none bg-transparent text-sm text-fg placeholder:text-muted"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {typeChips.map((c) => {
                const active = !group && chip === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => selectChip(c)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-bronze bg-bronze-soft text-bronze"
                        : "border-line text-fg-soft hover:bg-bronze-soft/50"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-fg-soft hover:bg-bronze-soft/50 transition"
              >
                <Filter size={14} /> Filters
              </button>
            </div>
          </div>

          <div className="my-5 h-px bg-line" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Account structure tree */}
            <div className="lg:col-span-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-fg">Account Structure</h3>
                <PanelLeftClose size={15} className="text-muted" />
              </div>

              <div className="mt-3 space-y-3">
                {accountTree.map((grp) => {
                  const GroupIcon = typeIcon[grp.type];
                  return (
                    <div key={grp.label}>
                      <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                        <GroupIcon size={15} className="text-bronze shrink-0" />
                        <span className="text-sm font-medium text-fg">{grp.label}</span>
                        <span className="ml-auto text-xs text-muted">{grp.count}</span>
                      </div>
                      <div className="ml-3 mt-0.5 border-l border-line pl-2 space-y-0.5">
                        {grp.children.map((child) => {
                          const active = group === child.label;
                          return (
                            <button
                              key={child.label}
                              type="button"
                              onClick={() => selectGroup(child.label)}
                              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition ${
                                active
                                  ? "bg-bronze-soft text-bronze"
                                  : "text-fg-soft hover:bg-bronze-soft/50"
                              }`}
                            >
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                              <span className="text-sm truncate">{child.label}</span>
                              <span className="ml-auto text-xs opacity-70">{child.count}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-line px-3 py-2.5 text-sm font-medium text-fg-soft hover:bg-bronze-soft/50 hover:text-bronze transition"
              >
                <Plus size={15} /> Add Group
              </button>
            </div>

            {/* Accounts table */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-fg">Accounts ({filtered.length})</h3>
                <span className="text-xs text-muted">Sort by: Code (Asc)</span>
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
                      <th className="py-2.5 pr-3 font-medium">Code</th>
                      <th className="py-2.5 pr-3 font-medium">Account Name</th>
                      <th className="py-2.5 pr-3 font-medium">Type</th>
                      <th className="py-2.5 pr-3 font-medium">Subtype</th>
                      <th className="py-2.5 pr-3 font-medium text-right">Balance</th>
                      <th className="py-2.5 pr-3 font-medium">Linked</th>
                      <th className="py-2.5 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-muted">
                          No accounts match your filters.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((a) => (
                        <tr key={a.code} className="border-b border-line/60 hover:bg-bronze-soft/30 transition">
                          <td className="py-3 pr-3 text-fg-soft">{a.code || "—"}</td>
                          <td className="py-3 pr-3">
                            <p className="font-medium text-fg">{a.name}</p>
                            <p className={`text-xs ${a.note === "Default account" ? "text-muted" : "text-bronze"}`}>
                              {a.note}
                            </p>
                          </td>
                          <td className="py-3 pr-3">
                            <StatusPill tone={typeTone[a.type]}>{a.type}</StatusPill>
                          </td>
                          <td className="py-3 pr-3 text-fg-soft">{a.subtype}</td>
                          <td className="py-3 pr-3 text-right font-medium text-fg">{a.balance}</td>
                          <td className="py-3 pr-3">
                            <span className="inline-flex items-center gap-1 text-fg-soft">
                              <Link2 size={14} className="text-muted" />
                              {a.linked}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <Menu
                              align="right"
                              widthClass="w-40"
                              trigger={
                                <button
                                  type="button"
                                  aria-label={`Actions for ${a.name}`}
                                  className="text-muted hover:text-bronze transition"
                                >
                                  <MoreVertical size={16} />
                                </button>
                              }
                            >
                              <MenuItem icon={Pencil}>Edit</MenuItem>
                              <MenuItem icon={Copy}>Duplicate</MenuItem>
                              <MenuItem icon={Trash2} danger onClick={() => setDeleteTarget(a)}>
                                Delete
                              </MenuItem>
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
                  Showing 1 to {filtered.length} of {filtered.length} accounts
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <button className="h-8 w-8 rounded-lg border border-line text-muted hover:bg-bronze-soft/50 flex items-center justify-center" aria-label="Previous page">
                      <ChevronLeft size={15} />
                    </button>
                    <button className="h-8 w-8 rounded-lg bg-bronze-soft text-bronze font-medium flex items-center justify-center">1</button>
                    <button className="h-8 w-8 rounded-lg border border-line text-fg-soft hover:bg-bronze-soft/50 flex items-center justify-center">2</button>
                    <button className="h-8 w-8 rounded-lg border border-line text-muted hover:bg-bronze-soft/50 flex items-center justify-center" aria-label="Next page">
                      <ChevronRight size={15} />
                    </button>
                  </div>
                  <span className="text-muted">Rows per page 25</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Right rail */}
        <div className="xl:col-span-3 space-y-6">
          <AccountHealthCard />
          <AccountInsights />
          <AIRailPanel
            title="AI Assistant"
            greeting="Ask anything about your accounts"
            prompts={[
              "Explain Accounts Receivable",
              "Why is GST Output increasing?",
              "Suggest missing ledgers",
              "Create account structure",
            ]}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateAccountModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(account) => add(account)}
      />

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete account?"
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
          <span className="font-semibold text-fg">{deleteTarget?.name}</span> (code{" "}
          {deleteTarget?.code})? Linked records may be affected.
        </p>
      </Modal>
    </div>
  );
}
