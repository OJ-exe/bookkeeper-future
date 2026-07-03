import { prisma } from "@/lib/prisma";
import type { PayrollRun, PayrollStatus } from "@/data/payroll";

const seedPayrollRuns: PayrollRun[] = [
  {
    id: "PR-2026-06",
    period: "June 2026",
    employees: 44,
    gross: "₹38.4L",
    deductions: "₹6.3L",
    netPay: "₹32.1L",
    status: "Processing",
    payDate: "Jul 01, 2026",
  },
  {
    id: "PR-2026-05",
    period: "May 2026",
    employees: 45,
    gross: "₹38.9L",
    deductions: "₹6.4L",
    netPay: "₹32.5L",
    status: "Paid",
    payDate: "Jun 01, 2026",
  },
];

function normalizePayrollPayload(input: PayrollRun | Record<string, unknown>) {
  const status = typeof input.status === "string" ? (input.status as PayrollStatus) : "Pending";
  const id = typeof input.id === "string" && input.id.trim() ? input.id.trim() : `PR-${Date.now()}`;

  return {
    id,
    period: typeof input.period === "string" ? input.period : "Current",
    employees: typeof input.employees === "number" ? input.employees : 0,
    gross: typeof input.gross === "string" ? input.gross : "₹0",
    deductions: typeof input.deductions === "string" ? input.deductions : "₹0",
    netPay: typeof input.netPay === "string" ? input.netPay : "₹0",
    status,
    payDate: typeof input.payDate === "string" ? input.payDate : "—",
  };
}

export async function listPayrollRuns() {
  const count = await prisma.payrollRun.count();

  if (count === 0) {
    await prisma.payrollRun.createMany({ data: seedPayrollRuns });
  }

  return prisma.payrollRun.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createPayrollRun(input: PayrollRun | Record<string, unknown>) {
  return prisma.payrollRun.create({ data: normalizePayrollPayload(input) });
}

export async function updatePayrollRun(id: string, input: Partial<PayrollRun> | Record<string, unknown>) {
  const existing = await prisma.payrollRun.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  return prisma.payrollRun.update({
    where: { id },
    data: {
      ...normalizePayrollPayload({ ...existing, ...input, id: input.id ?? existing.id }),
    },
  });
}

export async function deletePayrollRun(id: string) {
  const existing = await prisma.payrollRun.findUnique({ where: { id } });
  if (!existing) {
    return false;
  }

  await prisma.payrollRun.delete({ where: { id } });
  return true;
}
