import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import CouponDialog, { type CouponDialogMode } from "../../components/coupons/CouponDialog";
import CouponsCharts from "../../components/coupons/CouponsCharts";
import CouponsHeader from "../../components/coupons/CouponsHeader";
import CouponsTable, { type Coupon } from "../../components/coupons/CouponsTable";
import StatsGrid from "../../components/dashboard/StatsGrid";
import FiltersBar from "../../components/ui/FiltersBar";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { couponsStats as statsTemplate } from "../../data/coupons.data";
import { getCoupon, getCoupons, getCouponStats, updateCoupon, type CouponPayload } from "../../services/coupons.service";
import type { ProviderService } from "../../types/adminApi";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import { getErrorMessage } from "../../utils/error";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

const PAGE_SIZE = 10;
const SERVICE_LABELS: Record<ProviderService, string> = { car_wash: "غسيل السيارات", car_rental: "تأجير السيارات", maintenance_repair: "صيانة سريعة", towing: "سطحة" };
const LABEL_TO_SERVICE = Object.fromEntries(Object.entries(SERVICE_LABELS).map(([key, value]) => [value, key])) as Record<string, ProviderService>;
const STATUS_MAP: Record<string, "active" | "inactive"> = { نشط: "active", "غير نشط": "inactive" };
const DISCOUNT_MAP: Record<string, "percentage" | "fixed"> = { "نسبة مئوية": "percentage", "مبلغ ثابت": "fixed" };

function numberFromLabel(value: string): number {
  return Number.parseFloat(value.replace(/[^\d.]/g, "")) || 0;
}

function toIso(date: string, endOfDay = false): string {
  return new Date(`${date.replaceAll("/", "-")}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`).toISOString();
}

function toRecord(coupon: Awaited<ReturnType<typeof getCoupon>>, formatCurrency: (value: number) => string): Coupon {
  return {
    id: coupon.id,
    code: coupon.code,
    description: coupon.description,
    discountType: coupon.discountType === "percentage" ? "نسبة مئوية" : "مبلغ ثابت",
    discountValue: coupon.discountType === "percentage" ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue),
    services: coupon.applicableCategories.length === 4 ? "جميع الخدمات" : coupon.applicableCategories.map((service) => SERVICE_LABELS[service]).join("، "),
    maxDiscount: coupon.maxDiscountAmount === null ? "" : formatCurrency(coupon.maxDiscountAmount),
    minOrder: formatCurrency(coupon.minimumOrderAmount),
    usageLimit: coupon.maxUsagePerUser,
    maxTotalUsage: coupon.maxTotalUsage,
    totalUsage: coupon.totalReservedUsages + coupon.totalRedeemedUsages,
    startDate: coupon.startAt.slice(0, 10),
    endDate: coupon.endAt.slice(0, 10),
    status: coupon.isActive ? "نشط" : "غير نشط",
  };
}

export default function Coupons() {
  const { t } = useTranslation();
  const { formatCurrency } = useLocale();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [couponPendingDelete, setCouponPendingDelete] = useState<Coupon | null>(null);
  const [dialog, setDialog] = useState<{ open: boolean; mode: CouponDialogMode; coupon: Coupon | null }>({ open: false, mode: "create", coupon: null });
  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => setPage(1), [debouncedSearch, discountType, status]);

  const listQuery = useQuery({
    queryKey: ["coupons", page, debouncedSearch, status, discountType],
    queryFn: ({ signal }) => getCoupons({ page, limit: PAGE_SIZE, search: debouncedSearch.trim() || undefined, status: STATUS_MAP[status], discountType: DISCOUNT_MAP[discountType] }, signal),
    placeholderData: (previousData) => previousData,
  });
  const statsQuery = useQuery({ queryKey: ["coupon-stats"], queryFn: ({ signal }) => getCouponStats(signal) });
  const selectedCouponId = dialog.coupon ? String(dialog.coupon.id) : "";
  const detailQuery = useQuery({
    queryKey: ["coupon", selectedCouponId],
    queryFn: ({ signal }) => getCoupon(selectedCouponId, signal),
    enabled: dialog.open && dialog.mode !== "create" && Boolean(selectedCouponId),
  });

  const rows = useMemo(() => (listQuery.data?.items ?? []).map((item) => toRecord(item, formatCurrency)), [listQuery.data?.items, formatCurrency]);
  const selectedCoupon = detailQuery.data ? toRecord(detailQuery.data, formatCurrency) : dialog.coupon;

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CouponPayload }) => updateCoupon(id, payload),
    onSuccess: async () => {
      await Promise.all([queryClient.invalidateQueries({ queryKey: ["coupons"] }), queryClient.invalidateQueries({ queryKey: ["coupon-stats"] }), queryClient.invalidateQueries({ queryKey: ["coupon"] })]);
      toast.success(t("coupon.updateSuccess"));
    },
  });

  const openDialog = (mode: CouponDialogMode, coupon: Coupon | null = null) => setDialog({ open: true, mode, coupon });
  const closeDialog = () => setDialog((current) => ({ ...current, open: false }));

  const submitCoupon = async (coupon: Coupon) => {
    if (dialog.mode === "create") {
      throw new Error(t("coupon.createUnavailable"));
    }

    const selectedLabels = coupon.services === "جميع الخدمات" ? Object.values(SERVICE_LABELS) : coupon.services.split("، ");
    const payload: CouponPayload = {
      code: coupon.code,
      description: coupon.description,
      startAt: toIso(coupon.startDate),
      endAt: toIso(coupon.endDate, true),
      discountType: DISCOUNT_MAP[coupon.discountType] ?? "percentage",
      discountValue: numberFromLabel(coupon.discountValue),
      ...(coupon.discountType === "نسبة مئوية" && numberFromLabel(coupon.maxDiscount) > 0 ? { maxDiscountAmount: numberFromLabel(coupon.maxDiscount) } : {}),
      minimumOrderAmount: numberFromLabel(coupon.minOrder),
      maxUsagePerUser: coupon.usageLimit,
      maxTotalUsage: coupon.maxTotalUsage,
      isActive: coupon.status === "نشط",
      applicableCategories: selectedLabels.map((label) => LABEL_TO_SERVICE[label]).filter((value): value is ProviderService => Boolean(value)),
    };

    try {
      await updateMutation.mutateAsync({ id: String(coupon.id), payload });
      closeDialog();
    } catch (error) {
      throw new Error(getErrorMessage(error, t("coupon.saveError")));
    }
  };

  const statsData = statsQuery.data;
  const stats = statsTemplate.map((card) => {
    const values: Record<string, number | string> = {
      "إجمالي عدد الكوبونات": statsData?.totalCoupons.value ?? "—",
      "إجمالي مرات الاستخدام": statsData?.totalUsageCount.value ?? "—",
      "الكوبونات النشطة": statsData?.activeCoupons.value ?? "—",
    };
    const deltaByTitle: Record<string, number | undefined> = {
      "إجمالي عدد الكوبونات": statsData?.totalCoupons.delta,
      "إجمالي مرات الاستخدام": statsData?.totalUsageCount.delta,
      "الكوبونات النشطة": statsData?.activeCoupons.delta,
    };
    const delta = deltaByTitle[card.title];
    return {
      ...card,
      value: values[card.title] ?? card.value,
      change: delta === undefined ? "" : t("coupon.vsPreviousMonth", { value: `${delta >= 0 ? "+" : ""}${delta}` }),
      changeType: delta === undefined || delta === 0 ? "neutral" : delta > 0 ? "up" : "down",
    };
  });
  const distribution = useMemo(() => {
    const percentage = listQuery.data?.items.filter((coupon) => coupon.discountType === "percentage").length ?? 0;
    const fixed = listQuery.data?.items.filter((coupon) => coupon.discountType === "fixed").length ?? 0;
    return [{ name: `${t("values.percentage")} (${percentage})`, value: percentage, color: "#75262d" }, { name: `${t("values.fixedAmount")} (${fixed})`, value: fixed, color: "#f8d58e" }];
  }, [listQuery.data?.items, t]);
  const usage: Array<{ name: string; value: number }> = [];
  const pagination = listQuery.data?.pagination;
  const totalPages = Math.max(1, Math.ceil((pagination?.total ?? 0) / (pagination?.limit ?? PAGE_SIZE)));

  return (
    <section>
      <CouponsHeader onAdd={() => openDialog("create")} />
      <div className="mb-7"><StatsGrid stats={stats} /></div>
      <CouponsCharts distribution={distribution} usage={usage} />
      <FiltersBar search={{ value: search, onChange: setSearch, placeholder: t("filters.searchCoupon") }} fields={[
        { key: "discountType", type: "select", value: discountType, onChange: setDiscountType, placeholder: t("coupon.discountType"), options: Object.keys(DISCOUNT_MAP) },
        { key: "status", type: "select", value: status, onChange: setStatus, placeholder: t("filters.allStatuses"), options: Object.keys(STATUS_MAP) },
      ]} />
      <CouponsTable rows={rows} currentPage={pagination?.page ?? page} totalPages={totalPages} totalCount={pagination?.total ?? 0} loading={listQuery.isLoading} emptyMessage={listQuery.isError ? getErrorMessage(listQuery.error, t("coupon.loadError")) : undefined} onPageChange={setPage} onView={(coupon) => openDialog("view", coupon)} onEdit={(coupon) => openDialog("edit", coupon)} onDelete={setCouponPendingDelete} />
      <CouponDialog open={dialog.open} mode={dialog.mode} coupon={selectedCoupon} onClose={closeDialog} onSubmit={submitCoupon} onEdit={() => setDialog((current) => ({ ...current, mode: "edit" }))} />
      <ConfirmDialog open={couponPendingDelete !== null} onClose={() => setCouponPendingDelete(null)} onConfirm={() => { setCouponPendingDelete(null); toast.error(t("coupon.deleteUnavailable")); }} icon={Trash2} title={t("coupon.deleteConfirm")} description={t("coupon.deleteQuestion", { code: couponPendingDelete?.code ?? "" })} confirmLabel={t("coupon.delete")} tone="danger" />
    </section>
  );
}
