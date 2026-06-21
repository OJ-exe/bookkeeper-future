"use client";

import { useState } from "react";
import {
  Sparkles,
  Plus,
  ArrowUp,
  Paperclip,
  FilePlus2,
  Receipt,
  ListChecks,
  Wallet,
  RefreshCcw,
  Languages,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { Menu, MenuLabel, MenuItem } from "@/components/ui/Menu";

type Message = { role: "user" | "assistant"; text: string };

type Session = { id: string; title: string; group: string };

const sessions: Session[] = [
  { id: "s1", title: "Cash position review", group: "Today" },
  { id: "s2", title: "Overdue invoices", group: "Previous 7 days" },
  { id: "s3", title: "GST reconciliation", group: "Previous 7 days" },
];

const suggestions: { icon: LucideIcon; text: string }[] = [
  { icon: FilePlus2, text: "Create an invoice — I'll handle the details" },
  { icon: Receipt, text: "Record a vendor bill from a document" },
  { icon: ListChecks, text: "How many open and overdue invoices do I have?" },
  { icon: Wallet, text: "Analyze my cash position and what needs attention this week" },
];

function mockReply(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("invoice")) {
    return "Here's a summary based on your books: you have 18 open invoices worth ₹2.1M, of which 4 are overdue by more than 30 days. I can draft a new invoice or send reminders for the overdue ones — just confirm and I'll prepare it for your approval before anything is saved.";
  }
  if (p.includes("cash")) {
    return "Here's a summary based on your books: your current cash position is ₹4.8M across operating accounts, with ₹1.24M in upcoming GST payable due in 12 days. Receivables of ₹2.1M outpace payables of ₹0.9M this week. The main item needing attention is two overdue customer payments above ₹30 days.";
  }
  if (p.includes("overdue")) {
    return "Here's a summary based on your books: 4 invoices are currently overdue, totalling ₹6.4L. Two of them are past 30 days. I can draft polite reminders or a consolidated statement for each customer — confirm and I'll prepare them for your approval.";
  }
  if (p.includes("bill") || p.includes("vendor")) {
    return "Here's a summary based on your books: I can read a vendor bill from an uploaded document, extract the line items, GSTIN and tax, and create a draft purchase entry. Attach the document and I'll prepare it for your review before posting.";
  }
  return "Here's a summary based on your books: I've reviewed the relevant ledger context for your request. I can prepare a report, draft a document, or run a deeper analysis — nothing is saved until you approve it. Let me know how you'd like to proceed.";
}

export default function AICopilotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [activeSession, setActiveSession] = useState<string | null>(null);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      { role: "assistant", text: mockReply(trimmed) },
    ]);
    setInput("");
  }

  function newChat() {
    setMessages([]);
    setInput("");
    setActiveSession(null);
  }

  const grouped = sessions.reduce<Record<string, Session[]>>((acc, s) => {
    (acc[s.group] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Copilot"
        description="Ask questions, prepare reports, review ledger context, and draft documents — with approval before anything is saved."
        showStar={false}
        actions={
          <>
            <Menu
              align="right"
              widthClass="w-60"
              trigger={
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-fg-soft shadow-[var(--shadow-xs)] hover:bg-bronze-soft transition"
                >
                  <Sparkles size={16} className="text-bronze" />
                  GPT context: This company
                  <ChevronDown size={14} className="text-muted" />
                </button>
              }
            >
              <MenuLabel>Context source</MenuLabel>
              <MenuItem icon={Sparkles}>This company</MenuItem>
              <MenuItem icon={Sparkles}>Selected ledgers</MenuItem>
              <MenuItem icon={Sparkles}>Uploaded documents</MenuItem>
            </Menu>
            <Button variant="outline" size="sm" onClick={newChat}>
              <Plus size={16} /> New chat
            </Button>
          </>
        }
      />

      <div className="flex gap-6">
        {/* Sessions rail */}
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-6 space-y-4">
            <button
              type="button"
              onClick={newChat}
              className="flex w-full items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-medium text-fg shadow-[var(--shadow-xs)] hover:bg-bronze-soft hover:text-bronze transition"
            >
              <Plus size={16} /> New chat
            </button>

            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {group}
                </p>
                <ul className="space-y-0.5">
                  {items.map((s) => {
                    const active = activeSession === s.id;
                    return (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => setActiveSession(s.id)}
                          className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm transition ${
                            active
                              ? "bg-bronze-soft text-bronze font-medium"
                              : "text-fg-soft hover:bg-bronze-soft/50"
                          }`}
                        >
                          {s.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat column */}
        <div className="flex flex-1 flex-col min-h-[calc(100vh-9rem)]">
          <div className="flex-1">
            {messages.length === 0 ? (
              <div className="flex h-full min-h-[40vh] flex-col items-center justify-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bronze-soft text-bronze">
                  <Sparkles size={26} />
                </span>
                <h2 className="mt-5 text-2xl font-bold text-fg">
                  Hi Ojaswini! What should we work on?
                </h2>
                <p className="mt-2 max-w-md text-muted">
                  I can pull from your ledgers to answer questions, prepare reports, and draft
                  documents — you approve before anything is saved.
                </p>

                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                  {suggestions.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.text}
                        type="button"
                        onClick={() => send(s.text)}
                        className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-left shadow-[var(--shadow-xs)] hover:border-bronze hover:bg-bronze-soft/40 transition"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bronze-soft text-bronze">
                          <Icon size={18} />
                        </span>
                        <span className="text-sm font-medium text-fg-soft">{s.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-5 py-2">
                {messages.map((m, i) =>
                  m.role === "user" ? (
                    <div key={i} className="flex justify-end">
                      <div className="bg-bronze text-on-bronze rounded-2xl px-4 py-2.5 max-w-[80%] text-sm">
                        {m.text}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-bronze-soft text-bronze">
                        <Sparkles size={16} />
                      </span>
                      <div className="bg-surface border border-line rounded-2xl px-4 py-2.5 max-w-[80%] text-sm text-fg shadow-[var(--shadow-xs)]">
                        {m.text}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="sticky bottom-0 mt-4 pt-2">
            <div className="rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Attach a document"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-bronze-soft hover:text-bronze transition"
                >
                  <Paperclip size={18} />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send(input);
                  }}
                  placeholder="Ask Bookkeeper anything…"
                  className="w-full bg-transparent px-1 text-sm text-fg outline-none placeholder:text-muted"
                />
                <button
                  type="button"
                  onClick={() => send(input)}
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bronze text-on-bronze shadow-[var(--shadow-xs)] hover:opacity-90 transition"
                >
                  <ArrowUp size={18} />
                </button>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 px-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-fg-soft">
                  <RefreshCcw size={13} /> Reconcile Ledger
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-bronze-soft px-2.5 py-1 text-xs font-medium text-bronze">
                  <Languages size={13} /> English
                </span>
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-muted">
              AI responses may not be 100% accurate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
