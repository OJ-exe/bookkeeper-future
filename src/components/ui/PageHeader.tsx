import { ReactNode } from "react";
import { Star, Info } from "lucide-react";

export default function PageHeader({
  title,
  description,
  actions,
  showStar = true,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  showStar?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-fg">{title}</h1>
          {showStar && <Star size={18} className="text-muted hover:text-bronze cursor-pointer" />}
          <Info size={16} className="text-muted" />
        </div>
        {description && <p className="text-muted mt-1 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
