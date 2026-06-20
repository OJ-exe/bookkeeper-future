import { FilePlus, UserPlus, ReceiptText, Landmark, Sparkles } from "lucide-react";

const actions = [
  { icon: FilePlus, label: "Create Invoice" },
  { icon: UserPlus, label: "Add Customer" },
  { icon: ReceiptText, label: "Record Expense" },
  { icon: Landmark, label: "Reconcile Bank" },
  { icon: Sparkles, label: "Ask AI" },
];

export default function QuickActionsRow() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {actions.map(({ icon: Icon, label }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          className="bg-surface border border-line rounded-2xl p-4 flex items-center gap-3 hover:bg-bronze-soft/40 transition shadow-[var(--shadow-sm)]"
        >
          <span className="h-10 w-10 shrink-0 rounded-xl bg-bronze-soft flex items-center justify-center">
            <Icon size={18} className="text-bronze" />
          </span>
          <span className="text-sm font-medium text-fg">{label}</span>
        </button>
      ))}
    </div>
  );
}
