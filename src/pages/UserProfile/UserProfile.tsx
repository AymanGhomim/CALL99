import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import UserProfileTopBar from "../../components/userProfile/UserProfileTopBar";
import UserProfileCard from "../../components/userProfile/UserProfileCard";
import UserOrdersStats from "../../components/userProfile/UserOrdersStats";
import UserOrdersChartsSection from "../../components/userProfile/UserOrdersChartsSection";
import UserOrdersFiltersBar from "../../components/userProfile/UserOrdersFiltersBar";
import UserOrdersTable from "../../components/userProfile/UserOrdersTable";
import UserFinancialSummary from "../../components/userProfile/UserFinancialSummary";
import BlockUserButton from "../../components/userProfile/BlockUserButton";
import { usersList } from "../../data/users.data";
import {
  getUserOrders,
  getUserProfileExtras,
  monthlyActivityData,
  orderStatusData,
  orderStatusOptions,
} from "../../data/userProfile.data";
import { colors } from "../../constants/colors";

export default function UserProfile() {
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const user = useMemo(
    () => usersList.find((item) => String(item.id) === String(id)) ?? usersList[0],
    [id]
  );

  const extras = useMemo(() => getUserProfileExtras(), []);
  const orders = useMemo(() => getUserOrders(user.name), [user.name]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        !search || order.orderNo.includes(search) || order.provider.includes(search);
      const matchesStatus = !statusFilter || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <section>
      <UserProfileTopBar />

      <UserProfileCard
        name={user.name}
        phone={extras.phone}
        memberSince={extras.memberSince}
        status={extras.status}
      />

      <UserOrdersStats
        totalOrders={extras.totalOrders}
        cancelledOrders={extras.cancelledOrders}
        scheduledOrders={extras.scheduledOrders}
        completedOrders={extras.completedOrders}
      />

      <UserOrdersChartsSection
        statusData={orderStatusData}
        activityData={monthlyActivityData}
        barColor={colors.primary}
      />

      <UserOrdersFiltersBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={orderStatusOptions}
        onFilter={() => {}}
      />

      <div className="mb-6">
        <UserOrdersTable rows={filteredOrders} totalCount={2482} currentPage={1} totalPages={3} />
      </div>

      <UserFinancialSummary
        totalExpenses={extras.financialSummary.totalExpenses}
        totalOrders={extras.financialSummary.totalOrders}
        commissions={extras.financialSummary.commissions}
        onViewReport={() => {}}
      />

      <BlockUserButton onClick={() => {}} />
    </section>
  );
}
