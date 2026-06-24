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

export default function RunPayrollModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (run: PayrollRun) => void;
}) {
  const [period, setPeriod] = useState(months[0]);
  const [payDate, setPayDate] = useState("");
  const [employees, setEmployees] = useState("");

  function reset() {
    setPeriod(months[0]);
    setPayDate("");
    setEmployees("");
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (employees.trim() === "") return;
    const count = Number.parseInt(employees, 10);
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
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Run Payroll"
      description="Start a new payroll run for the selected period."
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
          Run Payroll
        </Button>
      </div>
    </Modal>
  );
}
