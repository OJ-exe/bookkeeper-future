"use client";

import { useState } from "react";
import {
  User,
  Building2,
  Users,
  Bell,
  ShieldCheck,
  CreditCard,
  Plug,
  Check,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatusPill from "@/components/ui/StatusPill";
import Modal from "@/components/ui/Modal";
import { resetStore } from "@/lib/store/dataStore";

type Section =
  | "Profile"
  | "Company"
  | "Team & Roles"
  | "Notifications"
  | "Security"
  | "Billing"
  | "Integrations";

const navItems: { key: Section; icon: LucideIcon }[] = [
  { key: "Profile", icon: User },
  { key: "Company", icon: Building2 },
  { key: "Team & Roles", icon: Users },
  { key: "Notifications", icon: Bell },
  { key: "Security", icon: ShieldCheck },
  { key: "Billing", icon: CreditCard },
  { key: "Integrations", icon: Plug },
];

const inputCls =
  "bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-fg outline-none focus:border-bronze transition w-full";
const labelCls = "text-sm font-medium text-fg-soft";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        on ? "bg-bronze" : "bg-line-strong"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow-[var(--shadow-xs)] transition ${
          on ? "left-[1.375rem]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function SaveBar({
  saved,
  onSave,
}: {
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <div className="mt-6 flex items-center gap-2 border-t border-line pt-5">
      <Button variant="bronze" size="sm" onClick={onSave}>
        {saved ? (
          <>
            <Check size={16} /> Saved
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
      <Button variant="outline" size="sm">
        Cancel
      </Button>
    </div>
  );
}

function ProfileSection() {
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-4 border-b border-line pb-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bronze text-2xl font-semibold text-on-bronze">
          O
        </span>
        <div>
          <Button variant="outline" size="sm">
            Change photo
          </Button>
          <p className="mt-1.5 text-xs text-muted">JPG or PNG, up to 2MB.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Full Name">
          <input className={inputCls} defaultValue="Ojaswini Sood" />
        </Field>
        <Field label="Email">
          <input className={inputCls} type="email" defaultValue="ojaswini@testcompany.com" />
        </Field>
        <Field label="Phone">
          <input className={inputCls} defaultValue="+91 98765 43210" />
        </Field>
        <Field label="Role">
          <div className="py-1">
            <StatusPill tone="neutral">Owner</StatusPill>
          </div>
        </Field>
        <Field label="Timezone">
          <select className={inputCls} defaultValue="Asia/Kolkata">
            <option>Asia/Kolkata</option>
            <option>Asia/Dubai</option>
            <option>America/New_York</option>
            <option>Europe/London</option>
          </select>
        </Field>
        <Field label="Language">
          <select className={inputCls} defaultValue="English">
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </select>
        </Field>
      </div>

      <SaveBar saved={saved} onSave={() => setSaved(true)} />
    </div>
  );
}

function CompanySection() {
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Company Name">
          <input className={inputCls} defaultValue="Test Company" />
        </Field>
        <Field label="GSTIN">
          <input className={inputCls} defaultValue="27ABCDE1234F1Z5" />
        </Field>
        <Field label="PAN">
          <input className={inputCls} defaultValue="ABCDE1234F" />
        </Field>
        <Field label="Address">
          <input className={inputCls} defaultValue="402, Pinnacle Tower, Andheri East" />
        </Field>
        <Field label="State">
          <select className={inputCls} defaultValue="Maharashtra">
            <option>Maharashtra</option>
            <option>Karnataka</option>
            <option>Delhi</option>
            <option>Tamil Nadu</option>
          </select>
        </Field>
        <Field label="Country">
          <select className={inputCls} defaultValue="India">
            <option>India</option>
            <option>United States</option>
            <option>United Arab Emirates</option>
          </select>
        </Field>
        <Field label="Financial Year Start">
          <select className={inputCls} defaultValue="April">
            <option>April</option>
            <option>January</option>
            <option>July</option>
          </select>
        </Field>
      </div>
      <SaveBar saved={saved} onSave={() => setSaved(true)} />
    </div>
  );
}

type Member = {
  name: string;
  email: string;
  role: string;
  tone: "neutral" | "info" | "success";
  status: string;
};

const members: Member[] = [
  {
    name: "Ojaswini Sood",
    email: "ojaswini@testcompany.com",
    role: "Owner",
    tone: "neutral",
    status: "Active",
  },
  {
    name: "Rahul Mehta",
    email: "rahul@testcompany.com",
    role: "Accountant",
    tone: "info",
    status: "Active",
  },
  {
    name: "Priya Nair",
    email: "priya@testcompany.com",
    role: "Viewer",
    tone: "success",
    status: "Invited",
  },
];

function TeamSection() {
  const [inviteOpen, setInviteOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-fg">Team Members</h2>
          <p className="text-sm text-muted">Manage who has access and their roles.</p>
        </div>
        <Button variant="bronze" size="sm" onClick={() => setInviteOpen(true)}>
          <Plus size={16} /> Invite member
        </Button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
              <th className="py-2.5 pr-3 font-medium">Name</th>
              <th className="py-2.5 pr-3 font-medium">Email</th>
              <th className="py-2.5 pr-3 font-medium">Role</th>
              <th className="py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.email} className="border-b border-line/60">
                <td className="py-3 pr-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bronze-soft text-xs font-semibold text-bronze">
                      {m.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </span>
                    <span className="font-medium text-fg">{m.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-3 text-fg-soft">{m.email}</td>
                <td className="py-3 pr-3">
                  <StatusPill tone={m.tone}>{m.role}</StatusPill>
                </td>
                <td className="py-3">
                  <StatusPill tone={m.status === "Active" ? "success" : "warning"}>
                    {m.status}
                  </StatusPill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite member"
        description="Send an invitation by email."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button variant="bronze" onClick={() => setInviteOpen(false)}>
              Send invite
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Email">
            <input className={inputCls} type="email" placeholder="name@company.com" />
          </Field>
          <Field label="Role">
            <select className={inputCls} defaultValue="Viewer">
              <option>Accountant</option>
              <option>Viewer</option>
              <option>Admin</option>
            </select>
          </Field>
        </div>
      </Modal>
    </div>
  );
}

const notificationRows: { key: string; label: string; desc: string; default: boolean }[] = [
  { key: "paid", label: "Invoice paid", desc: "When a customer pays an invoice.", default: true },
  {
    key: "overdue",
    label: "Payment overdue",
    desc: "When an invoice crosses its due date.",
    default: true,
  },
  {
    key: "customer",
    label: "New customer added",
    desc: "When a customer is created in your books.",
    default: false,
  },
  {
    key: "gst",
    label: "GST filing reminders",
    desc: "Ahead of upcoming GST due dates.",
    default: true,
  },
  {
    key: "summary",
    label: "Weekly summary email",
    desc: "A Monday digest of your financials.",
    default: false,
  },
];

function NotificationsSection() {
  const [state, setState] = useState<Record<string, boolean>>(
    () => Object.fromEntries(notificationRows.map((r) => [r.key, r.default]))
  );
  return (
    <div>
      <h2 className="text-base font-semibold text-fg">Notifications</h2>
      <p className="text-sm text-muted">Choose what you want to be notified about.</p>
      <ul className="mt-5 divide-y divide-line">
        {notificationRows.map((r) => (
          <li key={r.key} className="flex items-center justify-between gap-4 py-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-fg">{r.label}</p>
              <p className="text-sm text-muted">{r.desc}</p>
            </div>
            <Toggle
              on={state[r.key]}
              label={r.label}
              onClick={() => setState((s) => ({ ...s, [r.key]: !s[r.key] }))}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

const activeSessions: { device: string; meta: string }[] = [
  { device: "MacBook Pro — Chrome", meta: "Mumbai, India · Current session" },
  { device: "iPhone 15 — Safari", meta: "Mumbai, India · 2 hours ago" },
];

function SecuritySection() {
  const [twoFA, setTwoFA] = useState(true);
  const [resetOpen, setResetOpen] = useState(false);
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-base font-semibold text-fg">Change Password</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Current Password">
            <input className={inputCls} type="password" placeholder="••••••••" />
          </Field>
          <Field label="New Password">
            <input className={inputCls} type="password" placeholder="••••••••" />
          </Field>
          <Field label="Confirm Password">
            <input className={inputCls} type="password" placeholder="••••••••" />
          </Field>
        </div>
        <Button variant="bronze" size="sm" className="mt-4">
          Update Password
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
        <div>
          <p className="text-sm font-medium text-fg">Two-Factor Authentication</p>
          <p className="text-sm text-muted">Add an extra layer of security at sign-in.</p>
        </div>
        <Toggle on={twoFA} label="Two-Factor Authentication" onClick={() => setTwoFA((v) => !v)} />
      </div>

      <div className="border-t border-line pt-6">
        <h2 className="text-base font-semibold text-fg">Active Sessions</h2>
        <ul className="mt-4 space-y-3">
          {activeSessions.map((s) => (
            <li
              key={s.device}
              className="flex items-center justify-between gap-4 rounded-xl border border-line p-4"
            >
              <div>
                <p className="text-sm font-medium text-fg">{s.device}</p>
                <p className="text-xs text-muted">{s.meta}</p>
              </div>
              <Button variant="outline" size="sm">
                Revoke
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line pt-6">
        <h2 className="text-base font-semibold text-fg">Data</h2>
        <div className="mt-4 flex flex-col gap-4 rounded-xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-fg">Reset demo data</p>
            <p className="text-sm text-muted">
              Restore all records to the original seed data. This can&apos;t be undone.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setResetOpen(true)}>
            Reset demo data
          </Button>
        </div>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset demo data?"
        description="This action cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <button
              type="button"
              onClick={() => {
                resetStore();
                setResetOpen(false);
              }}
              className="h-11 px-5 rounded-xl bg-danger text-white text-sm font-medium hover:opacity-90 transition"
            >
              Reset data
            </button>
          </>
        }
      >
        <p className="text-sm text-fg-soft">
          All customers, vendors, invoices, bills and other records will revert to
          the original seed data. Any changes you&apos;ve made will be lost.
        </p>
      </Modal>
    </div>
  );
}

const invoices: { id: string; date: string; amount: string }[] = [
  { id: "INV-2026-006", date: "01 Jun 2026", amount: "₹2,499" },
  { id: "INV-2026-005", date: "01 May 2026", amount: "₹2,499" },
  { id: "INV-2026-004", date: "01 Apr 2026", amount: "₹2,499" },
];

function BillingSection() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-canvas p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-fg">Pro</p>
            <StatusPill tone="success">Active</StatusPill>
          </div>
          <p className="mt-1 text-sm text-muted">₹2,499/mo · Renews 01 Jul 2026</p>
        </div>
        <Button variant="bronze" size="sm">
          Manage Billing
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
        <div>
          <p className="text-sm font-medium text-fg">Payment Method</p>
          <p className="text-sm text-muted">Visa ending in 4242 · Expires 08/27</p>
        </div>
        <Button variant="outline" size="sm">
          Update
        </Button>
      </div>

      <div className="border-t border-line pt-6">
        <h2 className="text-base font-semibold text-fg">Invoices</h2>
        <ul className="mt-4 divide-y divide-line">
          {invoices.map((inv) => (
            <li key={inv.id} className="flex items-center justify-between gap-4 py-3 text-sm">
              <span className="font-medium text-fg">{inv.id}</span>
              <span className="text-muted">{inv.date}</span>
              <span className="font-medium text-fg">{inv.amount}</span>
              <button
                type="button"
                className="text-sm font-medium text-bronze hover:opacity-80 transition"
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const integrations: { name: string; desc: string }[] = [
  { name: "Razorpay", desc: "Accept payments and reconcile settlements." },
  { name: "Tally", desc: "Sync ledgers and vouchers two-way." },
  { name: "Zoho", desc: "Import contacts and invoices." },
  { name: "Google Drive", desc: "Attach and store source documents." },
  { name: "Slack", desc: "Get alerts in your team channels." },
];

function IntegrationsSection() {
  return (
    <div>
      <h2 className="text-base font-semibold text-fg">Integrations</h2>
      <p className="text-sm text-muted">Connect Bookkeeper with the tools you already use.</p>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {integrations.map((it) => (
          <div
            key={it.name}
            className="flex items-center justify-between gap-4 rounded-2xl border border-line p-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bronze-soft text-sm font-semibold text-bronze">
                {it.name[0]}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-fg">{it.name}</p>
                <p className="text-xs text-muted">{it.desc}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsScreen() {
  const [section, setSection] = useState<Section>("Profile");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your profile, company, team, billing, notifications, and security."
        showStar={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left nav */}
        <Card padded={false} className="lg:col-span-3 p-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = section === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSection(item.key)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    active
                      ? "bg-bronze-soft text-bronze"
                      : "text-fg-soft hover:bg-bronze-soft/50"
                  }`}
                >
                  <Icon size={17} className="shrink-0" />
                  {item.key}
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Right panel */}
        <Card className="lg:col-span-9">
          {section === "Profile" && <ProfileSection />}
          {section === "Company" && <CompanySection />}
          {section === "Team & Roles" && <TeamSection />}
          {section === "Notifications" && <NotificationsSection />}
          {section === "Security" && <SecuritySection />}
          {section === "Billing" && <BillingSection />}
          {section === "Integrations" && <IntegrationsSection />}
        </Card>
      </div>
    </div>
  );
}
