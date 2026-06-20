export default function HealthScore() {
  return (
    <div
      className="
      rounded-3xl
      border
     bg-slate-50
   border-slate-200
      p-6
      "
    >
      <p className="text-slate-500">
        Business Health
      </p>

      <div className="mt-6 flex items-center gap-6">
        <div
          className="
          h-28
          w-28
          rounded-full
          border-[8px]
          border-[#B08D57]
          flex
          items-center
          justify-center
          "
        >
          <div>
            <h2 className="text-3xl font-bold">
              82
            </h2>

            <p className="text-xs text-slate-500">
              /100
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-[#B08D57] text-xl font-semibold">
            Excellent
          </h3>

          <p className="text-slate-500 mt-2">
            Financial health is stable.
          </p>
        </div>
      </div>
    </div>
  );
}