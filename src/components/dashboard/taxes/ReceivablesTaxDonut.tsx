"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import Card from "@/components/ui/Card";
import { useChartColors } from "@/lib/useChartColors";
import { receivablesTaxPosition } from "@/data/taxes";

export default function ReceivablesTaxDonut() {
  const c = useChartColors();

  const colorByName: Record<string, string> = {
    "Current (0-30 days)": c.success,
    "1-30 days": c.info,
    "31-60 days": c.warning,
    "60+ days": c.danger,
  };

  const slices = receivablesTaxPosition.map((s) => ({
    ...s,
    color: colorByName[s.name] ?? c.bronze,
  }));

  return (
    <Card className="flex h-full flex-col">
      <h2 className="text-base font-semibold text-fg">Receivables Tax Position</h2>

      <div className="mt-4 flex flex-1 flex-col items-center gap-6 sm:flex-row">
        <ul className="flex-1 space-y-3 self-stretch">
          {slices.map((s) => (
            <li key={s.name} className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <span className="min-w-0 truncate text-sm text-fg-soft">{s.name}</span>
              <span className="ml-auto text-sm font-semibold text-fg">{s.amount}</span>
            </li>
          ))}
        </ul>

        <div className="relative h-36 w-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="name"
                innerRadius={46}
                outerRadius={66}
                paddingAngle={2}
                stroke="none"
              >
                {slices.map((s) => (
                  <Cell key={s.name} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-fg">₹1.24L</span>
            <span className="text-xs text-muted">Outstanding</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="text-sm text-muted">Total Outstanding</span>
        <span className="text-sm font-semibold text-fg">₹1,24,000</span>
      </div>
    </Card>
  );
}
