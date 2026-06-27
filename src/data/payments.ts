export type PaymentStatus = "Completed" | "Pending" | "Failed" | "Scheduled";

export type PaymentDirection = "Received" | "Made";

export type PaymentMethod = "Bank Transfer" | "UPI" | "Cheque" | "Card" | "Cash";

export type Payment = {
  id: string;
  date: string;
  party: string;
  direction: PaymentDirection;
  method: PaymentMethod;
  reference: string;
  status: PaymentStatus;
  amount: string;
};

export const payments: Payment[] = [
  { id: "PMT-2026-310", date: "15 Jun 2026", party: "ABC Pvt Ltd", direction: "Received", method: "Bank Transfer", reference: "INV-2026-152", status: "Completed", amount: "₹48,500" },
  { id: "PMT-2026-309", date: "14 Jun 2026", party: "Sharma Supplies", direction: "Made", method: "UPI", reference: "BILL-2026-045", status: "Completed", amount: "₹52,000" },
  { id: "PMT-2026-308", date: "14 Jun 2026", party: "XYZ Industries", direction: "Received", method: "Cheque", reference: "INV-2026-151", status: "Pending", amount: "₹1,25,000" },
  { id: "PMT-2026-307", date: "13 Jun 2026", party: "Metro Logistics", direction: "Made", method: "Bank Transfer", reference: "BILL-2026-044", status: "Scheduled", amount: "₹1,40,000" },
  { id: "PMT-2026-306", date: "12 Jun 2026", party: "Tech Solutions", direction: "Received", method: "Card", reference: "INV-2026-150", status: "Completed", amount: "₹75,800" },
  { id: "PMT-2026-305", date: "11 Jun 2026", party: "Apex Components", direction: "Made", method: "Cheque", reference: "BILL-2026-043", status: "Failed", amount: "₹68,500" },
  { id: "PMT-2026-304", date: "10 Jun 2026", party: "Global Traders", direction: "Received", method: "UPI", reference: "INV-2026-149", status: "Pending", amount: "₹62,400" },
  { id: "PMT-2026-303", date: "09 Jun 2026", party: "Nova Print", direction: "Made", method: "Cash", reference: "BILL-2026-041", status: "Completed", amount: "₹28,000" },
];

export const paymentTabs = ["All", "Received", "Made", "Pending", "Scheduled", "Failed"];
