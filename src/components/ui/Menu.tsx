"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function Menu({
  trigger,
  children,
  align = "right",
  widthClass = "w-56",
}: {
  trigger: ReactElement<Record<string, unknown>>;
  children: ReactNode;
  align?: "left" | "right";
  widthClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerEl = isValidElement(trigger)
    ? cloneElement(trigger, {
        onClick: () => setOpen((o) => !o),
        "aria-haspopup": "menu",
        "aria-expanded": open,
      })
    : trigger;

  return (
    <div className="relative" ref={ref}>
      {triggerEl}
      {open && (
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className={`absolute z-40 mt-2 ${align === "right" ? "right-0" : "left-0"} ${widthClass} origin-top rounded-xl border border-line bg-raised p-1.5 shadow-[var(--shadow-md)]`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function MenuItem({
  icon: Icon,
  children,
  onClick,
  href,
  danger = false,
}: {
  icon?: LucideIcon;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
}) {
  const cls = `flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition ${
    danger
      ? "text-danger hover:bg-danger-soft"
      : "text-fg-soft hover:bg-bronze-soft hover:text-bronze"
  }`;

  if (href) {
    return (
      <Link href={href} role="menuitem" className={cls}>
        {Icon && <Icon size={16} className="shrink-0" />}
        {children}
      </Link>
    );
  }
  return (
    <button type="button" role="menuitem" onClick={onClick} className={cls}>
      {Icon && <Icon size={16} className="shrink-0" />}
      {children}
    </button>
  );
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
      {children}
    </p>
  );
}

export function MenuDivider() {
  return <div className="my-1.5 h-px bg-line" />;
}
