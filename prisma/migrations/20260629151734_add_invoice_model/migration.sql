-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "date" TEXT,
    "due" TEXT,
    "customer" TEXT NOT NULL,
    "source" TEXT DEFAULT 'Direct',
    "status" TEXT NOT NULL DEFAULT 'Sent',
    "grandTotal" TEXT DEFAULT '₹0',
    "netReceivable" TEXT DEFAULT '₹0',
    "open" TEXT DEFAULT '₹0',
    "customerId" INTEGER,
    "vendorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_number_key" ON "Invoice"("number");
