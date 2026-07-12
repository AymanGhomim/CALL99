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
  Bell,
  FileText,
  Clock3,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { logout as logoutRequest } from "../../../services/auth.service";

const links = [
  { to: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { to: "/users", label: "المستخدمون", icon: Users },
  { to: "/providers", label: "المقدمون", icon: UserRoundCheck },
  { to: "/orders", label: "الطلبات", icon: ShoppingCart },
  { to: "/packages", label: "الباقات", icon: Box },
  { to: "/wallet", label: "الإدارة المالية", icon: Wallet },
  { to: "/ads", label: "الإعلانات", icon: Megaphone },
  { to: "/complaints", label: "الشكاوى", icon: MessageSquareWarning },
  { to: "/notifications", label: "الاشعارات", icon: Bell },
  { to: "/coupons", label: "الكوبونات", icon: FileText },
  { to: "/activity", label: "النشاط الاخير", icon: Clock3 },
];

// Shared by the main nav list and the standalone "Settings" link below it
// so the active/inactive styling never has to be kept in sync by hand.
function SidebarLink({ to, label, icon: Icon, className = "", onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `relative flex items-center gap-3 py-[14px] pl-5 pr-6 text-[15px] font-medium transition-all duration-200 rounded-l-xl ${className} ${
          isActive
            ? "bg-[#5c1e24] text-white"
            : "rounded-r-xl text-white/90 hover:bg-[#5c1e24]/60"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={20} className="shrink-0" strokeWidth={1.8} />
          <span className="flex-1 text-right">{label}</span>
          {isActive && (
            <span className="absolute right-0 top-0 h-full w-[5px] rounded-full bg-white" />
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
export default function Sidebar({ isOpen = false, onClose }) {
  const navigate = useNavigate();
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
        dir="rtl"
        className={`fixed right-0 top-0 z-40 flex h-screen w-[var(--sidebar-width)] min-w-[var(--sidebar-width)] max-w-[var(--sidebar-width)] shrink-0 flex-col overflow-y-auto overflow-x-visible bg-[#75262d] text-white transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق القائمة"
          className="absolute left-4 top-4 rounded-full p-1.5 text-white/80 hover:bg-white/10 lg:hidden"
        >
          <X size={20} />
        </button>

        {/* Logo Section */}
        <div className="flex items-center justify-center gap-3 px-5 pt-10 pb-6">
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5">
            <img
              src="/images/logo.png"
              alt="CALL99"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-[32px] font-extrabold tracking-wide leading-none">
              CALL99
            </h1>
            <p className="text-[13px] font-medium opacity-90 mt-1">
              نظام الإدارة الشامل
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-5 pt-2">
          {links.map((link) => (
            <SidebarLink key={link.to} {...link} onNavigate={onClose} />
          ))}
        </nav>

        {/* Bottom Section - Settings & Logout */}
        <div className="border-t border-white/20 px-5 pt-4 pb-6">
          <SidebarLink
            to="/settings"
            label="الإعدادات"
            icon={Settings}
            className="mb-3"
            onNavigate={onClose}
          />

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-[14px] text-[15px] font-bold text-[#75262d] transition hover:bg-white/90"
          >
            <LogOut size={18} strokeWidth={2.2} />
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
}
