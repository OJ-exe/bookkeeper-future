"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

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

export default function RunPayrollModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [employees, setEmployees] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
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
            <select id="pay-period" className={inputClass} defaultValue={months[0]}>
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
            <input id="pay-date" type="date" className={inputClass} />
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
        <Button variant="outline" type="button" onClick={onClose}>
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
