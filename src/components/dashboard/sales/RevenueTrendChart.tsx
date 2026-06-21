"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Card from "@/components/ui/Card";
import CardSelect from "@/components/ui/CardSelect";
import { useChartColors } from "@/lib/useChartColors";
import { revenueTrend } from "@/data/salesDocuments";

export default function RevenueTrendChart() {
  const c = useChartColors();

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-fg">Revenue Trend</h2>
        <CardSelect options={["This Financial Year", "Last Quarter", "This Month"]} />
      </div>

      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueTrend} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.bronze} stopOpacity={0.28} />
                <stop offset="100%" stopColor={c.bronze} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
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
              tickFormatter={(v: number) => `₹${(v / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              contentStyle={{
                background: c.tooltipBg,
                border: `1px solid ${c.tooltipBorder}`,
                borderRadius: 12,
                color: c.tooltipText,
              }}
              formatter={(v: number) => [`₹${(v / 1000000).toFixed(2)}M`, "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={c.bronze}
              strokeWidth={2}
              fill="url(#revenueTrendFill)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
