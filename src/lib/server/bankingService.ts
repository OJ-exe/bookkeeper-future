import { prisma } from "@/lib/prisma";
import type { BankAccountCreateInput, BankAccountUpdateInput, BankTransactionCreateInput, BankTransactionUpdateInput } from "@/types/banking";

const seedBankAccounts = [
  { name: "HDFC Current", bankName: "HDFC Bank", accountNo: "••1234", balance: "₹4,12,000", ledger: "HDFC Bank A/c" },
  { name: "ICICI Savings", bankName: "ICICI Bank", accountNo: "••8842", balance: "₹1,82,500", ledger: "ICICI Bank A/c" },
  { name: "Cash in Hand", bankName: "Cash", accountNo: "••0000", balance: "₹85,400", ledger: "Cash A/c" },
];

const seedBankTransactions = [
  { date: "18 Jun 2026", description: "Receipt from ABC Pvt Ltd", reference: "NEFT-AX9921", kind: "Inflow", amount: "₹48,500", account: "HDFC Current", status: "Unmatched" },
  { date: "18 Jun 2026", description: "Vendor payment - Global Supplies", reference: "RTGS-GS4410", kind: "Outflow", amount: "₹1,25,000", account: "HDFC Current", status: "Matched" },
];

function normalizeBankAccountPayload(input: BankAccountCreateInput | Record<string, unknown>) {
  return {
    name: typeof input.name === "string" ? input.name : "",
    bankName: typeof input.bankName === "string" ? input.bankName : null,
    accountNo: typeof input.accountNo === "string" ? input.accountNo : null,
    balance: typeof input.balance === "string" ? input.balance : "₹0",
    ledger: typeof input.ledger === "string" ? input.ledger : null,
  };
}

async function resolveBankAccountId(userId: number, id: number | null) {
  if (id === null) return null;
  const record = await prisma.bankAccount.findFirst({ where: { id, userId } });
  return record ? id : null;
}

async function resolvePaymentId(userId: number, id: number | null) {
  if (id === null) return null;
  const record = await prisma.payment.findFirst({ where: { id, userId } });
  return record ? id : null;
}

async function normalizeBankTransactionPayload(
  userId: number,
  input: BankTransactionCreateInput | Record<string, unknown>
) {
  const raw = input as Record<string, unknown>;
  return {
    date: typeof raw.date === "string" ? raw.date : null,
    description: typeof raw.description === "string" ? raw.description : "",
    reference: typeof raw.reference === "string" ? raw.reference : null,
    kind: typeof raw.kind === "string" ? raw.kind : "Inflow",
    amount: typeof raw.amount === "string" ? raw.amount : "₹0",
    account: typeof raw.account === "string" ? raw.account : null,
    status: typeof raw.status === "string" ? raw.status : "Unmatched",
    bankAccountId: await resolveBankAccountId(userId, typeof raw.bankAccountId === "number" ? raw.bankAccountId : null),
    paymentId: await resolvePaymentId(userId, typeof raw.paymentId === "number" ? raw.paymentId : null),
  };
}

export async function listBankAccounts(userId: number) {
  const existingCount = await prisma.bankAccount.count({ where: { userId } });

  if (existingCount === 0) {
    await prisma.bankAccount.createMany({
      data: seedBankAccounts.map((account) => ({ userId, ...account })),
    });
  }

  return prisma.bankAccount.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function getBankAccount(userId: number, id: number) {
  return prisma.bankAccount.findFirst({ where: { id, userId } });
}

export async function createBankAccount(userId: number, input: BankAccountCreateInput) {
  return prisma.bankAccount.create({ data: { userId, ...normalizeBankAccountPayload(input) } });
}

export async function updateBankAccount(userId: number, id: number, input: BankAccountUpdateInput) {
  const existing = await prisma.bankAccount.findFirst({ where: { id, userId } });
  if (!existing) {
    return null;
  }

  return prisma.bankAccount.update({
    where: { id },
    data: normalizeBankAccountPayload({ ...existing, ...input, name: input.name ?? existing.name }),
  });
}

export async function deleteBankAccount(userId: number, id: number) {
  const existing = await prisma.bankAccount.findFirst({ where: { id, userId } });
  if (!existing) {
    return false;
  }

  await prisma.bankAccount.delete({ where: { id } });
  return true;
}

export async function listBankTransactions(userId: number) {
  const existingCount = await prisma.bankTransaction.count({ where: { userId } });

  if (existingCount === 0) {
    await prisma.bankTransaction.createMany({
      data: seedBankTransactions.map((transaction) => ({ userId, ...transaction })),
    });
  }

  return prisma.bankTransaction.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function getBankTransaction(userId: number, id: number) {
  return prisma.bankTransaction.findFirst({ where: { id, userId } });
}

export async function createBankTransaction(userId: number, input: BankTransactionCreateInput) {
  return prisma.bankTransaction.create({
    data: { userId, ...(await normalizeBankTransactionPayload(userId, input)) },
  });
}

export async function updateBankTransaction(userId: number, id: number, input: BankTransactionUpdateInput) {
  const existing = await prisma.bankTransaction.findFirst({ where: { id, userId } });
  if (!existing) {
    return null;
  }

  return prisma.bankTransaction.update({
    where: { id },
    data: await normalizeBankTransactionPayload(userId, {
      ...existing,
      ...input,
      description: input.description ?? existing.description,
    }),
  });
}

export async function deleteBankTransaction(userId: number, id: number) {
  const existing = await prisma.bankTransaction.findFirst({ where: { id, userId } });
  if (!existing) {
    return false;
  }

  await prisma.bankTransaction.delete({ where: { id } });
  return true;
}
