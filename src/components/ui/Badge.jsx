const toneClasses = {
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-rose-50 text-rose-500",
  info: "bg-blue-50 text-blue-600",
  sky: "bg-sky-50 text-sky-600",
  purple: "bg-violet-50 text-violet-600",
  neutral: "bg-gray-100 text-gray-500",
};

const sizeClasses = {
  sm: "px-2.5 py-0.5 text-[11px]",
  md: "px-3 py-1 text-xs",
};

/**
 * Small rounded status pill. Pass a `tone` (success | warning | danger | info | sky | purple | neutral)
 * instead of hardcoding Tailwind classes per page.
 */
export default function Badge({ tone = "neutral", size = "md", children, className = "" }) {
  return (
    <span
      className={`inline-block rounded-full font-bold ${sizeClasses[size] ?? sizeClasses.md} ${
        toneClasses[tone] ?? toneClasses.neutral
      } ${className}`}
    >
      {children}
    </span>
  );
}
