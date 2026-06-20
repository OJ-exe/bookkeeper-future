export default function TaxSummary() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6">
      <h2 className="text-xl font-semibold">
        GST & TDS
      </h2>

      <div className="grid grid-cols-2 gap-5 mt-6">
        <div>
          <p>Output GST</p>
          <h3>₹0.00</h3>
        </div>

        <div>
          <p>Input GST</p>
          <h3>₹0.00</h3>
        </div>

        <div>
          <p>TDS Payable</p>
          <h3>₹0.00</h3>
        </div>

        <div>
          <p>TDS Receivable</p>
          <h3>₹0.00</h3>
        </div>
      </div>
    </div>
  );
}