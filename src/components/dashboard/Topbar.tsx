"use client";

import { Search, Bell, Plus, RefreshCw } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Button from "@/components/ui/Button";

export default function Topbar() {
  return (
    <header className="flex items-center gap-3 mb-2">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl bg-surface border border-line rounded-xl px-4 py-2.5 shadow-[var(--shadow-xs)]">
        <Search size={18} className="text-muted" />
        <input
          type="text"
          placeholder="Search customers, invoices, reports…"
          className="w-full outline-none bg-transparent text-sm text-fg placeholder:text-muted"
        />
        <kbd className="hidden sm:inline text-[11px] text-muted border border-line rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <ThemeToggle />
        <button className="h-10 w-10 rounded-xl bg-surface border border-line text-fg-soft shadow-[var(--shadow-xs)] flex items-center justify-center hover:bg-bronze-soft hover:text-bronze transition" aria-label="Refresh">
          <RefreshCw size={18} />
        </button>
        <button className="relative h-10 w-10 rounded-xl bg-surface border border-line text-fg-soft shadow-[var(--shadow-xs)] flex items-center justify-center hover:bg-bronze-soft hover:text-bronze transition" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" />
        </button>
        <Button variant="ink" size="sm" className="h-10">
          <Plus size={16} />
          <span className="hidden sm:inline">New</span>
        </Button>
        <div className="flex items-center gap-2 pl-1">
          <div className="h-9 w-9 rounded-full bg-bronze text-on-bronze flex items-center justify-center text-sm font-semibold">
            O
          </div>
          <div className="hidden lg:block leading-tight">
            <p className="text-sm font-medium text-fg">Ojaswini Sood</p>
            <p className="text-xs text-muted">Test Company</p>
          </div>
        </div>
      </div>
    </header>
  );
}
