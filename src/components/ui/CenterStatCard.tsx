export default function CenterStatCard({ icon, iconBg, iconColor, title, value, size = "md" }) {
  const isLarge = size === "lg";

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-[#f2e8e8] bg-white text-center shadow-sm ${
        isLarge ? "py-10" : "py-9"
      }`}
    >
      <div
        className={`mb-4 flex items-center justify-center rounded-full ${isLarge ? "h-14 w-14" : "h-12 w-12"}`}
        style={{ backgroundColor: iconBg }}
      >
        <span style={{ color: iconColor }}>{icon}</span>
      </div>

      <p className="text-sm font-semibold text-gray-500">{title}</p>
      <h3 className={`mt-2 font-extrabold text-[#221b1b] ${isLarge ? "text-3xl" : "text-2xl"}`}>{value}</h3>
    </div>
  );
}
