export default function BusinessHealth() {
  const metrics = [
    { label: "Cash Flow", value: 80 },
    { label: "Collections", value: 90 },
    { label: "Taxes", value: 70 },
    { label: "Profitability", value: 75 },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-full">
      <h2 className="text-lg font-semibold text-slate-900">
        Business Health
      </h2>

      <div className="mt-4">
        <div className="flex items-center gap-2">
          <span className="text-4xl font-bold text-green-600">
            82
          </span>

          <span className="text-slate-500">
            /100
          </span>
        </div>

        <p className="text-green-600 text-sm mt-1">
          Good
        </p>
      </div>

      <div className="space-y-4 mt-6">
        {metrics.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span>{item.label}</span>
              <span>{item.value}%</span>
            </div>

            <div className="h-2 bg-slate-100 rounded-full">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}