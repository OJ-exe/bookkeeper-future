"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const sizeClass = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: keyof typeof sizeClass;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-fg/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative flex min-h-full items-start justify-center p-4 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={`relative mt-[6vh] w-full ${sizeClass[size]} rounded-2xl border border-line bg-surface shadow-[var(--shadow-lg)]`}
        >
          <div className="flex items-start justify-between gap-4 border-b border-line p-5">
            <div>
              <h2 className="text-lg font-semibold text-fg">{title}</h2>
              {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="h-8 w-8 shrink-0 rounded-lg text-muted hover:bg-bronze-soft hover:text-bronze flex items-center justify-center transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-5">{children}</div>

          {footer && (
            <div className="flex justify-end gap-2 border-t border-line p-5">{footer}</div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
