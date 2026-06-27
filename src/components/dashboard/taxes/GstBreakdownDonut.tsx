"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ArrowRight } from "lucide-react";

import Card from "@/components/ui/Card";
import { useChartColors } from "@/lib/useChartColors";
import { gstBreakdown } from "@/data/taxes";

export default function GstBreakdownDonut() {
  const c = useChartColors();

  const colorByName: Record<string, string> = {
    CGST: c.bronze,
    SGST: c.success,
    IGST: c.info,
  };

  const slices = gstBreakdown.map((s) => ({
    ...s,
    color: colorByName[s.name] ?? c.bronze,
  }));

  return (
    <Card className="flex h-full flex-col">
      <h2 className="text-base font-semibold text-fg">GST Breakdown (Output)</h2>

      <div className="mt-4 flex flex-1 flex-col items-center gap-6 sm:flex-row">
        <div className="relative h-44 w-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="name"
                innerRadius={56}
                outerRadius={82}
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
            <span className="text-xl font-bold text-fg">₹1,82,000</span>
            <span className="text-xs text-muted">Total Output GST</span>
          </div>
        </div>

        <ul className="flex-1 space-y-3 self-stretch">
          {slices.map((s) => (
            <li key={s.name} className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <span className="min-w-0 truncate text-sm text-fg-soft">{s.name}</span>
              <span className="ml-auto text-sm font-semibold text-fg">{s.amount}</span>
              <span className="w-10 text-right text-xs text-muted">{s.pct}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-bronze hover:opacity-80 transition"
      >
        View details <ArrowRight size={14} />
      </button>
    </Card>
  );
}
