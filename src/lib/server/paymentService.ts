import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function getPayments(userId: number) {
  return prisma.payment.findMany({
    where: { userId },
    include: {
      customer: true,
      vendor: true,
      invoice: true,
      bill: true,
      bankAccount: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPayment(
  userId: number,
  data: Omit<Prisma.PaymentCreateInput, "user"> & {
    customerId?: number | null;
    vendorId?: number | null;
    invoiceId?: number | null;
    billId?: number | null;
    bankAccountId?: number | null;
  }
) {
  // Cross-tenant verification
  if (data.customerId) {
    const customer = await prisma.customer.findFirst({ where: { id: data.customerId, userId } });
    if (!customer) throw new Error("Invalid customer");
  }
  if (data.vendorId) {
    const vendor = await prisma.vendor.findFirst({ where: { id: data.vendorId, userId } });
    if (!vendor) throw new Error("Invalid vendor");
  }
  if (data.invoiceId) {
    const invoice = await prisma.invoice.findFirst({ where: { id: data.invoiceId, userId } });
    if (!invoice) throw new Error("Invalid invoice");
  }
  if (data.billId) {
    const bill = await prisma.bill.findFirst({ where: { id: data.billId, userId } });
    if (!bill) throw new Error("Invalid bill");
  }
  if (data.bankAccountId) {
    const bankAccount = await prisma.bankAccount.findFirst({ where: { id: data.bankAccountId, userId } });
    if (!bankAccount) throw new Error("Invalid bank account");
  }

  const { customerId, vendorId, invoiceId, billId, bankAccountId, ...rest } = data;

  return prisma.payment.create({
    data: {
      ...rest,
      user: { connect: { id: userId } },
      ...(customerId ? { customer: { connect: { id: customerId } } } : {}),
      ...(vendorId ? { vendor: { connect: { id: vendorId } } } : {}),
      ...(invoiceId ? { invoice: { connect: { id: invoiceId } } } : {}),
      ...(billId ? { bill: { connect: { id: billId } } } : {}),
      ...(bankAccountId ? { bankAccount: { connect: { id: bankAccountId } } } : {}),
    },
  });
}

export async function getPaymentById(userId: number, id: number) {
  return prisma.payment.findFirst({
    where: { id, userId },
    include: {
      customer: true,
      vendor: true,
      invoice: true,
      bill: true,
      bankAccount: true,
    },
  });
}

export async function updatePayment(
  userId: number,
  id: number,
  data: Prisma.PaymentUpdateInput & {
    customerId?: number | null;
    vendorId?: number | null;
    invoiceId?: number | null;
    billId?: number | null;
    bankAccountId?: number | null;
  }
) {
  const existing = await prisma.payment.findFirst({ where: { id, userId } });
  if (!existing) return null;

  // Cross-tenant verification for any references being changed
  if (data.customerId) {
    const customer = await prisma.customer.findFirst({ where: { id: data.customerId, userId } });
    if (!customer) throw new Error("Invalid customer");
  }
  if (data.vendorId) {
    const vendor = await prisma.vendor.findFirst({ where: { id: data.vendorId, userId } });
    if (!vendor) throw new Error("Invalid vendor");
  }
  if (data.invoiceId) {
    const invoice = await prisma.invoice.findFirst({ where: { id: data.invoiceId, userId } });
    if (!invoice) throw new Error("Invalid invoice");
  }
  if (data.billId) {
    const bill = await prisma.bill.findFirst({ where: { id: data.billId, userId } });
    if (!bill) throw new Error("Invalid bill");
  }
  if (data.bankAccountId) {
    const bankAccount = await prisma.bankAccount.findFirst({ where: { id: data.bankAccountId, userId } });
    if (!bankAccount) throw new Error("Invalid bank account");
  }

  const { customerId, vendorId, invoiceId, billId, bankAccountId, ...rest } = data;

  return prisma.payment.update({
    where: { id },
    data: {
      ...rest,
      ...(customerId !== undefined
        ? { customer: customerId ? { connect: { id: customerId } } : { disconnect: true } }
        : {}),
      ...(vendorId !== undefined
        ? { vendor: vendorId ? { connect: { id: vendorId } } : { disconnect: true } }
        : {}),
      ...(invoiceId !== undefined
        ? { invoice: invoiceId ? { connect: { id: invoiceId } } : { disconnect: true } }
        : {}),
      ...(billId !== undefined
        ? { bill: billId ? { connect: { id: billId } } : { disconnect: true } }
        : {}),
      ...(bankAccountId !== undefined
        ? { bankAccount: bankAccountId ? { connect: { id: bankAccountId } } : { disconnect: true } }
        : {}),
    },
  });
}

export async function deletePayment(userId: number, id: number) {
  const existing = await prisma.payment.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.payment.delete({
    where: { id },
  });
}