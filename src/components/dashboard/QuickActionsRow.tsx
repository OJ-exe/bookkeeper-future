"use client";

import { useRouter } from "next/navigation";
import { FilePlus, UserPlus, ReceiptText, Landmark, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { requestCreate } from "@/lib/quickAction";

type Action = {
  icon: LucideIcon;
  label: string;
  href: string;
  create?: string;
};

const actions: Action[] = [
  { icon: FilePlus, label: "Create Invoice", href: "/dashboard/invoices", create: "invoices" },
  { icon: UserPlus, label: "Add Customer", href: "/dashboard/customers", create: "customers" },
  { icon: ReceiptText, label: "Record Expense", href: "/dashboard/bills", create: "bills" },
  { icon: Landmark, label: "Reconcile Bank", href: "/dashboard/banking" },
  { icon: Sparkles, label: "Ask AI", href: "/dashboard/ai" },
];

export default function QuickActionsRow() {
  const router = useRouter();

  function go(action: Action) {
    if (action.create) requestCreate(action.create);
    router.push(action.href);
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            type="button"
            aria-label={action.label}
            onClick={() => go(action)}
            className="bg-surface border border-line rounded-2xl p-4 flex items-center gap-3 hover:bg-bronze-soft/40 transition shadow-[var(--shadow-sm)]"
          >
            <span className="h-10 w-10 shrink-0 rounded-xl bg-bronze-soft flex items-center justify-center">
              <Icon size={18} className="text-bronze" />
            </span>
            <span className="text-sm font-medium text-fg">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
