export default function TodaysFocus() {
  const tasks = [
    "Complete Company Profile",
    "Connect Bank Account",
    "Add First Customer",
    "Create First Invoice",
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">
        Today&apos;s Focus
      </h2>

      <div className="space-y-4">
        {tasks.map((task) => (
          <label
            key={task}
            className="flex items-center gap-3"
          >
            <input type="checkbox" />
            <span>{task}</span>
          </label>
        ))}
      </div>
    </div>
  );
}