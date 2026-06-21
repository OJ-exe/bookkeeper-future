"use client";

import { useState, type FormEvent } from "react";
import {
  Search,
  Filter,
  Plus,
  Upload,
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
  bankAccounts,
  bankTxns,
  bankTxnTabs,
  type BankTxn,
  type TxnStatus,
} from "@/data/banking";

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
  const [tab, setTab] = useState("All Transactions");
  const [query, setQuery] = useState("");
  const [account, setAccount] = useState("All");
  const [txnOpen, setTxnOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [deleteTxn, setDeleteTxn] = useState<BankTxn | null>(null);

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

  function handleAddBank(e: FormEvent) {
    e.preventDefault();
    setBankOpen(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Banking"
        description="Manage bank and cash accounts, import or add transactions, and match receipts, payments, and payouts against your ledger."
        showStar={false}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload size={16} /> Import Statement
            </Button>
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
        <StatCard icon={Wallet} label="Total Balance" value="₹6.8L" tone="bronze" />
        <StatCard
          icon={Landmark}
          label="Bank Accounts"
          value="3"
          sublabel="Linked"
          sublabelTone="muted"
          tone="info"
        />
        <StatCard
          icon={AlertTriangle}
          label="Unreconciled"
          value="12"
          sublabel="Need review"
          sublabelTone="muted"
          tone="warning"
        />
        <StatCard
          icon={CircleCheck}
          label="Reconciled"
          value="88%"
          sublabel="This month"
          tone="success"
        />
      </div>

      {/* Account cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setAccount("All")}
          className={`flex flex-col items-start gap-2 rounded-2xl border bg-surface p-5 text-left shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)] ${
            account === "All" ? "border-bronze ring-2 ring-bronze" : "border-line"
          }`}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-bronze-soft text-bronze">
            <Building2 size={18} />
          </span>
          <p className="text-sm font-semibold text-fg">All accounts</p>
          <p className="text-xs text-muted">Combined view</p>
          <p className="mt-auto pt-2 text-2xl font-bold text-fg">₹6,79,900</p>
        </button>

        {bankAccounts.map((acc) => {
          const selected = account === acc.name;
          const isCash = acc.bankName === "Cash";
          return (
            <button
              key={acc.name}
              type="button"
              onClick={() => setAccount(acc.name)}
              className={`flex flex-col items-start gap-2 rounded-2xl border bg-surface p-5 text-left shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)] ${
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
              <span className="text-xs font-medium text-bronze hover:opacity-80">
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
                        <MenuItem icon={Link2}>Match</MenuItem>
                        <MenuItem icon={Scissors}>Split</MenuItem>
                        <MenuItem icon={Ban}>Exclude</MenuItem>
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

      <AddTransactionModal open={txnOpen} onClose={() => setTxnOpen(false)} />

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
        <form id="add-bank-form" onSubmit={handleAddBank} className="space-y-4">
          <div>
            <label htmlFor="bank-name" className="mb-1.5 block text-sm font-medium text-fg-soft">Bank Name</label>
            <input id="bank-name" type="text" placeholder="e.g. HDFC Bank" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="bank-account-no" className="mb-1.5 block text-sm font-medium text-fg-soft">Account Number</label>
            <input id="bank-account-no" type="text" placeholder="e.g. ••1234" className={fieldClass} />
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
                placeholder="₹0.00"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="bank-ledger" className="mb-1.5 block text-sm font-medium text-fg-soft">Linked Ledger</label>
              <select id="bank-ledger" defaultValue={bankAccounts[0].ledger} className={fieldClass}>
                {bankAccounts.map((a) => (
                  <option key={a.ledger} value={a.ledger}>
                    {a.ledger}
                  </option>
                ))}
              </select>
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
            <Button className="bg-danger text-white" onClick={() => setDeleteTxn(null)}>
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
