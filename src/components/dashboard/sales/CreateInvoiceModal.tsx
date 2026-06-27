"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Invoice } from "@/data/salesDocuments";

const customerOptions = [
  "ABC Pvt Ltd",
  "XYZ Industries",
  "Tech Solutions",
  "Global Traders",
  "Sunrise Enterprises",
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

export default function CreateInvoiceModal({
  open,
  onClose,
  onCreate,
  editing,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (invoice: Invoice) => void;
  editing?: Invoice | null;
  onUpdate?: (item: Invoice, patch: Partial<Invoice>) => void;
}) {
  const isEdit = !!editing;
  const [customer, setCustomer] = useState(editing?.customer ?? customerOptions[0]);
  const [date, setDate] = useState(toDateInput(editing?.date));
  const [due, setDue] = useState(toDateInput(editing?.due));
  const [amount, setAmount] = useState(unblank(editing?.grandTotal));

  function reset() {
    setCustomer(customerOptions[0]);
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
        customer,
        date: formatDate(date),
        due: formatDate(due),
        grandTotal: formatted,
        netReceivable: formatted,
        open: formatted,
      });
      onClose();
      return;
    }
    onCreate({
      number: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: formatDate(date),
      due: formatDate(due),
      customer,
      source: "Direct",
      status: "Sent",
      grandTotal: formatted,
      netReceivable: formatted,
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
      title={isEdit ? "Edit Tax Invoice" : "Create Tax Invoice"}
      description={
        isEdit
          ? "Update this tax invoice's details."
          : "Generate a GST tax invoice in seconds."
      }
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-invoice-form"
            variant="bronze"
            disabled={amount.trim() === ""}
          >
            {isEdit ? "Save Changes" : "Create Invoice"}
          </Button>
        </>
      }
    >
      <form id="create-invoice-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fg-soft">Customer</label>
          <select
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className={fieldClass}
          >
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
