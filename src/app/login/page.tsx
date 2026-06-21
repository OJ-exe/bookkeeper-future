"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Eye, EyeOff } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Button from "@/components/ui/Button";

const features = [
  "AI-assisted bookkeeping",
  "GST & TDS compliance built in",
  "Real-time MIS and cash insights",
];

const inputCls =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-fg outline-none transition focus:border-bronze placeholder:text-muted";
const labelCls = "mb-1.5 block text-sm font-medium text-fg-soft";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);

  return (
    <main className="grid min-h-screen lg:grid-cols-2 bg-canvas">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-bronze lg:flex">
        <div className="pointer-events-none absolute -left-24 top-16 h-96 w-96 rounded-full bg-on-bronze/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-[28rem] w-[28rem] rounded-full bg-canvas/10 blur-3xl" />

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
              Your books, ready for the future.
            </h1>
            <p className="mt-4 max-w-md text-on-bronze/80">
              The AI finance workspace for accounting, MIS, compliance, and
              controlled business intelligence.
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

          <div className="rounded-2xl border border-on-bronze/15 bg-on-bronze/5 p-5">
            <p className="text-sm italic">
              &ldquo;Closing the books used to take a week. Now it&apos;s a
              morning.&rdquo;
            </p>
            <p className="mt-2 text-xs text-on-bronze/70">
              — Priya, Finance Lead
            </p>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <section className="relative flex items-center justify-center px-6 py-12">
        <div className="absolute right-5 top-5">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bronze font-bold text-on-bronze">
              BF
            </div>
            <p className="font-bold text-fg">Bookkeeper from the Future</p>
          </div>

          <h2 className="text-2xl font-bold text-fg">Welcome back</h2>
          <p className="mt-1 text-sm text-muted">Log in to your workspace.</p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label htmlFor="email" className={labelCls}>
                Email
              </label>
              <input id="email" type="email" placeholder="you@company.com" className={inputCls} />
            </div>

            <div>
              <label htmlFor="password" className={labelCls}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-bronze transition"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-fg-soft">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-line"
                  style={{ accentColor: "var(--bronze)" }}
                />
                Remember me
              </label>
              <Link href="/login" className="font-medium text-bronze hover:opacity-80">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="bronze" className="w-full">
              Sign In
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-line" />
              <span className="text-xs text-muted">or</span>
              <div className="h-px flex-1 bg-line" />
            </div>

            <Button type="button" variant="outline" className="w-full">
              Continue with Google
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-bronze hover:opacity-80">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
