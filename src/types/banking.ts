export type TxnStatus = "Matched" | "Unmatched" | "Excluded";

export type BankTransaction = {
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

export type BankAccountCreateInput = {
  name: string;
  bankName?: string;
  accountNo?: string;
  balance?: string;
  ledger?: string;
};

export type BankAccountUpdateInput = Partial<BankAccountCreateInput>;

export type BankTransactionCreateInput = {
  date?: string;
  description: string;
  reference?: string;
  kind?: "Inflow" | "Outflow";
  amount?: string;
  account?: string;
  status?: TxnStatus;
  bankAccountId?: number | null;
  paymentId?: number | null;
};

export type BankTransactionUpdateInput = Partial<BankTransactionCreateInput>;
