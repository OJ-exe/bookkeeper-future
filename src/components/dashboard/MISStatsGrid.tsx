const stats = [
  { title: "Revenue", value: "₹0.00" },
  { title: "Expenses", value: "₹0.00" },
  { title: "Gross Margin", value: "₹0.00" },
  { title: "Net Margin", value: "₹0.00" },
  { title: "Receivables", value: "₹0.00" },
  { title: "Payables", value: "₹0.00" },
  { title: "Cash Position", value: "₹0.00" },
  { title: "Bank Balance", value: "₹0.00" },
];

export default function MISStatsGrid() {
  return (
    <div className="grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-5">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white border border-slate-200 rounded-3xl p-5"
        >
          <p className="text-slate-500 text-sm">
            {item.title}
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}