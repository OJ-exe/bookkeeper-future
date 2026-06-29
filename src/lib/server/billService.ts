import { prisma } from "@/lib/prisma";
import type { BillCreateInput, BillUpdateInput } from "@/types/bill";

function buildBillNumber(number?: string) {
  if (typeof number === "string" && number.trim()) {
    return number.trim();
  }

  const suffix = `${Math.floor(100 + Math.random() * 900)}`;
  return `BILL-2026-${suffix}`;
}

function normalizeBillPayload(input: BillCreateInput | Record<string, unknown>) {
  const vendor = typeof input.vendor === "string" ? input.vendor : "";

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
    vendorId: typeof input.vendorId === "number" ? input.vendorId : null,
  };
}

export async function listBills() {
  const existingCount = await prisma.bill.count();

  if (existingCount === 0) {
    await prisma.bill.createMany({
      data: [
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
      ],
    });
  }

  return prisma.bill.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getBill(id: number) {
  return prisma.bill.findUnique({ where: { id } });
}

export async function createBill(input: BillCreateInput) {
  return prisma.bill.create({ data: normalizeBillPayload(input) });
}

export async function updateBill(id: number, input: BillUpdateInput) {
  const existing = await prisma.bill.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  return prisma.bill.update({
    where: { id },
    data: {
      ...normalizeBillPayload({
        ...existing,
        ...input,
        number: input.number ?? existing.number,
        vendor: input.vendor ?? existing.vendor,
      }),
    },
  });
}

export async function deleteBill(id: number) {
  const existing = await prisma.bill.findUnique({ where: { id } });
  if (!existing) {
    return false;
  }

  await prisma.bill.delete({ where: { id } });
  return true;
}
