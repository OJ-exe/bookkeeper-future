"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ArrowRight } from "lucide-react";

import Card from "@/components/ui/Card";
import { useChartColors } from "@/lib/useChartColors";
import { revenueContribution } from "@/data/customers";

export default function RevenueContributionDonut() {
  const c = useChartColors();

  const slices = revenueContribution.map((s, i) => ({
    ...s,
    color: i === 0 ? c.bronze : c.sand,
  }));

  return (
    <Card className="flex h-full flex-col">
      <h2 className="text-base font-semibold text-fg">Revenue Contribution</h2>

      <div className="mt-4 flex flex-1 flex-col items-center gap-6 sm:flex-row">
        <div className="relative h-48 w-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={88}
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
            <span className="text-2xl font-bold text-fg">₹15.4M</span>
            <span className="text-xs text-muted">Total Revenue</span>
          </div>
        </div>

        <ul className="flex-1 space-y-4 self-stretch">
          {slices.map((s) => (
            <li key={s.name} className="flex items-start gap-2.5">
              <span
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-fg">{s.name}</p>
                <p className="text-xs text-muted">{s.amount}</p>
              </div>
              <span className="ml-auto text-sm font-semibold text-fg">{s.value}%</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-bronze hover:opacity-80 transition"
      >
        View full report <ArrowRight size={14} />
      </button>
    </Card>
  );
}
