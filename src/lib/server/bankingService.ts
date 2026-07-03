import { prisma } from "@/lib/prisma";
import type { BankAccountCreateInput, BankAccountUpdateInput, BankTransactionCreateInput, BankTransactionUpdateInput } from "@/types/banking";

function normalizeBankAccountPayload(input: BankAccountCreateInput | Record<string, unknown>) {
  return {
    name: typeof input.name === "string" ? input.name : "",
    bankName: typeof input.bankName === "string" ? input.bankName : null,
    accountNo: typeof input.accountNo === "string" ? input.accountNo : null,
    balance: typeof input.balance === "string" ? input.balance : "₹0",
    ledger: typeof input.ledger === "string" ? input.ledger : null,
  };
}

function normalizeBankTransactionPayload(input: BankTransactionCreateInput | Record<string, unknown>) {
  const raw = input as Record<string, unknown>;
  return {
    date: typeof raw.date === "string" ? raw.date : null,
    description: typeof raw.description === "string" ? raw.description : "",
    reference: typeof raw.reference === "string" ? raw.reference : null,
    kind: typeof raw.kind === "string" ? raw.kind : "Inflow",
    amount: typeof raw.amount === "string" ? raw.amount : "₹0",
    account: typeof raw.account === "string" ? raw.account : null,
    status: typeof raw.status === "string" ? raw.status : "Unmatched",
    bankAccountId: typeof raw.bankAccountId === "number" ? raw.bankAccountId : null,
    paymentId: typeof raw.paymentId === "number" ? raw.paymentId : null,
  };
}

export async function listBankAccounts() {
  const existingCount = await prisma.bankAccount.count();

  if (existingCount === 0) {
    await prisma.bankAccount.createMany({
      data: [
        { name: "HDFC Current", bankName: "HDFC Bank", accountNo: "••1234", balance: "₹4,12,000", ledger: "HDFC Bank A/c" },
        { name: "ICICI Savings", bankName: "ICICI Bank", accountNo: "••8842", balance: "₹1,82,500", ledger: "ICICI Bank A/c" },
        { name: "Cash in Hand", bankName: "Cash", accountNo: "••0000", balance: "₹85,400", ledger: "Cash A/c" },
      ],
    });
  }

  return prisma.bankAccount.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getBankAccount(id: number) {
  return prisma.bankAccount.findUnique({ where: { id } });
}

export async function createBankAccount(input: BankAccountCreateInput) {
  return prisma.bankAccount.create({ data: normalizeBankAccountPayload(input) });
}

export async function updateBankAccount(id: number, input: BankAccountUpdateInput) {
  const existing = await prisma.bankAccount.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  return prisma.bankAccount.update({
    where: { id },
    data: normalizeBankAccountPayload({ ...existing, ...input, name: input.name ?? existing.name }),
  });
}

export async function deleteBankAccount(id: number) {
  const existing = await prisma.bankAccount.findUnique({ where: { id } });
  if (!existing) {
    return false;
  }

  await prisma.bankAccount.delete({ where: { id } });
  return true;
}

export async function listBankTransactions() {
  const existingCount = await prisma.bankTransaction.count();

  if (existingCount === 0) {
    await prisma.bankTransaction.createMany({
      data: [
        { date: "18 Jun 2026", description: "Receipt from ABC Pvt Ltd", reference: "NEFT-AX9921", kind: "Inflow", amount: "₹48,500", account: "HDFC Current", status: "Unmatched" },
        { date: "18 Jun 2026", description: "Vendor payment - Global Supplies", reference: "RTGS-GS4410", kind: "Outflow", amount: "₹1,25,000", account: "HDFC Current", status: "Matched" },
      ],
    });
  }

  return prisma.bankTransaction.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getBankTransaction(id: number) {
  return prisma.bankTransaction.findUnique({ where: { id } });
}

export async function createBankTransaction(input: BankTransactionCreateInput) {
  return prisma.bankTransaction.create({ data: normalizeBankTransactionPayload(input) });
}

export async function updateBankTransaction(id: number, input: BankTransactionUpdateInput) {
  const existing = await prisma.bankTransaction.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  return prisma.bankTransaction.update({
    where: { id },
    data: normalizeBankTransactionPayload({ ...existing, ...input, description: input.description ?? existing.description }),
  });
}

export async function deleteBankTransaction(id: number) {
  const existing = await prisma.bankTransaction.findUnique({ where: { id } });
  if (!existing) {
    return false;
  }

  await prisma.bankTransaction.delete({ where: { id } });
  return true;
}
