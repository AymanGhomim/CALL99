import { CalendarDays, Hash, Phone, ShieldCheck, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AdminRole, AdminUserRecord } from "../../types/adminApi";
import useLocale from "../../i18n/useLocale";
import Badge from "../ui/Badge";

const ROLE_KEYS: Record<AdminRole, string> = {
  SUPER_ADMIN: "roles.SUPER_ADMIN",
  ADMIN: "roles.ADMIN",
  GROUND_TEAM: "roles.GROUND_TEAM",
  CUSTOMER_SERVICE: "roles.CUSTOMER_SERVICE",
  MANAGER: "roles.MANAGER",
  USER: "roles.USER",
  CUSTOMER: "roles.CUSTOMER",
  PROVIDER: "roles.PROVIDER",
};

const STATUS_KEYS: Record<AdminUserRecord["status"], string> = {
  ACTIVE: "statuses.ACTIVE",
  BLOCKED: "statuses.BLOCKED",
  INACTIVE: "statuses.INACTIVE",
  PENDING_VERIFICATION: "statuses.PENDING_VERIFICATION",
  SUSPENDED: "statuses.SUSPENDED",
  INCOMPLETE: "statuses.INCOMPLETE",
};

export default function AdminStaffProfileCard({ user }: { user: AdminUserRecord }) {
  const { t } = useTranslation();
  const { formatDate } = useLocale();
  const fields = [
    { label: t("adminProfile.adminName"), value: user.fullName ?? t("provider.unnamed"), icon: UserRound },
    { label: t("common.phone"), value: user.phone ?? "—", icon: Phone },
    { label: t("common.role"), value: t(ROLE_KEYS[user.role]), icon: ShieldCheck },
    { label: t("common.status"), value: t(STATUS_KEYS[user.status]), icon: ShieldCheck },
    { label: t("common.createdAt"), value: formatDate(user.createdAt, { dateStyle: "long" }), icon: CalendarDays },
    { label: t("adminProfile.lastUpdated"), value: formatDate(user.updatedAt, { dateStyle: "long" }), icon: CalendarDays },
    { label: t("adminProfile.userId"), value: user.id, icon: Hash },
  ];

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-[#eadfe0] bg-white shadow-sm">
      <div className="bg-gradient-to-l from-[#75262d] to-[#9a4048] px-6 py-8 text-white sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-2xl font-extrabold">
              {user.fullName?.trim().charAt(0) || "A"}
            </span>
            <div>
              <h2 className="text-xl font-extrabold">{user.fullName ?? t("provider.unnamed")}</h2>
              <p className="mt-1 text-sm text-white/75">{t(ROLE_KEYS[user.role])}</p>
            </div>
          </div>
          <Badge tone={user.status === "ACTIVE" ? "success" : user.status === "BLOCKED" ? "danger" : "warning"}>
            {t(STATUS_KEYS[user.status])}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 sm:p-8">
        {fields.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-[#eee5e5] bg-[#fdfbfb] p-4 text-start">
            <p className="flex items-center gap-2 text-xs font-semibold text-gray-500"><Icon size={15} />{label}</p>
            <p className="mt-2 break-all font-bold text-[#302526]">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
