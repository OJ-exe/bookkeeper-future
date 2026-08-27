import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function getPayrollRuns(userId: number) {
  return prisma.payrollRun.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPayrollRunById(userId: number, id: string) {
  return prisma.payrollRun.findFirst({
    where: { id, userId },
  });
}

export async function createPayrollRun(
  userId: number,
  data: Omit<Prisma.PayrollRunCreateInput, "user">
) {
  return prisma.payrollRun.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
}

export async function updatePayrollRun(
  userId: number,
  id: string,
  data: Prisma.PayrollRunUpdateInput
) {
  const existing = await prisma.payrollRun.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.payrollRun.update({
    where: { id },
    data,
  });
}

export async function deletePayrollRun(userId: number, id: string) {
  const existing = await prisma.payrollRun.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.payrollRun.delete({
    where: { id },
  });
}