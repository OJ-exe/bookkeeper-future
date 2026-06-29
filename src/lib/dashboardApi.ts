export type DashboardKpi = {
  label: string;
  value: string;
  change: string;
  tone: "positive" | "neutral" | "warning";
};

export type DashboardActivityItem = {
  title: string;
  detail: string;
  time: string;
};

export interface DashboardSummaryResponse {
  connected: boolean;
  source: "mock" | "remote";
  message: string;
  kpis: DashboardKpi[];
  activity: DashboardActivityItem[];
  aiSuggestion: string;
}

export interface HealthStatusResponse {
  status: "ok";
  message: string;
  timestamp: string;
}

async function fetchRemoteDashboard(): Promise<DashboardSummaryResponse | null> {
  const baseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/dashboard`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as DashboardSummaryResponse;
  } catch {
    return null;
  }
}

export async function getDashboardSummary(): Promise<DashboardSummaryResponse> {
  const remoteData = await fetchRemoteDashboard();

  if (remoteData) {
    return remoteData;
  }

  return {
    connected: false,
    source: "mock",
    message: "Using local placeholder data. Configure API_BASE_URL to connect a real backend.",
    kpis: [
      { label: "Cash balance", value: "$182K", change: "+12% vs last month", tone: "positive" },
      { label: "Receivables", value: "$48K", change: "4 invoices overdue", tone: "warning" },
      { label: "Payroll", value: "24/26", change: "2 pending approvals", tone: "neutral" },
    ],
    activity: [
      { title: "Invoice batch synced", detail: "3 invoices imported from the ERP", time: "10 min ago" },
      { title: "Bank feed refreshed", detail: "5 transactions reconciled", time: "32 min ago" },
    ],
    aiSuggestion: "Connect your backend endpoint to unlock live insights and AI suggestions.",
  };
}

export async function getHealthStatus(): Promise<HealthStatusResponse> {
  return {
    status: "ok",
    message: "Backend API layer is available.",
    timestamp: new Date().toISOString(),
  };
}

export async function getAiSuggestion(prompt: string): Promise<{ prompt: string; response: string }> {
  return {
    prompt,
    response: `AI integration is ready. Send this prompt to your real backend service to generate a live answer: ${prompt}`,
  };
}
