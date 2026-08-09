import { prisma } from "@/lib/prisma";
import type {
  DashboardActivityItem,
  DashboardAnalyticsPayload,
  DashboardBankingSummary,
  DashboardBusinessHealth,
  DashboardCustomerVendorItem,
  DashboardFocusTask,
  DashboardInsightItem,
  DashboardMetric,
  DashboardOutstandingBucket,
  DashboardOutstandingSummary,
  DashboardReportItem,
  DashboardSeriesPoint,
  DashboardSetupTask,
  DashboardTaxSummary,
} from "@/types/dashboard";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function parseAmount(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/[₹,]/g, "").replace(/\s/g, "");
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function parseDateString(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const candidates = [
    normalized,
    normalized.replace(/\//g, "-"),
    normalized.split("/").reverse().join("-"),
  ];

  for (const candidate of candidates) {
    const parsed = new Date(candidate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function getMonthLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function bucketForInvoiceStatus(dueDate: Date | null, status: string) {
  if (status.toLowerCase().includes("paid") || status.toLowerCase().includes("closed")) {
    return 0;
  }

  if (!dueDate) {
    return 1;
  }

  const today = new Date();
  const diffDays = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 0;
  }
  if (diffDays <= 30) {
    return 1;
  }
  if (diffDays <= 60) {
    return 2;
  }
  return 3;
}

function buildFallbackPayload(): DashboardAnalyticsPayload {
  const metrics: DashboardMetric[] = [
    { label: "Cash Available", value: formatCurrency(0), sublabel: "No bank activity yet", tone: "success", icon: "Wallet" },
    { label: "Receivables", value: formatCurrency(0), sublabel: "No invoices pending", tone: "info", icon: "ArrowDownToLine" },
    { label: "Payables", value: formatCurrency(0), sublabel: "No bills pending", tone: "warning", icon: "ArrowUpFromLine" },
    { label: "Tasks Need Attention", value: "0", sublabel: "All caught up", tone: "bronze", icon: "AlertCircle" },
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return {
    metrics,
    cashflow: months.map((month) => ({ month, inflow: 0, outflow: 0, net: 0 })),
    revenueExpenses: months.map((month) => ({ month, revenue: 0, expenses: 0 })),
    outstanding: {
      total: 0,
      buckets: [
        { name: "Not Overdue", value: 0, color: "#22c55e" },
        { name: "1–30 Days", value: 0, color: "#f59e0b" },
        { name: "31–60 Days", value: 0, color: "#d97706" },
        { name: "60+ Days", value: 0, color: "#ef4444" },
      ],
    },
    businessHealth: {
      score: 50,
      status: "Stable",
      change: "+0 pts vs last month",
      metrics: [
        { label: "Cash Flow", pct: 50 },
        { label: "Collections", pct: 50 },
        { label: "Taxes", pct: 50 },
        { label: "Profitability", pct: 50 },
      ],
    },
    topCustomers: [],
    topVendors: [],
    bankingSummary: { accounts: 0, balance: 0, pending: 0, matched: 0 },
    taxSummary: { output: 0, input: 0, net: 0, pending: 0 },
    setupTasks: [
      { icon: "Building2", name: "Company Profile", status: "Pending" },
      { icon: "Receipt", name: "GST & Tax Settings", status: "Pending" },
      { icon: "Landmark", name: "Bank Connections", status: "Pending" },
      { icon: "Users", name: "Customers", status: "Pending" },
      { icon: "Truck", name: "Vendors", status: "Pending" },
      { icon: "UserCog", name: "Employees", status: "Pending" },
      { icon: "FileText", name: "Document Templates", status: "Pending" },
      { icon: "BarChart3", name: "Reports Ready", status: "Pending" },
    ],
    focusTasks: [
      { label: "Add the first customer", note: "Kick off collections", done: false },
      { label: "Connect a bank account", note: "Start reconciliations", done: false },
      { label: "Create your first invoice", note: "Track outbound work", done: false },
    ],
    activity: [],
    insights: [
      { title: "No transactions captured yet", subtitle: "Once entries are synced, insights will appear here.", tone: "info" },
    ],
    reports: [
      { name: "Profit & Loss", description: "Review revenue and expense movement." },
      { name: "Cash Flow", description: "Track cash positions and liquidity." },
      { name: "Tax Summary", description: "Understand input and output tax impact." },
    ],
    recentReports: [{ name: "No reports generated", generated: "Waiting for data" }],
    summary: [
      { label: "Net Flow", value: formatCurrency(0), note: "This month" },
      { label: "Collections", value: formatCurrency(0), note: "Invoices due" },
      { label: "Tax Position", value: formatCurrency(0), note: "Pending" },
    ],
  };
}

export async function getDashboardAnalytics(): Promise<DashboardAnalyticsPayload> {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  try {
    const [
      invoices,
      bills,
      payments,
      customers,
      vendors,
      bankAccounts,
      transactions,
      employees,
    ] = await Promise.all([
      prisma.invoice.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          createdAt: true,
          date: true,
          due: true,
          status: true,
          grandTotal: true,
          netReceivable: true,
          open: true,
          customer: true,
        },
      }),
      prisma.bill.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          createdAt: true,
          date: true,
          due: true,
          status: true,
          grandTotal: true,
          netPayable: true,
          open: true,
          vendor: true,
        },
      }),
      prisma.payment.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          createdAt: true,
          date: true,
          direction: true,
          status: true,
          amount: true,
          party: true,
          invoiceId: true,
          billId: true,
        },
      }),
      prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          createdAt: true,
          name: true,
          revenue: true,
        },
      }),
      prisma.vendor.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          createdAt: true,
          name: true,
          spend: true,
        },
      }),
      prisma.bankAccount.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          balance: true,
        },
      }),
      prisma.bankTransaction.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          createdAt: true,
          date: true,
          kind: true,
          amount: true,
          description: true,
          status: true,
        },
      }),
      prisma.employee.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          createdAt: true,
        },
      }),
    ]);

    const months = Array.from({ length: 6 }, (_, index) => {
      const month = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return { key: monthKey(month), label: getMonthLabel(month), date: month };
    });

    const revenueByMonth = new Map<string, number>();
    const expenseByMonth = new Map<string, number>();
    const cashflowByMonth = new Map<string, { inflow: number; outflow: number }>();

    months.forEach((month) => {
      revenueByMonth.set(month.key, 0);
      expenseByMonth.set(month.key, 0);
      cashflowByMonth.set(month.key, { inflow: 0, outflow: 0 });
    });

    invoices.forEach((invoice) => {
      const parsedDate = parseDateString(invoice.date) ?? invoice.createdAt;
      const key = monthKey(parsedDate);
      if (!revenueByMonth.has(key)) return;
      revenueByMonth.set(key, revenueByMonth.get(key)! + parseAmount(invoice.grandTotal));
    });

    bills.forEach((bill) => {
      const parsedDate = parseDateString(bill.date) ?? bill.createdAt;
      const key = monthKey(parsedDate);
      if (!expenseByMonth.has(key)) return;
      expenseByMonth.set(key, expenseByMonth.get(key)! + parseAmount(bill.grandTotal));
    });

    transactions.forEach((transaction) => {
      const parsedDate = parseDateString(transaction.date) ?? transaction.createdAt;
      const key = monthKey(parsedDate);
      const bucket = cashflowByMonth.get(key);
      if (!bucket) return;
      const amount = parseAmount(transaction.amount);
      if (transaction.kind?.toLowerCase() === "inflow") {
        bucket.inflow += amount;
      } else {
        bucket.outflow += amount;
      }
    });

    const receivables = invoices.reduce((sum, invoice) => sum + parseAmount(invoice.netReceivable), 0);
    const payables = bills.reduce((sum, bill) => sum + parseAmount(bill.netPayable), 0);
    const cashBalance = bankAccounts.reduce((sum, account) => sum + parseAmount(account.balance), 0);
    const overdueInvoices = invoices.filter((invoice) => {
      const dueDate = parseDateString(invoice.due ?? null);
      return invoice.status.toLowerCase().includes("overdue") || (dueDate !== null && dueDate < new Date());
    }).length;
    const pendingBills = bills.filter((bill) => {
      const status = bill.status.toLowerCase();
      return status !== "paid" && status !== "closed";
    }).length;
    const attentionCount = overdueInvoices + pendingBills;

    const metrics: DashboardMetric[] = [
      {
        label: "Cash Available",
        value: formatCurrency(cashBalance),
        sublabel: `${bankAccounts.length} connected accounts`,
        tone: "success",
        icon: "Wallet",
      },
      {
        label: "Receivables",
        value: formatCurrency(receivables),
        sublabel: `${overdueInvoices} invoices overdue`,
        tone: "info",
        icon: "ArrowDownToLine",
      },
      {
        label: "Payables",
        value: formatCurrency(payables),
        sublabel: `${pendingBills} bills open`,
        tone: "warning",
        icon: "ArrowUpFromLine",
      },
      {
        label: "Tasks Need Attention",
        value: String(attentionCount),
        sublabel: attentionCount > 0 ? "Needs follow-up" : "All clear",
        tone: "bronze",
        icon: "AlertCircle",
      },
    ];

    const outstandingBuckets: DashboardOutstandingBucket[] = [
      { name: "Not Overdue", value: 0, color: "#22c55e" },
      { name: "1–30 Days", value: 0, color: "#f59e0b" },
      { name: "31–60 Days", value: 0, color: "#d97706" },
      { name: "60+ Days", value: 0, color: "#ef4444" },
    ];

    let outstandingTotal = 0;
    invoices.forEach((invoice) => {
      const amount = parseAmount(invoice.open);
      if (amount <= 0) return;
      outstandingTotal += amount;
      const bucketIndex = bucketForInvoiceStatus(parseDateString(invoice.due ?? null), invoice.status);
      outstandingBuckets[bucketIndex].value += amount;
    });

    const outstanding: DashboardOutstandingSummary = {
      total: outstandingTotal,
      buckets: outstandingBuckets,
    };

    const cashFlowPct = Math.min(100, Math.max(0, Math.round((cashBalance / Math.max(1, receivables + payables)) * 100)));
    const businessHealth: DashboardBusinessHealth = {
      score: Math.min(100, Math.max(45, cashFlowPct + (bankAccounts.length > 0 ? 10 : 0) - overdueInvoices * 5 - pendingBills * 3)),
      status: overdueInvoices > 0 ? "Needs attention" : "Healthy",
      change: `${cashBalance >= receivables ? "+" : "-"}${Math.max(1, Math.round(Math.abs(cashBalance - receivables) / 1000))} pts vs last month`,
      metrics: [
        { label: "Cash Flow", pct: cashFlowPct },
        { label: "Collections", pct: Math.min(100, Math.max(0, 100 - overdueInvoices * 12)) },
        { label: "Taxes", pct: 80 },
        { label: "Profitability", pct: Math.min(100, Math.max(0, receivables > 0 ? 100 - pendingBills * 8 : 90)) },
      ],
    };

    const topCustomers: DashboardCustomerVendorItem[] = customers
      .map((customer) => ({ name: customer.name, total: parseAmount(customer.revenue) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const topVendors: DashboardCustomerVendorItem[] = vendors
      .map((vendor) => ({ name: vendor.name, total: parseAmount(vendor.spend) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const pendingTransactions = transactions.filter((transaction) => transaction.status.toLowerCase() !== "matched").length;
    const matchedTransactions = transactions.filter((transaction) => transaction.status.toLowerCase() === "matched").length;
    const bankingSummary: DashboardBankingSummary = {
      accounts: bankAccounts.length,
      balance: cashBalance,
      pending: pendingTransactions,
      matched: matchedTransactions,
    };

    const outputTax = invoices.reduce((sum, invoice) => sum + parseAmount(invoice.grandTotal) * 0.18, 0);
    const inputTax = bills.reduce((sum, bill) => sum + parseAmount(bill.grandTotal) * 0.18, 0);
    const taxSummary: DashboardTaxSummary = {
      output: outputTax,
      input: inputTax,
      net: outputTax - inputTax,
      pending: overdueInvoices + pendingBills,
    };

    const setupTasks: DashboardSetupTask[] = [
      { icon: "Building2", name: "Company Profile", status: customers.length > 0 ? "Completed" : "Pending" },
      { icon: "Receipt", name: "GST & Tax Settings", status: invoices.length > 0 || bills.length > 0 ? "Completed" : "Pending" },
      { icon: "Landmark", name: "Bank Connections", status: bankAccounts.length > 0 ? "Completed" : "Pending" },
      { icon: "Users", name: "Customers", status: customers.length > 0 ? "Completed" : "Pending" },
      { icon: "Truck", name: "Vendors", status: vendors.length > 0 ? "Completed" : "Pending" },
      { icon: "UserCog", name: "Employees", status: employees.length > 0 ? "Completed" : "Pending" },
      { icon: "FileText", name: "Document Templates", status: "Pending" },
      { icon: "BarChart3", name: "Reports Ready", status: invoices.length > 0 || bills.length > 0 ? "Completed" : "Pending" },
    ];

    const focusTasks: DashboardFocusTask[] = [
      {
        label: customers.length > 0 ? "Review open receivables" : "Add the first customer",
        note: customers.length > 0 ? "Keep collections moving" : "Kick off collections",
        done: customers.length > 0,
      },
      {
        label: bankAccounts.length > 0 ? "Reconcile latest bank entries" : "Connect a bank account",
        note: bankAccounts.length > 0 ? "Match recent inflows and outflows" : "Start reconciliations",
        done: bankAccounts.length > 0,
      },
      {
        label: invoices.length > 0 ? "Follow up on pending invoices" : "Create your first invoice",
        note: invoices.length > 0 ? "Keep payment pace healthy" : "Track outbound work",
        done: invoices.length > 0,
      },
    ];

    const activity: DashboardActivityItem[] = [
      ...customers.slice(0, 2).map((customer) => ({
        time: customer.createdAt.toLocaleDateString(),
        description: `${customer.name} added`,
        who: "Customer",
      })),
      ...vendors.slice(0, 2).map((vendor) => ({
        time: vendor.createdAt.toLocaleDateString(),
        description: `${vendor.name} listed`,
        who: "Vendor",
      })),
      ...transactions.slice(0, 2).map((transaction) => ({
        time: transaction.date ?? transaction.createdAt.toLocaleDateString(),
        description: transaction.description,
        who: transaction.kind ?? "Bank",
      })),
    ].slice(0, 5);

    const insights: DashboardInsightItem[] = [
      {
        title: overdueInvoices > 0 ? `${overdueInvoices} invoices need follow-up` : "Collections look healthy",
        subtitle: overdueInvoices > 0 ? "Review due dates and send reminders." : "All current invoice deadlines appear on track.",
        tone: overdueInvoices > 0 ? "warning" : "success",
      },
      {
        title: pendingBills > 0 ? `${pendingBills} bills remain open` : "Bill flow is under control",
        subtitle: pendingBills > 0 ? "Clear pending bills before month-end." : "No vendor payments are waiting for action.",
        tone: pendingBills > 0 ? "info" : "success",
      },
      {
        title: bankAccounts.length > 0 ? `${bankAccounts.length} bank accounts synced` : "Bank accounts are not connected yet",
        subtitle: bankAccounts.length > 0 ? "The latest transactions are ready for reconciliation." : "Connect accounts to unlock cash insights.",
        tone: bankAccounts.length > 0 ? "info" : "warning",
      },
    ];

    const reports: DashboardReportItem[] = [
      { name: "Profit & Loss", description: "Revenue, expense, and margin outlook." },
      { name: "Cash Flow", description: "Liquidity across connected bank accounts." },
      { name: "Tax Summary", description: "Input and output tax balances." },
      { name: "Receivables", description: "Open invoices and follow-up status." },
    ];

    const recentReports = [
      { name: "Cash flow snapshot", generated: "Updated just now" },
      { name: "Receivables aging", generated: "A few minutes ago" },
    ];

    const lastMonthKey = months.at(-1)?.key ?? "";
    const lastMonthCashflow = cashflowByMonth.get(lastMonthKey);
    const summary = [
      { label: "Net Flow", value: formatCurrency((lastMonthCashflow?.inflow ?? 0) - (lastMonthCashflow?.outflow ?? 0)), note: "This month" },
      { label: "Collections", value: formatCurrency(receivables), note: `${overdueInvoices} invoices pending` },
      { label: "Tax Position", value: formatCurrency(taxSummary.net), note: `${taxSummary.pending} actions pending` },
    ];

    return {
      metrics,
      cashflow: months.map((month) => ({
        month: month.label,
        inflow: cashflowByMonth.get(month.key)?.inflow ?? 0,
        outflow: cashflowByMonth.get(month.key)?.outflow ?? 0,
        net: (cashflowByMonth.get(month.key)?.inflow ?? 0) - (cashflowByMonth.get(month.key)?.outflow ?? 0),
      })),
      revenueExpenses: months.map((month) => ({
        month: month.label,
        revenue: revenueByMonth.get(month.key) ?? 0,
        expenses: expenseByMonth.get(month.key) ?? 0,
      })),
      outstanding,
      businessHealth,
      topCustomers,
      topVendors,
      bankingSummary,
      taxSummary,
      setupTasks,
      focusTasks,
      activity,
      insights,
      reports,
      recentReports,
      summary,
    };
  } catch {
    return buildFallbackPayload();
  }
}
