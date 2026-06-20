import {
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function AICopilot() {
  return (
    <div
      className="
      bg-white
      border
      border-slate-200
      rounded-3xl
      p-6
      shadow-sm
      h-full
      "
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="
          h-10
          w-10
          rounded-xl
          bg-[#B08D57]/10
          flex
          items-center
          justify-center
          "
        >
          <Sparkles
            size={18}
            className="text-[#B08D57]"
          />
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">
            AI Copilot
          </h2>

          <p className="text-sm text-slate-500">
            Business insights powered by AI
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="font-medium text-slate-800">
            Revenue increased by 18%
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Compared to last month
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="font-medium text-slate-800">
            4 invoices need follow-up
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Total outstanding ₹1.2L
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="font-medium text-slate-800">
            GST estimate ₹42,000
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Due next filing cycle
          </p>
        </div>
      </div>

      <button
        className="
        mt-6
        w-full
        rounded-2xl
        bg-[#B08D57]
        text-white
        py-3
        font-medium
        flex
        items-center
        justify-center
        gap-2
        hover:opacity-90
        transition
        "
      >
        <TrendingUp size={18} />
        Generate Report
        <ArrowRight size={16} />
      </button>
    </div>
  );
}