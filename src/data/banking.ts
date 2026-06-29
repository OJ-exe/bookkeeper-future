export type TxnStatus = "Matched" | "Unmatched" | "Excluded";

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

export const bankTxnTabs = [
  "All Transactions",
  "Unmatched",
  "Matched",
  "Inflow",
  "Outflow",
];
