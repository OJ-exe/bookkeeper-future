import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

const adapter = connectionString ? new PrismaPg({ connectionString }) : undefined;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter } as never);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}