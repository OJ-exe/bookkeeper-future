import Card from "@/components/ui/Card";

const items = [
  { time: "10:30 AM", desc: "Invoice #104 created", who: "by you" },
  { time: "09:15 AM", desc: 'Customer "ABC Pvt Ltd" added', who: "by you" },
  { time: "Yesterday", desc: "Bank account HDFC 1234 linked", who: "by you" },
  { time: "Yesterday", desc: "GST settings updated", who: "by you" },
  { time: "2 days ago", desc: "Company profile created", who: "by you" },
];

export default function RecentActivity() {
  return (
    <Card className="flex flex-col h-full">
      <h2 className="text-sm font-semibold text-fg">Recent Activity</h2>

      <ul className="mt-4 space-y-4">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <span className="h-2 w-2 rounded-full bg-bronze" />
              {i < items.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-line" />
              )}
            </div>
            <div className="min-w-0 pb-1">
              <p className="text-xs text-muted">{it.time}</p>
              <p className="text-sm text-fg">{it.desc}</p>
              <p className="text-xs text-muted">{it.who}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        <button
          type="button"
          className="text-xs font-medium text-bronze hover:underline"
        >
          View All Activity
        </button>
      </div>
    </Card>
  );
}
