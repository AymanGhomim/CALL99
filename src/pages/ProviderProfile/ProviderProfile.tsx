import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Ban, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
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
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { getAdminProviderProfile } from "../../services/providers.service";
import { colors } from "../../constants/colors";
import { getErrorMessage } from "../../utils/error";
import type { ProviderService } from "../../types/adminApi";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

const SERVICE_KEYS: Record<ProviderService, string> = {
  car_wash: "values.carWash", car_rental: "values.carRental",
  maintenance_repair: "values.maintenance", towing: "values.towing",
};

export default function ProviderProfile() {
  const { t } = useTranslation();
  const { formatDate } = useLocale();
  const { id = "" } = useParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pendingAction, setPendingAction] = useState<"block" | "delete" | null>(null);

  const providerQuery = useQuery({
    queryKey: ["admin-provider", id],
    queryFn: ({ signal }) => getAdminProviderProfile(id, signal),
    enabled: Boolean(id),
  });

  if (providerQuery.isLoading) {
    return <section><UserProfileTopBar title={t("modules.providerProfile.title")} subtitle={t("modules.providerProfile.subtitle")} /><div className="rounded-xl border border-[#f2e8e8] bg-white p-10 text-center text-gray-400">{t("provider.loading")}</div></section>;
  }

  if (!providerQuery.data || providerQuery.isError) {
    return <section><UserProfileTopBar title={t("modules.providerProfile.title")} subtitle={t("modules.providerProfile.subtitle")} /><div className="rounded-xl border border-[#f2e8e8] bg-white p-10 text-center text-red-500">{getErrorMessage(providerQuery.error, t("provider.loadError"))}</div></section>;
  }

  const { provider, documents, subscription, wallet } = providerQuery.data;
  const name = provider.companyName ?? provider.fullName ?? provider.responsibleName ?? t("provider.unnamed");
  const memberSince = formatDate(provider.createdAt, { dateStyle: "long" });
  const mainService = provider.services[0] as ProviderService | undefined;
  const statusLabels = { approved: t("statuses.approved"), pending_review: t("statuses.underReview"), rejected: t("statuses.rejected"), incomplete: t("statuses.INCOMPLETE") } as const;
  const approvalStatusLabels = {
    pending: t("statuses.PENDING"), approved: t("statuses.approved"),
    rejected: t("statuses.rejected"), suspended: t("statuses.SUSPENDED"),
  } as const;
  const registrationSource = provider.registeredBy === "ground_team"
    ? t("provider.groundTeamRegistration")
    : t("provider.selfRegistration");
  const displayDate = (value?: string) => value ? formatDate(value) : "—";
  const emptyActivity = ["january", "february", "march", "april", "may", "june"].map((month) => ({ name: t(`dates.months.${month}`), value: 0 }));
  const plan = subscription?.plan;
  const asText = (value: string | number | null | undefined) => value == null ? "—" : String(value);

  const confirmUnsupportedAction = () => {
    setPendingAction(null);
    toast.error(t("provider.accountIdMissing"));
  };

  return (
    <section>
      <UserProfileTopBar title={t("modules.providerProfile.title")} subtitle={t("modules.providerProfile.subtitle")} />
      <ProviderInfoCard
        name={name}
        status={statusLabels[provider.status]}
        memberSince={t("provider.memberSince", { date: memberSince })}
        rating={0}
        reviewsCount={0}
        basicInfo={[
          { label: t("common.email"), value: asText(provider.email) }, { label: t("provider.city"), value: asText(provider.city) },
          { label: t("provider.address"), value: asText(provider.detailedAddress) }, { label: t("provider.vatNumber"), value: asText(provider.vatNumber) },
          { label: t("provider.identityNumber"), value: asText(provider.nationalIdOrIqama ?? provider.idNumber) }, { label: t("provider.licenseNumber"), value: asText(provider.licenseNumber) },
          { label: t("provider.companyName"), value: asText(provider.companyName) }, { label: t("provider.responsibleName"), value: asText(provider.responsibleName) },
          { label: t("provider.approvalStatus"), value: approvalStatusLabels[provider.approvalStatus] }, { label: t("provider.registrationSource"), value: registrationSource },
        ]}
      />
      <ProviderQuickInfoRow
        mainService={mainService ? t(SERVICE_KEYS[mainService]) : "—"}
        commercialRegisterNo={asText(provider.commercialRegistrationNumber)}
        providerType={t(provider.providerType === "company" ? "provider.company" : "provider.individual")}
      />
      <ProviderDetailsGrid
        galleryCount={0}
        documents={[
          { label: t("provider.commercialRegistration"), status: documents.commercialRegistration.url ? t("provider.verified") : t("provider.unavailable"), url: documents.commercialRegistration.url ?? undefined, fileName: documents.commercialRegistration.originalName ?? undefined, mimeType: documents.commercialRegistration.mimeType ?? undefined },
          { label: t("provider.nationalId"), status: documents.managerNationalId.url ? t("provider.verified") : t("provider.unavailable"), url: documents.managerNationalId.url ?? undefined, fileName: documents.managerNationalId.originalName ?? undefined, mimeType: documents.managerNationalId.mimeType ?? undefined },
        ]}
        services={provider.services.map((service) => ({ name: t(SERVICE_KEYS[service as ProviderService] ?? service), price: "—", status: t("statuses.active") }))}
        currentPackage={{
          name: plan?.name ?? t("provider.noPlan"), price: plan?.price ?? "—",
          startDate: displayDate(subscription?.startDate), endDate: displayDate(subscription?.endDate),
          status: t(subscription?.status === "active" ? "statuses.active" : "statuses.inactive"),
          description: plan?.description,
          maxImages: plan?.maxImages,
          maxVideos: plan?.maxVideos,
          maxServices: plan?.maxServices,
          maxServiceListings: plan?.maxServiceListings,
        }}
      />
      <ProviderOrdersStats cancelledOrders={0} completedOrders={0} totalOrders={0} scheduledOrders={0} activeOrders={0} />
      <div className="mb-6"><BarChartCard title={t("provider.monthlyActivity")} data={emptyActivity} barColor={colors.primary} /></div>
      <UserOrdersFiltersBar
        search={search} onSearchChange={setSearch}
        dateFrom={dateFrom} onDateFromChange={setDateFrom}
        dateTo={dateTo} onDateToChange={setDateTo}
        statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
        statusOptions={[]}
        onFilter={() => toast.error(t("provider.ordersUnavailable"))}
      />
      <div className="mb-6"><ProviderOrdersTable rows={[]} totalCount={0} currentPage={1} totalPages={1} /></div>
      <ProviderFinancialSummary totalRevenue={wallet?.balance ?? "—"} totalRevenueLabel={t("provider.walletBalance")} totalOrders={0} commissions="—" netProfit="—" />
      <ProviderReviewsCard reviews={[]} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <BlockUserButton label={t("provider.block")} onClick={() => setPendingAction("block")} />
        <button type="button" onClick={() => setPendingAction("delete")} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#f2e8e8] bg-white py-4 text-sm font-bold text-red-500 shadow-sm transition-colors hover:bg-red-50">{t("provider.delete")}<Trash2 size={17} /></button>
      </div>
      <ConfirmDialog
        open={pendingAction !== null}
        onClose={() => setPendingAction(null)}
        onConfirm={confirmUnsupportedAction}
        icon={pendingAction === "delete" ? Trash2 : Ban}
        title={t(pendingAction === "delete" ? "provider.confirmDelete" : "provider.confirmBlock")}
        description={t("provider.confirmAction", { name })}
        confirmLabel={t(pendingAction === "delete" ? "provider.delete" : "provider.block")}
        tone="danger"
      />
    </section>
  );
}
