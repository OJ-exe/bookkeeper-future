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

const data = [
  { name: "Not Overdue", value: 1 },
  { name: "1–30 Days", value: 1 },
  { name: "31–60 Days", value: 1 },
  { name: "60+ Days", value: 1 },
];

export default function OutstandingDonut() {
  const c = useChartColors();

  const buckets = [
    { name: "Not Overdue", color: c.success },
    { name: "1–30 Days", color: c.warning },
    { name: "31–60 Days", color: c.bronze },
    { name: "60+ Days", color: c.danger },
  ];

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
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                stroke="none"
              >
                {buckets.map((b) => (
                  <Cell key={b.name} fill={b.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-fg">₹0</span>
            <span className="text-xs text-muted">Total</span>
          </div>
        </div>

        <ul className="flex-1 space-y-3">
          {buckets.map((b) => (
            <li key={b.name} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: b.color }}
              />
              <span className="text-sm text-fg">{b.name}</span>
              <span className="ml-auto text-sm text-muted">₹0 (0%)</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
