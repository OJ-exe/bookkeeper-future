export type TxnStatus = "Matched" | "Unmatched" | "Excluded";

export type BankTxn = {
  id?: number;
  date: string;
  description: string;
  reference: string;
  kind: "Inflow" | "Outflow";
  amount: string;
  account: string;
  status: TxnStatus;
  bankAccountId?: number | null;
  paymentId?: number | null;
};

export type BankAccount = {
  id?: number;
  name: string;
  bankName: string;
  accountNo: string;
  balance: string;
  ledger: string;
};

export const bankAccounts: BankAccount[] = [
  {
    id: 1,
    name: "HDFC Current",
    bankName: "HDFC Bank",
    accountNo: "••1234",
    balance: "₹4,12,000",
    ledger: "HDFC Bank A/c",
  },
  {
    id: 2,
    name: "ICICI Savings",
    bankName: "ICICI Bank",
    accountNo: "••8842",
    balance: "₹1,82,500",
    ledger: "ICICI Bank A/c",
  },
  {
    id: 3,
    name: "Cash in Hand",
    bankName: "Cash",
    accountNo: "••0000",
    balance: "₹85,400",
    ledger: "Cash A/c",
  },
];

export const bankTxns: BankTxn[] = [];

export const bankTxnTabs = [
  "All Transactions",
  "Unmatched",
  "Matched",
  "Inflow",
  "Outflow",
];
