export type InvoiceStatus = "Sent" | "Viewed" | "Paid" | "Overdue" | "Recurring";

export type Invoice = {
  number: string;
  date: string;
  due: string;
  customer: string;
  source: string;
  status: InvoiceStatus;
  grandTotal: string;
  netReceivable: string;
  open: string;
};

export const invoices: Invoice[] = [
  { number: "INV-2026-152", date: "15 Jun 2026", due: "30 Jun 2026", customer: "ABC Pvt Ltd", source: "Direct", status: "Sent", grandTotal: "₹48,500", netReceivable: "₹48,500", open: "₹48,500" },
  { number: "INV-2026-151", date: "14 Jun 2026", due: "29 Jun 2026", customer: "XYZ Industries", source: "Order #ORD-125", status: "Viewed", grandTotal: "₹1,25,000", netReceivable: "₹1,25,000", open: "₹1,25,000" },
  { number: "INV-2026-150", date: "13 Jun 2026", due: "28 Jun 2026", customer: "Tech Solutions", source: "Direct", status: "Paid", grandTotal: "₹75,800", netReceivable: "₹0", open: "₹0" },
  { number: "INV-2026-149", date: "12 Jun 2026", due: "27 Jun 2026", customer: "Global Traders", source: "Order #ORD-124", status: "Overdue", grandTotal: "₹62,400", netReceivable: "₹62,400", open: "₹62,400" },
  { number: "INV-2026-148", date: "11 Jun 2026", due: "26 Jun 2026", customer: "Sunrise Enterprises", source: "Recurring", status: "Recurring", grandTotal: "₹35,000", netReceivable: "₹35,000", open: "₹35,000" },
  { number: "INV-2026-147", date: "10 Jun 2026", due: "25 Jun 2026", customer: "ABC Pvt Ltd", source: "Direct", status: "Sent", grandTotal: "₹1,10,000", netReceivable: "₹1,10,000", open: "₹1,10,000" },
  { number: "INV-2026-146", date: "09 Jun 2026", due: "24 Jun 2026", customer: "XYZ Industries", source: "Order #ORD-123", status: "Viewed", grandTotal: "₹86,500", netReceivable: "₹86,500", open: "₹86,500" },
  { number: "INV-2026-145", date: "08 Jun 2026", due: "23 Jun 2026", customer: "Tech Solutions", source: "Direct", status: "Paid", grandTotal: "₹29,700", netReceivable: "₹0", open: "₹0" },
];

export const docTabs = [
  "All",
  "Tax Invoices",
  "Recurring Invoices",
  "Sales Return",
  "Pro Forma Invoices",
  "Order Book",
  "Drafts",
  "Overdue",
];

export const revenueTrend = [
  { month: "Jan", revenue: 900000 },
  { month: "Feb", revenue: 1100000 },
  { month: "Mar", revenue: 1050000 },
  { month: "Apr", revenue: 1400000 },
  { month: "May", revenue: 1700000 },
  { month: "Jun", revenue: 1600000 },
  { month: "Jul", revenue: 1850000 },
  { month: "Aug", revenue: 2000000 },
  { month: "Sep", revenue: 2200000 },
  { month: "Oct", revenue: 2400000 },
  { month: "Nov", revenue: 2600000 },
  { month: "Dec", revenue: 2900000 },
];

export const receivablesAging = [
  { name: "Current (0-30 days)", value: 1500000, amount: "₹1.5M" },
  { name: "1-30 Days", value: 300000, amount: "₹300K" },
  { name: "31-60 Days", value: 200000, amount: "₹200K" },
  { name: "60+ Days", value: 100000, amount: "₹100K" },
];

export const invoicePipeline = [
  { stage: "Draft", count: 8, amount: "₹85K" },
  { stage: "Sent", count: 15, amount: "₹2.4M" },
  { stage: "Viewed", count: 6, amount: "₹980K" },
  { stage: "Overdue", count: 4, amount: "₹620K" },
  { stage: "Paid", count: 92, amount: "₹11.4M" },
];

export const topCustomersBySales = [
  { rank: 1, name: "ABC Pvt Ltd", revenue: "₹4.20M", pct: "28%" },
  { rank: 2, name: "XYZ Industries", revenue: "₹3.50M", pct: "23%" },
  { rank: 3, name: "Tech Solutions", revenue: "₹2.80M", pct: "18%" },
  { rank: 4, name: "Global Traders", revenue: "₹1.90M", pct: "12%" },
  { rank: 5, name: "Sunrise Enterprises", revenue: "₹1.20M", pct: "8%" },
];
