export type DashboardTone = "positive" | "neutral" | "warning";

export interface DashboardMetric {
  label: string;
  value: string;
  sublabel: string;
  tone: "success" | "info" | "warning" | "bronze";
  icon: string;
}

export interface DashboardSeriesPoint {
  month: string;
  inflow?: number;
  outflow?: number;
  net?: number;
  revenue?: number;
  expenses?: number;
}

export interface DashboardOutstandingBucket {
  name: string;
  value: number;
  color: string;
}

export interface DashboardOutstandingSummary {
  total: number;
  buckets: DashboardOutstandingBucket[];
}

export interface DashboardBusinessHealth {
  score: number;
  status: string;
  change: string;
  metrics: Array<{ label: string; pct: number }>;
}

export interface DashboardCustomerVendorItem {
  name: string;
  total: number;
}

export interface DashboardBankingSummary {
  accounts: number;
  balance: number;
  pending: number;
  matched: number;
}

export interface DashboardTaxSummary {
  output: number;
  input: number;
  net: number;
  pending: number;
}

export interface DashboardSetupTask {
  name: string;
  status: "Completed" | "In Progress" | "Pending";
}

export interface DashboardFocusTask {
  label: string;
  note: string;
  done: boolean;
}

export interface DashboardActivityItem {
  time: string;
  description: string;
  who: string;
}

export interface DashboardInsightItem {
  title: string;
  subtitle: string;
  tone: "success" | "warning" | "info";
}

export interface DashboardReportItem {
  name: string;
  description: string;
}

export interface DashboardAnalyticsPayload {
  metrics: DashboardMetric[];
  cashflow: DashboardSeriesPoint[];
  revenueExpenses: DashboardSeriesPoint[];
  outstanding: DashboardOutstandingSummary;
  businessHealth: DashboardBusinessHealth;
  topCustomers: DashboardCustomerVendorItem[];
  topVendors: DashboardCustomerVendorItem[];
  bankingSummary: DashboardBankingSummary;
  taxSummary: DashboardTaxSummary;
  setupTasks: DashboardSetupTask[];
  focusTasks: DashboardFocusTask[];
  activity: DashboardActivityItem[];
  insights: DashboardInsightItem[];
  reports: DashboardReportItem[];
  recentReports: Array<{ name: string; generated: string }>;
  summary: Array<{ label: string; value: string; note: string }>;
}
