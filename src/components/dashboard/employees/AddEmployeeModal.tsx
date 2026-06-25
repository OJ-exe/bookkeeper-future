"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { departments, type Department, type Employee } from "@/data/employees";

const inputClass =
  "bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-fg outline-none focus:border-bronze";
const labelClass = "text-sm font-medium text-fg-soft";

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// "—" is used as a placeholder for empty fields; show it as blank when editing.
function unblank(v: string | undefined) {
  return v && v !== "—" ? v : "";
}

export default function AddEmployeeModal({
  open,
  onClose,
  onCreate,
  editing,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (employee: Employee) => void;
  editing?: Employee | null;
  onUpdate?: (item: Employee, patch: Partial<Employee>) => void;
}) {
  const isEdit = !!editing;
  const [name, setName] = useState(editing?.name ?? "");
  const [department, setDepartment] = useState<Department>(editing?.department ?? departments[0]);
  const [designation, setDesignation] = useState(unblank(editing?.designation));
  const [email, setEmail] = useState(unblank(editing?.email));
  const [phone, setPhone] = useState(unblank(editing?.phone));
  const [ctc, setCtc] = useState(unblank(editing?.ctc));

  function reset() {
    setName("");
    setDepartment(departments[0]);
    setDesignation("");
    setEmail("");
    setPhone("");
    setCtc("");
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (name.trim() === "") return;
    if (isEdit && editing && onUpdate) {
      onUpdate(editing, {
        name: name.trim(),
        initials: initialsOf(name),
        department,
        designation: designation.trim() || "—",
        email: email.trim() || "—",
        phone: phone.trim() || "—",
        ctc: ctc.trim() || "—",
      });
      onClose();
      return;
    }
    onCreate({
      code: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      initials: initialsOf(name),
      department,
      designation: designation.trim() || "—",
      email: email.trim() || "—",
      phone: phone.trim() || "—",
      ctc: ctc.trim() || "—",
      status: "Active",
      joinedNew: true,
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
      title={isEdit ? "Edit Employee" : "Add Employee"}
      description={
        isEdit
          ? "Update this employee's master data."
          : "Add a new employee to your master data."
      }
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
            <select
              id="emp-department"
              className={inputClass}
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department)}
            >
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
            <input
              id="emp-designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Sales Manager"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="emp-email" className={labelClass}>
              Email
            </label>
            <input
              id="emp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rajesh.kumar@company.com"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="emp-phone" className={labelClass}>
              Phone
            </label>
            <input
              id="emp-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="emp-ctc" className={labelClass}>
              CTC
            </label>
            <input
              id="emp-ctc"
              value={ctc}
              onChange={(e) => setCtc(e.target.value)}
              placeholder="₹9.6L"
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
          form="add-employee-form"
          disabled={name.trim() === ""}
        >
          {isEdit ? "Save Changes" : "Add Employee"}
        </Button>
      </div>
    </Modal>
  );
}
