"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Users,
  UserCheck,
  UserMinus,
  Building2,
  BadgeDollarSign,
  MoreVertical,
  Eye,
  Pencil,
  Wallet,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import CardSelect from "@/components/ui/CardSelect";
import { Menu, MenuItem } from "@/components/ui/Menu";

import AddEmployeeModal from "@/components/dashboard/employees/AddEmployeeModal";

import {
  employeeTabs,
  departments,
  type Employee,
  type EmployeeStatus,
} from "@/data/employees";
import { useCollection } from "@/lib/store/dataStore";

const statusTone: Record<EmployeeStatus, "success" | "warning" | "neutral"> = {
  Active: "success",
  "On Leave": "warning",
  Inactive: "neutral",
};

function tabPredicate(tab: string, e: Employee): boolean {
  switch (tab) {
    case "Active":
      return e.status === "Active";
    case "On Leave":
      return e.status === "On Leave";
    case "New Joiners":
      return e.joinedNew;
    case "Inactive":
      return e.status === "Inactive";
    default:
      return true; // "All Employees"
  }
}

const departmentOptions = ["All Departments", ...departments];

export default function EmployeesScreen() {
  const { items: employees, add, remove } = useCollection<Employee>("employees");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All Employees");
  const [department, setDepartment] = useState("All Departments");
  const [addOpen, setAddOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<Employee | null>(null);

  const q = query.trim().toLowerCase();
  const filtered = employees.filter((e) => {
    const matchesQuery =
      !q ||
      e.code.toLowerCase().includes(q) ||
      e.name.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q);
    const matchesDept =
      department === "All Departments" || e.department === department;
    return matchesQuery && matchesDept && tabPredicate(tab, e);
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Employees"
        description="Manage employee master data, departments, compensation, and payroll context."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download size={16} /> Download Template
            </Button>
            <Button variant="outline" size="sm">
              <Upload size={16} /> Upload CSV
            </Button>
            <Button variant="bronze" size="sm" onClick={() => setAddOpen(true)}>
              <Plus size={16} /> Add Employee
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard icon={Users} label="Total Employees" value="48" tone="info" />
        <StatCard
          icon={UserCheck}
          label="Active"
          value="44"
          sublabel="92% of total"
          tone="success"
        />
        <StatCard
          icon={UserMinus}
          label="On Leave"
          value="3"
          sublabel="This week"
          sublabelTone="muted"
          tone="warning"
        />
        <StatCard icon={Building2} label="Departments" value="5" tone="bronze" />
        <StatCard
          icon={BadgeDollarSign}
          label="Monthly Payroll"
          value="₹38.4L"
          sublabel="Gross"
          tone="success"
        />
      </div>

      {/* Directory */}
      <Card padded={false} className="p-5">
        {/* Tab bar */}
        <div className="flex flex-wrap items-center gap-2">
          {employeeTabs.map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-bronze bg-bronze-soft text-bronze"
                    : "border-line text-fg-soft hover:bg-bronze-soft/50"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Search + filters */}
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 lg:max-w-md">
            <Search size={16} className="shrink-0 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search code, name, department, designation, email…"
              className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
            />
          </div>
          <div className="flex items-center gap-2">
            <CardSelect
              options={departmentOptions}
              value={department}
              onChange={setDepartment}
            />
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-fg-soft hover:bg-bronze-soft/50 transition"
            >
              <Filter size={14} /> Filters
            </button>
          </div>
        </div>

        <div className="my-5 h-px bg-line" />

        <h3 className="text-sm font-semibold text-fg">
          Employee Directory ({filtered.length})
        </h3>

        {/* Table */}
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
                <th className="py-2.5 pr-3 font-medium">Employee</th>
                <th className="py-2.5 pr-3 font-medium">Department</th>
                <th className="py-2.5 pr-3 font-medium">Designation</th>
                <th className="py-2.5 pr-3 font-medium">Contact</th>
                <th className="py-2.5 pr-3 font-medium">CTC</th>
                <th className="py-2.5 pr-3 font-medium">Status</th>
                <th className="py-2.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted">
                    No employees match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr
                    key={e.code}
                    className="border-b border-line/60 hover:bg-bronze-soft/30 transition"
                  >
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bronze-soft text-xs font-semibold text-bronze">
                          {e.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-fg">{e.name}</p>
                          <p className="text-xs text-muted">{e.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-fg-soft">{e.department}</td>
                    <td className="py-3 pr-3 text-fg-soft">{e.designation}</td>
                    <td className="py-3 pr-3">
                      <p className="text-fg-soft">{e.email}</p>
                      <p className="text-xs text-muted">{e.phone}</p>
                    </td>
                    <td className="py-3 pr-3 font-medium text-fg">{e.ctc}</td>
                    <td className="py-3 pr-3">
                      <StatusPill tone={statusTone[e.status]}>{e.status}</StatusPill>
                    </td>
                    <td className="py-3 text-right">
                      <Menu
                        align="right"
                        widthClass="w-44"
                        trigger={
                          <button
                            type="button"
                            aria-label={`Actions for ${e.name}`}
                            className="text-muted hover:text-bronze transition"
                          >
                            <MoreVertical size={16} />
                          </button>
                        }
                      >
                        <MenuItem icon={Eye}>View</MenuItem>
                        <MenuItem icon={Pencil}>Edit</MenuItem>
                        <MenuItem icon={Wallet}>Run Payroll</MenuItem>
                        <MenuItem
                          icon={Trash2}
                          danger
                          onClick={() => setDeactivateTarget(e)}
                        >
                          Deactivate
                        </MenuItem>
                      </Menu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
          <span className="text-muted">
            Showing 1 to {filtered.length} of {filtered.length} employees
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted hover:bg-bronze-soft/50"
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-bronze-soft font-medium text-bronze">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-fg-soft hover:bg-bronze-soft/50">
                2
              </button>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted hover:bg-bronze-soft/50"
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
            <span className="text-muted">10 / page</span>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <AddEmployeeModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={(employee) => add(employee)}
      />

      <Modal
        open={deactivateTarget !== null}
        onClose={() => setDeactivateTarget(null)}
        title="Deactivate employee?"
        description="This action can be reversed later."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeactivateTarget(null)}>
              Cancel
            </Button>
            <button
              type="button"
              onClick={() => {
                if (deactivateTarget) remove(deactivateTarget);
                setDeactivateTarget(null);
              }}
              className="h-11 px-5 rounded-xl bg-danger text-white text-sm font-medium hover:opacity-90 transition"
            >
              Deactivate
            </button>
          </>
        }
      >
        <p className="text-sm text-fg-soft">
          Are you sure you want to deactivate{" "}
          <span className="font-semibold text-fg">{deactivateTarget?.name}</span>? They
          will be excluded from active payroll runs.
        </p>
      </Modal>
    </div>
  );
}
