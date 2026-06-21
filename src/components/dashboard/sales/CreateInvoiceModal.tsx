"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const customerOptions = [
  "ABC Pvt Ltd",
  "XYZ Industries",
  "Tech Solutions",
  "Global Traders",
  "Sunrise Enterprises",
];

const fieldClass =
  "w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm text-fg outline-none placeholder:text-muted focus:border-bronze transition";

export default function CreateInvoiceModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Tax Invoice"
      description="Generate a GST tax invoice in seconds."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-invoice-form"
            variant="bronze"
            disabled={amount.trim() === ""}
          >
            Create Invoice
          </Button>
        </>
      }
    >
      <form id="create-invoice-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fg-soft">Customer</label>
          <select defaultValue={customerOptions[0]} className={fieldClass}>
            {customerOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">Invoice Date</label>
            <input type="date" className={fieldClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">Due Date</label>
            <input type="date" className={fieldClass} />
          </div>
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-fg-soft">Notes</label>
          <textarea
            rows={3}
            placeholder="Add notes or terms…"
            className={`${fieldClass} resize-none`}
          />
        </div>
      </form>
    </Modal>
  );
}
