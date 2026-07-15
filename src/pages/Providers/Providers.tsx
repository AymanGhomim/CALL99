import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ProviderRequestReviewDialog from "../../components/providers/ProviderRequestReviewDialog";
import ProvidersFiltersPanel from "../../components/providers/ProvidersFiltersPanel";
import ProvidersHeader from "../../components/providers/ProvidersHeader";
import ProvidersRequestsTable, { type ProviderRequest } from "../../components/providers/ProvidersRequestsTable";
import ProvidersStatsSection from "../../components/providers/ProvidersStatsSection";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import useLocale from "../../i18n/useLocale";
import {
  approveProviderApplication,
  getProviderApplication,
  getProviderApplications,
  getProviderApplicationStats,
  rejectProviderApplication,
} from "../../services/providers.service";
import type { ProviderApplicationDetail, ProviderApplicationStatus, ProviderService } from "../../types/adminApi";
import { getErrorMessage } from "../../utils/error";

const PAGE_SIZE = 20;
const SERVICE_LABELS: Record<ProviderService, string> = {
  car_wash: "غسيل السيارات",
  car_rental: "تأجير السيارات",
  maintenance_repair: "صيانة سريعة",
  towing: "سطحة",
};
const LABEL_TO_SERVICE = Object.fromEntries(Object.entries(SERVICE_LABELS).map(([key, value]) => [value, key])) as Record<string, ProviderService>;
const STATUS_LABELS: Record<ProviderApplicationStatus, string> = { pending_review: "قيد المراجعة", approved: "تم القبول", rejected: "مرفوض" };
const LABEL_TO_STATUS = Object.fromEntries(Object.entries(STATUS_LABELS).map(([key, value]) => [value, key])) as Record<string, ProviderApplicationStatus>;

function toIsoBoundary(date: string, endOfDay = false): string | undefined {
  return date ? new Date(`${date}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`).toISOString() : undefined;
}

function rejectionText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function optionalText(value: string | number | null | undefined): string | undefined {
  return value == null ? undefined : String(value);
}

function mapDetail(
  detail: ProviderApplicationDetail,
  applicationId: string | number,
  formatDate: (value: Date | string | number, options?: Intl.DateTimeFormatOptions) => string,
): ProviderRequest {
  const provider = detail.provider;
  const documentStatus = (state: "pending" | "approved" | "rejected") => {
    if (state === "approved") return "تم التحقق" as const;
    if (state === "rejected") return "مرفوض" as const;
    return "بانتظار التحقق" as const;
  };
  return {
    id: applicationId,
    orderNo: detail.applicationNumber,
    providerName: provider.fullName || detail.user.fullName,
    phone: detail.user.phone,
    serviceType: SERVICE_LABELS[detail.service],
    status: STATUS_LABELS[detail.status],
    date: formatDate(detail.submittedAt, { dateStyle: "medium" }),
    rejectionReason: rejectionText(detail.rejectionReason),
    providerType: provider.providerType === "company" ? "شركة" : "فرد",
    email: provider.email ?? undefined,
    city: provider.city ?? undefined,
    address: provider.detailedAddress ?? undefined,
    companyName: provider.companyName ?? undefined,
    responsibleName: provider.responsibleName ?? undefined,
    nationalId: optionalText(provider.nationalIdOrIqama ?? provider.idNumber),
    commercialRegistrationNumber: optionalText(provider.commercialRegistrationNumber),
    vatNumber: optionalText(provider.vatNumber),
    licenseNumber: optionalText(provider.licenseNumber),
    documents: [
      { id: "commercial-register", label: "السجل التجاري", fileName: detail.documents.commercialRegistration.originalName, url: detail.documents.commercialRegistration.url, mimeType: detail.documents.commercialRegistration.mimeType, status: documentStatus(detail.documents.commercialRegistration.reviewState) },
      { id: "national-id", label: "الهوية الوطنية", fileName: detail.documents.managerNationalId.originalName, url: detail.documents.managerNationalId.url, mimeType: detail.documents.managerNationalId.mimeType, status: documentStatus(detail.documents.managerNationalId.reviewState) },
    ],
  };
}

export default function Providers() {
  const { t } = useTranslation();
  const { formatDate } = useLocale();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<ProviderRequest | null>(null);
  const [search, setSearch] = useState("");
  const [providerType, setProviderType] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => setPage(1), [debouncedSearch, providerType, status, dateFrom, dateTo]);

  const statsQuery = useQuery({ queryKey: ["provider-application-stats"], queryFn: ({ signal }) => getProviderApplicationStats(signal) });
  const listQuery = useQuery({
    queryKey: ["provider-applications", page, debouncedSearch, providerType, status, dateFrom, dateTo],
    queryFn: ({ signal }) => getProviderApplications({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch.trim() || undefined,
      category: LABEL_TO_SERVICE[providerType],
      status: LABEL_TO_STATUS[status],
      from: toIsoBoundary(dateFrom),
      to: toIsoBoundary(dateTo, true),
    }, signal),
    placeholderData: (previousData) => previousData,
  });

  const selectedId = selectedRequest ? String(selectedRequest.id) : "";
  const detailQuery = useQuery({
    queryKey: ["provider-application", selectedId],
    queryFn: ({ signal }) => getProviderApplication(selectedId, signal),
    enabled: Boolean(selectedId),
  });

  const rows = useMemo<ProviderRequest[]>(() => (listQuery.data?.items ?? []).map((item) => ({
    id: item.id,
    orderNo: item.applicationNumber,
    providerName: item.fullName,
    serviceType: SERVICE_LABELS[item.service],
    phone: item.phone,
    date: formatDate(item.submittedAt, { dateStyle: "medium" }),
    status: STATUS_LABELS[item.status],
    rejectionReason: rejectionText(item.rejectionReason),
    providerType: item.providerType === "company" ? "شركة" : "فرد",
  })), [formatDate, listQuery.data?.items]);

  const reviewedRequest = detailQuery.data && selectedRequest
    ? mapDetail(detailQuery.data, selectedRequest.id, formatDate)
    : selectedRequest;
  const reviewMutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: "approve" | "reject"; reason?: string }) => action === "approve" ? approveProviderApplication(id) : rejectProviderApplication(id, reason ?? ""),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["provider-applications"] }),
        queryClient.invalidateQueries({ queryKey: ["provider-application-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["provider-application"] }),
      ]);
      setSelectedRequest(null);
      toast.success(t(variables.action === "approve" ? "provider.accepted" : "provider.rejected"));
    },
    onError: (error) => toast.error(getErrorMessage(error, t("provider.reviewUpdateError"))),
  });

  const apiStats = statsQuery.data;
  const stats = {
    total: { value: apiStats?.total.count ?? "—" },
    pendingReview: { value: apiStats?.pendingReview.count ?? "—" },
    rejected: { value: apiStats?.rejected.count ?? "—" },
    awaitingVerification: { value: apiStats?.awaitingVerification.count ?? "—" },
    approved: { value: apiStats?.approved.count ?? "—" },
  };
  const pagination = listQuery.data?.pagination;
  const totalPages = Math.max(1, Math.ceil((pagination?.total ?? 0) / (pagination?.limit ?? PAGE_SIZE)));

  return (
    <section>
      <ProvidersHeader />
      <ProvidersStatsSection stats={stats} />
      <ProvidersFiltersPanel
        search={search} onSearchChange={setSearch}
        providerType={providerType} onProviderTypeChange={setProviderType} providerTypeOptions={Object.values(SERVICE_LABELS)}
        status={status} onStatusChange={setStatus} statusOptions={Object.values(STATUS_LABELS)}
        dateFrom={dateFrom} onDateFromChange={setDateFrom} dateTo={dateTo} onDateToChange={setDateTo}
        onFilter={() => { setPage(1); toast.success(t("provider.filtersApplied")); }}
      />
      <ProvidersRequestsTable
        rows={rows}
        totalCount={pagination?.total ?? 0}
        currentPage={pagination?.page ?? page}
        totalPages={totalPages}
        pageSize={pagination?.limit ?? PAGE_SIZE}
        onPageChange={setPage}
        loading={listQuery.isLoading}
        emptyMessage={listQuery.isError ? getErrorMessage(listQuery.error, t("provider.listLoadError")) : undefined}
        onView={setSelectedRequest}
      />
      <ProviderRequestReviewDialog
        open={selectedRequest !== null}
        request={reviewedRequest}
        onClose={() => setSelectedRequest(null)}
        loading={reviewMutation.isPending || detailQuery.isLoading}
        onApprove={(request) => reviewMutation.mutate({ id: String(request.id), action: "approve" })}
        onReject={(request, reason) => reviewMutation.mutate({ id: String(request.id), action: "reject", reason })}
      />
    </section>
  );
}
