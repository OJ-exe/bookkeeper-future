"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { PayrollRun } from "@/data/payroll";

const inputClass =
  "bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-fg outline-none focus:border-bronze";
const labelClass = "text-sm font-medium text-fg-soft";

const months = [
  "June 2026",
  "July 2026",
  "August 2026",
  "September 2026",
  "October 2026",
  "November 2026",
  "December 2026",
];

function formatDate(raw: string) {
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

// Convert a stored display date ("01 Jul 2026") back to an ISO value for the
// native date input; pass through if unparseable.
function toDateInput(raw: string) {
  if (!raw || raw === "—") return "";
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

export default function RunPayrollModal({
  open,
  onClose,
  onCreate,
  editing,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (run: PayrollRun) => void;
  editing?: PayrollRun | null;
  onUpdate?: (item: PayrollRun, patch: Partial<PayrollRun>) => void;
}) {
  const isEdit = !!editing;
  const [period, setPeriod] = useState(editing?.period ?? months[0]);
  const [payDate, setPayDate] = useState(toDateInput(editing?.payDate ?? ""));
  const [employees, setEmployees] = useState(
    editing ? String(editing.employees) : ""
  );

  function reset() {
    setPeriod(months[0]);
    setPayDate("");
    setEmployees("");
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (employees.trim() === "") return;
    const count = Number.parseInt(employees, 10);
    if (isEdit && editing && onUpdate) {
      onUpdate(editing, {
        period,
        employees: Number.isNaN(count) ? editing.employees : count,
        payDate: formatDate(payDate),
      });
      onClose();
      return;
    }
    onCreate({
      id: `PR-2026-${Math.floor(100 + Math.random() * 900)}`,
      period,
      employees: Number.isNaN(count) ? 0 : count,
      gross: "₹0",
      deductions: "₹0",
      netPay: "₹0",
      status: "Draft",
      payDate: formatDate(payDate),
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
      title={isEdit ? "Edit Payroll Run" : "Run Payroll"}
      description={
        isEdit
          ? "Update this payroll run."
          : "Start a new payroll run for the selected period."
      }
      size="lg"
    >
      <form id="run-payroll-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pay-period" className={labelClass}>
              Period
            </label>
            <select
              id="pay-period"
              className={inputClass}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="pay-date" className={labelClass}>
              Pay Date
            </label>
            <input
              id="pay-date"
              type="date"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="pay-employees" className={labelClass}>
              Employees Count <span className="text-danger">*</span>
            </label>
            <input
              id="pay-employees"
              required
              value={employees}
              onChange={(e) => setEmployees(e.target.value)}
              placeholder="44"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="pay-notes" className={labelClass}>
              Notes
            </label>
            <textarea
              id="pay-notes"
              rows={3}
              placeholder="Optional notes for this payroll run…"
              className={inputClass}
            />
          </div>
        </div>
      </form>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="bronze"
          type="submit"
          form="run-payroll-form"
          disabled={employees.trim() === ""}
        >
          {isEdit ? "Save Changes" : "Run Payroll"}
        </Button>
      </div>
    </Modal>
  );
}
