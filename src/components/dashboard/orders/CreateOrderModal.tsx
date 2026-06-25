"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Order, OrderKind } from "@/data/orders";

const partyOptions = [
  "ABC Pvt Ltd",
  "XYZ Industries",
  "Tech Solutions",
  "Sharma Supplies",
  "Metro Logistics",
  "Apex Components",
];

const orderTypeOptions: OrderKind[] = ["Sales Order", "Purchase Order"];

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

export default function CreateOrderModal({
  open,
  onClose,
  onCreate,
  editing,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (order: Order) => void;
  editing?: Order | null;
  onUpdate?: (item: Order, patch: Partial<Order>) => void;
}) {
  const isEdit = !!editing;
  const [party, setParty] = useState(editing?.party ?? partyOptions[0]);
  const [kind, setKind] = useState<OrderKind>(editing?.kind ?? orderTypeOptions[0]);
  const [date, setDate] = useState(toDateInput(editing?.date));
  const [expectedDate, setExpectedDate] = useState(toDateInput(editing?.expectedDate));
  const [amount, setAmount] = useState(unblank(editing?.total));

  function reset() {
    setParty(partyOptions[0]);
    setKind(orderTypeOptions[0]);
    setDate("");
    setExpectedDate("");
    setAmount("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (amount.trim() === "") return;
    const formatted = formatAmount(amount);
    if (isEdit && editing && onUpdate) {
      onUpdate(editing, {
        date: formatDate(date),
        expectedDate: formatDate(expectedDate),
        party,
        kind,
        total: formatted,
        value: formatted,
      });
      onClose();
      return;
    }
    onCreate({
      number: `ORD-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: formatDate(date),
      expectedDate: formatDate(expectedDate),
      party,
      kind,
      status: "Open",
      total: formatted,
      fulfilled: "0%",
      value: formatted,
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
      title={isEdit ? "Edit Order" : "Create Order"}
      description={
        isEdit
          ? "Update this sales or purchase order."
          : "Record a new sales or purchase order in seconds."
      }
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-order-form"
            variant="bronze"
            disabled={amount.trim() === ""}
          >
            {isEdit ? "Save Changes" : "Create Order"}
          </Button>
        </>
      }
    >
      <form id="create-order-form" onSubmit={handleSubmit} className="space-y-4">
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
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">Order Type</label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as OrderKind)}
              className={fieldClass}
            >
              {orderTypeOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">Order Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-fg-soft">Expected Date</label>
            <input
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
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
