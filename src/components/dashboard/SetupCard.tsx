const steps = [
  "Company Profile",
  "Connect Bank",
  "Add Customer",
  "Create Invoice",
  "GST Setup",
];

export default function SetupCard() {
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
      <h2 className="text-xl font-semibold text-slate-900">
        Setup Progress
      </h2>

      <p className="text-slate-500 mt-1">
        3 of 5 completed
      </p>

      <div className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className="
              flex
              items-center
              justify-between
            "
          >
            <span className="text-slate-700">
              {step}
            </span>

            <span>
              {index < 3 ? "✅" : "⬜"}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="h-3 rounded-full bg-slate-100">
          <div
            className="
              h-full
              w-[60%]
              rounded-full
              bg-[#B08D57]
            "
          />
        </div>
      </div>
    </div>
  );
}