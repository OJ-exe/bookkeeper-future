export type AccountType = "Asset" | "Liability" | "Income" | "Expense";

export type Account = {
  code: string;
  name: string;
  type: AccountType;
  subtype: string;
  balance: string;
  linked: number;
  note: string;
};

export const accounts: Account[] = [
  { code: "1001", name: "Accounts Receivable", type: "Asset", subtype: "Current Assets", balance: "₹1,24,000.00", linked: 12, note: "Default account" },
  { code: "1002", name: "CGST Input", type: "Asset", subtype: "Current Assets", balance: "₹18,450.00", linked: 8, note: "Default account" },
  { code: "1006", name: "Diesel", type: "Asset", subtype: "Inventory", balance: "₹45,200.00", linked: 1, note: "1 linked record" },
  { code: "1007", name: "HDFC 1234", type: "Asset", subtype: "Cash & Cash Equivalents", balance: "₹3,85,000.00", linked: 24, note: "1 linked record" },
  { code: "1004", name: "IGST Input", type: "Asset", subtype: "Current Assets", balance: "₹22,100.00", linked: 5, note: "Default account" },
  { code: "1003", name: "SGST Input", type: "Asset", subtype: "Current Assets", balance: "₹18,450.00", linked: 5, note: "Default account" },
  { code: "1005", name: "TDS Receivable", type: "Asset", subtype: "Current Assets", balance: "₹12,000.00", linked: 3, note: "Default account" },
  { code: "1010", name: "Vendor Advances", type: "Asset", subtype: "Current Assets", balance: "₹0.00", linked: 0, note: "Default account" },
  { code: "5002", name: "Purchase Return", type: "Expense", subtype: "Direct Expense", balance: "₹2,300.00", linked: 1, note: "1 linked record" },
  { code: "5001", name: "Purchases", type: "Expense", subtype: "Direct Expense", balance: "₹2,45,000.00", linked: 2, note: "2 linked records" },
  { code: "5003", name: "Salary Expense", type: "Expense", subtype: "Salary Expense", balance: "₹1,20,000.00", linked: 0, note: "Default account" },
  { code: "4001", name: "Sales", type: "Income", subtype: "Operating Income", balance: "₹8,40,000.00", linked: 15, note: "1 linked record" },
];

export type AccountTreeGroup = {
  type: AccountType;
  label: string;
  count: number;
  children: { label: string; count: number }[];
};

export const accountTree: AccountTreeGroup[] = [
  {
    type: "Asset",
    label: "Assets",
    count: 8,
    children: [
      { label: "Cash & Cash Equivalents", count: 2 },
      { label: "Current Assets", count: 5 },
      { label: "Inventory", count: 1 },
      { label: "Other Assets", count: 0 },
    ],
  },
  {
    type: "Liability",
    label: "Liabilities",
    count: 7,
    children: [
      { label: "Current Liabilities", count: 6 },
      { label: "Long Term Liabilities", count: 1 },
      { label: "Other Liabilities", count: 0 },
    ],
  },
  {
    type: "Income",
    label: "Income",
    count: 2,
    children: [
      { label: "Operating Income", count: 2 },
      { label: "Other Income", count: 0 },
    ],
  },
  {
    type: "Expense",
    label: "Expenses",
    count: 3,
    children: [
      { label: "Direct Expense", count: 2 },
      { label: "Salary Expense", count: 1 },
      { label: "Other Expense", count: 0 },
    ],
  },
];

export const typeChips: string[] = [
  "All Types",
  "Assets",
  "Liabilities",
  "Income",
  "Expenses",
  "Banking",
  "Tax",
  "Payroll",
  "Inventory",
];
