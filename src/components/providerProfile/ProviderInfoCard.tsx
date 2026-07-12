import { Calendar, Star } from "lucide-react";
import Badge from "../ui/Badge";

export default function ProviderInfoCard({
  name,
  status,
  memberSince,
  rating,
  reviewsCount,
  basicInfo,
}) {
  return (
    <div className="mb-6 rounded-xl border border-[#f2e8e8] bg-white p-8 shadow-sm">
      {/* Top row: Identity + Basic Info */}
      <div className="flex items-start justify-between gap-8 max-[900px]:flex-col-reverse">
        {/* Right side: Identity block (renders on right in RTL) */}
        <div className="flex shrink-0 items-start gap-4">
          <div className="text-right">
            <Badge tone="purple" className="mb-2">
              {status}
            </Badge>
            <h2 className="text-xl font-extrabold text-[#221b1b]">{name}</h2>
            <p className="mt-1 flex items-center justify-end gap-2 text-sm text-gray-500">
              {memberSince}
              <Calendar size={14} className="text-gray-400" />
            </p>
            <p className="mt-1 flex items-center justify-end gap-1.5 text-sm">
              <span className="font-bold text-[#221b1b]">
                ({reviewsCount} تقييم)
              </span>
              <span className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    size={13}
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ))}
              </span>
              <span className="font-extrabold text-[#221b1b]">{rating}</span>
            </p>
          </div>

          <div className="h-16 w-16 shrink-0 rounded-full bg-[#221b1b]" />
        </div>

        {/* Left side: Basic info definition list (renders on left in RTL) */}
        <div className="flex-1">
          <h3 className="mb-5 text-right text-lg font-extrabold text-[#221b1b]">
            المعلومات الأساسية
          </h3>

          <div className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
            {basicInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-[#f2e8e8] pb-3"
              >
                <span className="text-left text-gray-500">{item.value}</span>
                <span className="font-semibold text-[#221b1b]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
