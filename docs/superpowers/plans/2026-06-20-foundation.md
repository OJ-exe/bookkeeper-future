# Dashboard Redesign — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. When building the visual components, also load the **frontend-design** skill for quality.

**Goal:** Build the theme-aware design-system foundation — semantic light/dark tokens, theming machinery, the app shell (sidebar + topbar replacing the old bottom tab bar), and the reusable `components/ui/` primitives — so every later page phase is fast and dual-theme by construction.

**Architecture:** Semantic CSS custom properties define a light value (`:root`) and a dark value (`[data-theme="dark"]`); Tailwind v4 `@theme inline` maps them to utilities so components reference roles (`bg-surface`, `text-fg`, `border-line`, `text-bronze`) and re-theme at runtime. A `ThemeProvider` + a no-flash inline script control the active theme. Presentational primitives are composed by later page phases.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (`@tailwindcss/postcss`), `lucide-react`, `recharts`, Inter via `next/font/google`.

> **Next.js 16 caveat:** APIs differ from older versions. Before writing the root layout / `next/font` / any routing code, skim `node_modules/next/dist/docs/` (per `AGENTS.md`).

> **No test runner:** This phase verifies with `npm run build`, `npm run lint`, and visual checks in light + dark. Do not add Jest/Vitest.

---

## File Structure

**Tokens & theming**
- Modify: `src/app/globals.css` — semantic token definitions + `@theme inline` mapping + base layer.
- Modify: `src/app/layout.tsx` — Inter font, `<html>` setup, no-flash script, `ThemeProvider`, metadata.
- Create: `src/components/theme/ThemeProvider.tsx` — context, `localStorage` sync, `useTheme` hook.
- Create: `src/components/theme/ThemeToggle.tsx` — sun/moon button.

**UI primitives** (`src/components/ui/`)
- Create: `Card.tsx`, `Button.tsx`, `StatusPill.tsx`, `StatCard.tsx`, `PageHeader.tsx`, `Tabs.tsx`, `DataTable.tsx`, `HealthGauge.tsx`, `AIRailPanel.tsx`, `InsightsList.tsx`, `OnboardingStrip.tsx`.

**App shell**
- Modify: `src/components/dashboard/Sidebar.tsx` — tokens, theme-aware, sole nav.
- Modify: `src/components/dashboard/Topbar.tsx` — tokens, real theme toggle, ⌘K search affordance.
- Modify: `src/app/dashboard/layout.tsx` — single canonical layout.
- Delete: `src/components/dashboard/DashboardLayout.tsx` — duplicate.

Existing dashboard widgets (`MISStatsGrid`, `AICopilot`, etc.) are **not** touched in this phase; they keep rendering with their current styles and are redesigned in later phases.

---

## Task 1: Inter font + no-flash theme script in root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace the root layout**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookkeeper from the Future",
  description:
    "An AI finance workspace for accounting, MIS, compliance, and business intelligence.",
};

// Runs before paint to set data-theme from saved preference or OS, avoiding a flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-canvas text-fg font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify type/build will resolve later**

The `@/components/theme/ThemeProvider` import resolves after Task 3. Do not build yet — the next two tasks complete the imports. Proceed to Task 2.

---

## Task 2: Semantic light/dark tokens in globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace the entire file**

```css
@import "tailwindcss";

/* ---- Light theme (default) ---- */
:root {
  --canvas: #f7f5ef;
  --surface: #ffffff;
  --raised: #ffffff;
  --sidebar: #fbf6ee;

  --fg: #101418;
  --fg-soft: #2c3e50;
  --fg-muted: #6b6b6b;

  --bronze: #b08d57;
  --bronze-soft: rgba(176, 141, 87, 0.12);
  --on-bronze: #101418;
  --sand: #dcc9a6;

  --line: #e4ded1;
  --line-strong: #d6d0bd;

  --success: #16a34a; --success-soft: #dcfce7;
  --warning: #d97706; --warning-soft: #fef3c7;
  --danger:  #dc2626; --danger-soft:  #fee2e2;
  --info:    #2563eb; --info-soft:    #dbeafe;

  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.06);
  --shadow-sm: 0 4px 16px rgba(10, 15, 23, 0.06);
  --shadow-md: 0 12px 40px rgba(10, 15, 23, 0.10);
  --shadow-lg: 0 30px 80px rgba(10, 15, 23, 0.18);
}

/* ---- Dark theme ---- */
[data-theme="dark"] {
  --canvas: #0a0d12;
  --surface: #11161f;
  --raised: #161c26;
  --sidebar: #0d1219;

  --fg: #f8f3ea;
  --fg-soft: #d7cdbc;
  --fg-muted: #9c9284;

  --bronze: #c8a06a;
  --bronze-soft: rgba(200, 160, 106, 0.18);
  --on-bronze: #101418;
  --sand: #3a3324;

  --line: #2e3540;
  --line-strong: #475569;

  --success: #4ade80; --success-soft: rgba(74, 222, 128, 0.16);
  --warning: #fbbf24; --warning-soft: rgba(251, 191, 36, 0.16);
  --danger:  #f87171; --danger-soft:  rgba(248, 113, 113, 0.16);
  --info:    #60a5fa; --info-soft:    rgba(96, 165, 250, 0.16);

  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.34);
  --shadow-sm: 0 10px 30px rgba(0, 0, 0, 0.38);
  --shadow-md: 0 24px 56px rgba(0, 0, 0, 0.50);
  --shadow-lg: 0 30px 80px rgba(0, 0, 0, 0.60);
}

/* ---- Map semantic vars to Tailwind utilities (inline = re-themes at runtime) ---- */
@theme inline {
  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-raised: var(--raised);
  --color-sidebar: var(--sidebar);

  --color-fg: var(--fg);
  --color-fg-soft: var(--fg-soft);
  --color-muted: var(--fg-muted);

  --color-bronze: var(--bronze);
  --color-bronze-soft: var(--bronze-soft);
  --color-on-bronze: var(--on-bronze);
  --color-sand: var(--sand);

  --color-line: var(--line);
  --color-line-strong: var(--line-strong);

  --color-success: var(--success);
  --color-success-soft: var(--success-soft);
  --color-warning: var(--warning);
  --color-warning-soft: var(--warning-soft);
  --color-danger: var(--danger);
  --color-danger-soft: var(--danger-soft);
  --color-info: var(--info);
  --color-info-soft: var(--info-soft);

  --font-sans: var(--font-inter), ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 28px;
}

html { scroll-behavior: smooth; }

body {
  background: var(--canvas);
  color: var(--fg);
}

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--bronze-soft); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: var(--bronze); }
```

- [ ] **Step 2: Note available utilities**

This yields utilities used throughout: `bg-canvas bg-surface bg-raised bg-sidebar`, `text-fg text-fg-soft text-muted`, `text-bronze bg-bronze bg-bronze-soft border-bronze text-on-bronze`, `border-line border-line-strong`, status `text-success bg-success-soft` (and warning/danger/info), `rounded-2xl`, `shadow-[var(--shadow-sm)]`. Use these instead of raw hex or `slate-*` going forward.

---

## Task 3: ThemeProvider + useTheme hook

**Files:**
- Create: `src/components/theme/ThemeProvider.tsx`

- [ ] **Step 1: Create the provider**

```tsx
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The no-flash script already set data-theme on <html> before paint; read it back.
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setThemeState(current === "dark" ? "dark" : "light");
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("theme", t);
    } catch {
      /* ignore storage errors (private mode) */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
```

- [ ] **Step 2: Build to verify tokens + provider wire up**

Run: `cd bookkeeper-future && npm run build`
Expected: PASS (the root layout, globals.css, and provider compile; existing pages still build).

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css src/components/theme/ThemeProvider.tsx
git commit -m "feat: add semantic light/dark token system and ThemeProvider"
```

---

## Task 4: ThemeToggle component

**Files:**
- Create: `src/components/theme/ThemeToggle.tsx`

- [ ] **Step 1: Create the toggle**

```tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="h-10 w-10 rounded-xl bg-surface border border-line text-fg-soft shadow-[var(--shadow-xs)] flex items-center justify-center hover:bg-bronze-soft hover:text-bronze transition"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/theme/ThemeToggle.tsx
git commit -m "feat: add theme toggle button"
```

---

## Task 5: Core primitives — Card, Button, StatusPill

**Files:**
- Create: `src/components/ui/Card.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/StatusPill.tsx`

- [ ] **Step 1: Card**

```tsx
import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`bg-surface border border-line rounded-2xl shadow-[var(--shadow-sm)] ${
        padded ? "p-6" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Button**

```tsx
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "ink" | "bronze" | "outline" | "ghost";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  ink: "bg-fg text-canvas hover:opacity-90",
  bronze: "bg-bronze text-on-bronze hover:opacity-90",
  outline: "bg-surface border border-line text-fg hover:bg-bronze-soft",
  ghost: "text-fg-soft hover:bg-bronze-soft hover:text-bronze",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
};

export default function Button({
  children,
  variant = "ink",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-medium shadow-[var(--shadow-xs)] transition disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 3: StatusPill**

```tsx
import { ReactNode } from "react";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const tones: Record<Tone, string> = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-bronze-soft text-fg-soft",
};

export default function StatusPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Build + commit**

Run: `npm run build`
Expected: PASS

```bash
git add src/components/ui/Card.tsx src/components/ui/Button.tsx src/components/ui/StatusPill.tsx
git commit -m "feat: add Card, Button, StatusPill primitives"
```

---

## Task 6: StatCard + PageHeader

**Files:**
- Create: `src/components/ui/StatCard.tsx`, `src/components/ui/PageHeader.tsx`

- [ ] **Step 1: StatCard**

```tsx
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sublabel?: string;
  trend?: { dir: "up" | "down"; text: string };
}) {
  const trendColor = trend?.dir === "down" ? "text-danger" : "text-success";
  const TrendIcon = trend?.dir === "down" ? ArrowDownRight : ArrowUpRight;
  return (
    <div className="bg-surface border border-line rounded-2xl p-5 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition">
      <div className="flex items-start justify-between">
        <div className="h-11 w-11 rounded-xl bg-bronze-soft flex items-center justify-center">
          <Icon size={20} className="text-bronze" />
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={14} />
            {trend.text}
          </span>
        )}
      </div>
      <p className="text-muted text-sm mt-4">{label}</p>
      <h3 className="text-2xl font-bold text-fg mt-1">{value}</h3>
      {sublabel && <p className="text-xs text-muted mt-1">{sublabel}</p>}
    </div>
  );
}
```

- [ ] **Step 2: PageHeader**

```tsx
import { ReactNode } from "react";
import { Star, Info } from "lucide-react";

export default function PageHeader({
  title,
  description,
  actions,
  showStar = true,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  showStar?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-fg">{title}</h1>
          {showStar && <Star size={18} className="text-muted hover:text-bronze cursor-pointer" />}
          <Info size={16} className="text-muted" />
        </div>
        {description && <p className="text-muted mt-1 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
```

- [ ] **Step 3: Build + commit**

Run: `npm run build`
Expected: PASS

```bash
git add src/components/ui/StatCard.tsx src/components/ui/PageHeader.tsx
git commit -m "feat: add StatCard and PageHeader primitives"
```

---

## Task 7: Tabs + InsightsList

**Files:**
- Create: `src/components/ui/Tabs.tsx`, `src/components/ui/InsightsList.tsx`

- [ ] **Step 1: Tabs**

```tsx
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
```

- [ ] **Step 2: InsightsList**

```tsx
import { LucideIcon } from "lucide-react";

export type Insight = {
  icon: LucideIcon;
  tone: "success" | "warning" | "danger" | "info";
  title: string;
  subtitle?: string;
};

const toneColor: Record<Insight["tone"], string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
};

export default function InsightsList({ items }: { items: Insight[] }) {
  return (
    <ul className="space-y-4">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <li key={i} className="flex gap-3">
            <Icon size={18} className={`mt-0.5 shrink-0 ${toneColor[it.tone]}`} />
            <div>
              <p className="text-sm font-medium text-fg">{it.title}</p>
              {it.subtitle && <p className="text-xs text-muted mt-0.5">{it.subtitle}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 3: Build + commit**

Run: `npm run build`
Expected: PASS

```bash
git add src/components/ui/Tabs.tsx src/components/ui/InsightsList.tsx
git commit -m "feat: add Tabs and InsightsList primitives"
```

---

## Task 8: HealthGauge

**Files:**
- Create: `src/components/ui/HealthGauge.tsx`

- [ ] **Step 1: Create the gauge (SVG arc, theme-aware via currentColor)**

```tsx
export default function HealthGauge({
  score,
  label = "Good",
  size = 120,
}: {
  score: number; // 0-100
  label?: string;
  size?: number;
}) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, score));
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 75 ? "text-success" : pct >= 50 ? "text-warning" : "text-danger";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className="text-line"
            stroke="currentColor"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className={color}
            stroke="currentColor"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-fg">{pct}</span>
          <span className="text-xs text-muted">/100</span>
        </div>
      </div>
      <span className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-success-soft ${color}`}>
        {label}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Build + commit**

Run: `npm run build`
Expected: PASS

```bash
git add src/components/ui/HealthGauge.tsx
git commit -m "feat: add HealthGauge primitive"
```

---

## Task 9: DataTable

**Files:**
- Create: `src/components/ui/DataTable.tsx`

- [ ] **Step 1: Create a generic, theme-aware table**

```tsx
import { ReactNode } from "react";
import { MoreVertical } from "lucide-react";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  align?: "left" | "right";
};

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  rowActions = true,
  emptyText = "No records found.",
}: {
  columns: Column<T>[];
  rows: T[];
  rowActions?: boolean;
  emptyText?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-line">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`py-3 px-3 font-medium ${c.align === "right" ? "text-right" : ""}`}
              >
                {c.header}
              </th>
            ))}
            {rowActions && <th className="py-3 px-3" />}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (rowActions ? 1 : 0)}
                className="py-10 text-center text-muted"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="border-b border-line/60 hover:bg-bronze-soft/40 transition">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`py-3 px-3 text-fg ${c.align === "right" ? "text-right" : ""}`}
                  >
                    {c.render ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
                {rowActions && (
                  <td className="py-3 px-3 text-right">
                    <button className="text-muted hover:text-bronze" aria-label="Row actions">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Build + commit**

Run: `npm run build`
Expected: PASS

```bash
git add src/components/ui/DataTable.tsx
git commit -m "feat: add generic DataTable primitive"
```

---

## Task 10: AIRailPanel + OnboardingStrip

**Files:**
- Create: `src/components/ui/AIRailPanel.tsx`, `src/components/ui/OnboardingStrip.tsx`

- [ ] **Step 1: AIRailPanel**

```tsx
import { Sparkles, ArrowUp } from "lucide-react";

export default function AIRailPanel({
  title = "AI Copilot",
  greeting = "How can I help you today?",
  prompts,
}: {
  title?: string;
  greeting?: string;
  prompts: string[];
}) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-bronze" />
        <h3 className="font-semibold text-fg">{title}</h3>
      </div>
      <p className="text-sm text-muted mt-3">{greeting}</p>
      <div className="mt-4 space-y-2">
        {prompts.map((p) => (
          <button
            key={p}
            className="w-full text-left text-sm rounded-xl border border-line px-3 py-2 text-fg-soft hover:bg-bronze-soft hover:text-bronze transition"
          >
            {p}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-line px-3 py-2">
        <input
          className="w-full bg-transparent text-sm outline-none text-fg placeholder:text-muted"
          placeholder="Ask anything…"
        />
        <button className="text-bronze" aria-label="Send">
          <ArrowUp size={16} />
        </button>
      </div>
      <p className="text-[11px] text-muted mt-2">AI responses may not be 100% accurate.</p>
    </div>
  );
}
```

- [ ] **Step 2: OnboardingStrip**

```tsx
import { LucideIcon } from "lucide-react";

export type OnboardingItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
};

export default function OnboardingStrip({
  heading,
  subheading,
  items,
}: {
  heading: string;
  subheading?: string;
  items: OnboardingItem[];
}) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-6 shadow-[var(--shadow-sm)]">
      <h3 className="text-xl font-bold text-fg">{heading}</h3>
      {subheading && <p className="text-muted mt-1">{subheading}</p>}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.title} className="rounded-xl border border-line p-4">
              <div className="h-10 w-10 rounded-lg bg-bronze-soft flex items-center justify-center">
                <Icon size={18} className="text-bronze" />
              </div>
              <p className="font-semibold text-fg mt-3">{it.title}</p>
              <p className="text-sm text-muted mt-1">{it.description}</p>
              <button className="text-sm font-medium text-bronze mt-3">{it.cta} →</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build + commit**

Run: `npm run build`
Expected: PASS

```bash
git add src/components/ui/AIRailPanel.tsx src/components/ui/OnboardingStrip.tsx
git commit -m "feat: add AIRailPanel and OnboardingStrip primitives"
```

---

## Task 11: Rework Sidebar to tokens + theme

**Files:**
- Modify: `src/components/dashboard/Sidebar.tsx`

- [ ] **Step 1: Keep the existing `menu` array (lines 24-130) unchanged. Replace only the returned JSX (from `return (` at line 135 to the end) with:**

```tsx
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
                  {section.items.map((item) => {
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
```

- [ ] **Step 2: Add the HealthGauge import at the top of the file (below the lucide import block):**

```tsx
import HealthGauge from "@/components/ui/HealthGauge";
```

- [ ] **Step 3: Build + commit**

Run: `npm run build`
Expected: PASS

```bash
git add src/components/dashboard/Sidebar.tsx
git commit -m "feat: rework sidebar with semantic tokens and HealthGauge"
```

---

## Task 12: Rework Topbar with real theme toggle + tokens

**Files:**
- Modify: `src/components/dashboard/Topbar.tsx`

- [ ] **Step 1: Replace the entire file**

The greeting moves out of the topbar (it belongs to the dashboard page header in a later phase). This Topbar is the global app bar: search, theme toggle, notifications, new, avatar.

```tsx
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
```

- [ ] **Step 2: Build + commit**

Run: `npm run build`
Expected: PASS

```bash
git add src/components/dashboard/Topbar.tsx
git commit -m "feat: rework topbar with working theme toggle and tokens"
```

---

## Task 13: Single canonical dashboard layout; delete duplicate

**Files:**
- Modify: `src/app/dashboard/layout.tsx`
- Delete: `src/components/dashboard/DashboardLayout.tsx`

- [ ] **Step 1: Replace `src/app/dashboard/layout.tsx`**

```tsx
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <main className="lg:ml-72 min-h-screen px-4 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <Topbar />
          {children}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Delete the duplicate component**

Run: `git rm src/components/dashboard/DashboardLayout.tsx`

- [ ] **Step 3: Remove the now-duplicated `<Topbar />` from the dashboard page**

In `src/app/dashboard/page.tsx`, delete the `import Topbar ...` line (line 1) and the `<Topbar />` JSX (line 37). The layout now renders the topbar globally. Leave the rest of the page untouched (its widgets are redesigned in the next phase).

- [ ] **Step 4: Build + lint**

Run: `npm run build && npm run lint`
Expected: PASS, no unused-import errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/layout.tsx src/app/dashboard/page.tsx
git commit -m "refactor: single dashboard layout with global topbar; remove duplicate"
```

---

## Task 14: Visual verification in both themes

**Files:** none (verification only)

- [ ] **Step 1: Run the dev server**

Run: `npm run dev`
Open `http://localhost:3000/dashboard`.

- [ ] **Step 2: Verify light mode**

Confirm: cream sidebar, warm canvas, bronze active nav item, bronze HealthGauge area, topbar search + icons render, no raw white-on-white or unreadable contrast.

- [ ] **Step 3: Toggle to dark mode**

Click the sun/moon toggle. Confirm: canvas → near-black `#0a0d12`, panels → `#11161f`, text → cream, bronze accent brighter, no flash of light theme. Reload the page and confirm dark persists with **no white flash** before paint.

- [ ] **Step 4: Confirm existing widgets still render**

The not-yet-redesigned dashboard widgets (stats grid, charts, etc.) still render without crashing (they may look stylistically old — that is expected; they are redesigned in the next phase).

- [ ] **Step 5: Final commit if any tweaks were needed**

```bash
git add -A
git commit -m "chore: foundation visual verification fixes"
```

---

## Self-Review (completed by author)

**Spec coverage:** semantic light/dark tokens (Task 2) ✓; theming mechanism — provider, no-flash script, toggle (Tasks 1,3,4) ✓; sidebar replaces tab bar as sole nav (Task 11,13) ✓; topbar with toggle (Task 12) ✓; all `components/ui/` primitives from the spec — Card, Button, StatusPill, StatCard, PageHeader, Tabs, DataTable, HealthGauge, AIRailPanel, InsightsList, OnboardingStrip (Tasks 5-10) ✓; single layout / duplicate removed (Task 13) ✓; Inter font (Task 1) ✓; dual-theme verification (Task 14) ✓. Page-level redesigns are explicitly deferred to later phase plans.

**Placeholder scan:** none — every step has complete code or an exact command.

**Type consistency:** `useTheme`/`ThemeProvider` exports match imports; `HealthGauge` props (`score`, `label`, `size`) consistent between Task 8 and Task 11; `Button` variants/sizes used in Task 12 match Task 5; utility class names match the tokens defined in Task 2.
