export default function RevenueChannels() {
  const channels = [
    { name: "Website", value: "₹0" },
    { name: "Marketplace", value: "₹0" },
    { name: "Offline", value: "₹0" },
    { name: "Partners", value: "₹0" },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">
        Revenue Channels
      </h2>

      <div className="space-y-4">
        {channels.map((item) => (
          <div
            key={item.name}
            className="flex justify-between"
          >
            <span>{item.name}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}