import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/ui/AuthCard";
import Button from "../../components/ui/Button/Button";
import {
  requestPasswordResetOtp,
  requestRegistrationOtp,
  resetPassword,
} from "../../services/auth.service";
import { parseAuthSession, useAuthStore } from "../../store/authStore";
import { getErrorMessage, getErrorStatus } from "../../utils/error";
import { useTranslation } from "react-i18next";

const OTP_LENGTH = 4;
const OTP_FLOW_KEY = "otp_flow";

export default function OTP() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [otp, setOtp] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ""));
  const [serverOtp, setServerOtp] = useState(sessionStorage.getItem("login_otp") || "");
  const [timer, setTimer] = useState(Number(sessionStorage.getItem("otp_expires_in")) || 60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const phone = sessionStorage.getItem("login_phone") || "";
  const isPasswordReset = sessionStorage.getItem(OTP_FLOW_KEY) === "password-reset";

  useEffect(() => {
    const pendingAuth = sessionStorage.getItem("pending_auth");

    if (!phone || (!isPasswordReset && !pendingAuth)) {
      toast.error(isPasswordReset ? "برجاء إدخال رقم الهاتف أولاً" : "برجاء تسجيل الدخول أولاً");
      navigate("/login", { replace: true });
    }
  }, [isPasswordReset, navigate, phone]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);

    if (!pasted) return;

    event.preventDefault();

    const nextOtp = Array.from({ length: OTP_LENGTH }, () => "");
    pasted.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });

    setOtp(nextOtp);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
  };

  const handleResend = async () => {
    if (!phone) {
      toast.error("رقم الهاتف غير موجود");
      return;
    }

    setResending(true);

    try {
      const res = isPasswordReset
        ? await requestPasswordResetOtp(phone)
        : await requestRegistrationOtp(phone);
      const newOtp = res.data.otpCode;
      const expires = 60;

      if (newOtp) {
        setServerOtp(newOtp);
        sessionStorage.setItem("login_otp", newOtp);
        toast.success(`رمز التحقق للتجربة: ${newOtp}`);
      } else {
        toast.success("تم إرسال رمز التحقق");
      }

      sessionStorage.setItem("otp_expires_in", String(expires));
      setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
      setTimer(expires);
      inputsRef.current[0]?.focus();
    } catch (err) {
      const status = getErrorStatus(err);

      if (status === 400) {
        toast.error("رقم الهاتف غير صحيح");
      } else if (status === 429) {
        toast.error("عدد المحاولات كبير جداً، حاول لاحقاً");
      } else {
        toast.error(getErrorMessage(err, "حدث خطأ أثناء إرسال الرمز"));
      }
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      toast.error("برجاء إدخال رمز التحقق كاملًا");
      return;
    }

    if (timer <= 0) {
      toast.error(t("auth.validation.otpExpired"));
      return;
    }

    if (isPasswordReset && newPassword.length < 8) {
      toast.error(t("auth.validation.passwordLength"));
      return;
    }

    if (isPasswordReset && newPassword !== confirmPassword) {
      toast.error(t("auth.validation.passwordMismatch"));
      return;
    }

    setLoading(true);

    try {
      if (!isPasswordReset && serverOtp && code !== serverOtp) {
        toast.error(t("auth.validation.invalidOtp"));
        return;
      }

      if (isPasswordReset) {
        await resetPassword({ phone, otp: code, newPassword });
        sessionStorage.removeItem("login_phone");
        sessionStorage.removeItem("login_otp");
        sessionStorage.removeItem("otp_expires_in");
        sessionStorage.removeItem(OTP_FLOW_KEY);

        toast.success(t("auth.messages.resetSuccess"));
        navigate("/login", { replace: true });
        return;
      }

      const pendingAuth = parseAuthSession(sessionStorage.getItem("pending_auth"));

      if (!pendingAuth) {
        toast.error("بيانات تسجيل الدخول غير مكتملة");
        navigate("/login", { replace: true });
        return;
      }

      setAuth({
        accessToken: pendingAuth.accessToken,
        refreshToken: pendingAuth.refreshToken,
        sessionId: pendingAuth.sessionId,
        user: pendingAuth.user,
      });

      sessionStorage.removeItem("pending_auth");
      sessionStorage.removeItem("login_phone");
      sessionStorage.removeItem("login_otp");
      sessionStorage.removeItem("otp_expires_in");
      sessionStorage.removeItem(OTP_FLOW_KEY);

      toast.success(t("auth.messages.verificationSuccess"));
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء التحقق"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#F4EEEE] text-[#772326]">
            <ShieldCheck size={22} strokeWidth={2.2} />
          </div>

          <h1 className="text-[28px] font-extrabold leading-tight text-[#191919]">
            {t(isPasswordReset ? "auth.resetTitle" : "auth.phoneVerificationTitle")}
          </h1>

          <p className="mt-2 text-sm font-bold text-[#777]">
            {isPasswordReset
              ? t("auth.otpResetSubtitle")
              : t("auth.otpMinuteHint")}
          </p>

          {phone && <p className="mt-1 text-sm font-extrabold text-[#191919]">{phone}</p>}
        </div>

        <form onSubmit={handleSubmit}>
          <div dir="ltr" className="mb-5 flex justify-center gap-3">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputsRef.current[index] = element;
                }}
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                maxLength={1}
                inputMode="numeric"
                className="h-14 w-14 rounded-xl border border-[#E3E6EA] bg-white text-center text-base font-bold text-[#6B7280] outline-none transition focus:border-[#772326]"
              />
            ))}
          </div>

          {isPasswordReset && (
            <div className="mb-6 space-y-4" dir="rtl">
              <label className="block text-right text-sm font-semibold text-[#262626]">
                {t("auth.newPassword")}
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  className="mt-2 h-12 w-full rounded-xl border border-[#E3E6EA] px-4 outline-none transition focus:border-[#772326]"
                />
              </label>
              <label className="block text-right text-sm font-semibold text-[#262626]">
                {t("auth.confirmPassword")}
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  className="mt-2 h-12 w-full rounded-xl border border-[#E3E6EA] px-4 outline-none transition focus:border-[#772326]"
                />
              </label>
            </div>
          )}

          <div className="mb-8 text-center text-sm text-[#8F96A3]">
            {t("auth.didNotReceive")}{" "}
            <button
              type="button"
              disabled={timer > 0 || resending}
              onClick={handleResend}
              className="font-semibold text-[#772326] disabled:text-[#772326]/50"
            >
              {t(resending ? "auth.sending" : "auth.resend")}
            </button>{" "}
            <span>({`00:${String(Math.max(timer, 0)).padStart(2, "0")}`})</span>
          </div>

          <Button disabled={loading}>
            {t(loading ? "auth.verifying" : "auth.verify")}
            <ShieldCheck size={18} />
          </Button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E5DCDC] bg-white text-base font-bold text-[#772326] transition hover:bg-[#FBF7F7]"
          >
            <ArrowRight size={18} />
            {t("auth.backToLogin")}
          </button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
