const activity = [
  {
    title: "Invoice #1004 Paid",
    time: "2 mins ago",
  },
  {
    title: "Expense Added",
    time: "18 mins ago",
  },
  {
    title: "Bank Synced",
    time: "1 hour ago",
  },
  {
    title: "AI Report Generated",
    time: "3 hours ago",
  },
];

export default function Activity() {
  return (
    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-3xl
        p-6
        shadow-sm
      "
    >
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        Recent Activity
      </h2>

      <div className="space-y-5">
        {activity.map((item) => (
          <div
            key={item.title}
            className="
              border-b
              border-slate-100
              pb-4
            "
          >
            <p className="font-medium text-slate-800">
              {item.title}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              {item.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}