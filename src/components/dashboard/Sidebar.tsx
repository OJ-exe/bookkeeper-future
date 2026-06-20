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
  <aside
  className="
    hidden
    lg:block
    fixed
    left-0
    top-0
    h-screen
    w-72
    bg-white
    border-r
    border-slate-200
  "
>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          

          <div>
            <h1 className="font-bold text-slate-900">
              Bookkeeper
            </h1>

            <p className="text-xs text-slate-500">
              from the Future
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {menu.map((section, index) => (
          <div key={index} className="mb-6">
            {"heading" in section ? (
              <>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2 px-3">
                  {section.heading}
                </p>

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active =
                      pathname === item.href;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`
                          flex
                          items-center
                          gap-3
                          px-3
                          py-2.5
                          rounded-xl
                          transition
                          ${
                            active
                              ? "bg-[#B08D57]/10 text-[#B08D57]"
                              : "text-slate-700 hover:bg-slate-100"
                          }
                        `}
                      >
                        <Icon size={18} />

                        <span className="text-sm font-medium">
                          {item.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <Link
                href={section.href}
                className={`
                  flex
                  items-center
                  gap-3
                  px-3
                  py-3
                  rounded-xl
                  transition
                  ${
                    pathname === section.href
                      ? "bg-[#B08D57]/10 text-[#B08D57]"
                      : "text-slate-700 hover:bg-slate-100"
                  }
                `}
              >
                <section.icon size={18} />

                <span className="text-sm font-medium">
                  {section.name}
                </span>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Business Health Card */}
      <div className="p-4 border-t border-slate-200">
        <div className="rounded-3xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-900">
            Business Health Score
          </p>

          <div className="flex justify-center mt-5">
            <div className="h-24 w-24 rounded-full border-[8px] border-green-500 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  82
                </div>

                <div className="text-xs text-slate-500">
                  /100
                </div>
              </div>
            </div>
          </div>

          <button
            className="
              mt-5
              w-full
              rounded-xl
              border
              border-slate-200
              py-3
              text-sm
              font-medium
              hover:bg-slate-50
              transition
            "
          >
            View Details →
          </button>
        </div>
      </div>
    </aside>
  );
}