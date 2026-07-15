import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRoundCheck,
  ShoppingCart,
  Box,
  Wallet,
  Megaphone,
  MessageSquareWarning,
  MessageSquareText,
  Bell,
  FileText,
  Ticket,
  Clock3,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { logout as logoutRequest } from "../../../services/auth.service";
import { useTranslation } from "react-i18next";
import useLocale from "../../../i18n/useLocale";

const links = [
  { to: "/dashboard", labelKey: "navigation.dashboard", icon: LayoutDashboard },
  { to: "/users", labelKey: "navigation.users", icon: Users },
  { to: "/providers", labelKey: "navigation.providers", icon: UserRoundCheck },
  { to: "/orders", labelKey: "navigation.orders", icon: ShoppingCart },
  { to: "/packages", labelKey: "navigation.packages", icon: Box },
  { to: "/wallet", labelKey: "navigation.wallet", icon: Wallet },
  { to: "/ads", labelKey: "navigation.ads", icon: Megaphone },
  { to: "/complaints", labelKey: "navigation.complaints", icon: MessageSquareWarning },
  { to: "/tickets", labelKey: "navigation.tickets", icon: Ticket },
  { to: "/notifications", labelKey: "navigation.notifications", icon: Bell },
  { to: "/ready-replies", labelKey: "navigation.readyReplies", icon: MessageSquareText },
  { to: "/coupons", labelKey: "navigation.coupons", icon: FileText },
  { to: "/activity", labelKey: "navigation.activity", icon: Clock3 },
];

// Shared by the main nav list and the standalone "Settings" link below it
// so the active/inactive styling never has to be kept in sync by hand.
interface SidebarLinkProps {
  to: string;
  label: string;
  icon: LucideIcon;
  className?: string;
  onNavigate: () => void;
  isCollapsed: boolean;
  direction: "rtl" | "ltr";
}

function SidebarLink({ to, label, icon: Icon, className = "", onNavigate, isCollapsed, direction }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      title={isCollapsed ? label : undefined}
      className={({ isActive }) =>
        `relative flex items-center gap-3 py-[14px] px-5 text-[15px] font-medium transition-colors duration-150 ${direction === "rtl" ? "rounded-l-xl" : "rounded-r-xl"} ${isCollapsed ? "lg:justify-center lg:px-0" : ""} ${className} ${
          isActive
            ? "bg-[#5c1e24] text-white"
            : "rounded-xl text-white/90 hover:bg-[#5c1e24]/60"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={20} className="shrink-0" strokeWidth={1.8} />
          <span className={`flex-1 text-start ${isCollapsed ? "lg:hidden" : ""}`}>{label}</span>
          {isActive && (
            <span className={`absolute top-0 h-full w-[5px] rounded-full bg-white ${direction === "rtl" ? "right-0" : "left-0"}`} />
          )}
        </>
      )}
    </NavLink>
  );
}

/**
 * Fixed sidebar on large screens (lg+); off-canvas drawer on mobile/tablet.
 * `isOpen`/`onClose` only matter below the lg breakpoint - on lg+ the
 * sidebar is always visible regardless of that state.
 */
interface SidebarProps {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export default function Sidebar({ isOpen = false, isCollapsed = false, onClose, onToggleCollapse }: SidebarProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { direction } = useLocale();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch {
      // Clear local session even if server logout fails.
    } finally {
      logout();
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      {/* Mobile backdrop - only rendered/interactive while the drawer is open */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-200 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        dir={direction}
        className={`fixed top-0 z-40 flex h-screen w-[var(--sidebar-width)] min-w-[var(--sidebar-width)] max-w-[var(--sidebar-width)] shrink-0 flex-col overflow-y-auto overflow-x-hidden bg-[#75262d] text-white transition-transform duration-300 ease-out lg:transition-none ${direction === "rtl" ? "right-0" : "left-0"} ${isCollapsed ? "lg:w-[76px] lg:min-w-[76px] lg:max-w-[76px]" : ""} ${
          isOpen ? "translate-x-0" : direction === "rtl" ? "translate-x-full" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("navigation.close")}
          className={`absolute top-4 rounded-full p-1.5 text-white/80 hover:bg-white/10 lg:hidden ${direction === "rtl" ? "left-4" : "right-4"}`}
        >
          <X size={20} />
        </button>

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={t(isCollapsed ? "navigation.expand" : "navigation.collapse")}
          title={t(isCollapsed ? "navigation.expand" : "navigation.collapse")}
          className={`absolute top-3 z-10 hidden h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20 lg:flex ${isCollapsed ? "left-1/2 -translate-x-1/2" : direction === "rtl" ? "left-3" : "right-3"}`}
        >
          {isCollapsed
            ? direction === "rtl" ? <ChevronLeft size={19} /> : <ChevronRight size={19} />
            : direction === "rtl" ? <ChevronRight size={19} /> : <ChevronLeft size={19} />}
        </button>

        {/* Logo Section */}
        <div className={`flex items-center justify-center gap-3 px-5 pt-10 pb-6 ${isCollapsed ? "lg:h-16 lg:p-0" : ""}`}>
          <div className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 ${isCollapsed ? "lg:hidden" : ""}`}>
            <img
              src="/images/logo.png"
              alt="CALL99"
              className="h-full w-full object-contain"
            />
          </div>
          <div className={`flex flex-col items-center ${isCollapsed ? "lg:hidden" : ""}`}>
            <h1 className="text-[32px] font-extrabold tracking-wide leading-none">
              CALL99
            </h1>
            <p className="text-[13px] font-medium opacity-90 mt-1">
              {t("navigation.systemName")}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className={`flex-1 space-y-1 px-5 pt-2 ${isCollapsed ? "lg:px-2" : ""}`}>
          {links.map((link) => (
            <SidebarLink key={link.to} to={link.to} label={t(link.labelKey)} icon={link.icon} onNavigate={onClose} isCollapsed={isCollapsed} direction={direction} />
          ))}
        </nav>

        {/* Bottom Section - Settings & Logout */}
        <div className={`border-t border-white/20 px-5 pt-4 pb-6 ${isCollapsed ? "lg:px-2" : ""}`}>
          <SidebarLink
            to="/settings"
            label={t("navigation.settings")}
            icon={Settings}
            className="mb-3"
            onNavigate={onClose}
            isCollapsed={isCollapsed}
            direction={direction}
          />

          <button
            onClick={handleLogout}
            title={isCollapsed ? t("header.logout") : undefined}
            className={`flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-[14px] text-[15px] font-bold text-[#75262d] transition hover:bg-white/90 ${isCollapsed ? "lg:px-0" : ""}`}
          >
            <LogOut size={18} strokeWidth={2.2} />
            <span className={isCollapsed ? "lg:hidden" : ""}>{t("header.logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
