"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Wallet,
  Landmark,
  AlertTriangle,
  CircleCheck,
  Building2,
  Banknote,
  Link2,
  Scissors,
  Ban,
  Pencil,
  Eye,
  Trash2,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { Menu, MenuItem } from "@/components/ui/Menu";

import AddTransactionModal from "@/components/dashboard/banking/AddTransactionModal";

import {
  bankTxnTabs,
  type BankAccount,
  type BankTxn,
  type TxnStatus,
} from "@/data/banking";
import UploadButton from "@/components/ui/UploadButton";
import DetailModal from "@/components/ui/DetailModal";
import { useToast } from "@/components/ui/Toast";

const txnStatuses: TxnStatus[] = ["Matched", "Unmatched", "Excluded"];

function parseAmount(value?: string | null) {
  if (typeof value !== "string") return 0;
  const normalized = value.replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function buildImportedBankTxn(row: Record<string, string>): BankTxn | null {
  const description = (row["Description"] ?? row["description"] ?? "").trim();
  if (!description) return null;
  const rawKind = (row["Type"] ?? "").trim();
  const kind: BankTxn["kind"] = rawKind === "Outflow" ? "Outflow" : "Inflow";
  const rawStatus = (row["Status"] ?? "").trim() as TxnStatus;
  const status: TxnStatus = txnStatuses.includes(rawStatus) ? rawStatus : "Unmatched";
  return {
    date: row["Date"]?.trim() || "—",
    description,
    reference: row["Reference"]?.trim() || "—",
    kind,
    amount: row["Amount"]?.trim() || "₹0",
    account: row["Account"]?.trim() || "Cash in Hand",
    status,
  };
}

const statusTone: Record<TxnStatus, "success" | "warning" | "neutral"> = {
  Matched: "success",
  Unmatched: "warning",
  Excluded: "neutral",
};

const kindTone: Record<BankTxn["kind"], "success" | "warning"> = {
  Inflow: "success",
  Outflow: "warning",
};

const fieldClass =
  "w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm text-fg outline-none placeholder:text-muted focus:border-bronze transition";

function tabPredicate(tab: string, txn: BankTxn): boolean {
  switch (tab) {
    case "Unmatched":
      return txn.status === "Unmatched";
    case "Matched":
      return txn.status === "Matched";
    case "Inflow":
      return txn.kind === "Inflow";
    case "Outflow":
      return txn.kind === "Outflow";
    default:
      return true; // "All Transactions"
  }
}

export default function BankingScreen() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [bankTxns, setBankTxns] = useState<BankTxn[]>([]);
  const toast = useToast();
  const [tab, setTab] = useState("All Transactions");
  const [query, setQuery] = useState("");
  const [account, setAccount] = useState("All");
  const [txnOpen, setTxnOpen] = useState(false);
  const [editTxn, setEditTxn] = useState<BankTxn | null>(null);
  const [viewTxn, setViewTxn] = useState<BankTxn | null>(null);
  const [bankOpen, setBankOpen] = useState(false);
  const [deleteTxn, setDeleteTxn] = useState<BankTxn | null>(null);
  const [bankDraft, setBankDraft] = useState({
    name: "",
    accountNo: "",
    balance: "",
    ledger: "",
  });

  useEffect(() => {
    void loadAccounts();
    void loadTransactions();
  }, []);

  async function loadAccounts() {
    try {
      const response = await fetch("/api/bank-accounts");
      if (!response.ok) throw new Error("Failed to load bank accounts");
      const data = (await response.json()) as BankAccount[];
      setBankAccounts(data);
    } catch {
      setBankAccounts([]);
    }
  }

  async function loadTransactions() {
    try {
      const response = await fetch("/api/transactions");
      if (!response.ok) throw new Error("Failed to load transactions");
      const data = (await response.json()) as BankTxn[];
      setBankTxns(data);
    } catch {
      setBankTxns([]);
    }
  }

  async function addTransaction(txn: BankTxn) {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txn),
      });
      if (!response.ok) throw new Error("Failed to create transaction");
      const created = (await response.json()) as BankTxn;
      setBankTxns((current) => [created, ...current]);
      toast("Transaction added.");
    } catch {
      toast("Unable to add transaction right now.");
    }
  }

  async function updateTransaction(item: BankTxn, patch: Partial<BankTxn>) {
    if (!item.id) return;
    try {
      const response = await fetch(`/api/transactions/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, ...patch }),
      });
      if (!response.ok) throw new Error("Failed to update transaction");
      const updated = (await response.json()) as BankTxn;
      setBankTxns((current) => current.map((entry) => (entry.id === item.id ? updated : entry)));
      toast("Transaction updated.");
    } catch {
      toast("Unable to update transaction right now.");
    }
  }

  async function removeTransaction(item: BankTxn) {
    if (!item.id) return;
    try {
      const response = await fetch(`/api/transactions/${item.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete transaction");
      setBankTxns((current) => current.filter((entry) => entry.id !== item.id));
      toast("Transaction removed.");
    } catch {
      toast("Unable to delete transaction right now.");
    }
  }

  async function addBankAccount(e: FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch("/api/bank-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bankDraft.name,
          accountNo: bankDraft.accountNo,
          balance: bankDraft.balance || "₹0",
          ledger: bankDraft.ledger || bankDraft.name,
        }),
      });
      if (!response.ok) throw new Error("Failed to create bank account");
      const created = (await response.json()) as BankAccount;
      setBankAccounts((current) => [created, ...current]);
      setBankDraft({ name: "", accountNo: "", balance: "", ledger: "" });
      setBankOpen(false);
      toast("Bank account added.");
    } catch {
      toast("Unable to add bank account right now.");
    }
  }

  const q = query.trim().toLowerCase();
  const filtered = bankTxns.filter((txn) => {
    const matchesAccount = account === "All" || txn.account === account;
    const matchesQuery =
      !q ||
      txn.description.toLowerCase().includes(q) ||
      txn.reference.toLowerCase().includes(q) ||
      txn.account.toLowerCase().includes(q);
    return matchesAccount && matchesQuery && tabPredicate(tab, txn);
  });

  const totalBalance = bankAccounts.reduce((sum, account) => sum + parseAmount(account.balance), 0);
  const unmatchedCount = bankTxns.filter((txn) => txn.status === "Unmatched").length;
  const matchedCount = bankTxns.filter((txn) => txn.status === "Matched").length;
  const reconciledPct = bankTxns.length ? Math.round((matchedCount / bankTxns.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Banking"
        description="Manage bank and cash accounts, import or add transactions, and match receipts, payments, and payouts against your ledger."
        showStar={false}
        actions={
          <>
            <UploadButton<BankTxn>
              label="Import Statement"
              build={buildImportedBankTxn}
              onImport={async (records) => {
                for (const record of records.filter(Boolean)) {
                  await addTransaction(record);
                }
              }}
            />
            <Button variant="outline" size="sm" onClick={() => setBankOpen(true)}>
              <Plus size={16} /> Add Bank
            </Button>
            <Button variant="bronze" size="sm" onClick={() => setTxnOpen(true)}>
              <Plus size={16} /> Add Transaction
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Wallet} label="Total Balance" value={formatCurrency(totalBalance)} tone="bronze" />
        <StatCard
          icon={Landmark}
          label="Bank Accounts"
          value={bankAccounts.length.toString()}
          sublabel="Linked"
          sublabelTone="muted"
          tone="info"
        />
        <StatCard
          icon={AlertTriangle}
          label="Unreconciled"
          value={unmatchedCount.toString()}
          sublabel="Need review"
          sublabelTone="muted"
          tone="warning"
        />
        <StatCard
          icon={CircleCheck}
          label="Reconciled"
          value={`${reconciledPct}%`}
          sublabel="This month"
          tone="success"
        />
      </div>

      {/* Account cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setAccount("All")}
          className={`flex flex-col items-start gap-2 rounded-2xl border bg-surface p-5 text-left shadow-(--shadow-sm) transition hover:shadow-(--shadow-md) ${
            account === "All" ? "border-bronze ring-2 ring-bronze" : "border-line"
          }`}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-bronze-soft text-bronze">
            <Building2 size={18} />
          </span>
          <p className="text-sm font-semibold text-fg">All accounts</p>
          <p className="text-xs text-muted">Combined view</p>
          <p className="mt-auto pt-2 text-2xl font-bold text-fg">{formatCurrency(totalBalance)}</p>
        </button>

        {bankAccounts.map((acc) => {
          const selected = account === acc.name;
          const isCash = acc.bankName === "Cash";
          return (
            <button
              key={acc.name}
              type="button"
              onClick={() => setAccount(acc.name)}
              className={`flex flex-col items-start gap-2 rounded-2xl border bg-surface p-5 text-left shadow-(--shadow-sm) transition hover:shadow-(--shadow-md) ${
                selected ? "border-bronze ring-2 ring-bronze" : "border-line"
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-bronze-soft text-bronze">
                {isCash ? <Banknote size={18} /> : <Landmark size={18} />}
              </span>
              <p className="text-sm font-semibold text-fg">{acc.name}</p>
              <p className="text-xs text-muted">
                {acc.bankName} · {acc.accountNo}
              </p>
              <p className="mt-auto pt-2 text-2xl font-bold text-fg">{acc.balance}</p>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  toast("Opening ledger…", "info");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    toast("Opening ledger…", "info");
                  }
                }}
                className="text-xs font-medium text-bronze hover:opacity-80 cursor-pointer"
              >
                View ledger
              </span>
            </button>
          );
        })}
      </div>

      {/* Transactions workspace */}
      <Card padded={false} className="p-5">
        {/* Tab bar */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-line">
          {bankTxnTabs.map((t) => {
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

        {/* Controls */}
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="flex min-w-[16rem] flex-1 items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 lg:max-w-md">
              <Search size={16} className="shrink-0 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search description, reference, account…"
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
          <p className="text-sm font-medium text-fg">Transactions ({filtered.length})</p>
        </div>

        <div className="my-5 h-px bg-line" />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
                <th className="py-2.5 pr-3 font-medium">Date</th>
                <th className="py-2.5 pr-3 font-medium">Description</th>
                <th className="py-2.5 pr-3 font-medium">Account</th>
                <th className="py-2.5 pr-3 font-medium">Type</th>
                <th className="py-2.5 pr-3 font-medium text-right">Amount</th>
                <th className="py-2.5 pr-3 font-medium">Status</th>
                <th className="py-2.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted">
                    No transactions to show here yet.
                  </td>
                </tr>
              ) : (
                filtered.map((txn) => (
                  <tr
                    key={txn.id}
                    className="border-b border-line/60 transition hover:bg-bronze-soft/30"
                  >
                    <td className="py-3 pr-3 text-fg-soft">{txn.date}</td>
                    <td className="py-3 pr-3">
                      <p className="font-medium text-fg">{txn.description}</p>
                      <p className="text-xs text-muted">{txn.reference}</p>
                    </td>
                    <td className="py-3 pr-3 text-fg-soft">{txn.account}</td>
                    <td className="py-3 pr-3">
                      <StatusPill tone={kindTone[txn.kind]}>{txn.kind}</StatusPill>
                    </td>
                    <td
                      className={`py-3 pr-3 text-right font-medium ${
                        txn.kind === "Inflow" ? "text-success" : "text-fg"
                      }`}
                    >
                      {txn.kind === "Inflow" ? "+" : "−"}
                      {txn.amount}
                    </td>
                    <td className="py-3 pr-3">
                      <StatusPill tone={statusTone[txn.status]}>{txn.status}</StatusPill>
                    </td>
                    <td className="py-3 text-right">
                      <Menu
                        align="right"
                        widthClass="w-44"
                        trigger={
                          <button
                            type="button"
                            aria-label={`Actions for ${txn.id}`}
                            className="text-muted hover:text-bronze transition"
                          >
                            <MoreVertical size={16} />
                          </button>
                        }
                      >
                        <MenuItem icon={Eye} onClick={() => setViewTxn(txn)}>
                          View
                        </MenuItem>
                        <MenuItem
                          icon={Link2}
                          onClick={() => {
                            void updateTransaction(txn, { status: "Matched" });
                            toast("Transaction matched.");
                          }}
                        >
                          Match
                        </MenuItem>
                        <MenuItem icon={Pencil} onClick={() => setEditTxn(txn)}>
                          Edit
                        </MenuItem>
                        <MenuItem
                          icon={Scissors}
                          onClick={() => toast("Split transaction — coming soon.", "info")}
                        >
                          Split
                        </MenuItem>
                        <MenuItem
                          icon={Ban}
                          onClick={() => {
                            void updateTransaction(txn, { status: "Excluded" });
                            toast("Transaction excluded.");
                          }}
                        >
                          Exclude
                        </MenuItem>
                        <MenuItem icon={Trash2} danger onClick={() => setDeleteTxn(txn)}>
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
            Showing 1 to {filtered.length} of {filtered.length} transactions
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
        open={viewTxn !== null}
        onClose={() => setViewTxn(null)}
        title={viewTxn?.description ?? "Transaction"}
        description="Transaction details"
        rows={
          viewTxn
            ? [
                { label: "Date", value: viewTxn.date },
                { label: "Description", value: viewTxn.description },
                { label: "Reference", value: viewTxn.reference },
                { label: "Account", value: viewTxn.account },
                { label: "Type", value: viewTxn.kind },
                { label: "Amount", value: viewTxn.amount },
                { label: "Status", value: viewTxn.status },
              ]
            : []
        }
      />

      <AddTransactionModal
        key={editTxn ? `edit-${editTxn.id}` : "create"}
        open={txnOpen || editTxn !== null}
        editing={editTxn}
        onClose={() => {
          setTxnOpen(false);
          setEditTxn(null);
        }}
        onCreate={(txn) => { void addTransaction(txn); }}
        onUpdate={(item, patch) => { void updateTransaction(item, patch); }}
        accounts={bankAccounts}
      />

      {/* Add Bank modal */}
      <Modal
        open={bankOpen}
        onClose={() => setBankOpen(false)}
        title="Add Bank"
        description="Link a new bank or cash account to your ledger."
        footer={
          <>
            <Button variant="outline" onClick={() => setBankOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="add-bank-form" variant="bronze">
              Add Bank
            </Button>
          </>
        }
      >
        <form id="add-bank-form" onSubmit={addBankAccount} className="space-y-4">
          <div>
            <label htmlFor="bank-name" className="mb-1.5 block text-sm font-medium text-fg-soft">Bank Name</label>
            <input
              id="bank-name"
              type="text"
              value={bankDraft.name}
              onChange={(e) => setBankDraft((current) => ({ ...current, name: e.target.value }))}
              placeholder="e.g. HDFC Bank"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="bank-account-no" className="mb-1.5 block text-sm font-medium text-fg-soft">Account Number</label>
            <input
              id="bank-account-no"
              type="text"
              value={bankDraft.accountNo}
              onChange={(e) => setBankDraft((current) => ({ ...current, accountNo: e.target.value }))}
              placeholder="e.g. ••1234"
              className={fieldClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bank-opening-balance" className="mb-1.5 block text-sm font-medium text-fg-soft">
                Opening Balance
              </label>
              <input
                id="bank-opening-balance"
                type="text"
                inputMode="decimal"
                value={bankDraft.balance}
                onChange={(e) => setBankDraft((current) => ({ ...current, balance: e.target.value }))}
                placeholder="₹0.00"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="bank-ledger" className="mb-1.5 block text-sm font-medium text-fg-soft">Linked Ledger</label>
              <input
                id="bank-ledger"
                type="text"
                value={bankDraft.ledger}
                onChange={(e) => setBankDraft((current) => ({ ...current, ledger: e.target.value }))}
                placeholder="e.g. HDFC Bank A/c"
                className={fieldClass}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        open={deleteTxn !== null}
        onClose={() => setDeleteTxn(null)}
        title="Delete transaction"
        description="This action cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTxn(null)}>
              Cancel
            </Button>
            <Button
              className="bg-danger text-white"
              onClick={() => {
                if (deleteTxn) {
                  void removeTransaction(deleteTxn);
                }
                setDeleteTxn(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-fg-soft">
          Are you sure you want to delete{" "}
          <span className="font-medium text-fg">{deleteTxn?.description}</span> (
          {deleteTxn?.amount})? This will remove it from your ledger.
        </p>
      </Modal>
    </div>
  );
}
