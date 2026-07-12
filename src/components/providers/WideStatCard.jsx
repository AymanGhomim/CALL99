export default function WideStatCard({ icon, iconBg, iconColor, title, value }) {
  return (
    <div className="flex min-h-[142px] items-center justify-between rounded-xl border border-[#f2e8e8] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="text-right">
        <p className="text-sm font-semibold text-[#3d3434]">{title}</p>
        <h3 className="mt-1 text-2xl font-extrabold text-[#75262d]">{value}</h3>
      </div>

      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
    </div>
  );
}
