import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function getBankAccounts(userId: number) {
  return prisma.bankAccount.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBankAccountById(userId: number, id: number) {
  return prisma.bankAccount.findFirst({
    where: { id, userId },
  });
}

export async function createBankAccount(
  userId: number,
  data: Omit<Prisma.BankAccountCreateInput, "user">
) {
  return prisma.bankAccount.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
}

export async function updateBankAccount(
  userId: number,
  id: number,
  data: Prisma.BankAccountUpdateInput
) {
  const existing = await prisma.bankAccount.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.bankAccount.update({
    where: { id },
    data,
  });
}

export async function deleteBankAccount(userId: number, id: number) {
  const existing = await prisma.bankAccount.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.bankAccount.delete({
    where: { id },
  });
}

export async function getBankTransactions(userId: number) {
  return prisma.bankTransaction.findMany({
    where: { userId },
    include: { bankAccount: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createBankTransaction(
  userId: number,
  data: Omit<Prisma.BankTransactionCreateInput, "user"> & {
    bankAccountId?: number | null;
    paymentId?: number | null;
  }
) {
  if (data.bankAccountId) {
    const acc = await prisma.bankAccount.findFirst({
      where: { id: data.bankAccountId, userId },
    });
    if (!acc) throw new Error("Bank account not found or unauthorized");
  }
  if (data.paymentId) {
    const payment = await prisma.payment.findFirst({
      where: { id: data.paymentId, userId },
    });
    if (!payment) throw new Error("Payment not found or unauthorized");
  }

  const { bankAccountId, paymentId, ...rest } = data;
  return prisma.bankTransaction.create({
    data: {
      ...rest,
      user: { connect: { id: userId } },
      ...(bankAccountId ? { bankAccount: { connect: { id: bankAccountId } } } : {}),
      ...(paymentId ? { payment: { connect: { id: paymentId } } } : {}),
    },
  });
}

export async function getBankTransactionById(userId: number, id: number) {
  return prisma.bankTransaction.findFirst({
    where: { id, userId },
    include: { bankAccount: true, payment: true },
  });
}

export async function updateBankTransaction(
  userId: number,
  id: number,
  data: Prisma.BankTransactionUpdateInput & {
    bankAccountId?: number | null;
    paymentId?: number | null;
  }
) {
  const existing = await prisma.bankTransaction.findFirst({ where: { id, userId } });
  if (!existing) return null;

  if (data.bankAccountId) {
    const acc = await prisma.bankAccount.findFirst({
      where: { id: data.bankAccountId, userId },
    });
    if (!acc) throw new Error("Bank account not found or unauthorized");
  }
  if (data.paymentId) {
    const payment = await prisma.payment.findFirst({
      where: { id: data.paymentId, userId },
    });
    if (!payment) throw new Error("Payment not found or unauthorized");
  }

  const { bankAccountId, paymentId, ...rest } = data;

  return prisma.bankTransaction.update({
    where: { id },
    data: {
      ...rest,
      ...(bankAccountId !== undefined
        ? { bankAccount: bankAccountId ? { connect: { id: bankAccountId } } : { disconnect: true } }
        : {}),
      ...(paymentId !== undefined
        ? { payment: paymentId ? { connect: { id: paymentId } } : { disconnect: true } }
        : {}),
    },
  });
}

export async function deleteBankTransaction(userId: number, id: number) {
  const existing = await prisma.bankTransaction.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.bankTransaction.delete({
    where: { id },
  });
}