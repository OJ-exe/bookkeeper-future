import { prisma } from "@/lib/prisma";
import type { PaymentCreateInput, PaymentUpdateInput } from "@/types/payment";

function parseAmount(value?: string | null) {
  if (typeof value !== "string") return 0;
  const normalized = value.replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatAmount(value: number) {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function normalizePaymentPayload(input: PaymentCreateInput | Record<string, unknown>) {
  return {
    date: typeof input.date === "string" ? input.date : null,
    party: typeof input.party === "string" ? input.party : "",
    direction: typeof input.direction === "string" ? input.direction : "Received",
    method: typeof input.method === "string" ? input.method : "Bank Transfer",
    reference: typeof input.reference === "string" ? input.reference : null,
    status: typeof input.status === "string" ? input.status : "Pending",
    amount: typeof input.amount === "string" ? input.amount : "₹0",
    customerId: typeof input.customerId === "number" ? input.customerId : null,
    vendorId: typeof input.vendorId === "number" ? input.vendorId : null,
    invoiceId: typeof input.invoiceId === "number" ? input.invoiceId : null,
    billId: typeof input.billId === "number" ? input.billId : null,
    bankAccountId: typeof input.bankAccountId === "number" ? input.bankAccountId : null,
    transactionId: typeof input.transactionId === "number" ? input.transactionId : null,
  };
}

async function syncInvoicePayment(id: number | null) {
  if (!id) return;
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) return;

  const payments = await prisma.payment.findMany({ where: { invoiceId: id } });
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

async function syncBillPayment(id: number | null) {
  if (!id) return;
  const bill = await prisma.bill.findUnique({ where: { id } });
  if (!bill) return;

  const payments = await prisma.payment.findMany({ where: { billId: id } });
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

async function syncRelatedDocuments(invoiceId: number | null, billId: number | null) {
  await syncInvoicePayment(invoiceId);
  await syncBillPayment(billId);
}

export async function listPayments() {
  const existingCount = await prisma.payment.count();

  if (existingCount === 0) {
    await prisma.payment.createMany({
      data: [
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
      ],
    });
  }

  return prisma.payment.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getPayment(id: number) {
  return prisma.payment.findUnique({ where: { id } });
}

export async function createPayment(input: PaymentCreateInput) {
  const payment = await prisma.payment.create({ data: normalizePaymentPayload(input) });
  await syncRelatedDocuments(payment.invoiceId, payment.billId);
  return payment;
}

export async function updatePayment(id: number, input: PaymentUpdateInput) {
  const existing = await prisma.payment.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  const payment = await prisma.payment.update({
    where: { id },
    data: {
      ...normalizePaymentPayload({
        ...existing,
        ...input,
        party: input.party ?? existing.party,
      }),
    },
  });

  await syncRelatedDocuments(existing.invoiceId, existing.billId);
  await syncRelatedDocuments(payment.invoiceId, payment.billId);
  return payment;
}

export async function deletePayment(id: number) {
  const existing = await prisma.payment.findUnique({ where: { id } });
  if (!existing) {
    return false;
  }

  await syncRelatedDocuments(existing.invoiceId, existing.billId);
  await prisma.payment.delete({ where: { id } });
  await syncRelatedDocuments(existing.invoiceId, existing.billId);
  return true;
}
