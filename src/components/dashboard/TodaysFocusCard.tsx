import { Check } from "lucide-react";
import Card from "@/components/ui/Card";

const tasks = [
  { label: "Complete Company Profile", note: "by you", done: true },
  { label: "Connect Bank Account", note: "by you", done: true },
  { label: "Add First Customer", note: "by you", done: false },
  { label: "Create First Invoice", note: "by you", done: false },
];

const PROGRESS = 50;

export default function TodaysFocusCard() {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fg">Today&apos;s Focus</h2>
        <span className="text-xs text-muted">2 of 4 tasks completed</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-bronze-soft">
          <div
            className="h-2 rounded-full bg-bronze"
            style={{ width: `${PROGRESS}%` }}
          />
        </div>
        <span className="text-xs font-medium text-bronze">{PROGRESS}%</span>
      </div>

      <ul className="mt-5 space-y-3.5">
        {tasks.map((t) => (
          <li key={t.label} className="flex items-center gap-3">
            <span
              className={
                t.done
                  ? "h-5 w-5 shrink-0 rounded-md bg-success text-on-bronze flex items-center justify-center"
                  : "h-5 w-5 shrink-0 rounded-md border border-line"
              }
            >
              {t.done && <Check size={14} aria-hidden="true" />}
            </span>
            <div className="min-w-0">
              <p
                className={
                  t.done
                    ? "text-sm text-muted line-through"
                    : "text-sm font-medium text-fg"
                }
              >
                {t.label}
              </p>
              <p className="text-xs text-muted">{t.note}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5 text-center">
        <button
          type="button"
          className="text-xs font-medium text-bronze hover:underline"
        >
          View All Tasks
        </button>
      </div>
    </Card>
  );
}
