import { prisma } from "@/lib/prisma";
import type { VendorCreateInput, VendorUpdateInput } from "@/types/vendor";

function buildInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function normalizeVendorPayload(input: VendorCreateInput | Record<string, unknown>) {
  const name = typeof input.name === "string" ? input.name : "";
  return {
    name,
    initials: typeof input.initials === "string" ? input.initials : buildInitials(name),
    preferred: input.preferred === true,
    gstin: typeof input.gstin === "string" ? input.gstin : null,
    city: typeof input.city === "string" ? input.city : null,
    contactName: typeof input.contactName === "string" ? input.contactName : null,
    email: typeof input.email === "string" ? input.email : null,
    phone: typeof input.phone === "string" ? input.phone : null,
    spend: typeof input.spend === "string" ? input.spend : "₹0",
    spendPct: typeof input.spendPct === "string" ? input.spendPct : "0% of total",
    payable: typeof input.payable === "string" ? input.payable : "₹0",
    payableNote: typeof input.payableNote === "string" ? input.payableNote : "No bills",
    status: typeof input.status === "string" ? input.status : "Active",
    isNew: input.isNew === true,
  };
}

export async function listVendors() {
  return prisma.vendor.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createVendor(input: VendorCreateInput) {
  return prisma.vendor.create({ data: normalizeVendorPayload(input) });
}

export async function updateVendor(id: number, input: VendorUpdateInput) {
  const existing = await prisma.vendor.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  return prisma.vendor.update({
    where: { id },
    data: {
      ...normalizeVendorPayload({
        ...existing,
        ...input,
        name: input.name ?? existing.name,
      }),
    },
  });
}

export async function deleteVendor(id: number) {
  const existing = await prisma.vendor.findUnique({ where: { id } });
  if (!existing) {
    return false;
  }

  await prisma.vendor.delete({ where: { id } });
  return true;
}
