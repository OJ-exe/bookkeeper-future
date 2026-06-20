const ageing = [
  "Current",
  "1-30",
  "31-60",
  "61-90",
  "90+",
];

export default function ReceivableAgeing() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">
        Receivables Ageing
      </h2>

      <div className="space-y-3">
        {ageing.map((item) => (
          <div
            key={item}
            className="flex justify-between"
          >
            <span>{item}</span>
            <span>₹0.00</span>
          </div>
        ))}
      </div>
    </div>
  );
}