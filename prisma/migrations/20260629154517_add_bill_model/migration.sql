-- CreateTable
CREATE TABLE "Bill" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "date" TEXT,
    "due" TEXT,
    "vendor" TEXT NOT NULL,
    "source" TEXT DEFAULT 'Direct',
    "status" TEXT NOT NULL DEFAULT 'Open',
    "grandTotal" TEXT DEFAULT '₹0',
    "netPayable" TEXT DEFAULT '₹0',
    "open" TEXT DEFAULT '₹0',
    "vendorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bill_number_key" ON "Bill"("number");

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
