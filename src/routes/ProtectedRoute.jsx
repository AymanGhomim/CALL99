import { Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // مؤقتًا: فتح صفحات الداشبورد بدون تسجيل دخول أثناء التطوير.
  return <Outlet />;
}
