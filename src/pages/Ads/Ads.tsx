import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AdsHeader from "../../components/ads/AdsHeader";
import AdsStats from "../../components/ads/AdsStats";
import AdsFiltersBar from "../../components/ads/AdsFiltersBar";
import AdsTable from "../../components/ads/AdsTable";
import AdDialog, { AD_DIALOG_MODES } from "../../components/dialogs/AdDialog";
import type { AdDialogMode, AdPayload, AdRecord } from "../../components/dialogs/AdDialog/constants";
import { adsStats as statsTemplate } from "../../data/ads.data";
import {
  createAdvertisement,
  getAdvertisement,
  getAdvertisements,
  getAdvertisementStats,
  updateAdvertisement,
  type AdvertisementPayload,
} from "../../services/advertisements.service";
import { getCoupons } from "../../services/coupons.service";
import type { Advertisement, ProviderService } from "../../types/adminApi";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import { getErrorMessage } from "../../utils/error";

const PAGE_SIZE = 10;
const SERVICE_LABELS: Record<ProviderService, string> = { car_wash: "غسيل", car_rental: "تاجير سيارات", maintenance_repair: "صيانه سريعه", towing: "سحب" };
const LABEL_TO_SERVICE = Object.fromEntries(Object.entries(SERVICE_LABELS).map(([key, value]) => [value, key])) as Record<string, ProviderService>;
const STATUS_MAP: Record<string, "active" | "scheduled" | "inactive"> = { نشط: "active", مجدولة: "scheduled", "غير نشط": "inactive" };
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

function toInputDate(value: string): string {
  return value.slice(0, 10);
}

function getStatus(ad: Advertisement): string {
  if (!ad.isActive) return "غير نشط";
  const now = Date.now();
  if (new Date(ad.startAt).getTime() > now) return "مجدولة";
  if (new Date(ad.endAt).getTime() < now) return "غير نشط";
  return "نشط";
}

function toRecord(ad: Advertisement, couponById: ReadonlyMap<string, string>): AdRecord {
  return {
    id: ad.id,
    name: ad.name,
    description: ad.description ?? "",
    service: SERVICE_LABELS[ad.targetCategories[0] ?? "car_wash"],
    startDate: toInputDate(ad.startAt),
    endDate: toInputDate(ad.endAt),
    status: getStatus(ad),
    couponCode: ad.couponId ? couponById.get(ad.couponId) ?? "" : "",
    imageUrl: `${apiBaseUrl}/files/public/${ad.bannerFileId}`,
    imageName: "banner",
    imageFile: null,
  };
}

export default function Ads() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [dialogState, setDialogState] = useState<{ open: boolean; mode: AdDialogMode; ad: AdRecord | null }>({ open: false, mode: AD_DIALOG_MODES.VIEW, ad: null });

  useEffect(() => setPage(1), [debouncedSearch, status]);

  const listQuery = useQuery({
    queryKey: ["advertisements", page, debouncedSearch, status],
    queryFn: ({ signal }) => getAdvertisements({ page, limit: PAGE_SIZE, search: debouncedSearch.trim() || undefined, status: STATUS_MAP[status] }, signal),
    placeholderData: (previousData) => previousData,
  });
  const statsQuery = useQuery({ queryKey: ["advertisement-stats"], queryFn: ({ signal }) => getAdvertisementStats(signal) });
  const couponsQuery = useQuery({ queryKey: ["coupon-options"], queryFn: ({ signal }) => getCoupons({ page: 1, limit: 100, status: "active" }, signal) });

  const couponById = useMemo(() => new Map((couponsQuery.data?.items ?? []).map((coupon) => [coupon.id, coupon.code])), [couponsQuery.data?.items]);
  const couponIdByCode = useMemo(() => new Map((couponsQuery.data?.items ?? []).map((coupon) => [coupon.code.toUpperCase(), coupon.id])), [couponsQuery.data?.items]);
  const selectedAdId = dialogState.ad ? String(dialogState.ad.id) : "";
  const detailQuery = useQuery({
    queryKey: ["advertisement", selectedAdId],
    queryFn: ({ signal }) => getAdvertisement(selectedAdId, signal),
    enabled: dialogState.open && dialogState.mode !== AD_DIALOG_MODES.CREATE && Boolean(selectedAdId),
  });
  const closeDialog = () => setDialogState((current) => ({ ...current, open: false }));
  const openDialog = (mode: AdDialogMode, ad: AdRecord | null = null) => setDialogState({ open: true, mode, ad });

  const rows = useMemo(() => (listQuery.data?.items ?? []).map((ad) => toRecord(ad, couponById)), [couponById, listQuery.data?.items]);
  const selectedAd = detailQuery.data ? toRecord(detailQuery.data, couponById) : dialogState.ad;

  const invalidate = async () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ["advertisements"] }),
    queryClient.invalidateQueries({ queryKey: ["advertisement-stats"] }),
    queryClient.invalidateQueries({ queryKey: ["advertisement"] }),
  ]);

  const createMutation = useMutation({ mutationFn: createAdvertisement, onSuccess: async () => { await invalidate(); toast.success("تم إنشاء الاعلان بنجاح"); } });
  const updateMutation = useMutation({ mutationFn: ({ id, payload }: { id: string; payload: Partial<AdvertisementPayload> }) => updateAdvertisement(id, payload), onSuccess: async () => { await invalidate(); toast.success("تم حفظ تعديلات الاعلان"); } });

  const toPayload = (payload: AdPayload): AdvertisementPayload => ({
    name: payload.name,
    description: payload.description,
    startAt: new Date(`${payload.startDate}T00:00:00.000Z`).toISOString(),
    endAt: new Date(`${payload.endDate}T23:59:59.999Z`).toISOString(),
    isActive: payload.isActive,
    targetCategories: [LABEL_TO_SERVICE[payload.service] ?? "car_wash"],
    couponId: payload.couponCode ? couponIdByCode.get(payload.couponCode.toUpperCase()) ?? null : null,
    bannerFile: payload.imageFile ?? undefined,
  });

  const handleCreate = async (payload: AdPayload) => {
    try { await createMutation.mutateAsync(toPayload(payload)); }
    catch (error) { throw new Error(getErrorMessage(error, "تعذر إنشاء الإعلان")); }
  };
  const handleSave = async (payload: AdPayload & { id?: string | number }) => {
    if (!payload.id) return;
    try { await updateMutation.mutateAsync({ id: String(payload.id), payload: toPayload(payload) }); }
    catch (error) { throw new Error(getErrorMessage(error, "تعذر تعديل الإعلان")); }
  };
  const handleToggleStatus = (row: AdRecord) => {
    updateMutation.mutate(
      { id: String(row.id), payload: { isActive: row.status !== "نشط" } },
      { onError: (error) => toast.error(getErrorMessage(error, "تعذر تغيير حالة الإعلان")) },
    );
  };

  const backendStats = statsQuery.data;
  const stats = statsTemplate.map((card) => {
    const values: Record<string, number | string> = {
      "إجمالي الاعلانات": backendStats?.totalAds.count ?? "—",
      "الاعلانات النشطه": backendStats?.activeAds.displayableCount ?? "—",
      "الاعلانات المجدوله": backendStats?.scheduledAds.count ?? "—",
      "الاعلانات غير النشطه": backendStats?.inactiveAds.count ?? "—",
    };
    return {
      ...card,
      value: values[card.title] ?? card.value,
      change: card.title === "الاعلانات النشطه" && backendStats
        ? `تشكل ${backendStats.activeAds.percentage}% من الإجمالي`
        : "",
    };
  });
  const pagination = listQuery.data?.pagination;
  const totalPages = Math.max(1, Math.ceil((pagination?.total ?? 0) / (pagination?.limit ?? PAGE_SIZE)));

  return (
    <section>
      <AdsHeader onAddAd={() => openDialog(AD_DIALOG_MODES.CREATE)} />
      <AdsStats stats={stats} />
      <AdsFiltersBar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} statusOptions={Object.keys(STATUS_MAP)} onFilter={() => setPage(1)} />
      <AdsTable rows={rows} totalCount={pagination?.total ?? 0} currentPage={pagination?.page ?? page} totalPages={totalPages} loading={listQuery.isLoading} emptyMessage={listQuery.isError ? getErrorMessage(listQuery.error, "تعذر تحميل الإعلانات") : undefined} onPageChange={setPage} onView={(row) => openDialog(AD_DIALOG_MODES.VIEW, row)} onEdit={(row) => openDialog(AD_DIALOG_MODES.EDIT, row)} onToggleStatus={handleToggleStatus} />
      <AdDialog open={dialogState.open} mode={dialogState.mode} ad={selectedAd} serviceOptions={Object.values(SERVICE_LABELS)} couponCodes={[...couponIdByCode.keys()]} onClose={closeDialog} onCreate={handleCreate} onSave={handleSave} />
    </section>
  );
}
