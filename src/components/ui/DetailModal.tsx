"use client";

import Modal from "@/components/ui/Modal";
import type { ReactNode } from "react";

export type DetailRow = { label: string; value: ReactNode };

/** Read-only record viewer used by row "View" actions. */
export default function DetailModal({
  open,
  onClose,
  title,
  description,
  rows,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  rows: DetailRow[];
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="md">
      <dl className="divide-y divide-line">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-4 py-2.5">
            <dt className="text-sm text-muted">{r.label}</dt>
            <dd className="text-sm font-medium text-fg text-right">{r.value}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  );
}
