"use client";

import { useEffect, useState } from "react";
import type { DashboardSummaryResponse } from "@/lib/dashboardApi";

export default function ApiIntegrationPanel() {
  const [data, setData] = useState<DashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [healthRes, dashboardRes] = await Promise.all([
          fetch("/api/health"),
          fetch("/api/dashboard"),
        ]);

        const [health, dashboard] = await Promise.all([
          healthRes.json(),
          dashboardRes.json(),
        ]);

        if (isMounted) {
          setData({
            ...(dashboard as DashboardSummaryResponse),
            message: `${(health as { message?: string }).message || "Backend API ready"}. ${(dashboard as DashboardSummaryResponse).message}`,
          });
        }
      } catch {
        if (isMounted) {
          setData({
            connected: false,
            source: "mock",
            message: "Unable to reach the API routes yet. The app is using fallback data.",
            kpis: [],
            activity: [],
            aiSuggestion: "Retry once the backend route is responding.",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Backend API integration</p>
          <p className="text-sm text-slate-500">
            Local route handlers are now ready for live backend connections.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            data?.connected ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          {loading ? "Checking..." : data?.connected ? "Connected" : "Fallback"}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-600">{data?.message}</p>

      {data?.kpis && data.kpis.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.kpis.slice(0, 2).map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
              <p className="text-sm text-slate-600">{item.change}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-800">Next step</p>
        <p className="mt-1">{data?.aiSuggestion}</p>
      </div>
    </div>
  );
}
