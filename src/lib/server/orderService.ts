import { prisma } from "@/lib/prisma";
import type { Order, OrderKind, OrderStatus } from "@/data/orders";

const seedOrders: Array<Omit<Order, "id">> = [
  {
    number: "ORD-2026-125",
    date: "15 Jun 2026",
    expectedDate: "30 Jun 2026",
    party: "ABC Pvt Ltd",
    kind: "Sales Order",
    status: "Open",
    total: "₹1,25,000",
    fulfilled: "0%",
    value: "₹1,25,000",
  },
  {
    number: "ORD-2026-124",
    date: "14 Jun 2026",
    expectedDate: "28 Jun 2026",
    party: "XYZ Industries",
    kind: "Sales Order",
    status: "Partially Fulfilled",
    total: "₹2,40,000",
    fulfilled: "60%",
    value: "₹2,40,000",
  },
];

function normalizeOrderPayload(input: Order | Record<string, unknown>) {
  const kind = typeof input.kind === "string" ? (input.kind as OrderKind) : "Sales Order";
  const status = typeof input.status === "string" ? (input.status as OrderStatus) : "Open";

  return {
    number: typeof input.number === "string" ? input.number.trim() : `ORD-${Math.floor(100 + Math.random() * 900)}`,
    date: typeof input.date === "string" ? input.date : null,
    expectedDate: typeof input.expectedDate === "string" ? input.expectedDate : null,
    party: typeof input.party === "string" ? input.party : "—",
    kind,
    status,
    total: typeof input.total === "string" ? input.total : "₹0",
    fulfilled: typeof input.fulfilled === "string" ? input.fulfilled : "0%",
    value: typeof input.value === "string" ? input.value : "₹0",
  };
}

export async function listOrders() {
  const count = await prisma.order.count();

  if (count === 0) {
    await prisma.order.createMany({ data: seedOrders });
  }

  return prisma.order.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createOrder(input: Order | Record<string, unknown>) {
  return prisma.order.create({ data: normalizeOrderPayload(input) });
}

export async function updateOrder(id: number, input: Partial<Order> | Record<string, unknown>) {
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  return prisma.order.update({
    where: { id },
    data: {
      ...normalizeOrderPayload({ ...existing, ...input, number: input.number ?? existing.number }),
    },
  });
}

export async function deleteOrder(id: number) {
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    return false;
  }

  await prisma.order.delete({ where: { id } });
  return true;
}
