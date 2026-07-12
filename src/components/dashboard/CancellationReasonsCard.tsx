import ChartCard from "./ChartCard";

export default function CancellationReasonsCard({ items }) {
  return (
    <ChartCard title="أسباب إلغاء الطلبات">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="grid grid-cols-[45px_1fr_155px] items-center gap-3 text-xs">
            <span className="text-gray-500">{item.value}%</span>
            <div className="h-2 overflow-hidden rounded-full bg-[#eee]">
              <div className="h-full rounded-full bg-[#75262d]" style={{ width: `${item.value}%` }} />
            </div>
            <span className="text-right font-medium text-[#564b4b]">{item.label}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
