export default function OutstandingInvoices() {
  const invoices = [
    { bucket: "Not Overdue", amount: "₹0" },
    { bucket: "1-30 Days", amount: "₹0" },
    { bucket: "31-60 Days", amount: "₹0" },
    { bucket: "60+ Days", amount: "₹0" },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">
        Outstanding Invoices
      </h2>

      <div className="space-y-4">
        {invoices.map((item) => (
          <div
            key={item.bucket}
            className="flex justify-between"
          >
            <span>{item.bucket}</span>
            <span>{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}