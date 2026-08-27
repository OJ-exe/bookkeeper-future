-- Multi-tenant scoping fix, part 2.
--
-- The earlier "add_multi_tenant_scoping" migration fixed Vendor, Employee,
-- Order, Account, and PayrollRun, which previously had no owner at all. An
-- audit of the rest of the schema found the same problem on five more
-- models: Invoice, Bill, Payment, BankAccount, and BankTransaction. Any
-- authenticated user could read/write/delete every company's invoices,
-- bills, payments, bank accounts, and bank transactions, and the dashboard
-- analytics endpoint aggregated all of it with no user filter at all.
--
-- This migration adds userId to each of them, backfills any pre-existing
-- rows to the earliest user in the system (so nothing is silently deleted),
-- then locks the column down as NOT NULL + foreign key. It also moves
-- Invoice.number and Bill.number from globally-unique to unique-per-user
-- (two different companies can both have an "INV-2026-101"), and does the
-- same for BankAccount.name.
--
-- ASSUMPTION: as with the prior migration, backfilling every existing row
-- to a single user is only appropriate because this is still
-- development/demo data (seeded on first read, mock Indian company
-- figures, no real customer data). If this is ever run against a database
-- that already holds real, multi-company records in these tables, that
-- backfill is NOT what you want — each row needs a real per-row ownership
-- decision first. Review the row counts below before running this against
-- that kind of database.
--
-- SEPARATE, UNRESOLVED ISSUE (see audit notes, not fixed by this
-- migration): the migration history in this repo does not contain a
-- CREATE TABLE for "User", "Session", "Account", "Employee", "Order",
-- "PayrollRun", "Payment", "BankAccount", or "BankTransaction" — only
-- Customer, Vendor, Invoice, and Bill were ever created via a tracked
-- migration. Those other tables clearly exist in the working database (the
-- app depends on them), so they were almost certainly created by
-- `prisma db push` or a manual `CREATE TABLE`, outside of migration
-- history. That means `prisma migrate deploy` against a *fresh* database
-- will fail (this migration's ALTER TABLE statements target tables that
-- were never created). This migration, like the one before it, assumes the
-- tables already exist — it does not attempt to fix the missing history,
-- since doing so blind (without a real database to diff against) risks
-- getting column types/defaults wrong. See the audit report for the
-- recommended next step (`prisma migrate diff` against the live dev
-- database, then a baseline migration).

-- === Invoice ===
ALTER TABLE "Invoice" ADD COLUMN "userId" INTEGER;
UPDATE "Invoice" SET "userId" = (SELECT "id" FROM "User" ORDER BY "id" ASC LIMIT 1) WHERE "userId" IS NULL;
ALTER TABLE "Invoice" ALTER COLUMN "userId" SET NOT NULL;
DROP INDEX IF EXISTS "Invoice_number_key";
CREATE INDEX "Invoice_userId_idx" ON "Invoice"("userId");
CREATE UNIQUE INDEX "Invoice_userId_number_key" ON "Invoice"("userId", "number");
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- === Bill ===
ALTER TABLE "Bill" ADD COLUMN "userId" INTEGER;
UPDATE "Bill" SET "userId" = (SELECT "id" FROM "User" ORDER BY "id" ASC LIMIT 1) WHERE "userId" IS NULL;
ALTER TABLE "Bill" ALTER COLUMN "userId" SET NOT NULL;
DROP INDEX IF EXISTS "Bill_number_key";
CREATE INDEX "Bill_userId_idx" ON "Bill"("userId");
CREATE UNIQUE INDEX "Bill_userId_number_key" ON "Bill"("userId", "number");
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- === Payment ===
-- No business identifier to re-scope here (reference/party are not unique
-- today); ownership is enforced via userId in the service layer.
ALTER TABLE "Payment" ADD COLUMN "userId" INTEGER;
UPDATE "Payment" SET "userId" = (SELECT "id" FROM "User" ORDER BY "id" ASC LIMIT 1) WHERE "userId" IS NULL;
ALTER TABLE "Payment" ALTER COLUMN "userId" SET NOT NULL;
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- === BankAccount ===
ALTER TABLE "BankAccount" ADD COLUMN "userId" INTEGER;
UPDATE "BankAccount" SET "userId" = (SELECT "id" FROM "User" ORDER BY "id" ASC LIMIT 1) WHERE "userId" IS NULL;
ALTER TABLE "BankAccount" ALTER COLUMN "userId" SET NOT NULL;
DROP INDEX IF EXISTS "BankAccount_name_key";
CREATE INDEX "BankAccount_userId_idx" ON "BankAccount"("userId");
CREATE UNIQUE INDEX "BankAccount_userId_name_key" ON "BankAccount"("userId", "name");
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- === BankTransaction ===
ALTER TABLE "BankTransaction" ADD COLUMN "userId" INTEGER;
UPDATE "BankTransaction" SET "userId" = (SELECT "id" FROM "User" ORDER BY "id" ASC LIMIT 1) WHERE "userId" IS NULL;
ALTER TABLE "BankTransaction" ALTER COLUMN "userId" SET NOT NULL;
CREATE INDEX "BankTransaction_userId_idx" ON "BankTransaction"("userId");
ALTER TABLE "BankTransaction" ADD CONSTRAINT "BankTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
