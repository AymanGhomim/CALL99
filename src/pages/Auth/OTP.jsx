import { useEffect, useRef, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/ui/AuthCard";
import Button from "../../components/ui/Button/Button";
import { requestRegistrationOtp } from "../../services/auth.service";
import { useAuthStore } from "../../store/authStore";
import { getErrorMessage } from "../../utils/error";

const OTP_LENGTH = 4;

export default function OTP() {
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [serverOtp, setServerOtp] = useState(sessionStorage.getItem("login_otp") || "");
  const [timer, setTimer] = useState(Number(sessionStorage.getItem("otp_expires_in")) || 60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const phone = sessionStorage.getItem("login_phone") || "";

  useEffect(() => {
    const pendingAuth = sessionStorage.getItem("pending_auth");

    if (!pendingAuth || !phone) {
      toast.error("برجاء تسجيل الدخول أولاً");
      navigate("/login", { replace: true });
    }
  }, [navigate, phone]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);

    if (!pasted) return;

    e.preventDefault();

    const nextOtp = Array(OTP_LENGTH).fill("");
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
      const res = await requestRegistrationOtp(phone);
      const newOtp = res?.data?.otp;
      const expires = res?.data?.expiresInSeconds || 60;

      if (newOtp) {
        setServerOtp(newOtp);
        sessionStorage.setItem("login_otp", newOtp);
        toast.success(`رمز التحقق للتجربة: ${newOtp}`);
      } else {
        toast.success("تم إرسال رمز التحقق");
      }

      sessionStorage.setItem("otp_expires_in", String(expires));
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimer(expires);
      inputsRef.current[0]?.focus();
    } catch (err) {
      const status = err?.response?.status;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      toast.error("برجاء إدخال رمز التحقق كاملًا");
      return;
    }

    if (timer <= 0) {
      toast.error("انتهت صلاحية رمز التحقق، اضغط إعادة إرسال");
      return;
    }

    setLoading(true);

    try {
      // لحد ما يتوفر Verify OTP endpoint، التحقق بيتم بالكود الراجع من Request OTP.
      if (serverOtp && code !== serverOtp) {
        toast.error("رمز التحقق غير صحيح");
        return;
      }

      const pendingAuth = JSON.parse(sessionStorage.getItem("pending_auth"));

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

      toast.success("تم التحقق بنجاح");
      navigate("/dashboard", { replace: true });
    } catch {
      toast.error("حدث خطأ أثناء التحقق");
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
            التحقق من رقم الهاتف
          </h1>

          <p className="mt-2 text-sm font-bold text-[#777]">
            رمز التحقق مكون من 4 أرقام وصالح لمدة دقيقة
          </p>

          {phone && <p className="mt-1 text-sm font-extrabold text-[#191919]">{phone}</p>}
        </div>

        <form onSubmit={handleSubmit}>
          <div dir="ltr" className="mb-5 flex justify-center gap-3">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
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

          <div className="mb-8 text-center text-sm text-[#8F96A3]">
            لم يصلك الرمز؟{" "}
            <button
              type="button"
              disabled={timer > 0 || resending}
              onClick={handleResend}
              className="font-semibold text-[#772326] disabled:text-[#772326]/50"
            >
              {resending ? "جاري الإرسال..." : "إعادة إرسال الرمز"}
            </button>{" "}
            <span>({`00:${String(Math.max(timer, 0)).padStart(2, "0")}`})</span>
          </div>

          <Button disabled={loading}>
            {loading ? "جاري التحقق..." : "تحقق"}
            <ShieldCheck size={18} />
          </Button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E5DCDC] bg-white text-base font-bold text-[#772326] transition hover:bg-[#FBF7F7]"
          >
            <ArrowRight size={18} />
            الرجوع إلى تسجيل الدخول
          </button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
