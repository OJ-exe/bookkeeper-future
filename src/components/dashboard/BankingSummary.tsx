export default function BankingSummary() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-x-auto">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        Banking Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>HDFC 1234</span>
          <span className="font-semibold">₹0.00</span>
        </div>

        <div className="flex justify-between">
          <span>ICICI Current</span>
          <span className="font-semibold">₹0.00</span>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <span className="text-slate-500">
            Open Transactions: 0
          </span>
        </div>
      </div>
    </div>
  );
}