"use client";

import {
  BarChart,
  Bar,
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
  { month: "Jan", revenue: 45000, expenses: 18000 },
  { month: "Feb", revenue: 52000, expenses: 22000 },
  { month: "Mar", revenue: 48000, expenses: 21000 },
  { month: "Apr", revenue: 65000, expenses: 28000 },
  { month: "May", revenue: 72000, expenses: 32000 },
  { month: "Jun", revenue: 80000, expenses: 35000 },
];

export default function RevenueExpensesChart() {
  const c = useChartColors();

  return (
    <Card className="h-full flex flex-col">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-fg">Revenue vs Expenses</h2>
        <CardSelect options={["This Financial Year", "Last Quarter", "This Month"]} />
      </div>

      <div className="flex-1 min-h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
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
              cursor={{ fill: c.grid, opacity: 0.3 }}
              contentStyle={{
                background: c.tooltipBg,
                border: `1px solid ${c.tooltipBorder}`,
                borderRadius: 12,
                color: c.tooltipText,
              }}
            />
            <Legend />
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill={c.bronze}
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              name="Expenses"
              fill={c.sand}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
