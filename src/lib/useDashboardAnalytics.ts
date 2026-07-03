"use client";

import { useEffect, useState } from "react";
import type { DashboardAnalyticsPayload } from "@/types/dashboard";

export function useDashboardAnalytics() {
  const [data, setData] = useState<DashboardAnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const response = await fetch("/api/dashboard/analytics", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const payload = (await response.json()) as DashboardAnalyticsPayload;

        if (isMounted) {
          setData(payload);
        }
      } catch {
        if (isMounted) {
          setData(null);
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

  return { data, loading };
}
