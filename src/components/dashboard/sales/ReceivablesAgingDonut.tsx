"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ArrowRight } from "lucide-react";

import Card from "@/components/ui/Card";
import { useChartColors } from "@/lib/useChartColors";
import { receivablesAging } from "@/data/salesDocuments";

export default function ReceivablesAgingDonut() {
  const c = useChartColors();

  const colorByName: Record<string, string> = {
    "Current (0-30 days)": c.success,
    "1-30 Days": c.info,
    "31-60 Days": c.warning,
    "60+ Days": c.danger,
  };

  const slices = receivablesAging.map((s) => ({
    ...s,
    color: colorByName[s.name] ?? c.bronze,
  }));

  return (
    <Card className="flex h-full flex-col">
      <h2 className="text-base font-semibold text-fg">Receivables Aging</h2>

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
            <span className="text-2xl font-bold text-fg">₹2.1M</span>
            <span className="text-xs text-muted">Outstanding</span>
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
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-bronze hover:opacity-80 transition"
      >
        View Ageing Report <ArrowRight size={14} />
      </button>
    </Card>
  );
}
