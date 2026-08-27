-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT,
    "preferred" BOOLEAN NOT NULL DEFAULT false,
    "gstin" TEXT,
    "city" TEXT,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "spend" TEXT DEFAULT '₹0',
    "spendPct" TEXT DEFAULT '0% of total',
    "payable" TEXT DEFAULT '₹0',
    "payableNote" TEXT DEFAULT 'No bills',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_email_key" ON "Vendor"("email");
