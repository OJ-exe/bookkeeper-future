import { prisma } from "@/lib/prisma";
import type { PaymentCreateInput, PaymentUpdateInput } from "@/types/payment";

const seedPayments = [
  {
    date: "15 Jun 2026",
    party: "ABC Pvt Ltd",
    direction: "Received",
    method: "Bank Transfer",
    reference: "INV-2026-152",
    status: "Completed",
    amount: "₹48,500",
  },
  {
    date: "14 Jun 2026",
    party: "Sharma Supplies",
    direction: "Made",
    method: "UPI",
    reference: "BILL-2026-045",
    status: "Completed",
    amount: "₹52,000",
  },
];

function parseAmount(value?: string | null) {
  if (typeof value !== "string") return 0;
  const normalized = value.replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatAmount(value: number) {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

async function resolveCustomerId(userId: number, id: number | null) {
  if (id === null) return null;
  const record = await prisma.customer.findFirst({ where: { id, userId } });
  return record ? id : null;
}

async function resolveVendorId(userId: number, id: number | null) {
  if (id === null) return null;
  const record = await prisma.vendor.findFirst({ where: { id, userId } });
  return record ? id : null;
}

async function resolveInvoiceId(userId: number, id: number | null) {
  if (id === null) return null;
  const record = await prisma.invoice.findFirst({ where: { id, userId } });
  return record ? id : null;
}

async function resolveBillId(userId: number, id: number | null) {
  if (id === null) return null;
  const record = await prisma.bill.findFirst({ where: { id, userId } });
  return record ? id : null;
}

async function resolveBankAccountId(userId: number, id: number | null) {
  if (id === null) return null;
  const record = await prisma.bankAccount.findFirst({ where: { id, userId } });
  return record ? id : null;
}

async function normalizePaymentPayload(userId: number, input: PaymentCreateInput | Record<string, unknown>) {
  const raw = input as Record<string, unknown>;

  // Every foreign key here must belong to the same user, or a payment could
  // be used to link/leak another company's customer, vendor, invoice, bill,
  // or bank account into this user's records.
  const customerId = await resolveCustomerId(userId, typeof raw.customerId === "number" ? raw.customerId : null);
  const vendorId = await resolveVendorId(userId, typeof raw.vendorId === "number" ? raw.vendorId : null);
  const invoiceId = await resolveInvoiceId(userId, typeof raw.invoiceId === "number" ? raw.invoiceId : null);
  const billId = await resolveBillId(userId, typeof raw.billId === "number" ? raw.billId : null);
  const bankAccountId = await resolveBankAccountId(userId, typeof raw.bankAccountId === "number" ? raw.bankAccountId : null);

  return {
    date: typeof raw.date === "string" ? raw.date : null,
    party: typeof raw.party === "string" ? raw.party : "",
    direction: typeof raw.direction === "string" ? raw.direction : "Received",
    method: typeof raw.method === "string" ? raw.method : "Bank Transfer",
    reference: typeof raw.reference === "string" ? raw.reference : null,
    status: typeof raw.status === "string" ? raw.status : "Pending",
    amount: typeof raw.amount === "string" ? raw.amount : "₹0",
    customerId,
    vendorId,
    invoiceId,
    billId,
    bankAccountId,
  };
}

async function syncInvoicePayment(userId: number, id: number | null) {
  if (!id) return;
  const invoice = await prisma.invoice.findFirst({ where: { id, userId } });
  if (!invoice) return;

  const payments = await prisma.payment.findMany({ where: { invoiceId: id, userId } });
  const paid = payments.reduce((sum, payment) => sum + parseAmount(payment.amount), 0);
  const total = parseAmount(invoice.grandTotal);
  const remaining = Math.max(total - paid, 0);

  await prisma.invoice.update({
    where: { id },
    data: {
      open: formatAmount(remaining),
      netReceivable: formatAmount(remaining),
      status: remaining === 0 ? "Paid" : invoice.status === "Overdue" ? "Overdue" : "Sent",
    },
  });
}

async function syncBillPayment(userId: number, id: number | null) {
  if (!id) return;
  const bill = await prisma.bill.findFirst({ where: { id, userId } });
  if (!bill) return;

  const payments = await prisma.payment.findMany({ where: { billId: id, userId } });
  const paid = payments.reduce((sum, payment) => sum + parseAmount(payment.amount), 0);
  const total = parseAmount(bill.grandTotal);
  const remaining = Math.max(total - paid, 0);

  await prisma.bill.update({
    where: { id },
    data: {
      open: formatAmount(remaining),
      netPayable: formatAmount(remaining),
      status: remaining === 0 ? "Paid" : bill.status === "Overdue" ? "Overdue" : "Open",
    },
  });
}

async function syncRelatedDocuments(userId: number, invoiceId: number | null, billId: number | null) {
  await syncInvoicePayment(userId, invoiceId);
  await syncBillPayment(userId, billId);
}

export async function listPayments(userId: number) {
  const existingCount = await prisma.payment.count({ where: { userId } });

  if (existingCount === 0) {
    await prisma.payment.createMany({
      data: seedPayments.map((payment) => ({ userId, ...payment })),
    });
  }

  return prisma.payment.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function getPayment(userId: number, id: number) {
  return prisma.payment.findFirst({ where: { id, userId } });
}

export async function createPayment(userId: number, input: PaymentCreateInput) {
  const payment = await prisma.payment.create({ data: { userId, ...(await normalizePaymentPayload(userId, input)) } });
  await syncRelatedDocuments(userId, payment.invoiceId, payment.billId);
  return payment;
}

export async function updatePayment(userId: number, id: number, input: PaymentUpdateInput) {
  const existing = await prisma.payment.findFirst({ where: { id, userId } });
  if (!existing) {
    return null;
  }

  const payment = await prisma.payment.update({
    where: { id },
    data: {
      ...(await normalizePaymentPayload(userId, {
        ...existing,
        ...input,
        party: input.party ?? existing.party,
      })),
    },
  });

  await syncRelatedDocuments(userId, existing.invoiceId, existing.billId);
  await syncRelatedDocuments(userId, payment.invoiceId, payment.billId);
  return payment;
}

export async function deletePayment(userId: number, id: number) {
  const existing = await prisma.payment.findFirst({ where: { id, userId } });
  if (!existing) {
    return false;
  }

  await syncRelatedDocuments(userId, existing.invoiceId, existing.billId);
  await prisma.payment.delete({ where: { id } });
  await syncRelatedDocuments(userId, existing.invoiceId, existing.billId);
  return true;
}
