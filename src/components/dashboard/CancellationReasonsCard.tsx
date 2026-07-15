import ChartCard from "./ChartCard";
import type { CancellationReason } from "../../types/dashboard";
import { useTranslation } from "react-i18next";

export default function CancellationReasonsCard({ items }: { items: CancellationReason[] }) {
  const { t } = useTranslation();
  return (
    <ChartCard title={t("dashboard.charts.cancellationReasons")}>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="grid grid-cols-[45px_1fr_155px] items-center gap-3 text-xs">
            <span className="text-gray-500">{item.value}%</span>
            <div className="h-2 overflow-hidden rounded-full bg-[#eee]">
              <div className="h-full rounded-full bg-[#75262d]" style={{ width: `${item.value}%` }} />
            </div>
            <span className="text-start font-medium text-[#564b4b]">{item.label}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
