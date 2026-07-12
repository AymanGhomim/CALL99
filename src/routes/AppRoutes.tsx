import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import OTP from "../pages/Auth/OTP";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/Dashboard/Dashboard";
import Users from "../pages/Users/Users";
import UserProfile from "../pages/UserProfile/UserProfile";
import Providers from "../pages/Providers/Providers";
import ProviderProfile from "../pages/ProviderProfile/ProviderProfile";
import Orders from "../pages/Orders/Orders";
import Packages from "../pages/Packages/Packages";
import Wallet from "../pages/Wallet/Wallet";
import Withdrawals from "../pages/Wallet/Withdrawals";
import WithdrawalDetails from "../pages/Wallet/WithdrawalDetails";
import Ads from "../pages/Ads/Ads";
import Complaints from "../pages/Complaints/Complaints";
import Notifications from "../pages/Notifications/Notifications";
import Settings from "../pages/Settings/Settings";
import Coupons from "../pages/Coupons/Coupons";
import Activity from "../pages/Activity/Activity";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OTP />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserProfile />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/providers/:id" element={<ProviderProfile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/wallet/withdrawals" element={<Withdrawals />} />
            <Route path="/wallet/withdrawals/:id" element={<WithdrawalDetails />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/activity" element={<Activity />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
