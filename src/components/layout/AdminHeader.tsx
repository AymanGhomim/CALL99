import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logout as logoutRequest } from "../../services/auth.service";
import { useAuthStore, type AuthRole } from "../../store/authStore";
import useLocale from "../../i18n/useLocale";
import LanguageSwitcher from "./LanguageSwitcher";
import { getNotificationCampaigns, getNotificationCampaignStats } from "../../services/notifications.service";
import { getErrorMessage } from "../../utils/error";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const roleKeys: Record<AuthRole, string> = {
  SUPER_ADMIN: "roles.SUPER_ADMIN", ADMIN: "roles.ADMIN", GROUND_TEAM: "roles.GROUND_TEAM",
  CUSTOMER_SERVICE: "roles.CUSTOMER_SERVICE", MANAGER: "roles.MANAGER", USER: "roles.USER",
  CUSTOMER: "roles.CUSTOMER", PROVIDER: "roles.PROVIDER",
};

const pageTitleKeys: Record<string, string> = {
  dashboard: "pages.dashboard", users: "pages.users", providers: "pages.providers", orders: "pages.orders",
  packages: "pages.packages", wallet: "pages.wallet", ads: "pages.ads", complaints: "pages.complaints",
  tickets: "pages.tickets", notifications: "pages.notifications", "ready-replies": "pages.readyReplies", coupons: "pages.coupons",
  activity: "pages.activity", settings: "pages.settings", "admin-profile": "pages.adminProfile",
};

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { direction, formatDate } = useLocale();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.logout);
  const [openMenu, setOpenMenu] = useState<"notifications" | "profile" | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const statsQuery = useQuery({
    queryKey: ["admin-notification-campaign-stats"],
    queryFn: ({ signal }) => getNotificationCampaignStats(signal),
    refetchInterval: 60_000,
  });
  const notificationsQuery = useQuery({
    queryKey: ["admin-notification-campaigns", 1, 20],
    queryFn: ({ signal }) => getNotificationCampaigns({ page: 1, limit: 20 }, signal),
    enabled: openMenu === "notifications",
  });
  const scheduledCount = statsQuery.data?.scheduledCount ?? 0;
  const adminNotifications = (notificationsQuery.data?.items ?? []).slice(0, 5);
  const notificationsErrorMessage = notificationsQuery.isError
    ? getErrorMessage(notificationsQuery.error, t("header.notificationsLoadError"))
    : "";

  const adminName = user?.fullName?.trim() || t("header.adminFallback");
  const roleLabel = user ? t(roleKeys[user.role]) : t("header.adminRoleFallback");
  const initial = adminName.charAt(0);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";
  const avatarUrl = user?.avatarDataUrl || (user?.avatarFileId
    ? `${apiBaseUrl}/files/public/${user.avatarFileId}`
    : null);
  const currentSection = location.pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  const pageTitle = t(pageTitleKeys[currentSection] ?? "pages.dashboard");

  document.title = `${pageTitle} | CALL99`;

  const toggleMenu = (menu: "notifications" | "profile") => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch {
      // The local session still needs to be cleared if the request fails.
    } finally {
      clearAuth();
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="sticky top-0 z-20 bg-[#fbf7f7]/95 px-2 pt-2 backdrop-blur-md sm:px-4 sm:pt-3 lg:px-7" dir={direction}>
      <header className="relative flex h-16 items-center justify-between overflow-visible rounded-2xl border border-[#eadfe0] bg-white px-2.5 shadow-[0_8px_30px_rgba(83,40,44,0.07)] sm:h-[72px] sm:px-4 lg:px-5">
        <span className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-l from-transparent via-[#75262d]/25 to-transparent" />

        <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={t("navigation.open")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#75262d]/8 text-[#75262d] transition hover:bg-[#75262d]/15 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#75262d] to-[#9b3b44] text-white shadow-[0_6px_16px_rgba(117,38,45,0.2)]">
            <LayoutDashboard size={20} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-extrabold text-[#2f2425]">{pageTitle}</p>
            <p className="mt-0.5 truncate text-xs text-[#928386]">{t("header.welcome", { name: adminName })}</p>
          </div>
        </div>

        <Link to="/dashboard" className="flex min-w-0 items-center gap-2 lg:hidden">
          <img src="/images/logo.png" alt="CALL99" className="h-9 w-9 shrink-0 rounded-lg object-contain" />
          <span className="truncate text-base font-extrabold text-[#75262d] max-[390px]:hidden sm:text-lg">CALL99</span>
        </Link>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
        <LanguageSwitcher compact />
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleMenu("notifications")}
            aria-label={t("header.openNotifications")}
            aria-expanded={openMenu === "notifications"}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition sm:h-11 sm:w-11 ${openMenu === "notifications" ? "border-[#75262d]/20 bg-[#75262d] text-white shadow-[0_6px_16px_rgba(117,38,45,0.2)]" : "border-[#eadfe0] bg-[#fbf8f8] text-[#68595b] hover:border-[#75262d]/25 hover:bg-[#75262d]/8 hover:text-[#75262d]"}`}
          >
            <Bell size={20} />
            {scheduledCount > 0 && (
              <span className={`absolute -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#75262d] px-1 text-[10px] font-bold text-white ${direction === "rtl" ? "-left-1" : "-right-1"}`}>
                {scheduledCount > 99 ? "99+" : scheduledCount}
              </span>
            )}
          </button>

          {openMenu === "notifications" && (
            <div className={`fixed left-2 right-2 top-[76px] overflow-hidden rounded-2xl border border-[#e4d6d8] bg-white text-start shadow-[0_22px_55px_rgba(73,35,39,0.16)] sm:absolute sm:top-[calc(100%+15px)] sm:w-[350px] ${direction === "rtl" ? "sm:left-0 sm:right-auto" : "sm:right-0 sm:left-auto"}`}>
              <div className="flex items-center justify-between border-b border-[#f1e8e9] px-4 py-3.5">
                <div>
                  <h2 className="font-bold text-[#2f2425]">{t("header.adminNotifications")}</h2>
                  <p className="mt-0.5 text-[11px] text-[#97888a]">{t("header.adminNotificationsHint")}</p>
                </div>
                {scheduledCount > 0 && (
                  <span className="rounded-full bg-[#75262d]/10 px-2 py-1 text-[11px] font-bold text-[#75262d]">
                    {t("header.scheduledCount", { count: scheduledCount })}
                  </span>
                )}
              </div>
              <div className="max-h-80 divide-y divide-[#f5eeee] overflow-y-auto">
                {notificationsQuery.isLoading && <p className="px-4 py-8 text-center text-sm text-gray-400">{t("common.loading")}</p>}
                {notificationsQuery.isError && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-red-500">{notificationsErrorMessage}</p>
                    <button type="button" onClick={() => notificationsQuery.refetch()} className="mt-3 rounded-lg border border-[#eadfe0] px-3 py-1.5 text-xs font-bold text-[#75262d]">{t("common.retry")}</button>
                  </div>
                )}
                {!notificationsQuery.isLoading && !notificationsQuery.isError && adminNotifications.length === 0 && <p className="px-4 py-8 text-center text-sm text-gray-400">{t("header.noAdminNotifications")}</p>}
                {adminNotifications.map((notification) => (
                  <Link
                    to="/notifications"
                    key={notification.id}
                    onClick={() => setOpenMenu(null)}
                    className="flex w-full gap-3 px-4 py-3.5 text-start transition hover:bg-[#fdfafa]"
                  >
                    <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.status === "failed" ? "bg-red-500" : notification.status === "scheduled" ? "bg-[#75262d]" : notification.status === "paused" ? "bg-amber-500" : "bg-emerald-500"}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="min-w-0 flex-1 truncate text-sm font-bold text-[#3c3031]">{notification.title}</p>
                        <span className="shrink-0 rounded-full bg-[#f7f1f2] px-2 py-0.5 text-[10px] font-semibold text-[#75262d]">{t(`statuses.${notification.status}`)}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-[#756669]">{notification.message}</p>
                      <p className="mt-1 text-[11px] text-[#97888a]">{formatDate(notification.scheduledAt || notification.createdAt, { dateStyle: "medium", timeStyle: "short" })}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {!notificationsQuery.isError && <Link
                to="/notifications"
                onClick={() => setOpenMenu(null)}
                className="block w-full border-t border-[#f1e8e9] px-4 py-3 text-center text-sm font-bold text-[#75262d] transition hover:bg-[#fdfafa]"
              >
                {t("header.viewAllAdminNotifications")}
              </Link>}
            </div>
          )}
        </div>

        <span className="hidden h-8 w-px bg-[#eadfe0] lg:block" />

        <div className="relative">
          <button
            type="button"
            onClick={() => toggleMenu("profile")}
            aria-label={t("header.openProfile")}
            aria-expanded={openMenu === "profile"}
            className={`flex items-center gap-2 rounded-xl border p-0.5 transition sm:p-1 lg:gap-3 lg:pl-3 ${openMenu === "profile" ? "border-[#75262d]/20 bg-[#fbf7f7]" : "border-transparent hover:border-[#eadfe0] hover:bg-[#fbf7f7]"}`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-gradient-to-br from-[#75262d] to-[#a64951] text-sm font-extrabold text-white shadow-[0_0_0_1px_rgba(117,38,45,0.18),0_5px_14px_rgba(117,38,45,0.18)] sm:h-11 sm:w-11">
              {avatarUrl && !avatarFailed ? (
                <img
                  src={avatarUrl}
                  alt={adminName}
                  className="h-full w-full object-cover"
                  onError={() => setAvatarFailed(true)}
                />
              ) : initial}
            </span>
            <span className="hidden text-start lg:block">
              <span className="block max-w-36 truncate text-sm font-bold text-[#302526]">{adminName}</span>
              <span className="block text-xs text-[#8b7b7d]">{roleLabel}</span>
            </span>
            <ChevronDown size={16} className={`hidden text-[#8b7b7d] transition-transform lg:block ${openMenu === "profile" ? "rotate-180" : ""}`} />
          </button>

          {openMenu === "profile" && (
            <div className={`fixed left-2 right-2 top-[76px] overflow-hidden rounded-2xl border border-[#e4d6d8] bg-white text-start shadow-[0_22px_55px_rgba(73,35,39,0.16)] sm:absolute sm:top-[calc(100%+14px)] sm:w-64 ${direction === "rtl" ? "sm:left-0 sm:right-auto" : "sm:right-0 sm:left-auto"}`}>
              <div className="border-b border-[#f1e8e9] bg-gradient-to-l from-[#75262d]/7 to-transparent px-4 py-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#302526]">
                  <ShieldCheck size={17} className="text-[#75262d]" />
                  <span className="truncate">{adminName}</span>
                </div>
                <p className="mt-1.5 text-xs text-[#8b7b7d]">{roleLabel}</p>
                {user?.phone && <p className="mt-1 text-xs text-[#8b7b7d]" dir="ltr">{user.phone}</p>}
              </div>
              <Link
                to="/admin-profile"
                onClick={() => setOpenMenu(null)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#554749] transition hover:bg-[#fdfafa]"
              >
                <Settings size={18} />
                {t("header.accountSettings")}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 border-t border-[#f1e8e9] px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={18} />
                {t("header.logout")}
              </button>
            </div>
          )}
        </div>
        </div>
      </header>
    </div>
  );
}
