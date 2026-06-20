export default function ExpenseAnalysis() {
  const expenses = [
    "Salary",
    "Rent",
    "Marketing",
    "Software",
    "Travel",
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">
        Top Expense Heads
      </h2>

      <div className="space-y-4">
        {expenses.map((item) => (
          <div
            key={item}
            className="flex justify-between"
          >
            <span>{item}</span>
            <span>₹0</span>
          </div>
        ))}
      </div>
    </div>
  );
}