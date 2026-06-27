export type OrderStatus =
  | "Open"
  | "Partially Fulfilled"
  | "Fulfilled"
  | "Cancelled"
  | "Draft";

export type OrderKind = "Sales Order" | "Purchase Order";

export type Order = {
  number: string;
  date: string;
  expectedDate: string;
  party: string;
  kind: OrderKind;
  status: OrderStatus;
  total: string;
  fulfilled: string;
  value: string;
};

export const orders: Order[] = [
  { number: "ORD-2026-125", date: "15 Jun 2026", expectedDate: "30 Jun 2026", party: "ABC Pvt Ltd", kind: "Sales Order", status: "Open", total: "₹1,25,000", fulfilled: "0%", value: "₹1,25,000" },
  { number: "ORD-2026-124", date: "14 Jun 2026", expectedDate: "28 Jun 2026", party: "XYZ Industries", kind: "Sales Order", status: "Partially Fulfilled", total: "₹2,40,000", fulfilled: "60%", value: "₹2,40,000" },
  { number: "ORD-2026-123", date: "13 Jun 2026", expectedDate: "25 Jun 2026", party: "Tech Solutions", kind: "Sales Order", status: "Fulfilled", total: "₹85,800", fulfilled: "100%", value: "₹85,800" },
  { number: "ORD-2026-122", date: "12 Jun 2026", expectedDate: "27 Jun 2026", party: "Sharma Supplies", kind: "Purchase Order", status: "Open", total: "₹1,40,000", fulfilled: "0%", value: "₹1,40,000" },
  { number: "ORD-2026-121", date: "11 Jun 2026", expectedDate: "24 Jun 2026", party: "Metro Logistics", kind: "Purchase Order", status: "Partially Fulfilled", total: "₹92,000", fulfilled: "45%", value: "₹92,000" },
  { number: "ORD-2026-120", date: "10 Jun 2026", expectedDate: "22 Jun 2026", party: "Apex Components", kind: "Purchase Order", status: "Fulfilled", total: "₹68,500", fulfilled: "100%", value: "₹68,500" },
  { number: "ORD-2026-119", date: "09 Jun 2026", expectedDate: "21 Jun 2026", party: "Global Traders", kind: "Sales Order", status: "Cancelled", total: "₹54,200", fulfilled: "0%", value: "₹54,200" },
  { number: "ORD-2026-118", date: "08 Jun 2026", expectedDate: "20 Jun 2026", party: "Greenfield Traders", kind: "Purchase Order", status: "Draft", total: "₹47,200", fulfilled: "0%", value: "₹47,200" },
];

export const orderTabs = [
  "All",
  "Sales Orders",
  "Purchase Orders",
  "Open",
  "Fulfilled",
  "Cancelled",
  "Drafts",
];
