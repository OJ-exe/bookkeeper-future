export type InvoiceStatus = "Sent" | "Viewed" | "Paid" | "Overdue" | "Recurring";

export type Invoice = {
  id?: number;
  number: string;
  date: string;
  due: string;
  customer: string;
  source: string;
  status: InvoiceStatus;
  grandTotal: string;
  netReceivable: string;
  open: string;
};

export type InvoiceCreateInput = {
  number?: string;
  date?: string;
  due?: string;
  customer: string;
  source?: string;
  status?: InvoiceStatus;
  grandTotal?: string;
  netReceivable?: string;
  open?: string;
  customerId?: number | null;
  vendorId?: number | null;
};

export type InvoiceUpdateInput = Partial<InvoiceCreateInput>;
