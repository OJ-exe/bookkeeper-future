# Phase 3 — Chart of Accounts + Interactive Primitives

**Goal:** Build the Chart of Accounts page (mockup #2) and introduce reusable interactive primitives (`Menu`, `Modal`) so buttons start working. Wire the global toolbar's menus, and make the Accounts page's filters/search/row-actions/create flow functional.

**Functionality level:** Interactive UI only — menus/modals/dropdowns/tabs/search/filtering work with client state; mock data is read-only (nothing persists across reload). No backend.

**Tech:** Next.js 16, React 19, Tailwind v4 semantic tokens, lucide-react. Token discipline as before (no raw hex except chart values; literal-class lookups for color-by-value). Escape apostrophes in JSX.

## Interactive primitives (`src/components/ui/`)
- `Menu.tsx` — `Menu` (trigger ReactElement cloned with toggle + aria; closes on outside pointerdown + Escape; aligns left/right) and `MenuItem` (button or Link, optional icon, danger variant).
- `Modal.tsx` — portal overlay; `open`/`onClose`; closes on Escape + backdrop; title/description/children/footer; body scroll lock; size sm/md/lg.

## Toolbar wiring (`Topbar.tsx`)
- `+ New` → `Menu`: New Invoice, New Customer, New Vendor, New Bill, New Payment (Links to the relevant `/dashboard/*` routes).
- Company switcher → `Menu`: Test Company (current), Add Company.
- User menu → `Menu`: Profile, Settings, Billing, divider, Log out (→ `/login`).
- Notifications → `Menu` panel: a few sample notifications + "View all".
- Sync → client `onClick` spins the icon briefly.
- AI Copilot → Link to `/dashboard/ai`; Help → Link/menu.

## Chart of Accounts page (`src/app/dashboard/accounts/page.tsx` + sections)
Layout (mockup #2): PageHeader with actions (Accounts Register, Export, Download Template, Upload CSV, + Create Account) → 5 StatCards (Total Accounts 20, Assets 8, Liabilities 7, P&L 5, Tax Mapping 100%) → three columns:
- **Left rail:** `AccountStructureTree` — grouped counts (Assets/Liabilities/Income/Expenses with children), "+ Add Group". Clicking a group filters the table by type.
- **Center:** search input (filters rows by code/name/subtype), type filter chips (All/Asset/Liability/Income/Expense/Banking/Tax/Payroll/Inventory) that filter the table, "Accounts (N)" + sort, the accounts `DataTable` (Code, Account Name + default-account sub, Type pill, Subtype, Balance, Linked count, row-actions `Menu`), pagination.
- **Right rail:** Account Health gauge (92/100) + checklist, Insights list, AI Assistant panel (`AIRailPanel`).

Functional behaviors:
- Search + type-chip + tree-group selection all filter the same client `accounts` array (a `"use client"` page or a client `AccountsView` component holding state).
- `+ Create Account` opens a `Modal` with a form (Code, Name, Type select, Subtype) — validates required, submit closes (read-only: no row added). Row-actions menu (Edit/Duplicate/Delete) open/close (Delete shows a confirm `Modal`, no-op on confirm).
- Tabs/sort toggle visible state.

## Verify
`npm run build` + `npm run lint` green; smoke-test `/dashboard/accounts` renders, filters work, modal opens; both themes. Final code review of the diff.
