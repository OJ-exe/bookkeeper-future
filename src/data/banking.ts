export type TxnStatus = "Matched" | "Unmatched" | "Excluded";

export type BankTxn = {
  id: string;
  date: string;
  description: string;
  reference: string;
  kind: "Inflow" | "Outflow";
  amount: string;
  account: string;
  status: TxnStatus;
};

export type BankAccount = {
  name: string;
  bankName: string;
  accountNo: string;
  balance: string;
  ledger: string;
};

export const bankAccounts: BankAccount[] = [
  {
    name: "HDFC Current",
    bankName: "HDFC Bank",
    accountNo: "••1234",
    balance: "₹4,12,000",
    ledger: "HDFC Bank A/c",
  },
  {
    name: "ICICI Savings",
    bankName: "ICICI Bank",
    accountNo: "••8842",
    balance: "₹1,82,500",
    ledger: "ICICI Bank A/c",
  },
  {
    name: "Cash in Hand",
    bankName: "Cash",
    accountNo: "••0000",
    balance: "₹85,400",
    ledger: "Cash A/c",
  },
];

export const bankTxns: BankTxn[] = [
  {
    id: "TXN-2026-0091",
    date: "18 Jun 2026",
    description: "Receipt from ABC Pvt Ltd",
    reference: "NEFT-AX9921",
    kind: "Inflow",
    amount: "₹48,500",
    account: "HDFC Current",
    status: "Unmatched",
  },
  {
    id: "TXN-2026-0090",
    date: "18 Jun 2026",
    description: "Vendor payment - Global Supplies",
    reference: "RTGS-GS4410",
    kind: "Outflow",
    amount: "₹1,25,000",
    account: "HDFC Current",
    status: "Matched",
  },
  {
    id: "TXN-2026-0089",
    date: "17 Jun 2026",
    description: "Payout settlement - Razorpay",
    reference: "PAYOUT-RZP8821",
    kind: "Inflow",
    amount: "₹62,400",
    account: "ICICI Savings",
    status: "Unmatched",
  },
  {
    id: "TXN-2026-0088",
    date: "16 Jun 2026",
    description: "Office rent - June",
    reference: "ACH-RENT06",
    kind: "Outflow",
    amount: "₹40,000",
    account: "HDFC Current",
    status: "Matched",
  },
  {
    id: "TXN-2026-0087",
    date: "16 Jun 2026",
    description: "Receipt from XYZ Industries",
    reference: "IMPS-XY3320",
    kind: "Inflow",
    amount: "₹1,10,000",
    account: "ICICI Savings",
    status: "Matched",
  },
  {
    id: "TXN-2026-0086",
    date: "15 Jun 2026",
    description: "Bank charges - quarterly",
    reference: "CHG-Q1FY27",
    kind: "Outflow",
    amount: "₹1,180",
    account: "ICICI Savings",
    status: "Excluded",
  },
  {
    id: "TXN-2026-0085",
    date: "14 Jun 2026",
    description: "Petty cash withdrawal",
    reference: "CASH-WD0614",
    kind: "Outflow",
    amount: "₹15,000",
    account: "Cash in Hand",
    status: "Unmatched",
  },
  {
    id: "TXN-2026-0084",
    date: "13 Jun 2026",
    description: "Cash sales deposit",
    reference: "CASH-DEP0613",
    kind: "Inflow",
    amount: "₹32,000",
    account: "Cash in Hand",
    status: "Matched",
  },
  {
    id: "TXN-2026-0083",
    date: "12 Jun 2026",
    description: "Vendor payment - Tech Solutions",
    reference: "NEFT-TS7745",
    kind: "Outflow",
    amount: "₹86,500",
    account: "HDFC Current",
    status: "Unmatched",
  },
];

export const bankTxnTabs = [
  "All Transactions",
  "Unmatched",
  "Matched",
  "Inflow",
  "Outflow",
];
