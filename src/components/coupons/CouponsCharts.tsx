import DonutChartCard from "../charts/DonutChartCard";
import LineChartCard from "../charts/LineChartCard";
import { useTranslation } from "react-i18next";

interface ChartItem {
  name: string;
  value: number;
  color?: string;
}

interface CouponsChartsProps {
  distribution: Array<ChartItem & { color: string }>;
  usage: ChartItem[];
}

export default function CouponsCharts({ distribution, usage }: CouponsChartsProps) {
  const { t } = useTranslation();
  return (
    <div className="mb-7 grid grid-cols-1 gap-5 xl:grid-cols-2">
      <DonutChartCard
        title={t("coupon.distribution")}
        data={distribution}
        centerLabel={t("coupon.item")}
        innerRadius={55}
        outerRadius={78}
        legendClassName="grid grid-cols-1 gap-3 text-sm text-[#3d3434]"
      />
      <LineChartCard title={t("coupon.usageOverTime")} data={usage} lineColor="#75262d" />
    </div>
  );
}
