export type BillStatus = "Open" | "Paid" | "Overdue" | "Recurring" | "Draft";

export type Bill = {
  number: string;
  date: string;
  due: string;
  vendor: string;
  source: string;
  status: BillStatus;
  grandTotal: string;
  netPayable: string;
  open: string;
};

export const bills: Bill[] = [
  { number: "BILL-2026-045", date: "15 Jun 2026", due: "30 Jun 2026", vendor: "Sharma Supplies", source: "Direct", status: "Open", grandTotal: "₹52,000", netPayable: "₹52,000", open: "₹52,000" },
  { number: "BILL-2026-044", date: "14 Jun 2026", due: "29 Jun 2026", vendor: "Metro Logistics", source: "PO #PO-128", status: "Open", grandTotal: "₹1,40,000", netPayable: "₹1,40,000", open: "₹1,40,000" },
  { number: "BILL-2026-043", date: "13 Jun 2026", due: "28 Jun 2026", vendor: "Apex Components", source: "Direct", status: "Paid", grandTotal: "₹68,500", netPayable: "₹0", open: "₹0" },
  { number: "BILL-2026-042", date: "01 Jun 2026", due: "16 Jun 2026", vendor: "Crestline Pvt Ltd", source: "PO #PO-121", status: "Overdue", grandTotal: "₹92,000", netPayable: "₹92,000", open: "₹92,000" },
  { number: "BILL-2026-041", date: "11 Jun 2026", due: "26 Jun 2026", vendor: "Nova Print", source: "Recurring", status: "Recurring", grandTotal: "₹28,000", netPayable: "₹28,000", open: "₹28,000" },
  { number: "BILL-2026-040", date: "10 Jun 2026", due: "25 Jun 2026", vendor: "Sharma Supplies", source: "Direct", status: "Open", grandTotal: "₹1,15,000", netPayable: "₹1,15,000", open: "₹1,15,000" },
  { number: "BILL-2026-039", date: "09 Jun 2026", due: "24 Jun 2026", vendor: "Greenfield Traders", source: "PO #PO-119", status: "Draft", grandTotal: "₹47,200", netPayable: "₹47,200", open: "₹47,200" },
  { number: "BILL-2026-038", date: "08 Jun 2026", due: "23 Jun 2026", vendor: "Unity Hardware", source: "Direct", status: "Paid", grandTotal: "₹31,800", netPayable: "₹0", open: "₹0" },
];

export const billTabs = [
  "All",
  "Tax Bills",
  "Recurring Bills",
  "Purchase Return",
  "Pro Forma Bills",
  "Drafts",
  "Overdue",
];

export const topVendorsBySpend = [
  { rank: 1, name: "Sharma Supplies", spend: "₹3.80M", pct: "26%" },
  { rank: 2, name: "Metro Logistics", spend: "₹3.10M", pct: "21%" },
  { rank: 3, name: "Apex Components", spend: "₹2.40M", pct: "16%" },
  { rank: 4, name: "Greenfield Traders", spend: "₹1.70M", pct: "12%" },
  { rank: 5, name: "Nova Print", spend: "₹1.10M", pct: "7%" },
];

export const payablesAging = [
  { name: "Current (0-30 days)", value: 900000, amount: "₹900K" },
  { name: "1-30 Days", value: 280000, amount: "₹280K" },
  { name: "31-60 Days", value: 140000, amount: "₹140K" },
  { name: "60+ Days", value: 80000, amount: "₹80K" },
];
