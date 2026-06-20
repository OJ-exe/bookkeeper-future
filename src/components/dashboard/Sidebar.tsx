"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
} from "lucide-react";

import HealthGauge from "@/components/ui/HealthGauge";

const menu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Business Command",
    href: "/dashboard/business-command",
    icon: Building2,
  },
  {
    heading: "FINANCE",
    items: [
      {
        name: "Accounts",
        href: "/dashboard/accounts",
        icon: Wallet,
      },
      {
        name: "Banking",
        href: "/dashboard/banking",
        icon: Landmark,
      },
    ],
  },
  {
    heading: "CRM",
    items: [
      {
        name: "Customers",
        href: "/dashboard/customers",
        icon: Users,
      },
      {
        name: "Vendors",
        href: "/dashboard/vendors",
        icon: UserRound,
      },
    ],
  },
  {
    heading: "BILLING",
    items: [
      {
        name: "Invoices",
        href: "/dashboard/invoices",
        icon: FileText,
      },
      {
        name: "Bills",
        href: "/dashboard/bills",
        icon: Receipt,
      },
      {
        name: "Orders",
        href: "/dashboard/orders",
        icon: ClipboardList,
      },
      {
        name: "Payments",
        href: "/dashboard/payments",
        icon: CreditCard,
      },
    ],
  },
  {
    heading: "HR",
    items: [
      {
        name: "Employees",
        href: "/dashboard/employees",
        icon: UserCog,
      },
      {
        name: "Payroll",
        href: "/dashboard/payroll",
        icon: BadgeDollarSign,
      },
    ],
  },
  {
    heading: "AI & INSIGHTS",
    items: [
      {
        name: "AI Copilot",
        href: "/dashboard/ai",
        icon: Sparkles,
      },
      {
        name: "Reports",
        href: "/dashboard/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    heading: "SETTINGS",
    items: [
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-72 bg-sidebar border-r border-line">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-line">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-bronze flex items-center justify-center text-on-bronze font-bold">
            BF
          </div>
          <div>
            <h1 className="font-bold text-fg leading-tight">Bookkeeper</h1>
            <p className="text-xs text-muted">from the Future</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {menu.map((section, index) => (
          <div key={index} className="mb-6">
            {"heading" in section ? (
              <>
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-2 px-3">
                  {section.heading}
                </p>
                <div className="space-y-1">
                  {section.items?.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                          active
                            ? "bg-bronze-soft text-bronze"
                            : "text-fg-soft hover:bg-bronze-soft/60"
                        }`}
                      >
                        <Icon size={18} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <Link
                href={section.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition ${
                  pathname === section.href
                    ? "bg-bronze-soft text-bronze"
                    : "text-fg-soft hover:bg-bronze-soft/60"
                }`}
              >
                <section.icon size={18} />
                <span className="text-sm font-medium">{section.name}</span>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Business Health Card */}
      <div className="p-4 border-t border-line">
        <div className="rounded-2xl border border-line p-5">
          <p className="text-sm font-semibold text-fg">Business Health Score</p>
          <div className="flex justify-center mt-4">
            <HealthGauge score={82} label="Good" size={96} />
          </div>
        </div>
      </div>
    </aside>
  );
}