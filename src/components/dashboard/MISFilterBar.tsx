export default function MISFilterBar() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <button className="px-4 py-2 rounded-xl bg-[#B08D57] text-white">
          Current Month
        </button>

        <button className="px-4 py-2 rounded-xl border border-slate-200">
          Last Month
        </button>

        <button className="px-4 py-2 rounded-xl border border-slate-200">
          Current Quarter
        </button>

        <button className="px-4 py-2 rounded-xl border border-slate-200">
          FYTD
        </button>

        <button className="px-4 py-2 rounded-xl border border-slate-200">
          Current FY
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <input
          type="date"
          className="border border-slate-200 rounded-xl px-4 py-2"
        />

        <input
          type="date"
          className="border border-slate-200 rounded-xl px-4 py-2"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button className="px-4 py-2 rounded-xl bg-[#B08D57] text-white">
          View MIS
        </button>

        <button className="px-4 py-2 rounded-xl border border-slate-200">
          Summary CSV
        </button>

        <button className="px-4 py-2 rounded-xl border border-slate-200">
          Details CSV
        </button>

        <button className="px-4 py-2 rounded-xl border border-slate-200">
          Explain With AI
        </button>
      </div>
    </div>
  );
}