import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function getVendors(userId: number) {
  return prisma.vendor.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getVendorById(userId: number, id: number) {
  return prisma.vendor.findFirst({
    where: { id, userId },
  });
}

export async function createVendor(
  userId: number,
  data: Omit<Prisma.VendorCreateInput, "user">
) {
  return prisma.vendor.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
}

export async function updateVendor(
  userId: number,
  id: number,
  data: Prisma.VendorUpdateInput
) {
  const existing = await prisma.vendor.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.vendor.update({
    where: { id },
    data,
  });
}

export async function deleteVendor(userId: number, id: number) {
  const existing = await prisma.vendor.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.vendor.delete({
    where: { id },
  });
}