import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function getCustomers(userId: number) {
  return prisma.customer.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCustomerById(userId: number, id: number) {
  return prisma.customer.findFirst({
    where: { id, userId },
  });
}

export async function createCustomer(
  userId: number,
  data: Omit<Prisma.CustomerCreateInput, "user">
) {
  return prisma.customer.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
}

export async function updateCustomer(
  userId: number,
  id: number,
  data: Prisma.CustomerUpdateInput
) {
  const existing = await prisma.customer.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.customer.update({
    where: { id },
    data,
  });
}

export async function deleteCustomer(userId: number, id: number) {
  const existing = await prisma.customer.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.customer.delete({
    where: { id },
  });
}