export type ReportItem = {
  name: string;
  description: string;
};

export type ReportCategory = {
  key: string;
  label: string;
  icon: string;
  reports: ReportItem[];
};

export const reportCategories: ReportCategory[] = [
  {
    key: "financial",
    label: "Financial",
    icon: "financial",
    reports: [
      { name: "Profit & Loss", description: "Income and expenses for a chosen period." },
      { name: "Balance Sheet", description: "Assets, liabilities, and equity snapshot." },
      { name: "Trial Balance", description: "All ledger balances for verification." },
      { name: "Cash Flow", description: "Cash inflows and outflows across activities." },
      { name: "General Ledger", description: "Detailed transaction history per account." },
    ],
  },
  {
    key: "tax",
    label: "Tax",
    icon: "tax",
    reports: [
      { name: "GST Summary", description: "Consolidated GST liability and credit." },
      { name: "GSTR-1", description: "Outward supplies return statement." },
      { name: "GSTR-3B", description: "Monthly summary GST return." },
      { name: "TDS Report", description: "Tax deducted at source on payments." },
      { name: "ITC Register", description: "Input tax credit availed and pending." },
    ],
  },
  {
    key: "sales",
    label: "Sales",
    icon: "sales",
    reports: [
      { name: "Sales Register", description: "All sales invoices for a period." },
      { name: "Customer Ageing", description: "Outstanding receivables by age bucket." },
      { name: "Revenue by Customer", description: "Revenue contribution per customer." },
      { name: "Top Products", description: "Best-selling products by value and volume." },
    ],
  },
  {
    key: "purchase",
    label: "Purchase",
    icon: "purchase",
    reports: [
      { name: "Purchase Register", description: "All purchase bills for a period." },
      { name: "Vendor Ageing", description: "Outstanding payables by age bucket." },
      { name: "Spend by Vendor", description: "Total spend grouped by vendor." },
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: "inventory",
    reports: [
      { name: "Stock Summary", description: "Current stock levels across items." },
      { name: "Stock Movement", description: "Inward and outward stock transactions." },
      { name: "Valuation", description: "Stock value by costing method." },
    ],
  },
  {
    key: "payroll",
    label: "Payroll",
    icon: "payroll",
    reports: [
      { name: "Salary Register", description: "Monthly salary breakdown per employee." },
      { name: "PF/ESI Report", description: "Provident fund and ESI contributions." },
      { name: "TDS on Salary", description: "Tax deducted from employee salaries." },
    ],
  },
];

export const recentReports: { name: string; generated: string }[] = [
  { name: "Profit & Loss", generated: "generated 2 hours ago" },
  { name: "GSTR-3B", generated: "generated 1 day ago" },
  { name: "Sales Register", generated: "generated 2 days ago" },
  { name: "Salary Register", generated: "generated 4 days ago" },
];
