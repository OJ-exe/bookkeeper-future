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
import { gstTrend } from "@/data/taxes";

export default function GstTrendChart() {
  const c = useChartColors();

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-fg">GST Trend</h2>
        <CardSelect options={["This Financial Year", "Last Quarter", "This Month"]} />
      </div>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={gstTrend} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="gstTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.info} stopOpacity={0.28} />
                <stop offset="100%" stopColor={c.info} stopOpacity={0} />
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
              tickFormatter={(v: number) => `₹${(v / 100000).toFixed(0)}L`}
            />
            <Tooltip
              contentStyle={{
                background: c.tooltipBg,
                border: `1px solid ${c.tooltipBorder}`,
                borderRadius: 12,
                color: c.tooltipText,
              }}
              formatter={(v: number) => [`₹${(v / 100000).toFixed(2)}L`, "GST"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={c.info}
              strokeWidth={2}
              fill="url(#gstTrendFill)"
              dot={{ r: 3, fill: c.info, strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
