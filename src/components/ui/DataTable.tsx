import { ReactNode } from "react";
import { MoreVertical } from "lucide-react";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  align?: "left" | "right";
};

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  rowActions = true,
  emptyText = "No records found.",
}: {
  columns: Column<T>[];
  rows: T[];
  rowActions?: boolean;
  emptyText?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-line">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`py-3 px-3 font-medium ${c.align === "right" ? "text-right" : ""}`}
              >
                {c.header}
              </th>
            ))}
            {rowActions && <th className="py-3 px-3" />}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (rowActions ? 1 : 0)}
                className="py-10 text-center text-muted"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="border-b border-line/60 hover:bg-bronze-soft/40 transition">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`py-3 px-3 text-fg ${c.align === "right" ? "text-right" : ""}`}
                  >
                    {c.render ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
                {rowActions && (
                  <td className="py-3 px-3 text-right">
                    <button className="text-muted hover:text-bronze" aria-label="Row actions">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
