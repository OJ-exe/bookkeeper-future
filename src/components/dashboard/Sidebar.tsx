"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import {
  LayoutDashboard,
  Building2,
  Wallet,
  Landmark,
  Users,
  UserRound,
  FileText,
  Receipt,
  ClipboardList,
  CreditCard,
  UserCog,
  BadgeDollarSign,
  Sparkles,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import HealthGauge from "@/components/ui/HealthGauge";
import { useSidebar } from "@/components/dashboard/SidebarProvider";

type Leaf = { name: string; href: string; icon: LucideIcon };
type Section = { heading: string; items: Leaf[] };
type Entry = Leaf | Section;

const menu: Entry[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Business Command", href: "/dashboard/business-command", icon: Building2 },
  {
    heading: "FINANCE",
    items: [
      { name: "Accounts", href: "/dashboard/accounts", icon: Wallet },
      { name: "Banking", href: "/dashboard/banking", icon: Landmark },
    ],
  },
  {
    heading: "CRM",
    items: [
      { name: "Customers", href: "/dashboard/customers", icon: Users },
      { name: "Vendors", href: "/dashboard/vendors", icon: UserRound },
    ],
  },
  {
    heading: "BILLING",
    items: [
      { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
      { name: "Bills", href: "/dashboard/bills", icon: Receipt },
      { name: "Orders", href: "/dashboard/orders", icon: ClipboardList },
      { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
    ],
  },
  {
    heading: "HR",
    items: [
      { name: "Employees", href: "/dashboard/employees", icon: UserCog },
      { name: "Payroll", href: "/dashboard/payroll", icon: BadgeDollarSign },
    ],
  },
  {
    heading: "AI & INSIGHTS",
    items: [
      { name: "AI Copilot", href: "/dashboard/ai", icon: Sparkles },
      { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    ],
  },
  {
    heading: "SETTINGS",
    items: [{ name: "Settings", href: "/dashboard/settings", icon: Settings }],
  },
];

function NavItem({
  item,
  active,
  collapsed,
}: {
  item: Leaf;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-label={item.name}
      title={collapsed ? item.name : undefined}
      className={`group/navitem relative flex items-center rounded-xl transition ${
        collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3 py-2.5"
      } ${
        active
          ? "bg-bronze-soft text-bronze"
          : "text-fg-soft hover:bg-bronze-soft/60"
      }`}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="text-sm font-medium">{item.name}</span>}

      {/* Hover tooltip when collapsed */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-md bg-fg px-2 py-1 text-xs font-medium text-canvas opacity-0 shadow-[var(--shadow-md)] transition-opacity duration-150 group-hover/navitem:opacity-100">
          {item.name}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={`hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen bg-sidebar border-r border-line transition-[width] duration-300 ease-out ${
        collapsed ? "w-16" : "w-72"
      }`}
    >
      {/* Logo + toggle */}
      <div
        className={`h-[73px] border-b border-line flex items-center ${
          collapsed ? "flex-col justify-center gap-2 py-3" : "justify-between px-5"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 rounded-lg bg-bronze flex items-center justify-center text-on-bronze font-bold">
            BF
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-fg leading-tight">Bookkeeper</h1>
              <p className="text-xs text-muted">from the Future</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="h-7 w-7 shrink-0 rounded-lg text-muted hover:bg-bronze-soft hover:text-bronze flex items-center justify-center transition"
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto overflow-x-hidden py-4 ${collapsed ? "px-2" : "px-4"}`}>
        {menu.map((entry, index) => (
          <div key={index} className={collapsed ? "mb-2" : "mb-6"}>
            {"heading" in entry ? (
              <>
                {collapsed ? (
                  <div className="my-2 h-px bg-line/70" />
                ) : (
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-2 px-3">
                    {entry.heading}
                  </p>
                )}
                <div className="space-y-1">
                  {entry.items.map((item) => (
                    <NavItem
                      key={item.name}
                      item={item}
                      active={pathname === item.href}
                      collapsed={collapsed}
                    />
                  ))}
                </div>
              </>
            ) : (
              <NavItem
                item={entry}
                active={pathname === entry.href}
                collapsed={collapsed}
              />
            )}
          </div>
        ))}
      </nav>

      {/* Business Health (expanded only) */}
      {!collapsed && (
        <div className="p-4 border-t border-line">
          <div className="rounded-2xl border border-line p-5">
            <p className="text-sm font-semibold text-fg">Business Health Score</p>
            <div className="flex justify-center mt-4">
              <HealthGauge score={82} label="Good" size={96} />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
