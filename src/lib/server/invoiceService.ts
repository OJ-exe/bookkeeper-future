import { prisma } from "@/lib/prisma";
import type { InvoiceCreateInput, InvoiceUpdateInput } from "@/types/invoice";

function buildInvoiceNumber(number?: string) {
  if (typeof number === "string" && number.trim()) {
    return number.trim();
  }

  const suffix = `${Math.floor(100 + Math.random() * 900)}`;
  return `INV-2026-${suffix}`;
}

function normalizeInvoicePayload(input: InvoiceCreateInput | Record<string, unknown>) {
  const customer = typeof input.customer === "string" ? input.customer : "";

  return {
    number: buildInvoiceNumber(typeof input.number === "string" ? input.number : undefined),
    date: typeof input.date === "string" ? input.date : null,
    due: typeof input.due === "string" ? input.due : null,
    customer,
    source: typeof input.source === "string" ? input.source : "Direct",
    status: typeof input.status === "string" ? input.status : "Sent",
    grandTotal: typeof input.grandTotal === "string" ? input.grandTotal : "₹0",
    netReceivable: typeof input.netReceivable === "string" ? input.netReceivable : "₹0",
    open: typeof input.open === "string" ? input.open : "₹0",
    customerId: typeof input.customerId === "number" ? input.customerId : null,
    vendorId: typeof input.vendorId === "number" ? input.vendorId : null,
  };
}

export async function listInvoices() {
  return prisma.invoice.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createInvoice(input: InvoiceCreateInput) {
  return prisma.invoice.create({ data: normalizeInvoicePayload(input) });
}

export async function updateInvoice(id: number, input: InvoiceUpdateInput) {
  const existing = await prisma.invoice.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  return prisma.invoice.update({
    where: { id },
    data: {
      ...normalizeInvoicePayload({
        ...existing,
        ...input,
        number: input.number ?? existing.number,
        customer: input.customer ?? existing.customer,
      }),
    },
  });
}

export async function deleteInvoice(id: number) {
  const existing = await prisma.invoice.findUnique({ where: { id } });
  if (!existing) {
    return false;
  }

  await prisma.invoice.delete({ where: { id } });
  return true;
}
