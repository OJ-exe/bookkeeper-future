"use client";

import {
  AreaChart,
  Area,
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

const data = [
  { month: "Jan", inflow: 1180000, outflow: 920000, net: 260000 },
  { month: "Feb", inflow: 1340000, outflow: 980000, net: 360000 },
  { month: "Mar", inflow: 1260000, outflow: 1040000, net: 220000 },
  { month: "Apr", inflow: 1480000, outflow: 1120000, net: 360000 },
  { month: "May", inflow: 1620000, outflow: 1180000, net: 440000 },
  { month: "Jun", inflow: 1540000, outflow: 1060000, net: 480000 },
];

export default function CashRunwayChart() {
  const c = useChartColors();

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-fg">Cash Runway</h2>
          <p className="text-xs text-muted">Inflow vs outflow · 6 months</p>
        </div>
        <CardSelect options={["6 Months", "3 Months", "12 Months", "This FY"]} />
      </div>

      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="runwayInflowFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.success} stopOpacity={0.24} />
                <stop offset="100%" stopColor={c.success} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="runwayOutflowFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.danger} stopOpacity={0.2} />
                <stop offset="100%" stopColor={c.danger} stopOpacity={0} />
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
              tickFormatter={(v: number) => `₹${(v / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                background: c.tooltipBg,
                border: `1px solid ${c.tooltipBorder}`,
                borderRadius: 12,
                color: c.tooltipText,
              }}
              formatter={(v: number) => `₹${(v / 1000000).toFixed(2)}M`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="inflow"
              name="Inflow"
              stroke={c.success}
              strokeWidth={2}
              fill="url(#runwayInflowFill)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="outflow"
              name="Outflow"
              stroke={c.danger}
              strokeWidth={2}
              fill="url(#runwayOutflowFill)"
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
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
