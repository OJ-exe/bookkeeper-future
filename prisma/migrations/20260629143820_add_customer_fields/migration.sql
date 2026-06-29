/*
  Warnings:

  - Added the required column `updatedAt` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "gstin" TEXT,
ADD COLUMN     "initials" TEXT,
ADD COLUMN     "isNew" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "outstanding" TEXT DEFAULT '₹0',
ADD COLUMN     "outstandingNote" TEXT DEFAULT 'No invoices',
ADD COLUMN     "revenue" TEXT DEFAULT '₹0',
ADD COLUMN     "revenuePct" TEXT DEFAULT '0% of total',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vip" BOOLEAN NOT NULL DEFAULT false;
