import type { Bill, BillStatus } from "@/types/bill";

export type { Bill, BillStatus } from "@/types/bill";

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
