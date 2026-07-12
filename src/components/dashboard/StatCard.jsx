import { cloneElement, isValidElement } from "react";

export default function StatCard({
  title,
  value,
  icon,
  iconBg = "#fbf7f7",
  iconColor = "#75262d",
  change,
  changeType = "up",
  prefix = "",
}) {
  return (
    <div className="min-h-[142px] rounded-xl border border-[#f2e8e8] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-9 flex items-start justify-between">
        {/* Icon in colored circle - top right */}
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: iconBg }}
        >
          <span style={{ color: iconColor }}>
            {isValidElement(icon) ? cloneElement(icon, { size: 24 }) : icon}
          </span>
        </div>

        {/* Change indicator - top left */}
        {change ? (
          <span
            className={`min-h-4 text-xs font-bold ${
              changeType === "down"
                ? "text-red-500"
                : changeType === "neutral"
                  ? "text-gray-400"
                  : "text-emerald-500"
            }`}
          >
            {change}
          </span>
        ) : (
          <span />
        )}
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-[#3d3434]">{title}</p>

      {/* Value with optional prefix */}
      <h3 className="mt-1 text-2xl font-extrabold text-[#75262d]">
        {prefix && <span className="text-xl font-bold">{prefix} </span>}
        {value}
      </h3>
    </div>
  );
}
