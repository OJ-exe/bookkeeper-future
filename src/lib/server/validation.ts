import { z } from "zod";

export const vendorCreateSchema = z.object({
  name: z.string().trim().min(1, "Vendor name is required."),
  initials: z.string().trim().optional(),
  preferred: z.boolean().optional().default(false),
  gstin: z.string().trim().optional().nullable(),
  city: z.string().trim().optional().nullable(),
  contactName: z.string().trim().optional().nullable(),
  email: z.string().email("Please provide a valid email.").optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  spend: z.string().trim().optional(),
  spendPct: z.string().trim().optional(),
  payable: z.string().trim().optional(),
  payableNote: z.string().trim().optional(),
  status: z.enum(["Active", "Inactive", "Overdue"]).optional().default("Active"),
  isNew: z.boolean().optional().default(true),
});

export const vendorUpdateSchema = vendorCreateSchema.partial();

export const invoiceCreateSchema = z.object({
  number: z.string().trim().min(1, "Invoice number is required.").optional(),
  date: z.string().trim().optional(),
  due: z.string().trim().optional(),
  customer: z.string().trim().min(1, "Customer is required."),
  source: z.string().trim().optional(),
  status: z.enum(["Sent", "Viewed", "Paid", "Overdue", "Recurring"]).optional().default("Sent"),
  grandTotal: z.string().trim().optional(),
  netReceivable: z.string().trim().optional(),
  open: z.string().trim().optional(),
  customerId: z.number().int().positive().optional().nullable(),
  vendorId: z.number().int().positive().optional().nullable(),
});

export const invoiceUpdateSchema = invoiceCreateSchema.partial();

export const billCreateSchema = z.object({
  number: z.string().trim().min(1, "Bill number is required.").optional(),
  date: z.string().trim().optional(),
  due: z.string().trim().optional(),
  vendor: z.string().trim().min(1, "Vendor is required."),
  source: z.string().trim().optional(),
  status: z.enum(["Open", "Paid", "Overdue", "Recurring", "Draft"]).optional().default("Open"),
  grandTotal: z.string().trim().optional(),
  netPayable: z.string().trim().optional(),
  open: z.string().trim().optional(),
  vendorId: z.number().int().positive().optional().nullable(),
});

export const billUpdateSchema = billCreateSchema.partial();

export const paymentCreateSchema = z.object({
  date: z.string().trim().optional(),
  party: z.string().trim().min(1, "Party is required."),
  direction: z.enum(["Received", "Made"]).optional().default("Received"),
  method: z.enum(["Bank Transfer", "UPI", "Cheque", "Card", "Cash"]).optional().default("Bank Transfer"),
  reference: z.string().trim().optional(),
  status: z.enum(["Completed", "Pending", "Failed", "Scheduled"]).optional().default("Pending"),
  amount: z.string().trim().optional(),
  customerId: z.number().int().positive().optional().nullable(),
  vendorId: z.number().int().positive().optional().nullable(),
  invoiceId: z.number().int().positive().optional().nullable(),
  billId: z.number().int().positive().optional().nullable(),
  bankAccountId: z.number().int().positive().optional().nullable(),
  transactionId: z.number().int().positive().optional().nullable(),
});

export const paymentUpdateSchema = paymentCreateSchema.partial();

export const accountCreateSchema = z.object({
  code: z.string().trim().min(1, "Account code is required."),
  name: z.string().trim().min(1, "Account name is required."),
  type: z.enum(["Asset", "Liability", "Income", "Expense"]).optional().default("Asset"),
  subtype: z.string().trim().optional(),
  balance: z.string().trim().optional(),
  linked: z.number().int().nonnegative().optional(),
  note: z.string().trim().optional(),
});

export const accountUpdateSchema = accountCreateSchema.partial();

export const employeeCreateSchema = z.object({
  code: z.string().trim().min(1, "Employee code is required."),
  name: z.string().trim().min(1, "Employee name is required."),
  initials: z.string().trim().optional(),
  department: z.enum(["Sales", "Finance", "Operations", "HR", "Engineering"]).optional().default("Sales"),
  designation: z.string().trim().optional(),
  email: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  ctc: z.string().trim().optional(),
  status: z.enum(["Active", "On Leave", "Inactive"]).optional().default("Active"),
  joinedNew: z.boolean().optional().default(false),
});

export const employeeUpdateSchema = employeeCreateSchema.partial();

export const orderCreateSchema = z.object({
  number: z.string().trim().min(1, "Order number is required."),
  date: z.string().trim().optional(),
  expectedDate: z.string().trim().optional(),
  party: z.string().trim().min(1, "Party is required."),
  kind: z.enum(["Sales Order", "Purchase Order"]).optional().default("Sales Order"),
  status: z.enum(["Open", "Partially Fulfilled", "Fulfilled", "Cancelled", "Draft"]).optional().default("Open"),
  total: z.string().trim().optional(),
  fulfilled: z.string().trim().optional(),
  value: z.string().trim().optional(),
});

export const orderUpdateSchema = orderCreateSchema.partial();

export const payrollCreateSchema = z.object({
  id: z.string().trim().min(1, "Payroll run id is required."),
  period: z.string().trim().min(1, "Payroll period is required."),
  employees: z.number().int().nonnegative().optional(),
  gross: z.string().trim().optional(),
  deductions: z.string().trim().optional(),
  netPay: z.string().trim().optional(),
  status: z.enum(["Paid", "Processing", "Pending", "Draft"]).optional().default("Pending"),
  payDate: z.string().trim().optional(),
});

export const payrollUpdateSchema = payrollCreateSchema.partial();

export const bankAccountCreateSchema = z.object({
  name: z.string().trim().min(1, "Bank account name is required."),
  bankName: z.string().trim().optional(),
  accountNo: z.string().trim().optional(),
  balance: z.string().trim().optional(),
  ledger: z.string().trim().optional(),
});

export const bankAccountUpdateSchema = bankAccountCreateSchema.partial();

export const bankTransactionCreateSchema = z.object({
  date: z.string().trim().optional(),
  description: z.string().trim().min(1, "Description is required."),
  reference: z.string().trim().optional(),
  kind: z.enum(["Inflow", "Outflow"]).optional().default("Inflow"),
  amount: z.string().trim().optional(),
  account: z.string().trim().optional(),
  status: z.enum(["Matched", "Unmatched", "Excluded"]).optional().default("Unmatched"),
  bankAccountId: z.number().int().positive().optional().nullable(),
  paymentId: z.number().int().positive().optional().nullable(),
});

export const bankTransactionUpdateSchema = bankTransactionCreateSchema.partial();

export function parseValidation<T>(schema: z.ZodType<T>, body: unknown) {
  return schema.safeParse(body);
}
