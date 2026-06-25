"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
  Clock,
  CircleCheck,
  Eye,
  Link2,
  FileDown,
  Pencil,
  Trash2,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import Card from "@/components/ui/Card";
import CardSelect from "@/components/ui/CardSelect";
import Modal from "@/components/ui/Modal";
import { Menu, MenuItem, MenuLabel, MenuDivider } from "@/components/ui/Menu";

import RecordPaymentModal from "@/components/dashboard/payments/RecordPaymentModal";

import {
  paymentTabs,
  type Payment,
  type PaymentStatus,
  type PaymentDirection,
  type PaymentMethod,
} from "@/data/payments";
import { useCollection } from "@/lib/store/dataStore";
import { exportCsv } from "@/lib/exportCsv";
import UploadButton from "@/components/ui/UploadButton";

const paymentStatuses: PaymentStatus[] = ["Completed", "Pending", "Failed", "Scheduled"];
const paymentMethods: PaymentMethod[] = ["Bank Transfer", "UPI", "Cheque", "Card", "Cash"];

function buildImportedPayment(row: Record<string, string>): Payment | null {
  const party = (row["Party"] ?? row["party"] ?? "").trim();
  const id =
    row["Payment ID"]?.trim() ||
    `PMT-2026-${Math.floor(100 + Math.random() * 900)}`;
  if (!party && !row["Payment ID"]?.trim()) return null;
  const rawDirection = (row["Direction"] ?? "").trim();
  const direction: PaymentDirection = rawDirection === "Made" ? "Made" : "Received";
  const rawMethod = (row["Method"] ?? "").trim() as PaymentMethod;
  const method: PaymentMethod = paymentMethods.includes(rawMethod) ? rawMethod : "Bank Transfer";
  const rawStatus = (row["Status"] ?? "").trim() as PaymentStatus;
  const status: PaymentStatus = paymentStatuses.includes(rawStatus) ? rawStatus : "Pending";
  return {
    id,
    date: row["Date"]?.trim() || "—",
    party: party || "—",
    direction,
    method,
    reference: row["Reference"]?.trim() || "—",
    status,
    amount: row["Amount"]?.trim() || "₹0",
  };
}

const statusTone: Record<PaymentStatus, "success" | "warning" | "danger" | "info" | "neutral"> = {
  Completed: "success",
  Pending: "warning",
  Failed: "danger",
  Scheduled: "info",
};

const directionTone: Record<PaymentDirection, "success" | "warning"> = {
  Received: "success",
  Made: "warning",
};

const amountColor: Record<PaymentDirection, string> = {
  Received: "text-success",
  Made: "text-fg",
};

const methodFilterOptions = ["All Methods", "Bank Transfer", "UPI", "Cheque", "Card", "Cash"];

function tabPredicate(tab: string, payment: Payment): boolean {
  switch (tab) {
    case "Received":
      return payment.direction === "Received";
    case "Made":
      return payment.direction === "Made";
    case "Pending":
      return payment.status === "Pending";
    case "Scheduled":
      return payment.status === "Scheduled";
    case "Failed":
      return payment.status === "Failed";
    default:
      return true; // "All"
  }
}

export default function PaymentsScreen() {
  const { items: payments, add, remove, update, setItems } = useCollection<Payment>("payments");
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [method, setMethod] = useState("All Methods");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Payment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);

  const q = query.trim().toLowerCase();
  const filtered = payments.filter((payment) => {
    const matchesQuery =
      !q ||
      payment.id.toLowerCase().includes(q) ||
      payment.party.toLowerCase().includes(q) ||
      payment.method.toLowerCase().includes(q) ||
      payment.reference.toLowerCase().includes(q) ||
      payment.status.toLowerCase().includes(q);
    const matchesMethod = method === "All Methods" || payment.method === method;
    return matchesQuery && matchesMethod && tabPredicate(tab, payment);
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payments"
        description="Track money received and paid, reconcile against invoices and bills, and manage payment methods."
        showStar={false}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download size={16} /> Export
            </Button>
            <UploadButton<Payment>
              label="Import"
              build={buildImportedPayment}
              onImport={(records) => setItems([...records, ...payments])}
            />
            <Button variant="bronze" size="sm" onClick={() => setCreateOpen(true)}>
              <Plus size={16} /> Record Payment
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          icon={ArrowDownToLine}
          label="Received (This Month)"
          value="₹3.4M"
          tone="success"
          trend={{ dir: "up", text: "14% vs last month" }}
        />
        <StatCard
          icon={ArrowUpFromLine}
          label="Paid (This Month)"
          value="₹2.1M"
          tone="warning"
        />
        <StatCard
          icon={Wallet}
          label="Net Cash Flow"
          value="₹1.3M"
          tone="bronze"
          trend={{ dir: "up", text: "8% vs last month" }}
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value="₹240K"
          sublabel="6 payments"
          sublabelTone="muted"
          tone="info"
        />
        <StatCard
          icon={CircleCheck}
          label="Reconciled"
          value="94%"
          sublabel="Of transactions"
          tone="success"
        />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-line">
        {paymentTabs.map((t) => {
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

      {/* Payment workspace */}
      <Card padded={false} className="p-5">
        {/* Controls */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="flex min-w-[16rem] flex-1 items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 lg:max-w-md">
              <Search size={16} className="shrink-0 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search payment, party, method, reference, status…"
                className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
              />
            </div>
            <CardSelect
              options={methodFilterOptions}
              value={method}
              onChange={setMethod}
            />
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-fg-soft hover:bg-bronze-soft/50 transition"
            >
              <Filter size={14} /> Filters
            </button>
          </div>

          <div className="flex items-center gap-3">
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
                  exportCsv<Payment>(
                    "payments.csv",
                    [
                      { key: "id", header: "ID" },
                      { key: "date", header: "Date" },
                      { key: "party", header: "Party" },
                      { key: "direction", header: "Direction" },
                      { key: "method", header: "Method" },
                      { key: "reference", header: "Reference" },
                      { key: "status", header: "Status" },
                      { key: "amount", header: "Amount" },
                    ],
                    filtered
                  )
                }
              >
                Export as CSV
              </MenuItem>
              <MenuItem icon={FileDown}>Export as Excel</MenuItem>
              <MenuDivider />
              <MenuItem icon={Link2}>Reconcile All</MenuItem>
            </Menu>
          </div>
        </div>

        <div className="my-5 h-px bg-line" />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
                <th className="py-2.5 pr-3 font-medium">Payment ID</th>
                <th className="py-2.5 pr-3 font-medium">Date</th>
                <th className="py-2.5 pr-3 font-medium">Party</th>
                <th className="py-2.5 pr-3 font-medium">Direction</th>
                <th className="py-2.5 pr-3 font-medium">Method</th>
                <th className="py-2.5 pr-3 font-medium">Reference</th>
                <th className="py-2.5 pr-3 font-medium">Status</th>
                <th className="py-2.5 pr-3 font-medium text-right">Amount</th>
                <th className="py-2.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-muted">
                    No payments to show here yet.
                  </td>
                </tr>
              ) : (
                filtered.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-line/60 transition hover:bg-bronze-soft/30"
                  >
                    <td className="py-3 pr-3 font-medium text-fg">{payment.id}</td>
                    <td className="py-3 pr-3 text-fg-soft">{payment.date}</td>
                    <td className="py-3 pr-3 text-fg-soft">{payment.party}</td>
                    <td className="py-3 pr-3">
                      <StatusPill tone={directionTone[payment.direction]}>
                        {payment.direction}
                      </StatusPill>
                    </td>
                    <td className="py-3 pr-3 text-fg-soft">{payment.method}</td>
                    <td className="py-3 pr-3 text-fg-soft">{payment.reference}</td>
                    <td className="py-3 pr-3">
                      <StatusPill tone={statusTone[payment.status]}>{payment.status}</StatusPill>
                    </td>
                    <td
                      className={`py-3 pr-3 text-right font-medium ${amountColor[payment.direction]}`}
                    >
                      {payment.amount}
                    </td>
                    <td className="py-3 text-right">
                      <Menu
                        align="right"
                        widthClass="w-48"
                        trigger={
                          <button
                            type="button"
                            aria-label={`Actions for ${payment.id}`}
                            className="text-muted hover:text-bronze transition"
                          >
                            <MoreVertical size={16} />
                          </button>
                        }
                      >
                        <MenuItem icon={Eye}>View</MenuItem>
                        <MenuItem icon={Pencil} onClick={() => setEditTarget(payment)}>
                          Edit
                        </MenuItem>
                        <MenuItem icon={Link2}>Reconcile</MenuItem>
                        <MenuItem icon={FileDown}>Download Receipt</MenuItem>
                        <MenuItem icon={Trash2} danger onClick={() => setDeleteTarget(payment)}>
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
            Showing 1 to {filtered.length} of {filtered.length} payments
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

      <RecordPaymentModal
        key={editTarget ? `edit-${editTarget.id}` : "create"}
        open={createOpen || editTarget !== null}
        editing={editTarget}
        onClose={() => {
          setCreateOpen(false);
          setEditTarget(null);
        }}
        onCreate={(payment) => add(payment)}
        onUpdate={(item, patch) => update(item, patch)}
      />

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete payment?"
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
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-danger px-5 text-sm font-medium text-white shadow-[var(--shadow-xs)] transition hover:opacity-90"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-fg-soft">
          Payment{" "}
          <span className="font-medium text-fg">{deleteTarget?.id}</span> for{" "}
          <span className="font-medium text-fg">{deleteTarget?.party}</span> will be permanently
          removed.
        </p>
      </Modal>
    </div>
  );
}
