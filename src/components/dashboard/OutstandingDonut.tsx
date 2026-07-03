"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Card from "@/components/ui/Card";
import CardSelect from "@/components/ui/CardSelect";
import { useChartColors } from "@/lib/useChartColors";
import { useDashboardAnalytics } from "@/lib/useDashboardAnalytics";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function OutstandingDonut() {
  const { data } = useDashboardAnalytics();
  const c = useChartColors();

  const fallbackBuckets = [
    { name: "Not Overdue", value: 1, color: c.success },
    { name: "1–30 Days", value: 1, color: c.warning },
    { name: "31–60 Days", value: 1, color: c.bronze },
    { name: "60+ Days", value: 1, color: c.danger },
  ];

  const buckets = data?.outstanding?.buckets?.length ? data.outstanding.buckets : fallbackBuckets;
  const total = data?.outstanding?.total ?? buckets.reduce((sum, bucket) => sum + bucket.value, 0);
  const chartData = buckets.map((bucket) => ({ name: bucket.name, value: bucket.value }));

  return (
    <Card className="h-full flex flex-col">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-fg">Outstanding Invoices</h2>
        <CardSelect options={["All Time", "This Quarter", "This Month"]} />
      </div>

      <div className="flex flex-1 items-center gap-4">
        <div className="relative h-44 w-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                stroke="none"
              >
                {buckets.map((bucket) => (
                  <Cell key={bucket.name} fill={bucket.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-fg">{currencyFormatter.format(total)}</span>
            <span className="text-xs text-muted">Total</span>
          </div>
        </div>

        <ul className="flex-1 space-y-3">
          {buckets.map((bucket) => {
            const pct = total > 0 ? (bucket.value / total) * 100 : 0;
            return (
              <li key={bucket.name} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: bucket.color }}
                />
                <span className="text-sm text-fg">{bucket.name}</span>
                <span className="ml-auto text-sm text-muted">{currencyFormatter.format(bucket.value)} ({pct.toFixed(0)}%)</span>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
