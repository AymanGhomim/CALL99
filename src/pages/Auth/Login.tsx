import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Smartphone } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/ui/AuthCard";
import AuthInput from "../../components/ui/AuthInput";
import Button from "../../components/ui/Button/Button";
import { login, logout as logoutSession, requestPasswordResetOtp } from "../../services/auth.service";
import { isBackofficeUser, useAuthStore } from "../../store/authStore";
import { getErrorMessage, getErrorStatus } from "../../utils/error";
import { useTranslation } from "react-i18next";

const OTP_FLOW_KEY = "otp_flow";

const formatSaudiPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");

  if (phone.trim().startsWith("+")) return `+${digits}`;
  if (digits.startsWith("966")) return `+${digits}`;
  if (digits.startsWith("05")) return `+966${digits.slice(1)}`;
  if (digits.startsWith("5")) return `+966${digits}`;

  return `+966${digits}`;
};

const isValidSaudiPhone = (phone: string): boolean => /^\+966\d{9}$/.test(phone);

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.logout);

  const [form, setForm] = useState({
    phone: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value =
      event.target.type === "checkbox" ? event.target.checked : event.target.value;

    setForm((prev) => ({
      ...prev,
      [event.target.name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const phone = formatSaudiPhone(form.phone);

    if (!form.phone.trim() || !form.password.trim()) {
      toast.error(t("auth.validation.credentialsRequired"));
      return;
    }

    if (!isValidSaudiPhone(phone)) {
      toast.error(t("auth.validation.invalidPhone"));
      return;
    }

    setLoading(true);

    try {
      const loginRes = await login(phone, form.password);
      const authData = loginRes.data;

      if (!isBackofficeUser(authData.user)) {
        setAuth(authData);
        try {
          await logoutSession();
        } finally {
          clearAuth();
        }
        toast.error(t("auth.messages.notAuthorized"));
        return;
      }

      setAuth(authData);
      toast.success(t("auth.messages.loginSuccess"));
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const status = getErrorStatus(err);

      if (status === 400) {
        toast.error("برجاء التأكد من رقم الهاتف وكلمة المرور");
      } else if (status === 401) {
        toast.error(t("auth.validation.invalidCredentials"));
      } else if (status === 429) {
        toast.error(t("auth.validation.tooManyAttempts"));
      } else {
        toast.error(getErrorMessage(err, "حدث خطأ أثناء تسجيل الدخول"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.phone.trim()) {
      toast.error(t("auth.validation.phoneRequired"));
      return;
    }

    const phone = formatSaudiPhone(form.phone);

    if (!isValidSaudiPhone(phone)) {
      toast.error(t("auth.validation.invalidPhone"));
      return;
    }

    setPasswordResetLoading(true);

    try {
      const response = await requestPasswordResetOtp(phone);
      sessionStorage.removeItem("pending_auth");
      sessionStorage.setItem("login_phone", phone);
      sessionStorage.setItem(OTP_FLOW_KEY, "password-reset");
      sessionStorage.setItem("otp_expires_in", "60");

      if (response.data.otpCode) {
        sessionStorage.setItem("login_otp", response.data.otpCode);
        toast.success(`رمز التحقق للتجربة: ${response.data.otpCode}`);
      } else {
        sessionStorage.removeItem("login_otp");
        toast.success(t("auth.messages.otpSent"));
      }

      navigate("/otp");
    } catch (error) {
      toast.error(getErrorMessage(error, "تعذر إرسال رمز استعادة كلمة المرور"));
    } finally {
      setPasswordResetLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="mb-11 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#F4EEEE] text-[#772326]">
            <LogIn size={30} strokeWidth={2.2} />
          </div>

          <h1 className="text-[32px] font-bold leading-tight text-[#191919]">
            {t("auth.adminLoginTitle")}
          </h1>

          <p className="mt-3 text-base font-normal text-[#777]">
            {t("auth.adminLoginSubtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label={t("auth.phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={10}
            value={form.phone}
            onChange={handleChange}
            icon={<Smartphone size={24} />}
            placeholder="500000001"
            prefix="+966"
            required
          />

          <AuthInput
            label={t("auth.password")}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder={t("auth.passwordPlaceholder")}
            required
          />

          <div className="flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-3 text-lg text-[#333]">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="h-5 w-5 rounded border-[#A15B5B] accent-[#772326]"
              />
              {t("auth.rememberMe")}
            </label>

            <button
              type="button"
              disabled={loading || passwordResetLoading}
              onClick={handleForgotPassword}
              className="text-sm font-bold text-[#772326] transition hover:text-[#542029] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t(passwordResetLoading ? "auth.sendingCode" : "auth.forgotPassword")}
            </button>
          </div>

          <Button disabled={loading}>
            {t(loading ? "auth.loggingIn" : "auth.login")}
            <LogIn size={24} />
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
