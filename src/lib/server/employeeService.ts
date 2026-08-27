import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function getEmployees(userId: number) {
  return prisma.employee.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEmployeeById(userId: number, id: number) {
  return prisma.employee.findFirst({
    where: { id, userId },
  });
}

export async function createEmployee(
  userId: number,
  data: Omit<Prisma.EmployeeCreateInput, "user">
) {
  return prisma.employee.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
}

export async function updateEmployee(
  userId: number,
  id: number,
  data: Prisma.EmployeeUpdateInput
) {
  const existing = await prisma.employee.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.employee.update({
    where: { id },
    data,
  });
}

export async function deleteEmployee(userId: number, id: number) {
  const existing = await prisma.employee.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.employee.delete({
    where: { id },
  });
}