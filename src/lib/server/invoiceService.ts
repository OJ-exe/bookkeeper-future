import { prisma } from "@/lib/prisma";
import type { InvoiceCreateInput, InvoiceUpdateInput } from "@/types/invoice";

function buildInvoiceNumber(number?: string) {
  if (typeof number === "string" && number.trim()) {
    return number.trim();
  }

  const suffix = `${Math.floor(100 + Math.random() * 900)}`;
  return `INV-2026-${suffix}`;
}

async function resolveCustomerId(userId: number, customerId: number | null) {
  if (customerId === null) {
    return null;
  }

  // Prevent linking an invoice to another user's customer record.
  const customer = await prisma.customer.findFirst({ where: { id: customerId, userId } });
  return customer ? customerId : null;
}

async function normalizeInvoicePayload(
  userId: number,
  input: InvoiceCreateInput | Record<string, unknown>
) {
  const customer = typeof input.customer === "string" ? input.customer : "";
  const requestedCustomerId = typeof input.customerId === "number" ? input.customerId : null;

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
    customerId: await resolveCustomerId(userId, requestedCustomerId),
    // vendorId has no Prisma relation on Invoice today and is not used by
    // the frontend; left untouched here rather than removed speculatively.
    vendorId: typeof input.vendorId === "number" ? input.vendorId : null,
  };
}

export async function listInvoices(userId: number) {
  return prisma.invoice.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function createInvoice(userId: number, input: InvoiceCreateInput) {
  return prisma.invoice.create({ data: { userId, ...(await normalizeInvoicePayload(userId, input)) } });
}

export async function updateInvoice(userId: number, id: number, input: InvoiceUpdateInput) {
  const existing = await prisma.invoice.findFirst({ where: { id, userId } });
  if (!existing) {
    return null;
  }

  return prisma.invoice.update({
    where: { id },
    data: {
      ...(await normalizeInvoicePayload(userId, {
        ...existing,
        ...input,
        number: input.number ?? existing.number,
        customer: input.customer ?? existing.customer,
      })),
    },
  });
}

export async function deleteInvoice(userId: number, id: number) {
  const existing = await prisma.invoice.findFirst({ where: { id, userId } });
  if (!existing) {
    return false;
  }

  await prisma.invoice.delete({ where: { id } });
  return true;
}
