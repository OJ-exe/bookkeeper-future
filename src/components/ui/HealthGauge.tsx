export default function HealthGauge({
  score,
  label = "Good",
  size = 120,
}: {
  score: number; // 0-100
  label?: string;
  size?: number;
}) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, score));
  const offset = circ - (pct / 100) * circ;
  // Full literal class strings so Tailwind's static scanner emits them.
  const tone = pct >= 75 ? "success" : pct >= 50 ? "warning" : "danger";
  const color = { success: "text-success", warning: "text-warning", danger: "text-danger" }[tone];
  const pillBg = { success: "bg-success-soft", warning: "bg-warning-soft", danger: "bg-danger-soft" }[tone];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className="text-line"
            stroke="currentColor"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className={color}
            stroke="currentColor"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-fg">{pct}</span>
          <span className="text-xs text-muted">/100</span>
        </div>
      </div>
      <span className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${pillBg} ${color}`}>
        {label}
      </span>
    </div>
  );
}
