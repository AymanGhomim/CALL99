import BarChartCard from "../charts/BarChartCard";
import DonutChartCard from "../charts/DonutChartCard";
import LineChartCard from "../charts/LineChartCard";
import CancellationReasonsCard from "./CancellationReasonsCard";
import StatusDistributionCard from "./StatusDistributionCard";
import type { CancellationReason, ChartDataPoint, ColoredChartDataPoint, DashboardColors } from "../../types/dashboard";
import { useTranslation } from "react-i18next";

interface DashboardChartsSectionProps {
  colors: DashboardColors;
  revenueData: ChartDataPoint[];
  serviceOrdersData: ColoredChartDataPoint[];
  statusData: ColoredChartDataPoint[];
  cancellationReasons: CancellationReason[];
  providerAcceptanceData: ChartDataPoint[];
  customersGrowthData: ChartDataPoint[];
}

export default function DashboardChartsSection({
  colors,
  revenueData,
  serviceOrdersData,
  statusData,
  cancellationReasons,
  providerAcceptanceData,
  customersGrowthData,
}: DashboardChartsSectionProps) {
  const { t } = useTranslation();
  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <BarChartCard
          title={t("dashboard.charts.revenueByService")}
          data={revenueData}
          barColor={colors.primary}
        />

        <DonutChartCard
          title={t("dashboard.charts.ordersByService")}
          centerLabel={t("dashboard.charts.totalOrders")}
          data={serviceOrdersData}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <StatusDistributionCard data={statusData} />
        <CancellationReasonsCard items={cancellationReasons} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <LineChartCard
          title={t("dashboard.charts.providerAcceptance")}
          data={providerAcceptanceData}
          lineColor={colors.primary}
        />

        <LineChartCard
          title={t("dashboard.charts.customerGrowth")}
          data={customersGrowthData}
          lineColor={colors.primary}
        />
      </div>
    </>
  );
}
