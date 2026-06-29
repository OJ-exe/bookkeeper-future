export type VendorStatus = "Active" | "Inactive" | "Overdue";

export type Vendor = {
  id?: number;
  name: string;
  initials: string;
  preferred: boolean;
  gstin: string | null;
  city: string | null;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  spend: string;
  spendPct: string;
  payable: string;
  payableNote: string;
  status: VendorStatus;
  isNew: boolean;
};

export type VendorCreateInput = {
  name: string;
  initials?: string;
  preferred?: boolean;
  gstin?: string | null;
  city?: string | null;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  spend?: string;
  spendPct?: string;
  payable?: string;
  payableNote?: string;
  status?: VendorStatus;
  isNew?: boolean;
};

export type VendorUpdateInput = Partial<VendorCreateInput>;
