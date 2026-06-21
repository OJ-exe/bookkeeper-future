"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ClipboardList,
  PackageOpen,
  PackageCheck,
  Clock,
  Percent,
  Eye,
  FileText,
  Pencil,
  Ban,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import StatusPill from "@/components/ui/StatusPill";
import Card from "@/components/ui/Card";
import { Menu, MenuItem, MenuLabel, MenuDivider } from "@/components/ui/Menu";

import CreateOrderModal from "@/components/dashboard/orders/CreateOrderModal";

import { orders, orderTabs, type Order, type OrderStatus } from "@/data/orders";

const statusTone: Record<OrderStatus, "success" | "warning" | "danger" | "info" | "neutral"> = {
  Open: "info",
  "Partially Fulfilled": "warning",
  Fulfilled: "success",
  Cancelled: "danger",
  Draft: "neutral",
};

function tabPredicate(tab: string, order: Order): boolean {
  switch (tab) {
    case "Sales Orders":
      return order.kind === "Sales Order";
    case "Purchase Orders":
      return order.kind === "Purchase Order";
    case "Open":
      return order.status === "Open";
    case "Fulfilled":
      return order.status === "Fulfilled";
    case "Cancelled":
      return order.status === "Cancelled";
    case "Drafts":
      return order.status === "Draft";
    default:
      return true; // "All"
  }
}

export default function OrdersScreen() {
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);

  const q = query.trim().toLowerCase();
  const filtered = orders.filter((order) => {
    const matchesQuery =
      !q ||
      order.number.toLowerCase().includes(q) ||
      order.party.toLowerCase().includes(q) ||
      order.kind.toLowerCase().includes(q) ||
      order.status.toLowerCase().includes(q);
    return matchesQuery && tabPredicate(tab, order);
  });

  const allSelected = filtered.length > 0 && filtered.every((order) => selected.has(order.number));

  function toggleOne(number: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(number)) next.delete(number);
      else next.add(number);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        filtered.forEach((order) => next.delete(order.number));
      } else {
        filtered.forEach((order) => next.add(order.number));
      }
      return next;
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Orders"
        description="Track sales and purchase orders, fulfillment status, and order-to-invoice conversion."
        showStar={false}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download size={16} /> Download Template
            </Button>
            <Button variant="outline" size="sm">
              <Upload size={16} /> Upload CSV
            </Button>
            <Button variant="bronze" size="sm" onClick={() => setCreateOpen(true)}>
              <Plus size={16} /> Create Order
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          icon={ClipboardList}
          label="Total Orders"
          value="64"
          tone="bronze"
        />
        <StatCard
          icon={PackageOpen}
          label="Open Orders"
          value="₹850K"
          sublabel="23 orders"
          tone="info"
        />
        <StatCard
          icon={PackageCheck}
          label="Fulfilled"
          value="₹4.2M"
          sublabel="This FY"
          tone="success"
          trend={{ dir: "up", text: "12% vs last month" }}
        />
        <StatCard
          icon={Clock}
          label="Pending Value"
          value="₹1.1M"
          sublabel="18 orders"
          sublabelTone="muted"
          tone="warning"
        />
        <StatCard
          icon={Percent}
          label="Conversion Rate"
          value="76%"
          sublabel="Orders → invoices"
          tone="success"
        />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-line">
        {orderTabs.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "border-bronze text-bronze"
                  : "border-transparent text-muted hover:text-fg-soft"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Order workspace */}
      <Card padded={false} className="p-5">
        {/* Controls */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="flex min-w-[16rem] flex-1 items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 lg:max-w-md">
              <Search size={16} className="shrink-0 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search order, party, type, status…"
                className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-fg-soft hover:bg-bronze-soft/50 transition"
            >
              <Filter size={14} /> Filters
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">{selected.size} selected</span>
            <Menu
              align="right"
              widthClass="w-48"
              trigger={
                <button
                  type="button"
                  aria-label="More actions"
                  className="inline-flex items-center justify-center rounded-lg border border-line px-2 py-1.5 text-muted hover:bg-bronze-soft/50 transition"
                >
                  <MoreVertical size={16} />
                </button>
              }
            >
              <MenuLabel>Export</MenuLabel>
              <MenuItem icon={Download}>Export as CSV</MenuItem>
              <MenuItem icon={Download}>Export as Excel</MenuItem>
              <MenuDivider />
              <MenuItem icon={FileText}>Convert Selected</MenuItem>
            </Menu>
          </div>
        </div>

        <div className="my-5 h-px bg-line" />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
                <th className="py-2.5 pr-3 font-medium">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all orders"
                    className="h-4 w-4 cursor-pointer accent-bronze align-middle"
                  />
                </th>
                <th className="py-2.5 pr-3 font-medium">Order Number</th>
                <th className="py-2.5 pr-3 font-medium">Order Date</th>
                <th className="py-2.5 pr-3 font-medium">Expected</th>
                <th className="py-2.5 pr-3 font-medium">Party</th>
                <th className="py-2.5 pr-3 font-medium">Type</th>
                <th className="py-2.5 pr-3 font-medium">Status</th>
                <th className="py-2.5 pr-3 font-medium text-right">Total</th>
                <th className="py-2.5 pr-3 font-medium text-right">Fulfilled</th>
                <th className="py-2.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-muted">
                    No orders to show here yet.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const isSelected = selected.has(order.number);
                  return (
                    <tr
                      key={order.number}
                      className={`border-b border-line/60 transition ${
                        isSelected ? "bg-bronze-soft/30" : "hover:bg-bronze-soft/30"
                      }`}
                    >
                      <td className="py-3 pr-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(order.number)}
                          aria-label={`Select ${order.number}`}
                          className="h-4 w-4 cursor-pointer accent-bronze align-middle"
                        />
                      </td>
                      <td className="py-3 pr-3 font-medium text-fg">{order.number}</td>
                      <td className="py-3 pr-3 text-fg-soft">{order.date}</td>
                      <td className="py-3 pr-3 text-fg-soft">{order.expectedDate}</td>
                      <td className="py-3 pr-3 text-fg-soft">{order.party}</td>
                      <td className="py-3 pr-3 text-fg-soft">{order.kind}</td>
                      <td className="py-3 pr-3">
                        <StatusPill tone={statusTone[order.status]}>{order.status}</StatusPill>
                      </td>
                      <td className="py-3 pr-3 text-right font-medium text-fg">{order.total}</td>
                      <td className="py-3 pr-3 text-right text-fg-soft">{order.fulfilled}</td>
                      <td className="py-3 text-right">
                        <Menu
                          align="right"
                          widthClass="w-48"
                          trigger={
                            <button
                              type="button"
                              aria-label={`Actions for ${order.number}`}
                              className="text-muted hover:text-bronze transition"
                            >
                              <MoreVertical size={16} />
                            </button>
                          }
                        >
                          <MenuItem icon={Eye}>View</MenuItem>
                          <MenuItem icon={FileText}>Convert to Invoice</MenuItem>
                          <MenuItem icon={Pencil}>Edit</MenuItem>
                          <MenuItem icon={Ban} danger>
                            Cancel
                          </MenuItem>
                        </Menu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
          <span className="text-muted">
            Showing 1 to {filtered.length} of {filtered.length} orders
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted hover:bg-bronze-soft/50"
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-bronze-soft font-medium text-bronze">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-fg-soft hover:bg-bronze-soft/50">
                2
              </button>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted hover:bg-bronze-soft/50"
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
            <span className="text-muted">10 / page</span>
          </div>
        </div>
      </Card>

      <CreateOrderModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
