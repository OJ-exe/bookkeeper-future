"use client";

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card from "@/components/ui/Card";
import CardSelect from "@/components/ui/CardSelect";
import { useChartColors } from "@/lib/useChartColors";
import { useDashboardAnalytics } from "@/lib/useDashboardAnalytics";

const fallbackData = [
  { month: "Jan", inflow: 42000, outflow: 28000, net: 14000 },
  { month: "Feb", inflow: 38000, outflow: 31000, net: 7000 },
  { month: "Mar", inflow: 51000, outflow: 34000, net: 17000 },
  { month: "Apr", inflow: 47000, outflow: 39000, net: 8000 },
  { month: "May", inflow: 62000, outflow: 41000, net: 21000 },
  { month: "Jun", inflow: 58000, outflow: 37000, net: 21000 },
];

export default function CashFlowChart() {
  const { data } = useDashboardAnalytics();
  const c = useChartColors();
  const chartData = data?.cashflow?.length ? data.cashflow : fallbackData;

  return (
    <Card className="h-full flex flex-col">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-fg">Cash Flow</h2>
          <p className="text-xs text-muted">Last 6 Months</p>
        </div>
        <CardSelect options={["6 Months", "3 Months", "12 Months", "This FY"]} />
      </div>

      <div className="flex-1 min-h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis
              dataKey="month"
              tick={{ fill: c.axis, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: c.axis, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: c.tooltipBg,
                border: `1px solid ${c.tooltipBorder}`,
                borderRadius: 12,
                color: c.tooltipText,
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="inflow"
              name="Inflow"
              stroke={c.success}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="outflow"
              name="Outflow"
              stroke={c.danger}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="net"
              name="Net"
              stroke={c.bronze}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
