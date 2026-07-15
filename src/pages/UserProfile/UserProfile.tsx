import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Ban, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import UserProfileTopBar from "../../components/userProfile/UserProfileTopBar";
import UserProfileCard from "../../components/userProfile/UserProfileCard";
import UserOrdersStats from "../../components/userProfile/UserOrdersStats";
import UserOrdersChartsSection from "../../components/userProfile/UserOrdersChartsSection";
import UserOrdersFiltersBar from "../../components/userProfile/UserOrdersFiltersBar";
import UserOrdersTable from "../../components/userProfile/UserOrdersTable";
import UserFinancialSummary from "../../components/userProfile/UserFinancialSummary";
import BlockUserButton from "../../components/userProfile/BlockUserButton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import AdminStaffProfileCard from "../../components/userProfile/AdminStaffProfileCard";
import { colors } from "../../constants/colors";
import {
  blockAdminUser,
  deleteAdminUser,
  getAdminUser,
  unblockAdminUser,
} from "../../services/adminUsers.service";
import { getErrorMessage } from "../../utils/error";
import { useTranslation } from "react-i18next";

const EMPTY_STATUS_DATA = [
  { name: "مكتملة", value: 0, color: "#22c55e" },
  { name: "ملغاة", value: 0, color: "#ef4444" },
  { name: "مجدولة", value: 0, color: "#3b82f6" },
];

const EMPTY_ACTIVITY_DATA = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"].map((name) => ({ name, value: 0 }));

type PendingAction = "block" | "delete" | null;

export default function UserProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id = "" } = useParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const userQuery = useQuery({
    queryKey: ["admin-user", id],
    queryFn: ({ signal }) => getAdminUser(id, signal),
    enabled: Boolean(id),
  });

  const detail = userQuery.data;
  const user = detail?.user;
  const isBlocked = user?.status === "BLOCKED";

  const actionMutation = useMutation({
    mutationFn: async (action: Exclude<PendingAction, null>) => {
      if (action === "delete") return deleteAdminUser(id);
      return isBlocked ? unblockAdminUser(id) : blockAdminUser(id);
    },
    onSuccess: async (_, action) => {
      setPendingAction(null);
      if (action === "delete") {
        await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        toast.success("تم حذف المستخدم بنجاح");
        navigate("/users", { replace: true });
        return;
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-user", id] }),
        queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
      ]);
      toast.success(isBlocked ? "تم إلغاء حظر المستخدم" : "تم حظر المستخدم");
    },
    onError: (error) => toast.error(getErrorMessage(error, "تعذر تنفيذ الإجراء")),
  });

  if (userQuery.isLoading) {
    return <section><UserProfileTopBar /><div className="rounded-xl border border-[#f2e8e8] bg-white p-10 text-center text-gray-400">جاري تحميل بيانات المستخدم...</div></section>;
  }

  if (!user || userQuery.isError) {
    return <section><UserProfileTopBar /><div className="rounded-xl border border-[#f2e8e8] bg-white p-10 text-center text-red-500">{getErrorMessage(userQuery.error, "تعذر تحميل بيانات المستخدم")}</div></section>;
  }

  const providerId = detail?.providerProfile?.provider.id ?? user.profileId;
  if ((detail?.profileType === "provider" || user.role === "PROVIDER") && providerId) {
    return <Navigate to={`/providers/${providerId}`} replace />;
  }
  if (detail?.profileType === "provider" || user.role === "PROVIDER") {
    return <section><UserProfileTopBar title={t("modules.providerProfile.title")} subtitle={t("modules.providerProfile.subtitle")} /><div className="rounded-xl border border-[#f2e8e8] bg-white p-10 text-center text-red-500">{t("provider.profileIdMissing")}</div></section>;
  }

  const memberSince = new Intl.DateTimeFormat("ar-EG", { dateStyle: "long" }).format(new Date(user.createdAt));
  const statusLabel = isBlocked ? "محظور" : user.status === "ACTIVE" ? "نشط" : "غير نشط";
  const isAdministrativeUser = !["USER", "CUSTOMER", "PROVIDER"].includes(user.role);

  if (isAdministrativeUser) {
    return (
      <section>
        <UserProfileTopBar title={t("adminProfile.staffProfile")} subtitle={t("adminProfile.staffProfileSubtitle")} />
        <AdminStaffProfileCard user={user} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <BlockUserButton label={isBlocked ? "إلغاء حظر المستخدم" : "حظر المستخدم"} onClick={() => setPendingAction("block")} />
          <button type="button" onClick={() => setPendingAction("delete")} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#f2e8e8] bg-white py-4 text-sm font-bold text-red-500 shadow-sm transition-colors hover:bg-red-50">حذف المستخدم<Trash2 size={17} /></button>
        </div>
        <ConfirmDialog
          open={pendingAction !== null}
          onClose={() => setPendingAction(null)}
          onConfirm={() => pendingAction && actionMutation.mutate(pendingAction)}
          loading={actionMutation.isPending}
          icon={pendingAction === "delete" ? Trash2 : Ban}
          title={pendingAction === "delete" ? "تأكيد حذف المستخدم" : isBlocked ? "تأكيد إلغاء حظر المستخدم" : "تأكيد حظر المستخدم"}
          description={pendingAction === "delete" ? `هل أنت متأكد من حذف المستخدم ${user.fullName ?? ""}؟ لا يمكن التراجع عن هذا الإجراء.` : `هل أنت متأكد من ${isBlocked ? "إلغاء حظر" : "حظر"} المستخدم ${user.fullName ?? ""}؟`}
          confirmLabel={pendingAction === "delete" ? "حذف المستخدم" : isBlocked ? "إلغاء الحظر" : "تأكيد الحظر"}
          tone={pendingAction === "block" && isBlocked ? "success" : "danger"}
        />
      </section>
    );
  }

  return (
    <section>
      <UserProfileTopBar />
      <UserProfileCard name={detail?.customerProfile?.name ?? user.fullName ?? "بدون اسم"} phone={user.phone ?? "—"} memberSince={`عضو منذ ${memberSince}`} status={statusLabel} />
      <UserOrdersStats totalOrders={0} cancelledOrders={0} scheduledOrders={0} completedOrders={0} />
      <UserOrdersChartsSection statusData={EMPTY_STATUS_DATA} activityData={EMPTY_ACTIVITY_DATA} barColor={colors.primary} />
      <UserOrdersFiltersBar
        search={search} onSearchChange={setSearch}
        dateFrom={dateFrom} onDateFromChange={setDateFrom}
        dateTo={dateTo} onDateToChange={setDateTo}
        statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
        statusOptions={[]}
        onFilter={() => toast.error("لا يوفر الـBackend الحالي بيانات طلبات المستخدم")}
      />
      <div className="mb-6"><UserOrdersTable rows={[]} totalCount={0} currentPage={1} totalPages={1} /></div>
      <UserFinancialSummary totalExpenses="—" totalOrders={0} commissions="—" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <BlockUserButton label={isBlocked ? "إلغاء حظر المستخدم" : "حظر المستخدم"} onClick={() => setPendingAction("block")} />
        <button type="button" onClick={() => setPendingAction("delete")} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#f2e8e8] bg-white py-4 text-sm font-bold text-red-500 shadow-sm transition-colors hover:bg-red-50">حذف المستخدم<Trash2 size={17} /></button>
      </div>
      <ConfirmDialog
        open={pendingAction !== null}
        onClose={() => setPendingAction(null)}
        onConfirm={() => pendingAction && actionMutation.mutate(pendingAction)}
        loading={actionMutation.isPending}
        icon={pendingAction === "delete" ? Trash2 : Ban}
        title={pendingAction === "delete" ? "تأكيد حذف المستخدم" : isBlocked ? "تأكيد إلغاء حظر المستخدم" : "تأكيد حظر المستخدم"}
        description={pendingAction === "delete" ? `هل أنت متأكد من حذف المستخدم ${user.fullName ?? ""}؟ لا يمكن التراجع عن هذا الإجراء.` : `هل أنت متأكد من ${isBlocked ? "إلغاء حظر" : "حظر"} المستخدم ${user.fullName ?? ""}؟`}
        confirmLabel={pendingAction === "delete" ? "حذف المستخدم" : isBlocked ? "إلغاء الحظر" : "تأكيد الحظر"}
        tone={pendingAction === "block" && isBlocked ? "success" : "danger"}
      />
    </section>
  );
}
