import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
export async function getAccounts(userId: number) {
  return prisma.account.findMany({
    where: { userId },
    orderBy: { code: "asc" },
  });
}

export async function getAccountById(userId: number, id: number) {
  return prisma.account.findFirst({
    where: { id, userId },
  });
}

export async function createAccount(
  userId: number,
  data: Omit<Prisma.AccountCreateInput, "user">
) {
  return prisma.account.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
}

export async function updateAccount(
  userId: number,
  id: number,
  data: Prisma.AccountUpdateInput
) {
  const existing = await prisma.account.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.account.update({
    where: { id },
    data,
  });
}

export async function deleteAccount(userId: number, id: number) {
  const existing = await prisma.account.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.account.delete({
    where: { id },
  });
}