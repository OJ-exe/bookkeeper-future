const items = [
  "Overdue Invoices",
  "Overdue Bills",
  "Open Bank Transactions",
  "Bill Uploads",
  "Quote Uploads",
];

export default function PendingActions() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6">
      <h2 className="text-xl font-semibold mb-6">
        Pending Actions
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item}
            className="flex justify-between"
          >
            <span>{item}</span>

            <span className="font-semibold">
              0
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}