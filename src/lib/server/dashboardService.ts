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

const compactFormatter = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  maximumFractionDigits: 1,
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

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatCompactCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatCompactNumber(value: number) {
  return compactFormatter.format(value);
}

function getMonthLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function parseDueDate(value: string | null | undefined) {
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

function buildFallbackPayload(): DashboardAnalyticsPayload {
  const metrics: DashboardMetric[] = [
    { label: "Cash Available", value: formatCurrency(0), sublabel: "No bank activity yet", tone: "success", icon: "Wallet" },
    { label: "Receivables", value: formatCurrency(0), sublabel: "No invoices pending", tone: "info", icon: "ArrowDownToLine" },
    { label: "Payables", value: formatCurrency(0), sublabel: "No bills pending", tone: "warning", icon: "ArrowUpFromLine" },
    { label: "Tasks Need Attention", value: "0", sublabel: "All caught up", tone: "bronze", icon: "AlertCircle" },
  ];

  const cashflow: DashboardSeriesPoint[] = Array.from({ length: 6 }, (_, index) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index] ?? "Jun",
    inflow: 0,
    outflow: 0,
    net: 0,
  }));

  const revenueExpenses: DashboardSeriesPoint[] = cashflow.map((item) => ({
    month: item.month,
    revenue: 0,
    expenses: 0,
  }));

  const outstanding: DashboardOutstandingSummary = {
    total: 0,
    buckets: [
      { name: "Not Overdue", value: 0, color: "#22c55e" },
      { name: "1–30 Days", value: 0, color: "#f59e0b" },
      { name: "31–60 Days", value: 0, color: "#d97706" },
      { name: "60+ Days", value: 0, color: "#ef4444" },
    ],
  };

  const businessHealth: DashboardBusinessHealth = {
    score: 72,
    status: "Stable",
    change: "+2 pts vs last month",
    metrics: [
      { label: "Cash Flow", pct: 72 },
      { label: "Collections", pct: 74 },
      { label: "Taxes", pct: 68 },
      { label: "Profitability", pct: 70 },
    ],
  };

  const topCustomers: DashboardCustomerVendorItem[] = [];
  const topVendors: DashboardCustomerVendorItem[] = [];
  const bankingSummary: DashboardBankingSummary = { accounts: 0, balance: 0, pending: 0, matched: 0 };
  const taxSummary: DashboardTaxSummary = { output: 0, input: 0, net: 0, pending: 0 };

  const setupTasks: DashboardSetupTask[] = [
    { name: "Company Profile", status: "Pending" },
    { name: "GST & Tax Settings", status: "Pending" },
    { name: "Bank Connections", status: "Pending" },
    { name: "Customers", status: "Pending" },
    { name: "Vendors", status: "Pending" },
    { name: "Employees", status: "Pending" },
    { name: "Document Templates", status: "Pending" },
    { name: "Reports Ready", status: "Pending" },
  ];

  const focusTasks: DashboardFocusTask[] = [
    { label: "Add the first customer", note: "Kick off collections", done: false },
    { label: "Connect a bank account", note: "Start reconciliations", done: false },
    { label: "Create your first invoice", note: "Track outbound work", done: false },
  ];

  const activity: DashboardActivityItem[] = [];
  const insights: DashboardInsightItem[] = [
    { title: "No transactions captured yet", subtitle: "Once entries are synced, insights will appear here.", tone: "info" },
  ];
  const reports: DashboardReportItem[] = [
    { name: "Profit & Loss", description: "Review revenue and expense movement." },
    { name: "Cash Flow", description: "Track cash positions and liquidity." },
    { name: "Tax Summary", description: "Understand input and output tax impact." },
  ];
  const recentReports = [{ name: "No reports generated", generated: "Waiting for data" }];
  const summary = [
    { label: "Net Flow", value: formatCurrency(0), note: "This month" },
    { label: "Collections", value: formatCurrency(0), note: "Invoices due" },
    { label: "Tax Position", value: formatCurrency(0), note: "Pending" },
  ];

  return {
    metrics,
    cashflow,
    revenueExpenses,
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

async function fetchMonthlySeries() {
  const months = Array.from({ length: 6 }, (_, index) => {
    const month = new Date();
    month.setDate(1);
    month.setMonth(month.getMonth() - (5 - index));
    return {
      month,
      key: monthKey(month),
      label: getMonthLabel(month),
    };
  });

  const [invoices, bills, transactions] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        createdAt: {
          gte: months[0].month,
        },
      },
      select: { createdAt: true, grandTotal: true },
    }),
    prisma.bill.findMany({
      where: {
        createdAt: {
          gte: months[0].month,
        },
      },
      select: { createdAt: true, grandTotal: true },
    }),
    prisma.bankTransaction.findMany({
      where: {
        createdAt: {
          gte: months[0].month,
        },
      },
      select: { createdAt: true, amount: true, kind: true },
    }),
  ]);

  const revenueSeries = months.map((item) => {
    const amount = invoices.reduce((sum, invoice) => {
      const invoiceMonth = monthKey(invoice.createdAt);
      return invoiceMonth === item.key ? sum + parseAmount(invoice.grandTotal) : sum;
    }, 0);
    return { month: item.label, revenue: amount };
  });

  const expenseSeries = months.map((item) => {
    const amount = bills.reduce((sum, bill) => {
      const billMonth = monthKey(bill.createdAt);
      return billMonth === item.key ? sum + parseAmount(bill.grandTotal) : sum;
    }, 0);
    return { month: item.label, expenses: amount };
  });

  const cashflowSeries = months.map((item) => {
    const inflow = transactions.reduce((sum, tx) => {
      const txMonth = monthKey(tx.createdAt);
      const isInflow = tx.kind?.toLowerCase() === "inflow";
      return txMonth === item.key && isInflow ? sum + parseAmount(tx.amount) : sum;
    }, 0);

    const outflow = transactions.reduce((sum, tx) => {
      const txMonth = monthKey(tx.createdAt);
      const isOutflow = tx.kind?.toLowerCase() === "outflow";
      return txMonth === item.key && isOutflow ? sum + parseAmount(tx.amount) : sum;
    }, 0);

    return { month: item.label, inflow, outflow, net: inflow - outflow };
  });

  return {
    revenueSeries,
    expenseSeries,
    cashflowSeries,
  };
}

export async function getDashboardAnalytics(): Promise<DashboardAnalyticsPayload> {
  try {
    const [
      invoices,
      bills,
      payments,
      customers,
      vendors,
      bankAccounts,
      transactions,
      accounts,
    ] = await Promise.all([
      prisma.invoice.findMany({ orderBy: { createdAt: "desc" }, take: 40 }),
      prisma.bill.findMany({ orderBy: { createdAt: "desc" }, take: 40 }),
      prisma.payment.findMany({ orderBy: { createdAt: "desc" }, take: 40 }),
      prisma.customer.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
      prisma.vendor.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
      prisma.bankAccount.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.bankTransaction.findMany({ orderBy: { createdAt: "desc" }, take: 40 }),
      prisma.account.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    const monthly = await fetchMonthlySeries();

    const receivables = invoices.reduce((sum, invoice) => sum + parseAmount(invoice.netReceivable), 0);
    const payables = bills.reduce((sum, bill) => sum + parseAmount(bill.netPayable), 0);
    const cashBalance = bankAccounts.reduce((sum, account) => sum + parseAmount(account.balance), 0);
    const overdueInvoices = invoices.filter((invoice) => {
      const dueDate = parseDueDate(invoice.due ?? null);
      return invoice.status.toLowerCase().includes("overdue") || (dueDate && dueDate < new Date());
    }).length;
    const pendingBills = bills.filter((bill) => bill.status.toLowerCase() !== "paid" && bill.status.toLowerCase() !== "closed").length;
    const attentionCount = overdueInvoices + pendingBills;

    const metrics: DashboardMetric[] = [
      { label: "Cash Available", value: formatCurrency(cashBalance), sublabel: `${bankAccounts.length} connected accounts`, tone: "success", icon: "Wallet" },
      { label: "Receivables", value: formatCurrency(receivables), sublabel: `${overdueInvoices} invoices pending`, tone: "info", icon: "ArrowDownToLine" },
      { label: "Payables", value: formatCurrency(payables), sublabel: `${pendingBills} bills to clear`, tone: "warning", icon: "ArrowUpFromLine" },
      { label: "Tasks Need Attention", value: String(attentionCount), sublabel: attentionCount > 0 ? "Need follow-up" : "All caught up", tone: "bronze", icon: "AlertCircle" },
    ];

    const outstandingBuckets: DashboardOutstandingBucket[] = [
      { name: "Not Overdue", value: 0, color: "#22c55e" },
      { name: "1–30 Days", value: 0, color: "#f59e0b" },
      { name: "31–60 Days", value: 0, color: "#d97706" },
      { name: "60+ Days", value: 0, color: "#ef4444" },
    ];

    let outstandingTotal = 0;
    for (const invoice of invoices) {
      const amount = parseAmount(invoice.open);
      if (amount <= 0) {
        continue;
      }

      outstandingTotal += amount;
      const bucketIndex = bucketForInvoiceStatus(parseDueDate(invoice.due ?? null), invoice.status);
      outstandingBuckets[bucketIndex].value += amount;
    }

    const outstanding: DashboardOutstandingSummary = {
      total: outstandingTotal,
      buckets: outstandingBuckets,
    };

    const businessHealth: DashboardBusinessHealth = {
      score: Math.min(100, Math.max(45, Math.round((cashBalance / Math.max(1, receivables + payables + 1)) * 40 + (bankAccounts.length >= 1 ? 18 : 0) + (overdueInvoices <= 1 ? 10 : 0) + (pendingBills <= 2 ? 8 : 0)))),
      status: overdueInvoices > 0 ? "Needs attention" : "Healthy",
      change: `${cashBalance >= receivables ? "+" : "-"}${Math.max(1, Math.round((cashBalance - receivables) / 1000))} pts vs last month`,
      metrics: [
        { label: "Cash Flow", pct: Math.min(100, Math.round((cashBalance / Math.max(1, receivables + payables)) * 100)) },
        { label: "Collections", pct: Math.max(0, 100 - overdueInvoices * 12) },
        { label: "Taxes", pct: 78 },
        { label: "Profitability", pct: Math.min(100, Math.round((receivables > 0 ? 100 - pendingBills * 8 : 90)))) },
      ],
    };

    const topCustomers: DashboardCustomerVendorItem[] = customers
      .map((customer) => ({
        name: customer.name,
        total: parseAmount(customer.revenue),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const topVendors: DashboardCustomerVendorItem[] = vendors
      .map((vendor) => ({
        name: vendor.name,
        total: parseAmount(vendor.spend),
      }))
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
      { name: "Company Profile", status: accounts.length > 0 || customers.length > 0 ? "Completed" : "Pending" },
      { name: "GST & Tax Settings", status: invoices.length > 0 || bills.length > 0 ? "Completed" : "Pending" },
      { name: "Bank Connections", status: bankAccounts.length > 0 ? "Completed" : "Pending" },
      { name: "Customers", status: customers.length > 0 ? "Completed" : "Pending" },
      { name: "Vendors", status: vendors.length > 0 ? "Completed" : "Pending" },
      { name: "Employees", status: accounts.length > 0 ? "Completed" : "Pending" },
      { name: "Document Templates", status: "Pending" },
      { name: "Reports Ready", status: invoices.length > 0 || bills.length > 0 ? "Completed" : "Pending" },
    ];

    const focusTasks: DashboardFocusTask[] = [
      { label: customers.length > 0 ? "Review open receivables" : "Add the first customer", note: customers.length > 0 ? "Keep collections moving" : "Kick off collections", done: customers.length > 0 },
      { label: bankAccounts.length > 0 ? "Reconcile latest bank entries" : "Connect a bank account", note: bankAccounts.length > 0 ? "Match recent inflows and outflows" : "Start reconciliations", done: bankAccounts.length > 0 },
      { label: invoices.length > 0 ? "Follow up on pending invoices" : "Create your first invoice", note: invoices.length > 0 ? "Keep payment pace healthy" : "Track outbound work", done: invoices.length > 0 },
    ];

    const activity: DashboardActivityItem[] = [
      ...customers.slice(0, 2).map((customer) => ({ time: "Fresh", description: `${customer.name} added`, who: "Customer" })),
      ...vendors.slice(0, 2).map((vendor) => ({ time: "Fresh", description: `${vendor.name} listed`, who: "Vendor" })),
      ...transactions.slice(0, 2).map((transaction) => ({ time: transaction.date ?? "Today", description: transaction.description, who: transaction.kind ?? "Bank" })),
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

    const summary = [
      { label: "Net Flow", value: formatCurrency(monthly.cashflowSeries.at(-1)?.net ?? 0), note: "This month" },
      { label: "Collections", value: formatCurrency(receivables), note: `${overdueInvoices} invoices pending` },
      { label: "Tax Position", value: formatCurrency(taxSummary.net), note: `${taxSummary.pending} actions pending` },
    ];

    return {
      metrics,
      cashflow: monthly.cashflowSeries,
      revenueExpenses: monthly.revenueSeries.map((item, index) => ({
        month: item.month,
        revenue: item.revenue,
        expenses: monthly.expenseSeries[index]?.expenses ?? 0,
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
