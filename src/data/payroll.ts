export type PayrollStatus = "Paid" | "Processing" | "Pending" | "Draft";

export type PayrollRun = {
  id: string;
  period: string;
  employees: number;
  gross: string;
  deductions: string;
  netPay: string;
  status: PayrollStatus;
  payDate: string;
};

export const payrollTabs = [
  "All Runs",
  "Paid",
  "Processing",
  "Pending",
  "Drafts",
];

export const payrollRuns: PayrollRun[] = [
  {
    id: "PR-2026-06",
    period: "June 2026",
    employees: 44,
    gross: "₹38.4L",
    deductions: "₹6.3L",
    netPay: "₹32.1L",
    status: "Processing",
    payDate: "Jul 01, 2026",
  },
  {
    id: "PR-2026-05",
    period: "May 2026",
    employees: 45,
    gross: "₹38.9L",
    deductions: "₹6.4L",
    netPay: "₹32.5L",
    status: "Paid",
    payDate: "Jun 01, 2026",
  },
  {
    id: "PR-2026-04",
    period: "April 2026",
    employees: 45,
    gross: "₹38.7L",
    deductions: "₹6.3L",
    netPay: "₹32.4L",
    status: "Paid",
    payDate: "May 01, 2026",
  },
  {
    id: "PR-2026-03",
    period: "March 2026",
    employees: 43,
    gross: "₹37.2L",
    deductions: "₹6.1L",
    netPay: "₹31.1L",
    status: "Paid",
    payDate: "Apr 01, 2026",
  },
  {
    id: "PR-2026-02",
    period: "February 2026",
    employees: 43,
    gross: "₹36.8L",
    deductions: "₹6.0L",
    netPay: "₹30.8L",
    status: "Pending",
    payDate: "Mar 01, 2026",
  },
  {
    id: "PR-2026-07",
    period: "July 2026",
    employees: 46,
    gross: "₹39.2L",
    deductions: "₹6.5L",
    netPay: "₹32.7L",
    status: "Draft",
    payDate: "Aug 01, 2026",
  },
];
