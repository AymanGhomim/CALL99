import DonutChartCard from "../charts/DonutChartCard";
import LineChartCard from "../charts/LineChartCard";

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
  return (
    <div className="mb-7 grid grid-cols-1 gap-5 xl:grid-cols-2">
      <DonutChartCard
        title="توزيع الكوبونات حسب نوع الخصم"
        data={distribution}
        centerLabel="كوبون"
        innerRadius={55}
        outerRadius={78}
        legendClassName="grid grid-cols-1 gap-3 text-sm text-[#3d3434]"
      />
      <LineChartCard title="الاستخدام عبر الوقت" data={usage} lineColor="#75262d" />
    </div>
  );
}
