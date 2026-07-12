const gradients = [
  "linear-gradient(135deg,#2b2440,#0f1020)",
  "linear-gradient(135deg,#1e293b,#0f172a)",
  "linear-gradient(135deg,#3b2f2f,#141010)",
  "linear-gradient(135deg,#2a1f3d,#12101c)",
  "linear-gradient(135deg,#1f2937,#0b0f16)",
  "linear-gradient(135deg,#33261f,#120d0a)",
  "linear-gradient(135deg,#211a35,#0d0a17)",
  "linear-gradient(135deg,#251d1d,#0e0a0a)",
];

export default function ProviderGalleryCard({ count = 12 }) {
  return (
    <div className="rounded-xl border border-[#f2e8e8] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-[#221b1b]">معرض الصور</h3>
        <span className="text-xs font-semibold text-gray-400">
          عدد الصور: {count} صورة
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {gradients.map((gradient, index) => (
          <div
            key={index}
            className="aspect-square rounded-lg"
            style={{ background: gradient }}
          />
        ))}
      </div>
    </div>
  );
}
