import { prisma } from "@/lib/prisma";
import type { BillCreateInput, BillUpdateInput } from "@/types/bill";

const seedBills = [
  {
    number: "BILL-2026-045",
    date: "15 Jun 2026",
    due: "30 Jun 2026",
    vendor: "Sharma Supplies",
    source: "Direct",
    status: "Open",
    grandTotal: "₹52,000",
    netPayable: "₹52,000",
    open: "₹52,000",
  },
  {
    number: "BILL-2026-044",
    date: "14 Jun 2026",
    due: "29 Jun 2026",
    vendor: "Metro Logistics",
    source: "PO #PO-128",
    status: "Open",
    grandTotal: "₹1,40,000",
    netPayable: "₹1,40,000",
    open: "₹1,40,000",
  },
  {
    number: "BILL-2026-043",
    date: "13 Jun 2026",
    due: "28 Jun 2026",
    vendor: "Apex Components",
    source: "Direct",
    status: "Paid",
    grandTotal: "₹68,500",
    netPayable: "₹0",
    open: "₹0",
  },
];

function buildBillNumber(number?: string) {
  if (typeof number === "string" && number.trim()) {
    return number.trim();
  }

  const suffix = `${Math.floor(100 + Math.random() * 900)}`;
  return `BILL-2026-${suffix}`;
}

async function resolveVendorId(userId: number, vendorId: number | null) {
  if (vendorId === null) {
    return null;
  }

  // Prevent linking a bill to another user's vendor record.
  const vendor = await prisma.vendor.findFirst({ where: { id: vendorId, userId } });
  return vendor ? vendorId : null;
}

async function normalizeBillPayload(userId: number, input: BillCreateInput | Record<string, unknown>) {
  const vendor = typeof input.vendor === "string" ? input.vendor : "";
  const requestedVendorId = typeof input.vendorId === "number" ? input.vendorId : null;

  return {
    number: buildBillNumber(typeof input.number === "string" ? input.number : undefined),
    date: typeof input.date === "string" ? input.date : null,
    due: typeof input.due === "string" ? input.due : null,
    vendor,
    source: typeof input.source === "string" ? input.source : "Direct",
    status: typeof input.status === "string" ? input.status : "Open",
    grandTotal: typeof input.grandTotal === "string" ? input.grandTotal : "₹0",
    netPayable: typeof input.netPayable === "string" ? input.netPayable : "₹0",
    open: typeof input.open === "string" ? input.open : "₹0",
    vendorId: await resolveVendorId(userId, requestedVendorId),
  };
}

export async function listBills(userId: number) {
  const existingCount = await prisma.bill.count({ where: { userId } });

  if (existingCount === 0) {
    await prisma.bill.createMany({
      data: seedBills.map((bill) => ({ userId, ...bill })),
    });
  }

  return prisma.bill.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function getBill(userId: number, id: number) {
  return prisma.bill.findFirst({ where: { id, userId } });
}

export async function createBill(userId: number, input: BillCreateInput) {
  return prisma.bill.create({ data: { userId, ...(await normalizeBillPayload(userId, input)) } });
}

export async function updateBill(userId: number, id: number, input: BillUpdateInput) {
  const existing = await prisma.bill.findFirst({ where: { id, userId } });
  if (!existing) {
    return null;
  }

  return prisma.bill.update({
    where: { id },
    data: {
      ...(await normalizeBillPayload(userId, {
        ...existing,
        ...input,
        number: input.number ?? existing.number,
        vendor: input.vendor ?? existing.vendor,
      })),
    },
  });
}

export async function deleteBill(userId: number, id: number) {
  const existing = await prisma.bill.findFirst({ where: { id, userId } });
  if (!existing) {
    return false;
  }

  await prisma.bill.delete({ where: { id } });
  return true;
}
