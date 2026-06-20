"use client";

import { LineChart, Line } from "recharts";

const data = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 200 },
  { month: "Mar", value: 150 },
];

export default function Charts() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6">
      <h2 className="text-xl font-semibold mb-4">
        Recharts Test
      </h2>

      <LineChart
        width={500}
        height={300}
        data={data}
      >
        <Line
          type="monotone"
          dataKey="value"
          stroke="#B08D57"
          strokeWidth={3}
        />
      </LineChart>
    </div>
  );
}