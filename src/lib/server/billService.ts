import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
export async function getBills(userId: number) {
  return prisma.bill.findMany({
    where: { userId },
    include: { vendorRecord: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBillById(userId: number, id: number) {
  return prisma.bill.findFirst({
    where: { id, userId },
    include: { vendorRecord: true },
  });
}

export async function createBill(
  userId: number,
  data: Omit<Prisma.BillCreateInput, "user"> & { vendorId?: number | null }
) {
  if (data.vendorId) {
    const vendor = await prisma.vendor.findFirst({
      where: { id: data.vendorId, userId },
    });
    if (!vendor) throw new Error("Referenced vendor not found or unauthorized");
  }

  const { vendorId, ...rest } = data;
  return prisma.bill.create({
    data: {
      ...rest,
      user: { connect: { id: userId } },
      ...(vendorId ? { vendorRecord: { connect: { id: vendorId } } } : {}),
    },
  });
}

export async function updateBill(
  userId: number,
  id: number,
  data: Prisma.BillUpdateInput
) {
  const existing = await prisma.bill.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.bill.update({
    where: { id },
    data,
  });
}

export async function deleteBill(userId: number, id: number) {
  const existing = await prisma.bill.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.bill.delete({
    where: { id },
  });
}