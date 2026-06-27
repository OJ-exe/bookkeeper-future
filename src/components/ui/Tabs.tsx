"use client";

import { useState } from "react";

export default function Tabs({
  tabs,
  onChange,
}: {
  tabs: string[];
  onChange?: (tab: string) => void;
}) {
  const [active, setActive] = useState(tabs[0]);
  return (
    <div className="flex gap-6 border-b border-line overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            onClick={() => {
              setActive(tab);
              onChange?.(tab);
            }}
            className={`whitespace-nowrap pb-3 text-sm font-medium border-b-2 -mb-px transition ${
              isActive
                ? "border-bronze text-bronze"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
