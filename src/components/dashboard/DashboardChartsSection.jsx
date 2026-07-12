import BarChartCard from "../charts/BarChartCard";
import DonutChartCard from "../charts/DonutChartCard";
import LineChartCard from "../charts/LineChartCard";
import CancellationReasonsCard from "./CancellationReasonsCard";
import StatusDistributionCard from "./StatusDistributionCard";

export default function DashboardChartsSection({
  colors,
  revenueData,
  serviceOrdersData,
  statusData,
  cancellationReasons,
  providerAcceptanceData,
  customersGrowthData,
}) {
  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <BarChartCard
          title="الإيرادات حسب نوع الخدمة"
          data={revenueData}
          barColor={colors.primary}
        />

        <DonutChartCard
          title="الطلبات حسب نوع الخدمة"
          data={serviceOrdersData}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <StatusDistributionCard data={statusData} />
        <CancellationReasonsCard items={cancellationReasons} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <LineChartCard
          title="معدل قبول مقدمي الخدمة"
          data={providerAcceptanceData}
          lineColor={colors.primary}
        />

        <LineChartCard
          title="نمو العملاء الجدد مع الوقت"
          data={customersGrowthData}
          lineColor={colors.primary}
        />
      </div>
    </>
  );
}
