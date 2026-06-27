"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Payment, PaymentDirection, PaymentMethod } from "@/data/payments";

const partyOptions = [
  "ABC Pvt Ltd",
  "XYZ Industries",
  "Tech Solutions",
  "Sharma Supplies",
  "Metro Logistics",
  "Apex Components",
];

const directionOptions: PaymentDirection[] = ["Received", "Made"];

const methodOptions: PaymentMethod[] = ["Bank Transfer", "UPI", "Cheque", "Card", "Cash"];

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

export default function RecordPaymentModal({
  open,
  onClose,
  onCreate,
  editing,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payment: Payment) => void;
  editing?: Payment | null;
  onUpdate?: (item: Payment, patch: Partial<Payment>) => void;
}) {
  const isEdit = !!editing;
  const [party, setParty] = useState(editing?.party ?? partyOptions[0]);
  const [direction, setDirection] = useState<PaymentDirection>(editing?.direction ?? directionOptions[0]);
  const [method, setMethod] = useState<PaymentMethod>(editing?.method ?? methodOptions[0]);
  const [reference, setReference] = useState(unblank(editing?.reference));
  const [amount, setAmount] = useState(unblank(editing?.amount));
  const [date, setDate] = useState(toDateInput(editing?.date));

  function reset() {
    setParty(partyOptions[0]);
    setDirection(directionOptions[0]);
    setMethod(methodOptions[0]);
    setReference("");
    setAmount("");
    setDate("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (amount.trim() === "") return;
    if (isEdit && editing && onUpdate) {
      onUpdate(editing, {
        date: formatDate(date),
        party,
        direction,
        method,
        reference: reference.trim() || "—",
        amount: formatAmount(amount),
      });
      onClose();
      return;
    }
    onCreate({
      id: `PMT-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: formatDate(date),
      party,
      direction,
      method,
      reference: reference.trim() || "—",
      status: "Completed",
      amount: formatAmount(amount),
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
      title={isEdit ? "Edit Payment" : "Record Payment"}
      description={
        isEdit
          ? "Update this payment record."
          : "Record money received or paid in seconds."
      }
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="record-payment-form"
            variant="bronze"
            disabled={amount.trim() === ""}
          >
            {isEdit ? "Save Changes" : "Record Payment"}
          </Button>
        </>
      }
    >
      <form id="record-payment-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">Party</label>
            <select
              value={party}
              onChange={(e) => setParty(e.target.value)}
              className={fieldClass}
            >
              {partyOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">Direction</label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as PaymentDirection)}
              className={fieldClass}
            >
              {directionOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className={fieldClass}
            >
              {methodOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">Reference</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="INV-2026-152"
              className={fieldClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={fieldClass}
            />
          </div>
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
