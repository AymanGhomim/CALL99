import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isBackofficeUser, useAuthStore } from "../store/authStore";

export default function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  return token && isBackofficeUser(user)
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
