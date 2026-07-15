import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Ban, Trash2 } from "lucide-react";
import UsersHeader from "../../components/users/UsersHeader";
import UsersFiltersBar from "../../components/users/UsersFiltersBar";
import UsersTable from "../../components/users/UsersTable";
import StatsGrid from "../../components/dashboard/StatsGrid";
import AddEmployeeDialog from "../../components/dialogs/AddEmployeeDialog";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { EmployeePayload } from "../../components/dialogs/AddEmployeeDialog/constants";
import { usersStats } from "../../data/users.data";
import type { UserRecord } from "../../types/entities";
import type { AdminRole, AdminUserListItem, UserStatus } from "../../types/adminApi";
import {
  blockAdminUser,
  createAdminUser,
  deleteAdminUser,
  getAdminUserCounters,
  getAdminUsers,
  unblockAdminUser,
  type CreateAdminUserPayload,
} from "../../services/adminUsers.service";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import { getErrorMessage } from "../../utils/error";

const PAGE_SIZE = 10;

const ROLE_TO_LABEL: Record<AdminRole, string> = {
  SUPER_ADMIN: "مدير عام",
  ADMIN: "مدير",
  GROUND_TEAM: "فريق ميداني",
  CUSTOMER_SERVICE: "خدمة عملاء",
  MANAGER: "مدير",
  USER: "عميل",
  CUSTOMER: "عميل",
  PROVIDER: "مقدم خدمة",
};

const ROLE_FILTER_MAP: Record<string, AdminRole> = {
  "مقدم خدمة": "PROVIDER",
  عميل: "CUSTOMER",
  مدير: "ADMIN",
  "خدمة عملاء": "CUSTOMER_SERVICE",
  "فريق ميداني": "GROUND_TEAM",
};

const STATUS_TO_LABEL: Record<UserStatus, string> = {
  ACTIVE: "نشط",
  BLOCKED: "محظور",
  INACTIVE: "غير نشط",
  PENDING_VERIFICATION: "قيد التحقق",
  SUSPENDED: "موقوف",
  INCOMPLETE: "غير مكتمل",
};

const STATUS_FILTER_MAP: Record<string, UserStatus> = {
  نشط: "ACTIVE",
  محظور: "BLOCKED",
};

const CREATE_ROLE_MAP: Record<EmployeePayload["role"], CreateAdminUserPayload["role"]> = {
  "customer-service": "CUSTOMER_SERVICE",
  "field-team": "GROUND_TEAM",
  manager: "ADMIN",
};

interface PendingUserAction {
  type: "block" | "delete";
  user: UserRecord;
}

function mapUser(user: AdminUserListItem): UserRecord {
  return {
    id: user.id,
    name: user.fullName ?? "بدون اسم",
    phone: user.phone ?? "—",
    role: ROLE_TO_LABEL[user.role],
    ordersCount: 0,
    createdAt: new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(new Date(user.createdAt)),
    status: STATUS_TO_LABEL[user.status],
  };
}

function toIsoStart(date: string): string | undefined {
  return date ? new Date(`${date}T00:00:00.000Z`).toISOString() : undefined;
}

function toIsoEnd(date: string): string | undefined {
  return date ? new Date(`${date}T23:59:59.999Z`).toISOString() : undefined;
}

export default function Users() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingUserAction | null>(null);
  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => setPage(1), [debouncedSearch, dateFrom, dateTo, role, status]);

  const usersQuery = useQuery({
    queryKey: ["admin-users", page, debouncedSearch, dateFrom, dateTo, role, status],
    queryFn: ({ signal }) => getAdminUsers({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch.trim() || undefined,
      role: ROLE_FILTER_MAP[role],
      status: STATUS_FILTER_MAP[status],
      createdAtFrom: toIsoStart(dateFrom),
      createdAtTo: toIsoEnd(dateTo),
    }, signal),
    placeholderData: (previousData) => previousData,
  });

  const countersQuery = useQuery({
    queryKey: ["admin-user-counters"],
    queryFn: ({ signal }) => getAdminUserCounters(signal),
  });

  const invalidateUsers = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-user-counters"] }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: async () => {
      await invalidateUsers();
      toast.success("تمت إضافة الموظف بنجاح");
    },
  });

  const actionMutation = useMutation({
    mutationFn: async (action: PendingUserAction) => {
      const id = String(action.user.id);
      if (action.type === "delete") return deleteAdminUser(id);
      return action.user.status === "محظور" ? unblockAdminUser(id) : blockAdminUser(id);
    },
    onSuccess: async (_, action) => {
      setPendingAction(null);
      await invalidateUsers();
      toast.success(
        action.type === "delete"
          ? "تم حذف المستخدم بنجاح"
          : action.user.status === "محظور" ? "تم إلغاء حظر المستخدم" : "تم حظر المستخدم",
      );
    },
    onError: (error) => toast.error(getErrorMessage(error, "تعذر تنفيذ الإجراء")),
  });

  const rows = useMemo(() => (usersQuery.data?.items ?? []).map(mapUser), [usersQuery.data?.items]);
  const pagination = usersQuery.data?.pagination;
  const totalPages = Math.max(1, Math.ceil((pagination?.total ?? 0) / (pagination?.limit ?? PAGE_SIZE)));
  const counters = countersQuery.data;
  const stats = useMemo(() => usersStats.map((card) => {
    if (!counters) return { ...card, value: "—" };
    const valueByTitle: Record<string, number> = {
      "مقدمو الخدمة": counters.providers,
      العملاء: counters.customers,
      "إجمالي المستخدمين": counters.totalUsers,
      المدراء: counters.admins + counters.superAdmins,
      "خدمة العملاء": counters.customerService,
      "الفريق الميداني": counters.groundTeam,
    };
    return { ...card, value: valueByTitle[card.title] ?? card.value, change: "" };
  }), [counters]);

  const handleAddEmployee = async (payload: EmployeePayload) => {
    try {
      await createMutation.mutateAsync({
        fullName: payload.fullName,
        phone: payload.phone,
        password: payload.password,
        role: CREATE_ROLE_MAP[payload.role],
      });
    } catch (error) {
      throw new Error(getErrorMessage(error, "تعذر إضافة الموظف"));
    }
  };

  return (
    <section>
      <UsersHeader onAddUser={() => setIsAddEmployeeOpen(true)} />
      <div className="mb-7"><StatsGrid stats={stats} /></div>
      <UsersFiltersBar
        search={search} onSearchChange={setSearch}
        dateFrom={dateFrom} onDateFromChange={setDateFrom}
        dateTo={dateTo} onDateToChange={setDateTo}
        role={role} onRoleChange={setRole}
        roleOptions={Object.keys(ROLE_FILTER_MAP)}
        status={status} onStatusChange={setStatus}
        statusOptions={Object.keys(STATUS_FILTER_MAP)}
        onFilter={() => setPage(1)}
      />
      <UsersTable
        rows={rows}
        totalCount={pagination?.total ?? 0}
        currentPage={pagination?.page ?? page}
        totalPages={totalPages}
        loading={usersQuery.isLoading}
        emptyMessage={usersQuery.isError ? getErrorMessage(usersQuery.error, "تعذر تحميل المستخدمين") : undefined}
        onPageChange={setPage}
        onView={(row) => navigate(`/users/${row.id}`)}
        onBlock={(user) => setPendingAction({ type: "block", user })}
        onDelete={(user) => setPendingAction({ type: "delete", user })}
      />
      <AddEmployeeDialog open={isAddEmployeeOpen} onClose={() => setIsAddEmployeeOpen(false)} onSubmit={handleAddEmployee} />
      <ConfirmDialog
        open={pendingAction !== null}
        onClose={() => setPendingAction(null)}
        onConfirm={() => pendingAction && actionMutation.mutate(pendingAction)}
        loading={actionMutation.isPending}
        icon={pendingAction?.type === "delete" ? Trash2 : Ban}
        title={pendingAction?.type === "delete" ? "حذف المستخدم" : pendingAction?.user.status === "محظور" ? "إلغاء حظر المستخدم" : "حظر المستخدم"}
        description={pendingAction?.type === "delete" ? `هل تريد حذف ${pendingAction.user.name} نهائيًا؟` : `هل تريد ${pendingAction?.user.status === "محظور" ? "إلغاء حظر" : "حظر"} ${pendingAction?.user.name ?? "المستخدم"}؟`}
        confirmLabel={pendingAction?.type === "delete" ? "حذف" : pendingAction?.user.status === "محظور" ? "إلغاء الحظر" : "حظر"}
        tone={pendingAction?.type === "block" && pendingAction.user.status === "محظور" ? "success" : "danger"}
      />
    </section>
  );
}
