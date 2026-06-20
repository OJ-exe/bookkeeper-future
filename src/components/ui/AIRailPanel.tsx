import { Sparkles, ArrowUp } from "lucide-react";

export default function AIRailPanel({
  title = "AI Copilot",
  greeting = "How can I help you today?",
  prompts,
}: {
  title?: string;
  greeting?: string;
  prompts: string[];
}) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-bronze" />
        <h3 className="font-semibold text-fg">{title}</h3>
      </div>
      <p className="text-sm text-muted mt-3">{greeting}</p>
      <div className="mt-4 space-y-2">
        {prompts.map((p) => (
          <button
            key={p}
            className="w-full text-left text-sm rounded-xl border border-line px-3 py-2 text-fg-soft hover:bg-bronze-soft hover:text-bronze transition"
          >
            {p}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-line px-3 py-2">
        <input
          className="w-full bg-transparent text-sm outline-none text-fg placeholder:text-muted"
          placeholder="Ask anything…"
        />
        <button className="text-bronze" aria-label="Send">
          <ArrowUp size={16} />
        </button>
      </div>
      <p className="text-[11px] text-muted mt-2">AI responses may not be 100% accurate.</p>
    </div>
  );
}
