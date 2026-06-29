export type PaymentStatus = "Completed" | "Pending" | "Failed" | "Scheduled";

export type PaymentDirection = "Received" | "Made";

export type PaymentMethod = "Bank Transfer" | "UPI" | "Cheque" | "Card" | "Cash";

export type Payment = {
  id?: number;
  date: string;
  party: string;
  direction: PaymentDirection;
  method: PaymentMethod;
  reference: string;
  status: PaymentStatus;
  amount: string;
  customerId?: number | null;
  vendorId?: number | null;
  invoiceId?: number | null;
  billId?: number | null;
  bankAccountId?: number | null;
  transactionId?: number | null;
};

export type PaymentCreateInput = {
  date?: string;
  party: string;
  direction?: PaymentDirection;
  method?: PaymentMethod;
  reference?: string;
  status?: PaymentStatus;
  amount?: string;
  customerId?: number | null;
  vendorId?: number | null;
  invoiceId?: number | null;
  billId?: number | null;
  bankAccountId?: number | null;
  transactionId?: number | null;
};

export type PaymentUpdateInput = Partial<PaymentCreateInput>;
