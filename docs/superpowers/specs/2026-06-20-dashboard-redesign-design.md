# Bookkeeper from the Future — Dashboard UI Redesign

**Date:** 2026-06-20
**Status:** Approved (design), pending implementation plan
**Scope:** In-app dashboard product only. Marketing site is out of scope for this spec (separate cycle).

## Context

`bookkeeper-future/` is a Next.js 16 + React 19 + Tailwind v4 project that already contains a
rough first pass of the dashboard redesign: a grouped sidebar, `lucide-react` icons, `recharts`,
and a dashboard page composing ~20 widgets. It is structurally close to the target mockups but
visually incoherent:

- `globals.css` defines bronze/olive/cream tokens but sets `body` to `slate-50` and the components
  mix those brand tokens with arbitrary `slate-*` grays.
- Two competing layout files exist: `app/dashboard/layout.tsx` and
  `components/dashboard/DashboardLayout.tsx`.
- Widgets are bespoke rather than composed from shared primitives.

The redesign references (`reference/redesign/`) contain two design languages: an indigo SaaS
dashboard and an olive/bronze editorial marketing site, plus a brand palette swatch
(`#101418 / #2C3E50 / #B08D57 / #DCC9A6 / #FBF6EE`).

**Decision:** Adopt the *structure and density* of the indigo dashboard mockups but render them in
the **bronze/ink/cream brand palette** (light mode only for now). This keeps the product
distinctive and tied to the marketing brand and the original orange heritage, rather than looking
like generic indigo SaaS.

This is an upgrade of an existing skeleton, not a rewrite. Existing routes, the recharts/lucide
dependencies, and the sidebar nav structure are kept.

## Goals

- One coherent, token-driven design system applied across the whole dashboard.
- Pages composed from a small set of reusable primitives, not bespoke markup.
- Visual fidelity matching the redesign mockups (stat cards, charts, AI rail, health gauges,
  status pills, onboarding strips), recolored to the brand palette.
- Fix the structural issues (duplicate layout, inconsistent tokens) as part of the work.

## Non-Goals (YAGNI)

- Marketing/public landing site redesign (separate spec).
- Dark mode (tokens will be structured to allow it later, but no dark theme is built now).
- Real data / backend wiring. Components use the existing mock/placeholder data shapes.
- Auth, multi-company logic, or any new product features.

## Design System

### Tokens (single source of truth)

Defined in `globals.css` via Tailwind v4 `@theme`, replacing the current ad-hoc `:root` vars.

| Role | Value |
|------|-------|
| Canvas (app bg) | `#F7F5EF` (warm) |
| Surface / cards | `#FFFFFF` |
| Sidebar | `#FBF6EE` (cream) |
| Text / ink (primary, primary buttons) | `#101418` |
| Slate (secondary text/headings) | `#2C3E50` |
| Muted | `#6B6B6B` |
| Bronze (accent: active nav, links, focus, highlights) | `#B08D57` |
| Bronze-soft (tint for active bg, chips) | bronze @ ~12% |
| Sand | `#DCC9A6` |
| Border | `#E4DED1` |
| Success / Warning / Danger / Info | green / amber / red / blue, each with a soft tint |

Plus scales for **radius** (sm→2xl), **shadow** (xs→lg, warm-tinted), **spacing**, and a **type
scale**. Font family: **Inter** (matches mockups), with system fallbacks.

### App shell

- **Remove** `components/dashboard/DashboardLayout.tsx`. Keep one canonical
  `app/dashboard/layout.tsx` (sidebar + `<main>` with consistent max width and padding).
- **Sidebar** (`Sidebar.tsx`): cream background, BF logo mark + wordmark, grouped nav (existing
  structure: Dashboard, Business Command, FINANCE, CRM, BILLING, HR, AI & INSIGHTS, SETTINGS),
  bronze active state on bronze-soft background, pinned Business Health gauge at the bottom.
  Collapsible / hidden on smaller breakpoints.
- **Topbar** (`Topbar.tsx`): global search with ⌘K affordance, refresh, +new, notifications with
  badge, company switcher, user avatar. No theme toggle (light mode only).

### Reusable primitives (`components/ui/`)

Each has a single clear purpose and a documented prop interface:

- `Card` — base surface (padding, radius, border, optional header/footer).
- `PageHeader` — title + favorite star + info icon + description + right-aligned action buttons.
- `StatCard` — pastel/bronze icon chip, big value, sublabel, trend indicator (↑/↓ + % + color).
- `Tabs` — underline tab bar with active state.
- `DataTable` — header row, body rows with optional avatar cell, status pill cell, and row actions
  (three-dot menu). Pagination footer.
- `StatusPill` — colored chip (success/warning/danger/info/neutral).
- `Button` — variants: `ink` (primary), `bronze`, `ghost`, `outline`; sizes sm/md.
- `HealthGauge` — circular gauge with score, label, and color band.
- `AIRailPanel` — heading + suggested-prompt buttons + "Ask anything…" input.
- `InsightsList` — icon + title + subtitle rows with status coloring.
- `OnboardingStrip` — bottom-of-page row of get-started cards with illustration slot.

### Standard page template

Every dashboard page follows the same composition (per mockups):

```
PageHeader
Row of StatCards
Main grid:  [ charts / tables (8 cols) ]  [ AI rail: Copilot + Insights + Health/QuickActions (4 cols) ]
OnboardingStrip (bottom)
```

## Rollout (phased, each phase independently reviewable)

1. **Foundation** — tokens in `globals.css`/`@theme`, app shell (single layout, sidebar, topbar),
   and all `components/ui/` primitives. No page is final yet, but everything downstream is fast.
2. **Dashboard home** (flagship, mockup #1) — greeting header, KPI stat row, Business Health,
   AI Copilot rail, cash-flow + revenue-vs-expense charts, outstanding invoices donut, setup
   workbench, today's focus, recent activity, insights.
3. **Chart of Accounts** (mockup #2) — account-structure tree + accounts table + account-health rail.
4. **Customers** (mockup #4) + **Sales Documents / Invoices** (mockup #5).
5. **Taxes / Tax Command Center** (mockup #3).
6. **Remaining list pages** — vendors, bills, orders, payments, employees, payroll, reports —
   reuse the template + primitives.

## Tech / constraints

- Next.js 16 — **read `node_modules/next/dist/docs/` before writing routing/server-component code**
  (per `AGENTS.md`; APIs differ from older versions).
- Keep existing deps: `recharts`, `lucide-react`, `tailwindcss@4`.
- Client components only where interactivity requires (`"use client"`), matching existing patterns.

## Success criteria

- All dashboard pages render from shared primitives with the bronze/ink/cream system.
- No remaining references to the duplicate layout or stray `slate-*` brand colors where a token
  should be used.
- Dashboard home visually matches mockup #1 at desktop width.
- `npm run build` and `npm run lint` pass.
