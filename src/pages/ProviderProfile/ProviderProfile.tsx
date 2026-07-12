import { useMemo, useState } from "react";
import UserProfileTopBar from "../../components/userProfile/UserProfileTopBar";
import UserOrdersFiltersBar from "../../components/userProfile/UserOrdersFiltersBar";
import BlockUserButton from "../../components/userProfile/BlockUserButton";
import BarChartCard from "../../components/charts/BarChartCard";
import ProviderInfoCard from "../../components/providerProfile/ProviderInfoCard";
import ProviderQuickInfoRow from "../../components/providerProfile/ProviderQuickInfoRow";
import ProviderDetailsGrid from "../../components/providerProfile/ProviderDetailsGrid";
import ProviderOrdersStats from "../../components/providerProfile/ProviderOrdersStats";
import ProviderOrdersTable from "../../components/providerProfile/ProviderOrdersTable";
import ProviderFinancialSummary from "../../components/providerProfile/ProviderFinancialSummary";
import ProviderReviewsCard from "../../components/providerProfile/ProviderReviewsCard";
import {
  getProviderOrders,
  getProviderProfile,
  providerMonthlyActivity,
  providerOrderStatusOptions,
} from "../../data/providerProfile.data";
import { colors } from "../../constants/colors";

export default function ProviderProfile() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const provider = useMemo(() => getProviderProfile(), []);
  const orders = useMemo(
    () => getProviderOrders(["أحمد محمد علي", "سارة أحمد حسن", "عمر خالد إبراهيم", "نورهان مصطفى"]),
    []
  );

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = !search || order.orderNo.includes(search) || order.customer.includes(search);
      const matchesStatus = !statusFilter || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <section>
      <UserProfileTopBar title="ملف مقدم الخدمه" subtitle="عرض وإدارة معلومات مقدم الخدمة" />

      <ProviderInfoCard
        name={provider.name}
        status={provider.status}
        memberSince={provider.memberSince}
        rating={provider.rating}
        reviewsCount={provider.reviewsCount}
        basicInfo={provider.basicInfo}
      />

      <ProviderQuickInfoRow
        mainService={provider.mainService}
        commercialRegisterNo={provider.commercialRegisterNo}
        providerType={provider.providerType}
      />

      <ProviderDetailsGrid
        galleryCount={provider.galleryCount}
        documents={provider.documents}
        services={provider.services}
        currentPackage={provider.currentPackage}
      />

      <ProviderOrdersStats
        cancelledOrders={provider.stats.cancelledOrders}
        completedOrders={provider.stats.completedOrders}
        totalOrders={provider.stats.totalOrders}
        scheduledOrders={provider.stats.scheduledOrders}
        activeOrders={provider.stats.activeOrders}
      />

      <div className="mb-6">
        <BarChartCard title="النشاط الشهري" data={providerMonthlyActivity} barColor={colors.primary} />
      </div>

      <UserOrdersFiltersBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={providerOrderStatusOptions}
        onFilter={() => {}}
      />

      <div className="mb-6">
        <ProviderOrdersTable rows={filteredOrders} totalCount={2482} currentPage={1} totalPages={3} />
      </div>

      <ProviderFinancialSummary
        totalRevenue={provider.financialSummary.totalRevenue}
        totalOrders={provider.financialSummary.totalOrders}
        commissions={provider.financialSummary.commissions}
        netProfit={provider.financialSummary.netProfit}
        onViewReport={() => {}}
      />

      <ProviderReviewsCard reviews={provider.reviews} onViewAll={() => {}} />

      <BlockUserButton label="حظر مقدم الخدمة" onClick={() => {}} />
    </section>
  );
}
