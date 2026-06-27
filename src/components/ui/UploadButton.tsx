"use client";

import { useRef, type ComponentProps } from "react";
import { Upload } from "lucide-react";
import Button from "@/components/ui/Button";
import { csvToObjects } from "@/lib/importCsv";

type Variant = ComponentProps<typeof Button>["variant"];

/**
 * A button that opens a file picker, parses the chosen CSV, maps each row to a
 * record via `build`, and hands the results to `onImport`. Rows whose `build`
 * returns null are skipped (e.g. missing required fields).
 */
export default function UploadButton<T>({
  label = "Upload CSV",
  build,
  onImport,
  variant = "outline",
}: {
  label?: string;
  build: (row: Record<string, string>) => T | null;
  onImport: (records: T[]) => void;
  variant?: Variant;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const records = csvToObjects(String(reader.result ?? ""))
        .map(build)
        .filter((r): r is T => r !== null);
      if (records.length > 0) onImport(records);
    };
    reader.readAsText(file);
    e.target.value = ""; // allow re-uploading the same file
  }

  return (
    <>
      <Button
        variant={variant}
        size="sm"
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={16} /> {label}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFile}
      />
    </>
  );
}
