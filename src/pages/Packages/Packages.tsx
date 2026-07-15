import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import PackagesHeader from "../../components/packages/PackagesHeader";
import PackagesFiltersBar from "../../components/packages/PackagesFiltersBar";
import PackagesTable from "../../components/packages/PackagesTable";
import StatsGrid from "../../components/dashboard/StatsGrid";
import PackageDialog, { PACKAGE_DIALOG_MODES } from "../../components/dialogs/PackageDialog";
import type { PackageDialogMode, PackagePayload, PackageRecord } from "../../components/dialogs/PackageDialog/constants";
import { packagesStats as statsTemplate, serviceTypeOptions, statusOptions } from "../../data/packages.data";
import {
  createSubscriptionPlan,
  getSubscriptionPlan,
  getSubscriptionPlans,
  setDefaultSubscriptionPlan,
  toggleSubscriptionPlanStatus,
  updateSubscriptionPlan,
  type SubscriptionPlanPayload,
} from "../../services/subscriptionPlans.service";
import { getErrorMessage } from "../../utils/error";

const PAGE_SIZE = 10;

function toRecord(plan: Awaited<ReturnType<typeof getSubscriptionPlans>>["items"][number]): PackageRecord {
  return {
    id: plan.id,
    code: plan.id,
    name: plan.name,
    description: plan.description,
    servicesCount: plan.maxServices,
    imagesCount: plan.maxImages,
    videosCount: plan.maxVideos,
    duration: `${plan.durationInMonths} شهر`,
    durationValue: plan.durationInMonths,
    durationUnit: "شهور",
    price: plan.price > 0 ? `${plan.price} ريال` : "مجاني",
    priceValue: plan.price,
    media: plan.maxVideos > 0 ? `${plan.maxImages} صوره + ${plan.maxVideos} فيديو` : `${plan.maxImages} صور`,
    hasBanner: plan.hasAdBanner,
    status: plan.status === "active" ? "نشط" : "غير نشط",
    isDefault: plan.isDefault,
    serviceTypes: [],
  };
}

function toPayload(payload: PackagePayload): SubscriptionPlanPayload {
  if (payload.durationUnit === "غير محدود") {
    throw new Error("الـBackend يتطلب مدة محددة للباقة بالشهور");
  }
  if (payload.servicesCount !== 1) {
    throw new Error("الـBackend يدعم خدمة واحدة فقط لكل باقة");
  }
  const durationInMonths = payload.durationUnit === "سنه" ? payload.durationValue * 12 : payload.durationValue;
  return {
    name: payload.name,
    description: payload.description,
    maxImages: payload.imagesCount,
    maxVideos: payload.videosCount,
    hasAdBanner: payload.hasBanner,
    price: payload.priceValue,
    durationInMonths,
    status: payload.isActive ? "active" : "inactive",
  };
}

export default function Packages() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [service, setService] = useState("");
  const [dialogState, setDialogState] = useState<{ open: boolean; mode: PackageDialogMode; package: PackageRecord | null }>({ open: false, mode: PACKAGE_DIALOG_MODES.VIEW, package: null });

  const plansQuery = useQuery({
    queryKey: ["subscription-plans", page],
    queryFn: ({ signal }) => getSubscriptionPlans(page, PAGE_SIZE, signal),
    placeholderData: (previousData) => previousData,
  });
  const selectedPlanId = dialogState.package ? String(dialogState.package.id) : "";
  const detailQuery = useQuery({
    queryKey: ["subscription-plan", selectedPlanId],
    queryFn: ({ signal }) => getSubscriptionPlan(selectedPlanId, signal),
    enabled: dialogState.open && dialogState.mode !== PACKAGE_DIALOG_MODES.CREATE && Boolean(selectedPlanId),
  });

  const allRows = useMemo(() => (plansQuery.data?.items ?? []).map(toRecord), [plansQuery.data?.items]);
  const filteredRows = useMemo(() => allRows.filter((plan) => {
    const matchesSearch = !search || plan.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = !status || plan.status === status;
    return matchesSearch && matchesStatus;
  }), [allRows, search, status]);
  const pagination = plansQuery.data?.pagination;
  const totalPages = Math.max(1, Math.ceil((pagination?.total ?? 0) / (pagination?.limit ?? PAGE_SIZE)));
  const visibleRows = filteredRows;
  const selectedPlan = detailQuery.data ? toRecord(detailQuery.data) : dialogState.package;
  useEffect(() => setPage(1), [search, status]);

  const invalidate = () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ["subscription-plans"] }),
    queryClient.invalidateQueries({ queryKey: ["subscription-plan"] }),
  ]);
  const createMutation = useMutation({ mutationFn: createSubscriptionPlan, onSuccess: async () => { await invalidate(); toast.success("تم إنشاء الباقه بنجاح"); } });
  const updateMutation = useMutation({ mutationFn: ({ id, payload }: { id: string; payload: SubscriptionPlanPayload }) => updateSubscriptionPlan(id, { ...payload, maxServices: 1 }), onSuccess: async () => { await invalidate(); toast.success("تم حفظ تعديلات الباقه"); } });
  const toggleMutation = useMutation({ mutationFn: ({ id, active }: { id: string; active: boolean }) => toggleSubscriptionPlanStatus(id, active), onSuccess: async () => { await invalidate(); toast.success("تم تحديث حالة الباقه"); }, onError: (error) => toast.error(getErrorMessage(error, "تعذر تحديث حالة الباقة")) });
  const defaultMutation = useMutation({ mutationFn: setDefaultSubscriptionPlan, onSuccess: async () => { await invalidate(); toast.success("تم تعيين الباقه كافتراضيه"); } });

  const closeDialog = () => setDialogState((current) => ({ ...current, open: false }));
  const openDialog = (mode: PackageDialogMode, plan: PackageRecord | null = null) => setDialogState({ open: true, mode, package: plan });
  const handleCreate = async (payload: PackagePayload) => {
    try { await createMutation.mutateAsync(toPayload(payload)); }
    catch (error) { throw new Error(getErrorMessage(error, "تعذر إنشاء الباقة")); }
  };
  const handleSave = async (payload: PackagePayload & { id?: string | number }) => {
    if (!payload.id) return;
    try { await updateMutation.mutateAsync({ id: String(payload.id), payload: toPayload(payload) }); }
    catch (error) { throw new Error(getErrorMessage(error, "تعذر تعديل الباقة")); }
  };
  const handleSetDefault = async (plan: PackageRecord) => {
    try { await defaultMutation.mutateAsync(String(plan.id)); }
    catch (error) { throw new Error(getErrorMessage(error, "تعذر تعيين الباقة الافتراضية")); }
  };

  const total = pagination?.total ?? 0;
  const stats = statsTemplate.map((card) => ({
    ...card,
    value: card.title === "إجمالي الباقات" ? total : "—",
    change: "",
  }));

  return (
    <section>
      <PackagesHeader onAddPackage={() => openDialog(PACKAGE_DIALOG_MODES.CREATE)} />
      <div className="mb-7"><StatsGrid stats={stats} /></div>
      <PackagesFiltersBar
        search={search} onSearchChange={setSearch}
        status={status} onStatusChange={setStatus} statusOptions={statusOptions}
        service={service} onServiceChange={setService} serviceOptions={serviceTypeOptions}
        onFilter={() => { setPage(1); if (service) toast.error("Backend الباقات لا يدعم فلترة نوع الخدمة"); }}
      />
      <PackagesTable rows={visibleRows} totalCount={pagination?.total ?? 0} currentPage={pagination?.page ?? page} totalPages={totalPages} loading={plansQuery.isLoading} emptyMessage={plansQuery.isError ? getErrorMessage(plansQuery.error, "تعذر تحميل الباقات") : undefined} onPageChange={setPage} onView={(row) => openDialog(PACKAGE_DIALOG_MODES.VIEW, row)} onEdit={(row) => openDialog(PACKAGE_DIALOG_MODES.EDIT, row)} onToggleStatus={(row) => { if (!toggleMutation.isPending) toggleMutation.mutate({ id: String(row.id), active: row.status !== "نشط" }); }} />
      <PackageDialog open={dialogState.open} mode={dialogState.mode} package={selectedPlan} onClose={closeDialog} onCreate={handleCreate} onSave={handleSave} onSetDefault={handleSetDefault} />
    </section>
  );
}
