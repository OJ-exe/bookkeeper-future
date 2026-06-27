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
  FileText,
  Receipt,
  AlertTriangle,
  CircleCheck,
  Percent,
  Eye,
  Pencil,
  FileDown,
  Wallet,
  Trash2,
  Printer,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { Menu, MenuItem, MenuLabel, MenuDivider } from "@/components/ui/Menu";

import CreateBillModal from "@/components/dashboard/bills/CreateBillModal";

import { billTabs, type Bill, type BillStatus } from "@/data/bills";
import { useCollection } from "@/lib/store/dataStore";
import { exportCsv, downloadCsvTemplate } from "@/lib/exportCsv";
import { consumeCreate } from "@/lib/quickAction";
import UploadButton from "@/components/ui/UploadButton";
import DetailModal from "@/components/ui/DetailModal";
import { useToast } from "@/components/ui/Toast";

const billCsvHeaders = [
  "Bill Number", "Bill Date", "Due Date", "Vendor", "Source",
  "Status", "Grand Total", "Net Payable", "Open",
];

const billStatuses: BillStatus[] = ["Open", "Paid", "Overdue", "Recurring", "Draft"];

function buildImportedBill(row: Record<string, string>): Bill | null {
  const vendor = (row["Vendor"] ?? row["vendor"] ?? "").trim();
  const number =
    row["Bill Number"]?.trim() ||
    `BILL-2026-${Math.floor(100 + Math.random() * 900)}`;
  if (!vendor && !row["Bill Number"]?.trim()) return null;
  const rawStatus = (row["Status"] ?? "").trim() as BillStatus;
  const status: BillStatus = billStatuses.includes(rawStatus) ? rawStatus : "Open";
  return {
    number,
    date: row["Bill Date"]?.trim() || "—",
    due: row["Due Date"]?.trim() || "—",
    vendor: vendor || "—",
    source: row["Source"]?.trim() || "Direct",
    status,
    grandTotal: row["Grand Total"]?.trim() || "₹0",
    netPayable: row["Net Payable"]?.trim() || "₹0",
    open: row["Open"]?.trim() || "₹0",
  };
}

const statusTone: Record<BillStatus, "success" | "warning" | "danger" | "info" | "neutral"> = {
  Open: "info",
  Paid: "success",
  Overdue: "danger",
  Recurring: "neutral",
  Draft: "warning",
};

function tabPredicate(tab: string, bill: Bill): boolean {
  switch (tab) {
    case "Tax Bills":
      return bill.status !== "Recurring" && bill.status !== "Draft";
    case "Recurring Bills":
      return bill.status === "Recurring";
    case "Overdue":
      return bill.status === "Overdue";
    case "Drafts":
      return bill.status === "Draft";
    case "Purchase Return":
    case "Pro Forma Bills":
      return false;
    default:
      return true; // "All"
  }
}

export default function BillsScreen() {
  const { items: bills, add, remove, update, setItems } = useCollection<Bill>("bills");
  const toast = useToast();
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(() => consumeCreate("bills"));
  const [editTarget, setEditTarget] = useState<Bill | null>(null);
  const [viewTarget, setViewTarget] = useState<Bill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Bill | null>(null);

  const q = query.trim().toLowerCase();
  const filtered = bills.filter((bill) => {
    const matchesQuery =
      !q ||
      bill.number.toLowerCase().includes(q) ||
      bill.vendor.toLowerCase().includes(q) ||
      bill.source.toLowerCase().includes(q) ||
      bill.status.toLowerCase().includes(q);
    return matchesQuery && tabPredicate(tab, bill);
  });

  const allSelected = filtered.length > 0 && filtered.every((bill) => selected.has(bill.number));

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
        filtered.forEach((bill) => next.delete(bill.number));
      } else {
        filtered.forEach((bill) => next.add(bill.number));
      }
      return next;
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Bills"
        description="Tax bills, recurring templates, purchase returns, pro forma bills, and purchase commitments in one workspace."
        showStar={false}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadCsvTemplate("bills-template.csv", billCsvHeaders, [
                  "BILL-2026-045", "15 Jun 2026", "30 Jun 2026", "Sharma Supplies",
                  "Direct", "Open", "₹0", "₹0", "₹0",
                ])
              }
            >
              <Download size={16} /> Download Template
            </Button>
            <UploadButton<Bill>
              label="Upload CSV"
              build={buildImportedBill}
              onImport={(records) => setItems([...records, ...bills])}
            />
            <Button variant="bronze" size="sm" onClick={() => setCreateOpen(true)}>
              <Plus size={16} /> Create Bill
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          icon={FileText}
          label="Total Payable"
          value="₹1.4M"
          tone="bronze"
        />
        <StatCard
          icon={Receipt}
          label="Open Bills"
          value="₹620K"
          sublabel="14 bills"
          tone="warning"
        />
        <StatCard
          icon={AlertTriangle}
          label="Overdue"
          value="₹180K"
          sublabel="4 bills"
          sublabelTone="muted"
          tone="danger"
        />
        <StatCard
          icon={CircleCheck}
          label="Paid This Month"
          value="₹2.1M"
          tone="success"
          trend={{ dir: "up", text: "9% vs last month" }}
        />
        <StatCard
          icon={Percent}
          label="On-time Rate"
          value="88%"
          sublabel="Good"
          tone="success"
        />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-line">
        {billTabs.map((t) => {
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

      {/* Bill workspace */}
      <Card padded={false} className="p-5">
        {/* Controls */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="flex min-w-[16rem] flex-1 items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 lg:max-w-md">
              <Search size={16} className="shrink-0 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bill, vendor, source, status…"
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
            <Button
              variant="outline"
              size="sm"
              disabled={selected.size === 0}
              onClick={() => {
                window.print();
                toast(`Printing ${selected.size} bill(s)…`, "info");
              }}
            >
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
                  exportCsv<Bill>(
                    "bills.csv",
                    [
                      { key: "number", header: "Number" },
                      { key: "date", header: "Date" },
                      { key: "due", header: "Due" },
                      { key: "vendor", header: "Vendor" },
                      { key: "source", header: "Source" },
                      { key: "status", header: "Status" },
                      { key: "grandTotal", header: "Grand Total" },
                      { key: "netPayable", header: "Net Payable" },
                      { key: "open", header: "Open" },
                    ],
                    filtered
                  )
                }
              >
                Export as CSV
              </MenuItem>
              <MenuItem
                icon={FileDown}
                onClick={() => toast("Excel export coming soon.", "info")}
              >
                Export as Excel
              </MenuItem>
              <MenuDivider />
              <MenuItem
                icon={Printer}
                onClick={() => {
                  window.print();
                  toast("Opening print view…", "info");
                }}
              >
                Print All
              </MenuItem>
            </Menu>
          </div>
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
                    aria-label="Select all bills"
                    className="h-4 w-4 cursor-pointer accent-bronze align-middle"
                  />
                </th>
                <th className="py-2.5 pr-3 font-medium">Bill Number</th>
                <th className="py-2.5 pr-3 font-medium">Bill Date</th>
                <th className="py-2.5 pr-3 font-medium">Due Date</th>
                <th className="py-2.5 pr-3 font-medium">Vendor</th>
                <th className="py-2.5 pr-3 font-medium">Source</th>
                <th className="py-2.5 pr-3 font-medium">Status</th>
                <th className="py-2.5 pr-3 font-medium text-right">Grand Total</th>
                <th className="py-2.5 pr-3 font-medium text-right">Net Payable</th>
                <th className="py-2.5 pr-3 font-medium text-right">Open</th>
                <th className="py-2.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-muted">
                    No bills to show here yet.
                  </td>
                </tr>
              ) : (
                filtered.map((bill) => {
                  const isSelected = selected.has(bill.number);
                  return (
                    <tr
                      key={bill.number}
                      className={`border-b border-line/60 transition ${
                        isSelected ? "bg-bronze-soft/30" : "hover:bg-bronze-soft/30"
                      }`}
                    >
                      <td className="py-3 pr-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(bill.number)}
                          aria-label={`Select ${bill.number}`}
                          className="h-4 w-4 cursor-pointer accent-bronze align-middle"
                        />
                      </td>
                      <td className="py-3 pr-3 font-medium text-fg">{bill.number}</td>
                      <td className="py-3 pr-3 text-fg-soft">{bill.date}</td>
                      <td className="py-3 pr-3 text-fg-soft">{bill.due}</td>
                      <td className="py-3 pr-3 text-fg-soft">{bill.vendor}</td>
                      <td className="py-3 pr-3 text-fg-soft">{bill.source}</td>
                      <td className="py-3 pr-3">
                        <StatusPill tone={statusTone[bill.status]}>{bill.status}</StatusPill>
                      </td>
                      <td className="py-3 pr-3 text-right font-medium text-fg">{bill.grandTotal}</td>
                      <td className="py-3 pr-3 text-right text-fg-soft">{bill.netPayable}</td>
                      <td className="py-3 pr-3 text-right text-fg-soft">{bill.open}</td>
                      <td className="py-3 text-right">
                        <Menu
                          align="right"
                          widthClass="w-44"
                          trigger={
                            <button
                              type="button"
                              aria-label={`Actions for ${bill.number}`}
                              className="text-muted hover:text-bronze transition"
                            >
                              <MoreVertical size={16} />
                            </button>
                          }
                        >
                          <MenuItem icon={Eye} onClick={() => setViewTarget(bill)}>
                            View
                          </MenuItem>
                          <MenuItem icon={Pencil} onClick={() => setEditTarget(bill)}>
                            Edit
                          </MenuItem>
                          <MenuItem
                            icon={FileDown}
                            onClick={() => toast(`Bill ${bill.number} downloaded.`)}
                          >
                            Download PDF
                          </MenuItem>
                          <MenuItem
                            icon={Wallet}
                            onClick={() => toast(`Recording payment for ${bill.number}…`, "info")}
                          >
                            Record Payment
                          </MenuItem>
                          <MenuItem icon={Trash2} danger onClick={() => setDeleteTarget(bill)}>
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
            Showing 1 to {filtered.length} of {filtered.length} bills
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

      <DetailModal
        open={viewTarget !== null}
        onClose={() => setViewTarget(null)}
        title={viewTarget?.number ?? "Bill"}
        description="Bill details"
        rows={
          viewTarget
            ? [
                { label: "Bill Date", value: viewTarget.date },
                { label: "Due Date", value: viewTarget.due },
                { label: "Vendor", value: viewTarget.vendor },
                { label: "Source", value: viewTarget.source },
                { label: "Status", value: viewTarget.status },
                { label: "Grand Total", value: viewTarget.grandTotal },
                { label: "Net Payable", value: viewTarget.netPayable },
                { label: "Open", value: viewTarget.open },
              ]
            : []
        }
      />

      <CreateBillModal
        key={editTarget ? `edit-${editTarget.number}` : "create"}
        open={createOpen || editTarget !== null}
        editing={editTarget}
        onClose={() => {
          setCreateOpen(false);
          setEditTarget(null);
        }}
        onCreate={(bill) => add(bill)}
        onUpdate={(item, patch) => update(item, patch)}
      />

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete bill?"
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
          <span className="font-semibold text-fg">{deleteTarget?.number}</span>? This bill will no
          longer be accessible.
        </p>
      </Modal>
    </div>
  );
}
