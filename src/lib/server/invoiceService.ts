import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
export async function getInvoices(userId: number) {
  return prisma.invoice.findMany({
    where: { userId },
    include: { customerRecord: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getInvoiceById(userId: number, id: number) {
  return prisma.invoice.findFirst({
    where: { id, userId },
    include: { customerRecord: true },
  });
}

export async function createInvoice(
  userId: number,
  data: Omit<Prisma.InvoiceCreateInput, "user"> & { customerId?: number | null }
) {
  if (data.customerId) {
    const customer = await prisma.customer.findFirst({
      where: { id: data.customerId, userId },
    });
    if (!customer) throw new Error("Referenced customer not found or unauthorized");
  }

  const { customerId, ...rest } = data;
  return prisma.invoice.create({
    data: {
      ...rest,
      user: { connect: { id: userId } },
      ...(customerId ? { customerRecord: { connect: { id: customerId } } } : {}),
    },
  });
}

export async function updateInvoice(
  userId: number,
  id: number,
  data: Prisma.InvoiceUpdateInput
) {
  const existing = await prisma.invoice.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.invoice.update({
    where: { id },
    data,
  });
}

export async function deleteInvoice(userId: number, id: number) {
  const existing = await prisma.invoice.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.invoice.delete({
    where: { id },
  });
}