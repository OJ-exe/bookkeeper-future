"use client";

import { useState } from "react";
import {
  Search,
  CalendarClock,
  Download,
  FileText,
  FileCheck,
  Star,
  Eye,
  FileDown,
  MoreVertical,
  FileSpreadsheet,
  TrendingUp,
  Percent,
  ShoppingCart,
  Package,
  Boxes,
  BadgeDollarSign,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import { Menu, MenuItem } from "@/components/ui/Menu";

import { reportCategories, recentReports } from "@/data/reports";
import { useDashboardAnalytics } from "@/lib/useDashboardAnalytics";

const categoryIcon: Record<string, LucideIcon> = {
  financial: TrendingUp,
  tax: Percent,
  sales: ShoppingCart,
  purchase: Package,
  inventory: Boxes,
  payroll: BadgeDollarSign,
};

export default function ReportsScreen() {
  const [query, setQuery] = useState("");
  const { data } = useDashboardAnalytics();

  const q = query.trim().toLowerCase();
  const categories = reportCategories
    .map((cat) => ({
      ...cat,
      reports: cat.reports.filter(
        (r) => !q || r.name.toLowerCase().includes(q)
      ),
    }))
    .filter((cat) => cat.reports.length > 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        description="Generate financial, tax, sales, purchase, inventory, and payroll reports for review and download."
        actions={
          <>
            <Button variant="outline" size="sm">
              <CalendarClock size={16} /> Schedule Report
            </Button>
            <Button variant="bronze" size="sm">
              <Download size={16} /> Export All
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={FileText} label="Reports Available" value={String(data?.reports?.length ?? 26)} tone="bronze" />
        <StatCard
          icon={FileCheck}
          label="Generated This Month"
          value={String(data?.recentReports?.length ?? 142)}
          tone="info"
          trend={{ dir: "up", text: "Live from database" }}
        />
        <StatCard
          icon={CalendarClock}
          label="Scheduled"
          value={String(data?.summary?.length ?? 8)}
          sublabel="Auto-delivery"
          sublabelTone="muted"
          tone="success"
        />
        <StatCard
          icon={Star}
          label="Favorites"
          value={String(data?.reports?.length ? Math.min(5, data.reports.length) : 5)}
          sublabel="Pinned"
          sublabelTone="muted"
          tone="warning"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Main */}
        <div className="xl:col-span-9 space-y-8">
          {/* Search */}
          <div className="flex w-full items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 lg:max-w-md">
            <Search size={16} className="shrink-0 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reports…"
              className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
            />
          </div>

          {categories.length === 0 ? (
            <Card>
              <p className="py-6 text-center text-muted">
                No reports match your search.
              </p>
            </Card>
          ) : (
            categories.map((cat) => {
              const Icon = categoryIcon[cat.icon] ?? FileText;
              return (
                <section key={cat.key} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-bronze-soft text-bronze">
                      <Icon size={18} />
                    </span>
                    <h2 className="text-base font-semibold text-fg">{cat.label}</h2>
                    <span className="text-sm text-muted">({cat.reports.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cat.reports.map((r) => (
                      <Card key={r.name} className="flex flex-col">
                        <p className="font-medium text-fg">{r.name}</p>
                        <p className="mt-1 text-sm text-muted">{r.description}</p>
                        <div className="mt-4 flex items-center gap-3 pt-1">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-bronze hover:opacity-80 transition"
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-soft hover:text-bronze transition"
                          >
                            <FileDown size={14} /> Download
                          </button>
                          <div className="ml-auto">
                            <Menu
                              align="right"
                              widthClass="w-44"
                              trigger={
                                <button
                                  type="button"
                                  aria-label={`More options for ${r.name}`}
                                  className="text-muted hover:text-bronze transition"
                                >
                                  <MoreVertical size={16} />
                                </button>
                              }
                            >
                              <MenuItem icon={FileDown}>Export PDF</MenuItem>
                              <MenuItem icon={FileSpreadsheet}>Export Excel</MenuItem>
                              <MenuItem icon={CalendarClock}>Schedule</MenuItem>
                            </Menu>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>

        {/* Right rail */}
        <div className="xl:col-span-3">
          <Card>
            <h2 className="text-base font-semibold text-fg">Recently generated</h2>
            <ul className="mt-4 space-y-3">
              {(data?.recentReports?.length ? data.recentReports : recentReports).map((r) => (
                <li key={r.name} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bronze-soft text-bronze">
                    <FileCheck size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">{r.name}</p>
                    <p className="text-xs text-muted">{r.generated}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
