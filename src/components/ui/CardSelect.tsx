import { ChevronDown } from "lucide-react";

// Presentational range/period selector for card headers (e.g. "6 Months").
export default function CardSelect({
  options,
  defaultValue,
  value,
  onChange,
}: {
  options: string[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        {...(value !== undefined
          ? { value, onChange: (e) => onChange?.(e.target.value) }
          : { defaultValue: defaultValue ?? options[0] })}
        className="appearance-none rounded-lg border border-line bg-canvas text-fg-soft text-xs font-medium pl-3 pr-7 py-1.5 outline-none hover:border-line-strong focus:border-bronze transition cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
