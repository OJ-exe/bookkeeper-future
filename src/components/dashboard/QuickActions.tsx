"use client";

import { useState } from "react";

import {
  FileText,
  Users,
  Wallet,
  Sparkles,
} from "lucide-react";

const actions = [
  {
    title: "Create Invoice",
    icon: FileText,
    modal: "invoice",
  },
  {
    title: "Add Customer",
    icon: Users,
    modal: "customer",
  },
  {
    title: "Record Expense",
    icon: Wallet,
    modal: "expense",
  },
  {
    title: "Ask AI",
    icon: Sparkles,
    modal: "ai",
  },
];

export default function QuickActions() {
  const [modal, setModal] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => setModal(action.modal)}
              className="
                bg-white
                border
                border-slate-200
                rounded-3xl
                p-5
                shadow-sm
                hover:shadow-md
                hover:border-[#B08D57]
                transition-all
                flex
                items-center
                gap-4
              "
            >
              <div
                className="
                  h-12
                  w-12
                  rounded-2xl
                  bg-[#B08D57]/10
                  flex
                  items-center
                  justify-center
                "
              >
                <Icon
                  size={20}
                  className="text-[#B08D57]"
                />
              </div>

              <span className="font-medium text-slate-800">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
          <div className="bg-white p-10 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              Modal Opened: {modal}
            </h2>

            <button
              onClick={() => setModal(null)}
              className="px-4 py-2 bg-[#B08D57] text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}