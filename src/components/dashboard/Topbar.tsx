"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Plus,
  RefreshCw,
  Sparkles,
  HelpCircle,
  Building2,
  ChevronDown,
  FileText,
  UserPlus,
  Receipt,
  CreditCard,
  Users,
  User,
  Settings,
  CircleDollarSign,
  LogOut,
  Check,
  CircleHelp,
  BookOpen,
} from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { Menu, MenuItem, MenuLabel, MenuDivider } from "@/components/ui/Menu";

function IconButton({
  label,
  badge,
  onClick,
  children,
}: {
  label: string;
  badge?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
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
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);

  function handleSync() {
    setSyncing(true);
    window.setTimeout(() => setSyncing(false), 900);
  }

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
          <Menu
            align="right"
            trigger={
              <button
                type="button"
                className="h-10 px-4 rounded-xl bg-fg text-canvas text-sm font-medium inline-flex items-center gap-2 shadow-[var(--shadow-xs)] hover:opacity-90 transition"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">New</span>
                <ChevronDown size={14} className="hidden sm:inline opacity-70" />
              </button>
            }
          >
            <MenuLabel>Create</MenuLabel>
            <MenuItem icon={FileText} href="/dashboard/invoices">New Invoice</MenuItem>
            <MenuItem icon={UserPlus} href="/dashboard/customers">New Customer</MenuItem>
            <MenuItem icon={Users} href="/dashboard/vendors">New Vendor</MenuItem>
            <MenuItem icon={Receipt} href="/dashboard/bills">New Bill</MenuItem>
            <MenuItem icon={CreditCard} href="/dashboard/payments">New Payment</MenuItem>
          </Menu>

          {/* Function cluster */}
          <div className="hidden sm:flex items-center gap-2">
            <IconButton label="AI Copilot" onClick={() => router.push("/dashboard/ai")}>
              <Sparkles size={18} />
            </IconButton>
            <IconButton label="Sync data" onClick={handleSync}>
              <RefreshCw size={18} className={syncing ? "animate-spin" : ""} />
            </IconButton>

            {/* Notifications */}
            <Menu
              align="right"
              widthClass="w-80"
              trigger={
                <button
                  type="button"
                  aria-label="Notifications"
                  title="Notifications"
                  className="relative h-10 w-10 rounded-xl bg-canvas border border-line text-fg-soft flex items-center justify-center hover:bg-bronze-soft hover:text-bronze transition"
                >
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-surface" />
                </button>
              }
            >
              <MenuLabel>Notifications</MenuLabel>
              <div className="px-3 py-2 text-sm text-fg-soft">
                <p className="font-medium text-fg">Invoice #104 created</p>
                <p className="text-xs text-muted">10:30 AM · by you</p>
              </div>
              <div className="px-3 py-2 text-sm text-fg-soft">
                <p className="font-medium text-fg">Bank not reconciled</p>
                <p className="text-xs text-muted">0 transactions pending</p>
              </div>
              <MenuDivider />
              <MenuItem href="/dashboard">View all activity</MenuItem>
            </Menu>

            {/* Help */}
            <Menu
              align="right"
              trigger={
                <button
                  type="button"
                  aria-label="Help & support"
                  title="Help & support"
                  className="h-10 w-10 rounded-xl bg-canvas border border-line text-fg-soft flex items-center justify-center hover:bg-bronze-soft hover:text-bronze transition"
                >
                  <HelpCircle size={18} />
                </button>
              }
            >
              <MenuItem icon={BookOpen} href="/dashboard">Documentation</MenuItem>
              <MenuItem icon={CircleHelp} href="/dashboard">Contact support</MenuItem>
              <MenuItem icon={Sparkles} href="/dashboard/ai">Ask AI Copilot</MenuItem>
            </Menu>

            <ThemeToggle />
          </div>

          {/* Divider */}
          <div className="hidden md:block h-8 w-px bg-line mx-1" />

          {/* Company switcher */}
          <Menu
            align="right"
            trigger={
              <button
                type="button"
                className="hidden md:flex items-center gap-2 h-10 px-3 rounded-xl border border-line bg-canvas text-fg-soft hover:bg-bronze-soft hover:text-bronze transition"
              >
                <Building2 size={16} />
                <span className="text-sm font-medium max-w-[120px] truncate">Test Company</span>
                <ChevronDown size={14} className="opacity-70" />
              </button>
            }
          >
            <MenuLabel>Companies</MenuLabel>
            <MenuItem icon={Check}>Test Company</MenuItem>
            <MenuDivider />
            <MenuItem icon={Plus}>Add company</MenuItem>
          </Menu>

          {/* User menu */}
          <Menu
            align="right"
            trigger={
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
            }
          >
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-fg">Ojaswini Sood</p>
              <p className="text-xs text-muted">ojaswini@testcompany.com</p>
            </div>
            <MenuDivider />
            <MenuItem icon={User} href="/dashboard/settings">Profile</MenuItem>
            <MenuItem icon={Settings} href="/dashboard/settings">Settings</MenuItem>
            <MenuItem icon={CircleDollarSign} href="/dashboard/settings">Billing</MenuItem>
            <MenuDivider />
            <MenuItem icon={LogOut} href="/login" danger>Log out</MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
}
