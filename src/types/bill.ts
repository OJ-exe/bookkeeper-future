export type BillStatus = "Open" | "Paid" | "Overdue" | "Recurring" | "Draft";

export type Bill = {
  id?: number;
  number: string;
  date: string;
  due: string;
  vendor: string;
  source: string;
  status: BillStatus;
  grandTotal: string;
  netPayable: string;
  open: string;
};

export type BillCreateInput = {
  number?: string;
  date?: string;
  due?: string;
  vendor: string;
  source?: string;
  status?: BillStatus;
  grandTotal?: string;
  netPayable?: string;
  open?: string;
  vendorId?: number | null;
};

export type BillUpdateInput = Partial<BillCreateInput>;
