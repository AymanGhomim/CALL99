import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatsGrid from "../../components/dashboard/StatsGrid";
import DashboardChartsSection from "../../components/dashboard/DashboardChartsSection";
import LatestOrdersTable from "../../components/dashboard/LatestOrdersTable";
import DashboardBottomSection from "../../components/dashboard/DashboardBottomSection";
import {
  cancellationReasons,
  colors,
  customersGrowthData,
  dashboardStats,
  latestOrders,
  providerAcceptanceData,
  recentActivities,
  revenueData,
  serviceOrdersData,
  statusData,
} from "../../data/dashboard.data";

export default function Dashboard() {
  return (
    <section>
      <DashboardHeader />

      <StatsGrid stats={dashboardStats} />

      <DashboardChartsSection
        colors={colors}
        revenueData={revenueData}
        serviceOrdersData={serviceOrdersData}
        statusData={statusData}
        cancellationReasons={cancellationReasons}
        providerAcceptanceData={providerAcceptanceData}
        customersGrowthData={customersGrowthData}
      />

      <div className="mt-7">
        <LatestOrdersTable rows={latestOrders} />
      </div>

      <DashboardBottomSection activities={recentActivities} />
    </section>
  );
}
