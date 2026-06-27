# Dashboard Home Redesign — Implementation Plan (Phase 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. ALSO load **frontend-design** when building the visual sections — this is pixel-faithful work against a mockup. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Rebuild the dashboard home page (`/dashboard`) to match redesign mockup #1, composed from the Phase-1 `components/ui/` primitives and the bronze/ink/cream tokens, fully working in light + dark mode.

**Architecture:** A set of focused section components under `src/components/dashboard/` (each one card/region from the mockup), assembled by a rewritten `src/app/dashboard/page.tsx`. Charts use `recharts` with a theme-aware `useChartColors()` hook (recharts needs color values, not Tailwind classes). Old placeholder widgets that mockup #1 doesn't use are deleted.

**Tech Stack:** Next.js 16, React 19, Tailwind v4 (semantic tokens), `recharts`, `lucide-react`.

**The mockup is the spec.** View `reference/redesign/PHOTO-2026-06-20-12-58-01.jpg` (relative to repo root, i.e. `../reference/redesign/...` from `bookkeeper-future/`, or absolute `/Users/shouryathakur/Development/js/Bookkeeper/reference/redesign/PHOTO-2026-06-20-12-58-01.jpg`) before building. Match its layout, spacing, and content.

> **No test runner.** Verify each task with `npm run build` + `npm run lint` (must stay green — zero new errors) and visual inspection. Use ONLY semantic token utilities (`bg-surface`, `text-fg`, `text-muted`, `border-line`, `text-bronze`, `bg-bronze-soft`, status tokens) — never raw hex in JSX className or `slate-*`. Raw hex is allowed ONLY inside `useChartColors` (recharts values).

---

## Mockup #1 layout (top → bottom)

1. **Greeting** (left): `Good Afternoon, Ojaswini 👋` + `Here's what's happening in Test Company today.`
2. **Top-right cards** (same row as greeting): **Business Health** card (score 82/100 "Good", `↑ 8 pts vs last month`, four labeled progress bars — Cash Flow 80%, Collections 90%, Taxes 70%, Profitability 75%, "View Full Report" button) and **AI Copilot** card (greeting + suggested prompts: Generate MIS Report, Forecast Cash Flow, Explain GST Reconciliation, Find Overdue Invoices, Create Invoice; "Ask anything…" input).
3. **KPI row** — 4 `StatCard`s: Cash Available ₹0 (Stable), Receivables ₹0 (No Overdue), Payables ₹0 (Under Control), Tasks Need Attention 0 (All Good).
4. **Quick actions** — 5 icon buttons: Create Invoice, Add Customer, Record Expense, Reconcile Bank, Ask AI.
5. **Charts row** (3 cols): Cash Flow (Last 6 Months) line chart (Inflow/Outflow/Net) · Revenue vs Expenses bar chart · Outstanding Invoices donut (₹0 Total, aging legend Not Overdue / 1–30 / 31–60 / 60+).
6. **Lower row** (4 cols): Setup Workbench (3 of 8 steps, 38%, step chips with status) · Today's Focus (checklist, 2 of 4, 50%) · Recent Activity (timeline) · Insights (`InsightsList`).
7. **Bottom strip**: mini stats — Cash Position ₹0.00, Bank Balance ₹0.00, GST Payable ₹0.00, TDS Payable ₹0.00, Last Updated.

The global Topbar (already built) sits above all this from the layout. The page itself starts at the greeting.

---

## File structure

**Create:**
- `src/lib/useChartColors.ts` — theme-aware recharts palette hook.
- `src/components/dashboard/Greeting.tsx`
- `src/components/dashboard/BusinessHealthCard.tsx` (score + breakdown bars)
- `src/components/dashboard/KpiRow.tsx`
- `src/components/dashboard/QuickActionsRow.tsx`
- `src/components/dashboard/CashFlowChart.tsx`
- `src/components/dashboard/RevenueExpensesChart.tsx`
- `src/components/dashboard/OutstandingDonut.tsx`
- `src/components/dashboard/SetupWorkbench.tsx`
- `src/components/dashboard/TodaysFocusCard.tsx`
- `src/components/dashboard/RecentActivity.tsx`
- `src/components/dashboard/InsightsPanel.tsx`
- `src/components/dashboard/BottomStats.tsx`

**Modify:**
- `src/app/dashboard/page.tsx` — rewrite to compose the above.

**Delete (placeholder widgets mockup #1 doesn't use; confirm no other importer with `grep -rl <Name> src` before deleting):**
- `Charts.tsx`, `RevenueExpenseChart.tsx` (old), `OutstandingInvoices.tsx` (old), `MISStatsGrid.tsx`, `MISFilterBar.tsx`, `QuickActions.tsx` (old), `AICopilot.tsx` (old), `BusinessHealth.tsx` (old), `SetupCard.tsx`, `TodaysFocus.tsx` (old), `Activity.tsx`, `MISInsights.tsx`, `StatsCard.tsx`, `HealthScore.tsx`, `TaxSummary.tsx`, `PendingActions.tsx`, `ReceivableAgeing.tsx`, `PayableAgeing.tsx`, `BankingSummary.tsx`, `RevenueChannels.tsx`, `ExpenseAnalysis.tsx`, `TopCustomers.tsx`, `TopVendors.tsx`.
  - Keep `Sidebar.tsx`, `Topbar.tsx` (shell). These old widgets are only imported by the current `page.tsx`, which this plan rewrites — so after the rewrite they are dead. (Some, like TopCustomers, will be reintroduced properly in later page phases; the old versions are not worth keeping.)

---

## Task 1: Theme-aware chart colors hook

**Files:** Create `src/lib/useChartColors.ts`

- [ ] **Step 1: Create the hook**

```ts
"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

export type ChartColors = ReturnType<typeof useChartColors>;

export function useChartColors() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    bronze: dark ? "#C8A06A" : "#B08D57",
    sand: dark ? "#8A7C5F" : "#DCC9A6",
    slate: dark ? "#94A3B8" : "#64748B",
    success: dark ? "#4ADE80" : "#16A34A",
    warning: dark ? "#FBBF24" : "#D97706",
    danger: dark ? "#F87171" : "#DC2626",
    info: dark ? "#60A5FA" : "#2563EB",
    grid: dark ? "#2E3540" : "#E4DED1",
    axis: dark ? "#9C9284" : "#6B6B6B",
    tooltipBg: dark ? "#161C26" : "#FFFFFF",
    tooltipBorder: dark ? "#2E3540" : "#E4DED1",
    tooltipText: dark ? "#F8F3EA" : "#101418",
  };
}
```

- [ ] **Step 2: Build + commit**

Run: `npm run build` → PASS

```bash
git add src/lib/useChartColors.ts
git commit -m "feat(dashboard): add theme-aware chart colors hook"
```

> Note for all chart components: each is a `"use client"` component, wraps the chart in recharts `ResponsiveContainer` (`width="100%"`, fixed pixel height on the parent card), calls `const c = useChartColors()`, and uses `c.*` for `stroke`/`fill`/axis `tick={{ fill: c.axis }}`/`CartesianGrid stroke={c.grid}`/`Tooltip contentStyle={{ background: c.tooltipBg, border: \`1px solid ${c.tooltipBorder}\`, borderRadius: 12, color: c.tooltipText }}`. Card chrome (border, bg, title) uses tokens.

---

## Task 2: KPI row + Quick actions

**Files:** Create `KpiRow.tsx`, `QuickActionsRow.tsx`

- [ ] **Step 1: `KpiRow.tsx`** — a `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5` of the `StatCard` primitive (`@/components/ui/StatCard`). Data (match mockup):

```ts
import { Wallet, ArrowDownToLine, ArrowUpFromLine, AlertCircle } from "lucide-react";
const kpis = [
  { icon: Wallet, label: "Cash Available", value: "₹0", sublabel: "Stable" },
  { icon: ArrowDownToLine, label: "Receivables", value: "₹0", sublabel: "No Overdue" },
  { icon: ArrowUpFromLine, label: "Payables", value: "₹0", sublabel: "Under Control" },
  { icon: AlertCircle, label: "Tasks Need Attention", value: "0", sublabel: "All Good" },
];
```

Render each via `<StatCard icon={k.icon} label={k.label} value={k.value} sublabel={k.sublabel} />`. (No trend arrows — mockup KPIs show none.)

- [ ] **Step 2: `QuickActionsRow.tsx`** — a responsive row (`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3`) of action tiles. Each tile: `Card`-like (`bg-surface border border-line rounded-2xl p-4 flex items-center gap-3 hover:bg-bronze-soft/40 transition`), a `bg-bronze-soft` rounded icon chip with `text-bronze` icon, and a `text-sm font-medium text-fg` label. Items:

```ts
import { FilePlus, UserPlus, ReceiptText, Landmark, Sparkles } from "lucide-react";
const actions = [
  { icon: FilePlus, label: "Create Invoice" },
  { icon: UserPlus, label: "Add Customer" },
  { icon: ReceiptText, label: "Record Expense" },
  { icon: Landmark, label: "Reconcile Bank" },
  { icon: Sparkles, label: "Ask AI" },
];
```

Tiles are `<button type="button">` with `aria-label={label}`.

- [ ] **Step 3: Build + lint + commit**

```bash
npm run build && npm run lint
git add src/components/dashboard/KpiRow.tsx src/components/dashboard/QuickActionsRow.tsx
git commit -m "feat(dashboard): KPI row and quick actions"
```

---

## Task 3: Business Health card + AI Copilot rail

**Files:** Create `BusinessHealthCard.tsx`. (AI Copilot uses the existing `AIRailPanel` primitive directly in the page — no new file.)

- [ ] **Step 1: `BusinessHealthCard.tsx`** — a `Card`. Header row: title "Business Health" + small `MoreVertical` (decorative). Big score `82` with `/100` and a green `StatusPill tone="success"` "Good"; a `↑ 8 pts vs last month` line in `text-success text-xs`. Then four labeled horizontal progress bars. Each bar: label + right-aligned `%`, and a track `h-2 rounded-full bg-bronze-soft` with an inner fill `h-2 rounded-full` width = pct%, colored by token (`bg-success` ≥80, `bg-warning` ≥60 else `bg-danger`) via a literal-class lookup `{ success: "bg-success", warning: "bg-warning", danger: "bg-danger" }[tone]`. Footer: a full-width `Button variant="outline"` "View Full Report". Data:

```ts
const metrics = [
  { label: "Cash Flow", pct: 80 },
  { label: "Collections", pct: 90 },
  { label: "Taxes", pct: 70 },
  { label: "Profitability", pct: 75 },
];
```

(Reuse the foundation `HealthGauge` is optional here; the mockup shows a number + bars, not a ring, so a plain number is fine. Do NOT use raw hex for bar colors — use the literal-class lookup so Tailwind emits them.)

- [ ] **Step 2: Build + lint + commit**

```bash
npm run build && npm run lint
git add src/components/dashboard/BusinessHealthCard.tsx
git commit -m "feat(dashboard): business health card"
```

---

## Task 4: Charts (cash flow, revenue vs expenses, outstanding donut)

**Files:** Create `CashFlowChart.tsx`, `RevenueExpensesChart.tsx`, `OutstandingDonut.tsx`. All `"use client"`, all use `useChartColors`.

- [ ] **Step 1: `CashFlowChart.tsx`** — Card with title "Cash Flow" + subtitle "Last 6 Months". `ResponsiveContainer` (parent height ~`h-72`) → `LineChart` with three `Line`s: Inflow (`stroke={c.success}`), Outflow (`stroke={c.danger}`), Net (`stroke={c.bronze}`), each `strokeWidth={2}` `dot={false}`. `CartesianGrid strokeDasharray="3 3" stroke={c.grid}`, `XAxis dataKey="month" tick={{ fill: c.axis, fontSize: 12 }} axisLine={false} tickLine={false}`, `YAxis tick={{ fill: c.axis, fontSize: 12 }} axisLine={false} tickLine={false}`, `Tooltip contentStyle={...}` (see Task 1 note), `Legend`. Sample data:

```ts
const data = [
  { month: "Jan", inflow: 42000, outflow: 28000, net: 14000 },
  { month: "Feb", inflow: 38000, outflow: 31000, net: 7000 },
  { month: "Mar", inflow: 51000, outflow: 34000, net: 17000 },
  { month: "Apr", inflow: 47000, outflow: 39000, net: 8000 },
  { month: "May", inflow: 62000, outflow: 41000, net: 21000 },
  { month: "Jun", inflow: 58000, outflow: 37000, net: 21000 },
];
```

- [ ] **Step 2: `RevenueExpensesChart.tsx`** — Card, title "Revenue vs Expenses". `BarChart` with two `Bar`s: revenue `fill={c.bronze}`, expenses `fill={c.sand}`, both `radius={[6,6,0,0]}`. Same axes/grid/tooltip/legend styling as Step 1. Data:

```ts
const data = [
  { month: "Jan", revenue: 45000, expenses: 18000 },
  { month: "Feb", revenue: 52000, expenses: 22000 },
  { month: "Mar", revenue: 48000, expenses: 21000 },
  { month: "Apr", revenue: 65000, expenses: 28000 },
  { month: "May", revenue: 72000, expenses: 32000 },
  { month: "Jun", revenue: 80000, expenses: 35000 },
];
```

- [ ] **Step 3: `OutstandingDonut.tsx`** — Card, title "Outstanding Invoices". `PieChart` with a `Pie` (`innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value"`) over aging buckets, each `Cell` colored: Not Overdue `c.success`, 1–30 `c.warning`, 31–60 `c.bronze`, 60+ `c.danger`. Center label "₹0 / Total" (absolutely-positioned overlay, `text-fg`). To the right/below, a legend list of buckets with colored dots, amount, and `(0%)` — built with token text, dot color via inline `style={{ background: <c value> }}`. Data:

```ts
const data = [
  { name: "Not Overdue", value: 1 },
  { name: "1–30 Days", value: 1 },
  { name: "31–60 Days", value: 1 },
  { name: "60+ Days", value: 1 },
];
```

(Values are equal placeholders so the ring renders; center total shows ₹0 like the mockup.)

- [ ] **Step 4: Build + lint + commit**

```bash
npm run build && npm run lint
git add src/components/dashboard/CashFlowChart.tsx src/components/dashboard/RevenueExpensesChart.tsx src/components/dashboard/OutstandingDonut.tsx
git commit -m "feat(dashboard): cash flow, revenue/expenses, outstanding charts"
```

---

## Task 5: Setup Workbench, Today's Focus, Recent Activity, Insights

**Files:** Create `SetupWorkbench.tsx`, `TodaysFocusCard.tsx`, `RecentActivity.tsx`, `InsightsPanel.tsx`

- [ ] **Step 1: `SetupWorkbench.tsx`** — Card. Title "Setup Workbench" + "3 of 8 steps completed" + a progress bar (track `bg-bronze-soft`, fill `bg-bronze` width 38%) with "38%" label. Grid (`grid-cols-2 lg:grid-cols-3 gap-3`) of step chips; each chip: icon + name + a `StatusPill` (Completed→success, In Progress→info, Pending→neutral). Steps: Company Profile (Completed), GST & Tax Settings (Completed), Bank Connections (In Progress), Customers (Pending), Vendors (Pending), Employees (Pending), Document Templates (Pending), Reports Ready (Pending). Footer: `Button variant="bronze" size="sm"` "Continue Setup →" + a `text-bronze` "View All Steps" link.

- [ ] **Step 2: `TodaysFocusCard.tsx`** — Card, title "Today's Focus", "2 of 4 tasks completed" + 50% progress bar. A checklist of 4 rows, each a checkbox (use a `Check` icon in a `rounded` box — first two `bg-success text-on-bronze` checked, rest `border border-line`) + label + "by you"/sub note. Tasks: Complete Company Profile (done), Connect Bank Account (done), Add First Customer, Create First Invoice. Footer `text-bronze` "View All Tasks".

- [ ] **Step 3: `RecentActivity.tsx`** — Card, title "Recent Activity". A vertical list; each row: time (`text-xs text-muted`) + description (`text-sm text-fg`) + "by you". Items: `Invoice #104 created` (10:30 AM), `Customer "ABC Pvt Ltd" added` (09:15 AM), `Bank account HDFC 1234 linked` (Yesterday), `GST settings updated` (Yesterday), `Company profile created` (2 days ago). Footer `text-bronze` "View All Activity".

- [ ] **Step 4: `InsightsPanel.tsx`** — Card, title "Insights" + "View All" link. Use the `InsightsList` primitive (`@/components/ui/InsightsList`) with items:

```ts
import { CheckCircle2, RefreshCw, AlertTriangle, FileText } from "lucide-react";
const items = [
  { icon: CheckCircle2, tone: "success", title: "No overdue invoices", subtitle: "All customers are paying on time." },
  { icon: RefreshCw, tone: "info", title: "Bank not reconciled", subtitle: "0 transactions pending reconciliation." },
  { icon: AlertTriangle, tone: "warning", title: "Complete company setup", subtitle: "You're 38% done. Keep going!" },
  { icon: FileText, tone: "info", title: "Set up GST to unlock tax reports", subtitle: "Configure GST to generate returns." },
] as const;
```

- [ ] **Step 5: Build + lint + commit**

```bash
npm run build && npm run lint
git add src/components/dashboard/SetupWorkbench.tsx src/components/dashboard/TodaysFocusCard.tsx src/components/dashboard/RecentActivity.tsx src/components/dashboard/InsightsPanel.tsx
git commit -m "feat(dashboard): setup, focus, activity, insights cards"
```

---

## Task 6: Greeting + bottom stats strip

**Files:** Create `Greeting.tsx`, `BottomStats.tsx`

- [ ] **Step 1: `Greeting.tsx`** — `h1` `text-3xl font-bold text-fg` `Good Afternoon, Ojaswini 👋` (static greeting is fine — no time logic needed) + `p text-muted` `Here&apos;s what&apos;s happening in Test Company today.` (escape apostrophes).

- [ ] **Step 2: `BottomStats.tsx`** — a `Card` (or bordered strip) with a `grid grid-cols-2 md:grid-cols-5 gap-4`. Each cell: small icon chip + label (`text-xs text-muted`) + value (`text-sm font-semibold text-fg`) + sub note. Items: Cash Position ₹0.00 ("as of today"), Bank Balance ₹0.00 ("in 1 account"), GST Payable ₹0.00 ("No action required"), TDS Payable ₹0.00 ("No action required"), Last Updated ("2 mins ago", with a `text-bronze` Refresh).

- [ ] **Step 3: Build + lint + commit**

```bash
npm run build && npm run lint
git add src/components/dashboard/Greeting.tsx src/components/dashboard/BottomStats.tsx
git commit -m "feat(dashboard): greeting and bottom stats strip"
```

---

## Task 7: Compose page + delete dead widgets

**Files:** Modify `src/app/dashboard/page.tsx`; delete dead widgets (see File Structure list)

- [ ] **Step 1: Rewrite `src/app/dashboard/page.tsx`** to compose the sections per the mockup grid. Reference structure:

```tsx
import Greeting from "@/components/dashboard/Greeting";
import BusinessHealthCard from "@/components/dashboard/BusinessHealthCard";
import AIRailPanel from "@/components/ui/AIRailPanel";
import KpiRow from "@/components/dashboard/KpiRow";
import QuickActionsRow from "@/components/dashboard/QuickActionsRow";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import RevenueExpensesChart from "@/components/dashboard/RevenueExpensesChart";
import OutstandingDonut from "@/components/dashboard/OutstandingDonut";
import SetupWorkbench from "@/components/dashboard/SetupWorkbench";
import TodaysFocusCard from "@/components/dashboard/TodaysFocusCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import BottomStats from "@/components/dashboard/BottomStats";

const aiPrompts = [
  "Generate MIS Report",
  "Forecast Cash Flow",
  "Explain GST Reconciliation",
  "Find Overdue Invoices",
  "Create Invoice",
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 mt-2">
      {/* Greeting + top cards */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5 flex items-start">
          <Greeting />
        </div>
        <div className="xl:col-span-4">
          <BusinessHealthCard />
        </div>
        <div className="xl:col-span-3">
          <AIRailPanel prompts={aiPrompts} greeting="Hi Ojaswini! How can I help you today?" />
        </div>
      </div>

      <KpiRow />
      <QuickActionsRow />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CashFlowChart />
        <RevenueExpensesChart />
        <OutstandingDonut />
      </div>

      {/* Lower row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <SetupWorkbench />
        <TodaysFocusCard />
        <RecentActivity />
        <InsightsPanel />
      </div>

      <BottomStats />
    </div>
  );
}
```

Adjust column spans/breakpoints to best match the mockup while staying responsive. (The mockup puts Cash Flow at ~2 cols and Revenue/Outstanding narrower; if it looks better, make the charts row `xl:grid-cols-12` with spans 5/4/3. Use judgment against the mockup.)

- [ ] **Step 2: Delete dead placeholder widgets**

For each file in the delete list, first confirm it is not imported anywhere except the old page: `grep -rl "Charts\b" src` etc. Then:

```bash
git rm src/components/dashboard/Charts.tsx src/components/dashboard/RevenueExpenseChart.tsx src/components/dashboard/OutstandingInvoices.tsx src/components/dashboard/MISStatsGrid.tsx src/components/dashboard/MISFilterBar.tsx src/components/dashboard/QuickActions.tsx src/components/dashboard/AICopilot.tsx src/components/dashboard/BusinessHealth.tsx src/components/dashboard/SetupCard.tsx src/components/dashboard/TodaysFocus.tsx src/components/dashboard/Activity.tsx src/components/dashboard/MISInsights.tsx src/components/dashboard/StatsCard.tsx src/components/dashboard/HealthScore.tsx src/components/dashboard/TaxSummary.tsx src/components/dashboard/PendingActions.tsx src/components/dashboard/ReceivableAgeing.tsx src/components/dashboard/PayableAgeing.tsx src/components/dashboard/BankingSummary.tsx src/components/dashboard/RevenueChannels.tsx src/components/dashboard/ExpenseAnalysis.tsx src/components/dashboard/TopCustomers.tsx src/components/dashboard/TopVendors.tsx
```

If `grep` shows any of these are imported by a file OTHER than the rewritten `page.tsx` (e.g. a `business-command` page), do NOT delete that one — report it instead.

- [ ] **Step 3: Build + lint**

Run: `npm run build && npm run lint`
Expected: PASS, zero new lint errors, no "module not found" from deleted files.

- [ ] **Step 4: Visual check (dev server)**

Run `npm run dev`, open `/dashboard`. Confirm against the mockup: greeting + health + AI cards on top, KPI row, quick actions, three charts render with data, lower four cards, bottom strip. Toggle dark mode — confirm charts re-color (axes, lines, bars, donut), all cards readable, no raw white/contrast breaks.

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "feat(dashboard): compose redesigned dashboard home; remove placeholder widgets"
```

---

## Self-Review (author)

**Spec/mockup coverage:** greeting ✓ (T6); business health w/ bars ✓ (T3); AI copilot rail ✓ (page, AIRailPanel); KPI row ✓ (T2); quick actions ✓ (T2); cash flow / revenue-expense / outstanding charts ✓ (T4); setup workbench / today's focus / recent activity / insights ✓ (T5); bottom stats ✓ (T6); composition ✓ (T7); dark-mode charts via `useChartColors` ✓ (T1). 

**Placeholder scan:** chart components reference the `useChartColors` keys defined in Task 1; data arrays are concrete; no TBDs.

**Type/name consistency:** component filenames match the imports in Task 7's page (`RevenueExpensesChart`, `OutstandingDonut`, `TodaysFocusCard`, etc. — note these differ from the OLD deleted names `RevenueExpenseChart`/`OutstandingInvoices`/`TodaysFocus`). `AIRailPanel` prop names (`prompts`, `greeting`) match the Phase-1 primitive. `StatCard` props (`icon`,`label`,`value`,`sublabel`) match Phase 1. `InsightsList` item shape (`icon`,`tone`,`title`,`subtitle`) matches Phase 1.

**Token discipline:** raw hex confined to `useChartColors` (recharts values) and inline donut legend dot `style`; all card chrome uses semantic tokens; progress-bar/health colors use literal-class lookups so Tailwind emits them.
