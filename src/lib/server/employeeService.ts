import { prisma } from "@/lib/prisma";
import type { Department, Employee, EmployeeStatus } from "@/data/employees";

const seedEmployees: Array<Omit<Employee, "id">> = [
  {
    code: "EMP-001",
    name: "Rajesh Kumar",
    initials: "RK",
    department: "Sales",
    designation: "Sales Manager",
    email: "rajesh.kumar@company.com",
    phone: "+91 98765 43210",
    ctc: "₹14.4L",
    status: "Active",
    joinedNew: false,
  },
  {
    code: "EMP-007",
    name: "Neha Singh",
    initials: "NS",
    department: "Finance",
    designation: "Senior Accountant",
    email: "neha.singh@company.com",
    phone: "+91 91234 56789",
    ctc: "₹11.2L",
    status: "Active",
    joinedNew: false,
  },
];

function buildInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function normalizeEmployeePayload(input: Employee | Record<string, unknown>) {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const department = typeof input.department === "string" ? (input.department as Department) : "Sales";
  const status = typeof input.status === "string" ? (input.status as EmployeeStatus) : "Active";

  return {
    code: typeof input.code === "string" ? input.code.trim() : `EMP-${Math.floor(100 + Math.random() * 900)}`,
    name,
    initials: typeof input.initials === "string" ? input.initials : buildInitials(name),
    department,
    designation: typeof input.designation === "string" ? input.designation : "—",
    email: typeof input.email === "string" ? input.email : "—",
    phone: typeof input.phone === "string" ? input.phone : "—",
    ctc: typeof input.ctc === "string" ? input.ctc : "₹0",
    status,
    joinedNew: input.joinedNew === true,
  };
}

export async function listEmployees(userId: number) {
  const count = await prisma.employee.count({ where: { userId } });

  if (count === 0) {
    await prisma.employee.createMany({
      data: seedEmployees.map((employee) => ({ userId, ...employee })),
    });
  }

  return prisma.employee.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function createEmployee(userId: number, input: Employee | Record<string, unknown>) {
  return prisma.employee.create({ data: { userId, ...normalizeEmployeePayload(input) } });
}

export async function updateEmployee(
  userId: number,
  id: number,
  input: Partial<Employee> | Record<string, unknown>
) {
  const existing = await prisma.employee.findFirst({ where: { id, userId } });
  if (!existing) {
    return null;
  }

  return prisma.employee.update({
    where: { id },
    data: {
      ...normalizeEmployeePayload({ ...existing, ...input, name: input.name ?? existing.name }),
    },
  });
}

export async function deleteEmployee(userId: number, id: number) {
  const existing = await prisma.employee.findFirst({ where: { id, userId } });
  if (!existing) {
    return false;
  }

  await prisma.employee.delete({ where: { id } });
  return true;
}
