import { LucideIcon } from "lucide-react";

export type OnboardingItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
};

export default function OnboardingStrip({
  heading,
  subheading,
  items,
}: {
  heading: string;
  subheading?: string;
  items: OnboardingItem[];
}) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-6 shadow-[var(--shadow-sm)]">
      <h3 className="text-xl font-bold text-fg">{heading}</h3>
      {subheading && <p className="text-muted mt-1">{subheading}</p>}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.title} className="rounded-xl border border-line p-4">
              <div className="h-10 w-10 rounded-lg bg-bronze-soft flex items-center justify-center">
                <Icon size={18} className="text-bronze" />
              </div>
              <p className="font-semibold text-fg mt-3">{it.title}</p>
              <p className="text-sm text-muted mt-1">{it.description}</p>
              <button className="text-sm font-medium text-bronze mt-3">{it.cta} →</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
