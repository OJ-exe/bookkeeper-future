import { prisma } from "@/lib/prisma";
import type { Customer } from "@/generated/prisma/client";

function normalizeCustomerPayload(input: Partial<Customer>) {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  return {
    name,
    initials:
      typeof input.initials === "string" && input.initials.trim()
        ? input.initials.trim()
        : name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase() || "?",
    vip: input.vip === true,
    gstin: typeof input.gstin === "string" ? input.gstin.trim() : null,
    city: typeof input.city === "string" ? input.city.trim() : null,
    contactName: typeof input.contactName === "string" ? input.contactName.trim() : null,
    email: typeof input.email === "string" ? input.email.trim() : null,
    phone: typeof input.phone === "string" ? input.phone.trim() : null,
    revenue: typeof input.revenue === "string" ? input.revenue.trim() : "₹0",
    revenuePct:
      typeof input.revenuePct === "string" ? input.revenuePct.trim() : "0% of total",
    outstanding: typeof input.outstanding === "string" ? input.outstanding.trim() : "₹0",
    outstandingNote:
      typeof input.outstandingNote === "string"
        ? input.outstandingNote.trim()
        : "No invoices",
    status: typeof input.status === "string" ? input.status : "Active",
    isNew: input.isNew === true,
  };
}

export async function listCustomers(userId: number) {
  const count = await prisma.customer.count({ where: { userId } });

  if (count === 0) {
    await prisma.customer.createMany({
      data: [
        {
          userId,
          name: "ABC Pvt Ltd",
          initials: "ABC",
          vip: true,
          gstin: "27ABCDE1234F1Z5",
          city: "Mumbai, Maharashtra",
          contactName: "Rajesh Kumar",
          email: "rajesh@abc.com",
          phone: "+91 98765 43210",
          revenue: "₹4.20M",
          revenuePct: "28% of total",
          outstanding: "₹45,000",
          outstandingNote: "2 invoices",
          status: "Active",
          isNew: false,
        },
        {
          userId,
          name: "XYZ Industries",
          initials: "XYZ",
          vip: false,
          gstin: "29XYZAB9876K1Z1",
          city: "Bengaluru, Karnataka",
          contactName: "Neha Singh",
          email: "neha@xyz.com",
          phone: "+91 91234 56789",
          revenue: "₹3.50M",
          revenuePct: "23% of total",
          outstanding: "₹1,20,000",
          outstandingNote: "5 invoices",
          status: "Active",
          isNew: false,
        },
      ],
    });
  }

  return prisma.customer.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function createCustomer(userId: number, input: Partial<Customer>) {
  return prisma.customer.create({ data: { userId, ...normalizeCustomerPayload(input) } });
}

export async function updateCustomer(userId: number, id: number, input: Partial<Customer>) {
  const existing = await prisma.customer.findFirst({ where: { id, userId } });
  if (!existing) {
    return null;
  }

  return prisma.customer.update({
    where: { id },
    data: normalizeCustomerPayload({ ...existing, ...input }),
  });
}

export async function deleteCustomer(userId: number, id: number) {
  const existing = await prisma.customer.findFirst({ where: { id, userId } });
  if (!existing) {
    return false;
  }

  await prisma.customer.delete({ where: { id } });
  return true;
}
