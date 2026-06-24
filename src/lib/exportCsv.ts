export type CsvColumn<T> = { key: keyof T; header: string };

function escapeCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function triggerDownload(filename: string, content: string) {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download an empty CSV template — just the header row, plus an optional sample
 * row to show the expected format.
 */
export function downloadCsvTemplate(
  filename: string,
  headers: string[],
  sample?: string[]
) {
  const lines = [headers.map(escapeCell).join(",")];
  if (sample) lines.push(sample.map(escapeCell).join(","));
  triggerDownload(filename, lines.join("\r\n"));
}

/**
 * Build a CSV from rows + columns and trigger a browser download.
 * Call only from client event handlers (uses the DOM).
 */
export function exportCsv<T>(
  filename: string,
  columns: CsvColumn<T>[],
  rows: T[]
) {
  if (typeof document === "undefined") return;

  const header = columns.map((c) => escapeCell(c.header)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCell(row[c.key])).join(","))
    .join("\r\n");
  const csv = `${header}\r\n${body}`;
  triggerDownload(filename, csv);
}
