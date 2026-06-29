"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Bill } from "@/types/bill";

const vendorOptions = [
  "Sharma Supplies",
  "Metro Logistics",
  "Apex Components",
  "Greenfield Traders",
  "Nova Print",
];

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

// Convert a stored display date (e.g. "15 Jun 2026") into an ISO value (yyyy-mm-dd)
// for the native date input. Returns "" when the value is empty or unparseable.
function toDateInput(raw: string | undefined) {
  if (!raw || raw === "—") return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// "—" is used as a placeholder for empty fields; show it as blank when editing.
function unblank(v: string | undefined) {
  return v && v !== "—" ? v : "";
}

export default function CreateBillModal({
  open,
  onClose,
  onCreate,
  editing,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (bill: Bill) => void;
  editing?: Bill | null;
  onUpdate?: (item: Bill, patch: Partial<Bill>) => void;
}) {
  const isEdit = !!editing;
  const [vendor, setVendor] = useState(editing?.vendor ?? vendorOptions[0]);
  const [date, setDate] = useState(toDateInput(editing?.date));
  const [due, setDue] = useState(toDateInput(editing?.due));
  const [amount, setAmount] = useState(unblank(editing?.grandTotal));

  function reset() {
    setVendor(vendorOptions[0]);
    setDate("");
    setDue("");
    setAmount("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (amount.trim() === "") return;
    const formatted = formatAmount(amount);
    if (isEdit && editing && onUpdate) {
      onUpdate(editing, {
        vendor,
        date: formatDate(date),
        due: formatDate(due),
        grandTotal: formatted,
        netPayable: formatted,
        open: formatted,
      });
      onClose();
      return;
    }
    onCreate({
      number: `BILL-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: formatDate(date),
      due: formatDate(due),
      vendor,
      source: "Direct",
      status: "Open",
      grandTotal: formatted,
      netPayable: formatted,
      open: formatted,
    });
    reset();
    onClose();
  }

  function handleClose() {
    if (!isEdit) reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? "Edit Bill" : "Create Bill"}
      description={
        isEdit
          ? "Update this purchase bill's details."
          : "Record a new purchase bill in seconds."
      }
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-bill-form"
            variant="bronze"
            disabled={amount.trim() === ""}
          >
            {isEdit ? "Save Changes" : "Create Bill"}
          </Button>
        </>
      }
    >
      <form id="create-bill-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fg-soft">Vendor</label>
          <select
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className={fieldClass}
          >
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
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">Due Date</label>
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className={fieldClass}
            />
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
