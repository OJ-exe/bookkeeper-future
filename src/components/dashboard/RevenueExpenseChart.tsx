"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    month: "Jan",
    revenue: 45000,
    expenses: 18000,
  },
  {
    month: "Feb",
    revenue: 52000,
    expenses: 22000,
  },
  {
    month: "Mar",
    revenue: 48000,
    expenses: 21000,
  },
  {
    month: "Apr",
    revenue: 65000,
    expenses: 28000,
  },
  {
    month: "May",
    revenue: 72000,
    expenses: 32000,
  },
  {
    month: "Jun",
    revenue: 80000,
    expenses: 35000,
  },
];

export default function RevenueExpenseChart() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-[300px] lg:h-[400px] ">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        Revenue vs Expenses
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar
            dataKey="revenue"
            name="Revenue"
            fill="#B08D57"
            radius={[6, 6, 0, 0]}
          />

          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="#CBD5E1"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}