-- Multi-tenant scoping fix.
--
-- Vendor, Employee, Order, Account and PayrollRun previously had no owner at
-- all: any authenticated user could read/write every company's vendors,
-- employees, chart of accounts, orders, and payroll runs. This migration adds
-- userId to each of them, backfills any pre-existing rows to the earliest
-- user in the system (so nothing is silently deleted), then locks the column
-- down as NOT NULL + foreign key.
--
-- ASSUMPTION: if this is run against a database that already has real,
-- multi-company data in these tables, backfilling everything to a single
-- user is almost certainly NOT what you want — that data needs a real
-- per-row ownership decision first. Review the backfill step below (and the
-- row counts it would touch) before running this in that situation.

-- === Vendor ===
ALTER TABLE "Vendor" ADD COLUMN "userId" INTEGER;
UPDATE "Vendor" SET "userId" = (SELECT "id" FROM "User" ORDER BY "id" ASC LIMIT 1) WHERE "userId" IS NULL;
ALTER TABLE "Vendor" ALTER COLUMN "userId" SET NOT NULL;
DROP INDEX IF EXISTS "Vendor_email_key";
CREATE INDEX "Vendor_userId_idx" ON "Vendor"("userId");
CREATE UNIQUE INDEX "Vendor_userId_email_key" ON "Vendor"("userId", "email");
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- === Employee ===
ALTER TABLE "Employee" ADD COLUMN "userId" INTEGER;
UPDATE "Employee" SET "userId" = (SELECT "id" FROM "User" ORDER BY "id" ASC LIMIT 1) WHERE "userId" IS NULL;
ALTER TABLE "Employee" ALTER COLUMN "userId" SET NOT NULL;
DROP INDEX IF EXISTS "Employee_code_key";
CREATE INDEX "Employee_userId_idx" ON "Employee"("userId");
CREATE UNIQUE INDEX "Employee_userId_code_key" ON "Employee"("userId", "code");
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- === Order ===
ALTER TABLE "Order" ADD COLUMN "userId" INTEGER;
UPDATE "Order" SET "userId" = (SELECT "id" FROM "User" ORDER BY "id" ASC LIMIT 1) WHERE "userId" IS NULL;
ALTER TABLE "Order" ALTER COLUMN "userId" SET NOT NULL;
DROP INDEX IF EXISTS "Order_number_key";
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE UNIQUE INDEX "Order_userId_number_key" ON "Order"("userId", "number");
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- === Account ===
ALTER TABLE "Account" ADD COLUMN "userId" INTEGER;
UPDATE "Account" SET "userId" = (SELECT "id" FROM "User" ORDER BY "id" ASC LIMIT 1) WHERE "userId" IS NULL;
ALTER TABLE "Account" ALTER COLUMN "userId" SET NOT NULL;
DROP INDEX IF EXISTS "Account_code_key";
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
CREATE UNIQUE INDEX "Account_userId_code_key" ON "Account"("userId", "code");
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- === PayrollRun ===
-- id stays a globally unique business key (e.g. "PR-2026-06"); userId is
-- added for ownership/authorization checks in the service layer.
ALTER TABLE "PayrollRun" ADD COLUMN "userId" INTEGER;
UPDATE "PayrollRun" SET "userId" = (SELECT "id" FROM "User" ORDER BY "id" ASC LIMIT 1) WHERE "userId" IS NULL;
ALTER TABLE "PayrollRun" ALTER COLUMN "userId" SET NOT NULL;
CREATE INDEX "PayrollRun_userId_idx" ON "PayrollRun"("userId");
ALTER TABLE "PayrollRun" ADD CONSTRAINT "PayrollRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
