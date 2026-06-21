export const taxTabs = [
  "GST Dashboard",
  "TDS Dashboard",
  "Compliance Center",
  "Filing Center",
];

export const gstBreakdown = [
  { name: "CGST", value: 63700, pct: "35%", amount: "₹63,700" },
  { name: "SGST", value: 63700, pct: "35%", amount: "₹63,700" },
  { name: "IGST", value: 54600, pct: "30%", amount: "₹54,600" },
];

export const gstTrend = [
  { month: "Jan", value: 90000 },
  { month: "Feb", value: 110000 },
  { month: "Mar", value: 105000 },
  { month: "Apr", value: 140000 },
  { month: "May", value: 120000 },
  { month: "Jun", value: 124000 },
];

export const receivablesTaxPosition = [
  { name: "Current (0-30 days)", value: 95000, amount: "₹95,000" },
  { name: "1-30 days", value: 18000, amount: "₹18,000" },
  { name: "31-60 days", value: 9000, amount: "₹9,000" },
  { name: "60+ days", value: 2000, amount: "₹2,000" },
];

export const itcSummary = [
  { label: "Eligible ITC", amount: "₹60,000", tone: "success" as const },
  { label: "Utilized ITC", amount: "₹2,000", tone: "info" as const },
  { label: "Pending ITC", amount: "₹58,000", tone: "warning" as const },
  { label: "Blocked ITC", amount: "₹0", tone: "danger" as const },
];

export const upcomingTaxEvents = [
  { title: "GST Return (GSTR-3B)", date: "20 Jul 2026", due: "Due in 12 days" },
  { title: "TDS Deposit (Section 194C)", date: "07 Jul 2026", due: "Due in 29 days" },
  { title: "GST Return (GSTR-1)", date: "20 Jul 2026", due: "Due in 42 days" },
];

export const taxAlerts = [
  { title: "Missing GSTIN", note: "2 customers", tone: "warning" as const },
  { title: "High IGST spike", note: "+48% vs last period", tone: "danger" as const },
  { title: "Unmatched Input Credit", note: "₹8,000", tone: "info" as const },
];

export type TaxStatus = "Filed" | "Ready" | "Utilized" | "Pending";

export type TaxRecord = {
  date: string;
  document: string;
  type: string;
  category: string;
  party: string;
  taxable: string;
  cgst: string;
  sgst: string;
  igst: string;
  totalGst: string;
  status: TaxStatus;
};

export const taxRecords: TaxRecord[] = [
  { date: "15 Jun 2026", document: "INV-2026-152", type: "Tax Invoice", category: "Output - Sales", party: "ABC Pvt Ltd", taxable: "₹40,000", cgst: "₹3,600", sgst: "₹3,600", igst: "₹0", totalGst: "₹7,200", status: "Filed" },
  { date: "14 Jun 2026", document: "INV-2026-151", type: "Tax Invoice", category: "Output - Sales", party: "XYZ Industries", taxable: "₹1,00,000", cgst: "₹4,500", sgst: "₹4,500", igst: "₹0", totalGst: "₹9,000", status: "Ready" },
  { date: "13 Jun 2026", document: "INV-2026-150", type: "Tax Invoice", category: "Output - Sales", party: "Tech Solutions", taxable: "₹65,000", cgst: "₹2,925", sgst: "₹2,925", igst: "₹0", totalGst: "₹5,850", status: "Filed" },
  { date: "12 Jun 2026", document: "BILL-2026-045", type: "Purchase", category: "Input - Purchase", party: "BlueLine Services", taxable: "₹50,000", cgst: "₹2,250", sgst: "₹2,250", igst: "₹0", totalGst: "₹4,500", status: "Utilized" },
  { date: "11 Jun 2026", document: "BILL-2026-044", type: "Purchase", category: "Input - Purchase", party: "Global Traders", taxable: "₹80,000", cgst: "₹3,600", sgst: "₹3,600", igst: "₹0", totalGst: "₹7,200", status: "Pending" },
  { date: "10 Jun 2026", document: "CN-2026-012", type: "Credit Note", category: "Output - Sales", party: "ABC Pvt Ltd", taxable: "₹10,000", cgst: "₹450", sgst: "₹450", igst: "₹0", totalGst: "₹900", status: "Ready" },
];

export const taxSourceFilters = ["All Sources", "Output - Sales", "Input - Purchase", "Credit Note"];
