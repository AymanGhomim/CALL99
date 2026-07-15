import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import AdminHeader from "./AdminHeader";
import useLocale from "../../i18n/useLocale";

export default function DashboardLayout() {
  const { direction } = useLocale();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem("sidebar-collapsed") === "true",
  );

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  return (
    <div className="h-screen overflow-hidden bg-[#fbf7f7]" dir={direction}>
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
      />
      <div className={`h-screen overflow-hidden ${direction === "rtl"
        ? isSidebarCollapsed ? "lg:mr-[76px]" : "lg:mr-[var(--sidebar-width)]"
        : isSidebarCollapsed ? "lg:ml-[76px]" : "lg:ml-[var(--sidebar-width)]"
      }`}>
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="h-[calc(100vh-74px)] overflow-y-auto px-4 py-6 sm:h-[calc(100vh-87px)] sm:px-6 sm:py-8 lg:px-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
