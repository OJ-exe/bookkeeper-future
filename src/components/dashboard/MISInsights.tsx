import { Sparkles } from "lucide-react";

export default function MISInsights() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="text-[#B08D57]" />

        <h2 className="text-xl font-semibold">
          MIS Insights
        </h2>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="font-medium">
          No activity detected
        </p>

        <p className="text-sm text-slate-500 mt-2">
          Revenue and expense movement
          will appear here.
        </p>
      </div>
    </div>
  );
}