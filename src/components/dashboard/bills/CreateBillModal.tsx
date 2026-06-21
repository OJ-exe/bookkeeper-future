"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const vendorOptions = [
  "Sharma Supplies",
  "Metro Logistics",
  "Apex Components",
  "Greenfield Traders",
  "Nova Print",
];

const fieldClass =
  "w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm text-fg outline-none placeholder:text-muted focus:border-bronze transition";

export default function CreateBillModal({
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
      title="Create Bill"
      description="Record a new purchase bill in seconds."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-bill-form"
            variant="bronze"
            disabled={amount.trim() === ""}
          >
            Create Bill
          </Button>
        </>
      }
    >
      <form id="create-bill-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fg-soft">Vendor</label>
          <select defaultValue={vendorOptions[0]} className={fieldClass}>
            {vendorOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">Bill Date</label>
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
