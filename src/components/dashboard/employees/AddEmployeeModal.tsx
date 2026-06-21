"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { departments } from "@/data/employees";

const inputClass =
  "bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-fg outline-none focus:border-bronze";
const labelClass = "text-sm font-medium text-fg-soft";

export default function AddEmployeeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Employee"
      description="Add a new employee to your master data."
      size="lg"
    >
      <form id="add-employee-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="emp-name" className={labelClass}>
              Employee Name <span className="text-danger">*</span>
            </label>
            <input
              id="emp-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rajesh Kumar"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="emp-department" className={labelClass}>
              Department
            </label>
            <select id="emp-department" className={inputClass} defaultValue={departments[0]}>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="emp-designation" className={labelClass}>
              Designation
            </label>
            <input id="emp-designation" placeholder="Sales Manager" className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="emp-email" className={labelClass}>
              Email
            </label>
            <input
              id="emp-email"
              type="email"
              placeholder="rajesh.kumar@company.com"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="emp-phone" className={labelClass}>
              Phone
            </label>
            <input id="emp-phone" placeholder="+91 98765 43210" className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="emp-ctc" className={labelClass}>
              CTC
            </label>
            <input id="emp-ctc" placeholder="₹9.6L" className={inputClass} />
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
          form="add-employee-form"
          disabled={name.trim() === ""}
        >
          Add Employee
        </Button>
      </div>
    </Modal>
  );
}
