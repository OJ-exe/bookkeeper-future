import { prisma } from "@/lib/prisma";
import type { Account, AccountType } from "@/data/accounts";

const seedAccounts: Array<Omit<Account, "id">> = [
  { code: "1001", name: "Accounts Receivable", type: "Asset", subtype: "Current Assets", balance: "₹1,24,000.00", linked: 12, note: "Default account" },
  { code: "1002", name: "CGST Input", type: "Asset", subtype: "Current Assets", balance: "₹18,450.00", linked: 8, note: "Default account" },
  { code: "1006", name: "Diesel", type: "Asset", subtype: "Inventory", balance: "₹45,200.00", linked: 1, note: "1 linked record" },
  { code: "1007", name: "HDFC 1234", type: "Asset", subtype: "Cash & Cash Equivalents", balance: "₹3,85,000.00", linked: 24, note: "1 linked record" },
  { code: "5001", name: "Purchases", type: "Expense", subtype: "Direct Expense", balance: "₹2,45,000.00", linked: 2, note: "2 linked records" },
  { code: "4001", name: "Sales", type: "Income", subtype: "Operating Income", balance: "₹8,40,000.00", linked: 15, note: "1 linked record" },
];

function normalizeAccountPayload(input: Account | Record<string, unknown>) {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const type = typeof input.type === "string" ? (input.type as AccountType) : "Asset";

  return {
    code: typeof input.code === "string" ? input.code.trim() : "",
    name,
    type,
    subtype: typeof input.subtype === "string" ? input.subtype.trim() : "Current Assets",
    balance: typeof input.balance === "string" ? input.balance : "₹0.00",
    linked: typeof input.linked === "number" ? input.linked : 0,
    note: typeof input.note === "string" ? input.note : "Default account",
  };
}

export async function listAccounts(userId: number) {
  const count = await prisma.account.count({ where: { userId } });

  if (count === 0) {
    await prisma.account.createMany({
      data: seedAccounts.map((account) => ({ userId, ...account })),
    });
  }

  return prisma.account.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function createAccount(userId: number, input: Account | Record<string, unknown>) {
  return prisma.account.create({ data: { userId, ...normalizeAccountPayload(input) } });
}

export async function updateAccount(
  userId: number,
  id: number,
  input: Partial<Account> | Record<string, unknown>
) {
  const existing = await prisma.account.findFirst({ where: { id, userId } });
  if (!existing) {
    return null;
  }

  return prisma.account.update({
    where: { id },
    data: {
      ...normalizeAccountPayload({ ...existing, ...input, name: input.name ?? existing.name }),
    },
  });
}

export async function deleteAccount(userId: number, id: number) {
  const existing = await prisma.account.findFirst({ where: { id, userId } });
  if (!existing) {
    return false;
  }

  await prisma.account.delete({ where: { id } });
  return true;
}
