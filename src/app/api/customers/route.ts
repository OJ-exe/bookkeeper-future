import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizeCustomerPayload(body: unknown) {
  if (!body || typeof body !== "object") {
    return null;
  }

  const candidate = body as Record<string, unknown>;
  const name = typeof candidate.name === "string" ? candidate.name.trim() : "";

  if (!name) {
    return null;
  }

  return {
    name,
    initials:
      typeof candidate.initials === "string" && candidate.initials.trim()
        ? candidate.initials.trim()
        : name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase() || "?",
    vip: typeof candidate.vip === "boolean" ? candidate.vip : false,
    gstin: typeof candidate.gstin === "string" ? candidate.gstin : null,
    city: typeof candidate.city === "string" ? candidate.city : null,
    contactName: typeof candidate.contactName === "string" ? candidate.contactName : null,
    email: typeof candidate.email === "string" ? candidate.email : null,
    phone: typeof candidate.phone === "string" ? candidate.phone : null,
    revenue: typeof candidate.revenue === "string" ? candidate.revenue : "₹0",
    revenuePct: typeof candidate.revenuePct === "string" ? candidate.revenuePct : "0% of total",
    outstanding: typeof candidate.outstanding === "string" ? candidate.outstanding : "₹0",
    outstandingNote:
      typeof candidate.outstandingNote === "string" ? candidate.outstandingNote : "No invoices",
    status: typeof candidate.status === "string" ? candidate.status : "Active",
    isNew: typeof candidate.isNew === "boolean" ? candidate.isNew : true,
  };
}

export async function GET() {
  const existingCount = await prisma.customer.count();

  if (existingCount === 0) {
    await prisma.customer.createMany({
      data: [
        {
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

  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(customers);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = normalizeCustomerPayload(body);

    if (!payload) {
      return NextResponse.json(
        { error: "Customer name is required." },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({ data: payload });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Failed to create customer", error);
    return NextResponse.json(
      { error: "Unable to create customer." },
      { status: 500 }
    );
  }
}
