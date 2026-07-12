import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import MobileTopBar from "./MobileTopBar";

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-[#fbf7f7]" dir="rtl">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MobileTopBar onMenuClick={() => setSidebarOpen(true)} />

      <main className="h-screen overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:mr-[var(--sidebar-width)] lg:px-7">
        <Outlet />
      </main>
    </div>
  );
}
