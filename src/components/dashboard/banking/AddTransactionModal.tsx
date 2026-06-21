"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { bankAccounts } from "@/data/banking";

const fieldClass =
  "w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm text-fg outline-none placeholder:text-muted focus:border-bronze transition";

export default function AddTransactionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Transaction"
      description="Record a bank or cash transaction against your ledger."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
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
          <label className="mb-1.5 block text-sm font-medium text-fg-soft">Account</label>
          <select defaultValue={bankAccounts[0].name} className={fieldClass}>
            {bankAccounts.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name} ({a.accountNo})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">Date</label>
            <input type="date" className={fieldClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">Type</label>
            <select defaultValue="Inflow" className={fieldClass}>
              <option value="Inflow">Inflow</option>
              <option value="Outflow">Outflow</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-fg-soft">
            Description <span className="text-danger">*</span>
          </label>
          <input
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
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">Reference</label>
            <input type="text" placeholder="NEFT / UTR / cheque no." className={fieldClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">
              Amount <span className="text-danger">*</span>
            </label>
            <input
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
          <label className="mb-1.5 block text-sm font-medium text-fg-soft">Notes</label>
          <textarea
            rows={3}
            placeholder="Add notes or context…"
            className={`${fieldClass} resize-none`}
          />
        </div>
      </form>
    </Modal>
  );
}
