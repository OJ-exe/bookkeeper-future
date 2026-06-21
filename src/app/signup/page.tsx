"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { countries, currencies, indianStates } from "@/data/locationData";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Button from "@/components/ui/Button";

const features = [
  "Start free — no payment details",
  "GST, TDS & inventory ready",
  "AI bookkeeping & MIS from day one",
];

const inputCls =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-fg outline-none transition focus:border-bronze placeholder:text-muted";
const labelCls = "mb-1.5 block text-sm font-medium text-fg-soft";

export default function SignupPage() {
  const [hasPan, setHasPan] = useState(false);
  const [hasGstin, setHasGstin] = useState(false);

  return (
    <main className="grid min-h-screen lg:grid-cols-2 bg-canvas">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-bronze lg:flex">
        <div className="pointer-events-none absolute -left-24 top-16 h-96 w-96 rounded-full bg-on-bronze/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-[28rem] w-[28rem] rounded-full bg-on-bronze/5 blur-3xl" />

        <div className="relative z-10 flex w-full flex-col justify-between p-12 text-on-bronze">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-on-bronze font-bold text-bronze">
              BF
            </div>
            <div className="leading-tight">
              <p className="font-bold">Bookkeeper</p>
              <p className="text-sm text-on-bronze/70">from the Future</p>
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Start your finance workspace.
            </h1>
            <p className="mt-4 max-w-md text-on-bronze/80">
              Set up your company in minutes and let AI handle the books,
              compliance, and reporting.
            </p>

            <ul className="mt-8 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-on-bronze/15">
                    <Check size={14} />
                  </span>
                  <span className="text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-8">
            <div>
              <p className="text-2xl font-bold">14 days</p>
              <p className="text-xs text-on-bronze/70">free trial</p>
            </div>
            <div>
              <p className="text-2xl font-bold">No card</p>
              <p className="text-xs text-on-bronze/70">required</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <section className="relative flex justify-center px-6 py-12 lg:max-h-screen lg:overflow-y-auto">
        <div className="absolute right-5 top-5">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bronze font-bold text-on-bronze">
              BF
            </div>
            <p className="font-bold text-fg">Bookkeeper from the Future</p>
          </div>

          <h2 className="text-2xl font-bold text-fg">Create your workspace</h2>
          <p className="mt-1 text-sm text-muted">
            Start a free trial without payment details, or subscribe immediately.
          </p>

          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="fullName" className={labelCls}>Full Name</label>
              <input id="fullName" placeholder="Your name" className={inputCls} />
            </div>

            <div>
              <label htmlFor="email" className={labelCls}>Email</label>
              <input id="email" type="email" placeholder="you@company.com" className={inputCls} />
            </div>

            <div>
              <label htmlFor="password" className={labelCls}>Password</label>
              <input id="password" type="password" placeholder="Create password" className={inputCls} />
            </div>

            <div>
              <label htmlFor="company" className={labelCls}>Company Name</label>
              <input id="company" placeholder="Company name" className={inputCls} />
            </div>

            <div>
              <label htmlFor="address" className={labelCls}>Registered Address</label>
              <textarea id="address" rows={3} placeholder="Registered business address" className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className={labelCls}>City</label>
                <input id="city" placeholder="Mumbai" className={inputCls} />
              </div>
              <div>
                <label htmlFor="state" className={labelCls}>State</label>
                <select id="state" className={inputCls} defaultValue="">
                  <option value="" disabled>Select state</option>
                  {indianStates.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="pin" className={labelCls}>PIN Code</label>
              <input id="pin" placeholder="400001" className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="country" className={labelCls}>Country</label>
                <select id="country" className={inputCls}>
                  {countries.map((country: string) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="currency" className={labelCls}>Currency</label>
                <select id="currency" className={inputCls}>
                  {currencies.map((currency: string) => (
                    <option key={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* PAN & GST toggle cards */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-surface p-4 transition hover:border-bronze/50">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={hasPan}
                    onChange={() => setHasPan(!hasPan)}
                    className="h-5 w-5 rounded border-line"
                    style={{ accentColor: "var(--bronze)" }}
                  />
                  <span className="font-medium text-fg">PAN available</span>
                </label>
                {hasPan && (
                  <input
                    type="text"
                    placeholder="ABCDE1234F"
                    className={`mt-4 ${inputCls}`}
                  />
                )}
              </div>

              <div className="rounded-2xl border border-line bg-surface p-4 transition hover:border-bronze/50">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={hasGstin}
                    onChange={() => setHasGstin(!hasGstin)}
                    className="h-5 w-5 rounded border-line"
                    style={{ accentColor: "var(--bronze)" }}
                  />
                  <span className="font-medium text-fg">GSTIN available</span>
                </label>
                {hasGstin && (
                  <input
                    type="text"
                    placeholder="27ABCDE1234F1Z5"
                    className={`mt-4 ${inputCls}`}
                  />
                )}
              </div>
            </div>

            <div className="rounded-xl border border-line bg-bronze-soft p-4 text-sm text-fg-soft">
              Start Free Trial does not ask for payment details. Subscribe from
              Billing anytime before the trial ends to keep access active.
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="bronze" className="flex-1">
                Start Free Trial
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                Subscribe Now
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-bronze hover:opacity-80">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
