import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function getOrders(userId: number) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(userId: number, id: number) {
  return prisma.order.findFirst({
    where: { id, userId },
  });
}

export async function createOrder(
  userId: number,
  data: Omit<Prisma.OrderCreateInput, "user">
) {
  return prisma.order.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
}

export async function updateOrder(
  userId: number,
  id: number,
  data: Prisma.OrderUpdateInput
) {
  const existing = await prisma.order.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.order.update({
    where: { id },
    data,
  });
}

export async function deleteOrder(userId: number, id: number) {
  const existing = await prisma.order.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.order.delete({
    where: { id },
  });
}