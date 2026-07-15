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
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

const statKeys = ["todayOrders", "activeOrders", "awaitingProvider", "completedToday", "canceledToday", "todayRevenue", "platformCommission", "providerDues", "pendingRefunds", "currentActiveOrders", "activeCustomers", "activeProviders", "newCustomers", "newProviders", "autoCanceled", "openDisputes"];
const revenueKeys = ["carRental", "maintenance", "towing", "carWash"];
const serviceOrderKeys = ["carWash", "mobileMaintenance", "towing", "carRental"];
const statusKeys = ["completed", "inProgress", "awaiting", "scheduled", "canceled", "autoCanceled"];
const reasonKeys = ["providerNoResponse", "customerCanceled", "paymentDelay", "noNearbyServices", "duplicate"];
const monthKeys = ["january", "february", "march", "april", "may", "june"];
const dayKeys = ["friday", "thursday", "wednesday", "tuesday", "monday", "sunday", "saturday"];

export default function Dashboard() {
  const { t } = useTranslation();
  const { formatCurrency, formatNumber } = useLocale();
  const stats = dashboardStats.map((stat, index) => ({
    ...stat,
    title: t(`dashboard.stats.${statKeys[index]}`),
    value: [5, 6, 7, 8].includes(index) ? formatCurrency(Number.parseFloat(String(stat.value).replace(/[^\d.]/g, ""))) : formatNumber(Number.parseFloat(String(stat.value).replace(/[^\d.]/g, ""))),
    change: index === 0 ? t("dashboard.vsYesterday", { value: "+12.5%" }) : stat.change,
  }));
  const localizedRevenue = revenueData.map((item, index) => ({ ...item, name: t(`dashboard.services.${revenueKeys[index]}`) }));
  const localizedServiceOrders = serviceOrdersData.map((item, index) => ({ ...item, name: t(`dashboard.services.${serviceOrderKeys[index]}`) }));
  const localizedStatuses = statusData.map((item, index) => ({ ...item, name: t(`dashboard.orderStatuses.${statusKeys[index]}`) }));
  const localizedReasons = cancellationReasons.map((item, index) => ({ ...item, label: t(`dashboard.reasons.${reasonKeys[index]}`) }));
  const localizedCustomersGrowth = customersGrowthData.map((item, index) => ({ ...item, name: t(`dates.months.${monthKeys[index]}`) }));
  const localizedProviderAcceptance = providerAcceptanceData.map((item, index) => ({ ...item, name: t(`dates.days.${dayKeys[index]}`) }));
  const localizedActivities = recentActivities.map((item, index) => ({ ...item, title: t(`dashboard.activity${index + 1}Title`), description: t(`dashboard.activity${index + 1}Description`), time: t("dashboard.fifteenMinutesAgo") }));
  return (
    <section>
      <DashboardHeader />

      <StatsGrid stats={stats} />

      <DashboardChartsSection
        colors={colors}
        revenueData={localizedRevenue}
        serviceOrdersData={localizedServiceOrders}
        statusData={localizedStatuses}
        cancellationReasons={localizedReasons}
        providerAcceptanceData={localizedProviderAcceptance}
        customersGrowthData={localizedCustomersGrowth}
      />

      <div className="mt-7">
        <LatestOrdersTable rows={latestOrders} />
      </div>

      <DashboardBottomSection activities={localizedActivities} />
    </section>
  );
}
