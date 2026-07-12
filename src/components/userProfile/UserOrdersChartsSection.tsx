import BarChartCard from "../charts/BarChartCard";
import DonutChartCard from "../charts/DonutChartCard";

export default function UserOrdersChartsSection({ statusData, activityData, barColor }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
      <DonutChartCard title="إحصائيات الطلبات" data={statusData} centerLabel="إجمالي الطلبات" />
      <BarChartCard title="النشاط الشهري" data={activityData} barColor={barColor} />
    </div>
  );
}
