
import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string;
  status: string;
  icon: LucideIcon;
};

export default function StatsCard({
  title,
  value,
  status,
  icon: Icon,
}: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 rounded-2xl bg-[#B08D57]/10 flex items-center justify-center">
          <Icon
            size={22}
            className="text-[#B08D57]"
          />
        </div>
      </div>

      <p className="text-slate-500 text-sm mt-5">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-slate-900 mt-2">
        {value}
      </h2>

      <p className="text-[#B08D57] text-sm mt-2">
        {status}
      </p>
    </div>
  );
}