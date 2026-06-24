"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { bankAccounts, type BankTxn } from "@/data/banking";

const fieldClass =
  "w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm text-fg outline-none placeholder:text-muted focus:border-bronze transition";

function formatAmount(raw: string) {
  const trimmed = raw.trim();
  return trimmed.startsWith("₹") ? trimmed : `₹${trimmed}`;
}

function formatDate(raw: string) {
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AddTransactionModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (txn: BankTxn) => void;
}) {
  const [account, setAccount] = useState(bankAccounts[0].name);
  const [date, setDate] = useState("");
  const [kind, setKind] = useState<BankTxn["kind"]>("Inflow");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");

  function reset() {
    setAccount(bankAccounts[0].name);
    setDate("");
    setKind("Inflow");
    setDescription("");
    setReference("");
    setAmount("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (description.trim() === "" || amount.trim() === "") return;
    onCreate({
      id: `TXN-${Math.floor(100 + Math.random() * 900)}`,
      date: formatDate(date),
      description: description.trim(),
      reference: reference.trim() || "—",
      kind,
      amount: formatAmount(amount),
      account,
      status: "Unmatched",
    });
    reset();
    onClose();
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Transaction"
      description="Record a bank or cash transaction against your ledger."
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-transaction-form"
            variant="bronze"
            disabled={description.trim() === "" || amount.trim() === ""}
          >
            Add Transaction
          </Button>
        </>
      }
    >
      <form id="add-transaction-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="txn-account" className="mb-1.5 block text-sm font-medium text-fg-soft">Account</label>
          <select
            id="txn-account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className={fieldClass}
          >
            {bankAccounts.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name} ({a.accountNo})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="txn-date" className="mb-1.5 block text-sm font-medium text-fg-soft">Date</label>
            <input
              id="txn-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="txn-type" className="mb-1.5 block text-sm font-medium text-fg-soft">Type</label>
            <select
              id="txn-type"
              value={kind}
              onChange={(e) => setKind(e.target.value as BankTxn["kind"])}
              className={fieldClass}
            >
              <option value="Inflow">Inflow</option>
              <option value="Outflow">Outflow</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="txn-description" className="mb-1.5 block text-sm font-medium text-fg-soft">
            Description <span className="text-danger">*</span>
          </label>
          <input
            id="txn-description"
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Receipt from ABC Pvt Ltd"
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="txn-reference" className="mb-1.5 block text-sm font-medium text-fg-soft">Reference</label>
            <input
              id="txn-reference"
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="NEFT / UTR / cheque no."
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="txn-amount" className="mb-1.5 block text-sm font-medium text-fg-soft">
              Amount <span className="text-danger">*</span>
            </label>
            <input
              id="txn-amount"
              type="text"
              inputMode="decimal"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="₹0.00"
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="txn-notes" className="mb-1.5 block text-sm font-medium text-fg-soft">Notes</label>
          <textarea
            id="txn-notes"
            rows={3}
            placeholder="Add notes or context…"
            className={`${fieldClass} resize-none`}
          />
        </div>
      </form>
    </Modal>
  );
}
