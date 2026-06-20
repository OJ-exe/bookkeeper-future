"use client";

import {
  Search,
  Bell,
  Plus,
  RefreshCw,
  Sparkles,
  HelpCircle,
  Building2,
  ChevronDown,
} from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

function IconButton({
  label,
  badge,
  children,
}: {
  label: string;
  badge?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="relative h-10 w-10 rounded-xl bg-canvas border border-line text-fg-soft flex items-center justify-center hover:bg-bronze-soft hover:text-bronze transition"
    >
      {children}
      {badge && (
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-surface" />
      )}
    </button>
  );
}

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/80 backdrop-blur-md supports-[backdrop-filter]:bg-surface/70">
      <div className="px-4 lg:px-8 py-3 flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl bg-canvas border border-line rounded-xl px-4 py-2.5 focus-within:border-bronze transition">
          <Search size={18} className="text-muted shrink-0" />
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
          {/* Quick create */}
          <button
            type="button"
            className="h-10 px-4 rounded-xl bg-fg text-canvas text-sm font-medium inline-flex items-center gap-2 shadow-[var(--shadow-xs)] hover:opacity-90 transition"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New</span>
            <ChevronDown size={14} className="hidden sm:inline opacity-70" />
          </button>

          {/* Function cluster */}
          <div className="hidden sm:flex items-center gap-2">
            <IconButton label="AI Copilot">
              <Sparkles size={18} />
            </IconButton>
            <IconButton label="Sync data">
              <RefreshCw size={18} />
            </IconButton>
            <IconButton label="Notifications" badge>
              <Bell size={18} />
            </IconButton>
            <IconButton label="Help & support">
              <HelpCircle size={18} />
            </IconButton>
            <ThemeToggle />
          </div>

          {/* Divider */}
          <div className="hidden md:block h-8 w-px bg-line mx-1" />

          {/* Company switcher */}
          <button
            type="button"
            className="hidden md:flex items-center gap-2 h-10 px-3 rounded-xl border border-line bg-canvas text-fg-soft hover:bg-bronze-soft hover:text-bronze transition"
          >
            <Building2 size={16} />
            <span className="text-sm font-medium max-w-[120px] truncate">Test Company</span>
            <ChevronDown size={14} className="opacity-70" />
          </button>

          {/* User menu */}
          <button
            type="button"
            className="flex items-center gap-2 h-10 pl-1 pr-2 rounded-xl hover:bg-bronze-soft transition"
          >
            <span className="h-9 w-9 rounded-full bg-bronze text-on-bronze flex items-center justify-center text-sm font-semibold">
              O
            </span>
            <span className="hidden lg:block text-left leading-tight">
              <span className="block text-sm font-medium text-fg">Ojaswini Sood</span>
              <span className="block text-xs text-muted">Owner</span>
            </span>
            <ChevronDown size={14} className="hidden lg:block text-muted" />
          </button>
        </div>
      </div>
    </header>
  );
}
