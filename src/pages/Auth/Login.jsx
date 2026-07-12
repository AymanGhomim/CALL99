import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Smartphone } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/ui/AuthCard";
import AuthInput from "../../components/ui/AuthInput";
import Button from "../../components/ui/Button/Button";
import { login, requestRegistrationOtp } from "../../services/auth.service";
import { getErrorMessage } from "../../utils/error";

const formatSaudiPhone = (phone) => {
  const digits = phone.replace(/\D/g, "");

  if (phone.trim().startsWith("+")) return `+${digits}`;
  if (digits.startsWith("966")) return `+${digits}`;
  if (digits.startsWith("05")) return `+966${digits.slice(1)}`;
  if (digits.startsWith("5")) return `+966${digits}`;

  return `+966${digits}`;
};

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setForm((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phone = formatSaudiPhone(form.phone);

    if (!form.phone.trim() || !form.password.trim()) {
      toast.error("برجاء إدخال رقم الهاتف وكلمة المرور");
      return;
    }

    setLoading(true);

    try {
      const loginRes = await login(phone, form.password);
      const authData = loginRes.data;

      // نخزن بيانات الدخول مؤقتًا فقط، والداشبورد لن يفتح إلا بعد OTP.
      sessionStorage.setItem("pending_auth", JSON.stringify(authData));
      sessionStorage.setItem("login_phone", phone);

      try {
        const otpRes = await requestRegistrationOtp(phone);
        const otpCode = otpRes?.data?.otp;
        const expiresInSeconds = otpRes?.data?.expiresInSeconds || 60;

        if (otpCode) {
          sessionStorage.setItem("login_otp", otpCode);
          toast.success(`رمز التحقق للتجربة: ${otpCode}`);
        } else {
          toast.success("تم إرسال رمز التحقق");
        }

        sessionStorage.setItem("otp_expires_in", String(expiresInSeconds));
      } catch (otpErr) {
        toast.error(
          getErrorMessage(otpErr, "تم تسجيل الدخول، لكن حدث خطأ أثناء إرسال رمز التحقق"),
        );
        return;
      }

      navigate("/otp", { replace: true });
    } catch (err) {
      const status = err?.response?.status;

      if (status === 400) {
        toast.error("برجاء التأكد من رقم الهاتف وكلمة المرور");
      } else if (status === 401) {
        toast.error("رقم الهاتف أو كلمة المرور غير صحيحة");
      } else if (status === 429) {
        toast.error("عدد محاولات تسجيل الدخول كبير جداً، حاول لاحقاً");
      } else {
        toast.error(getErrorMessage(err, "حدث خطأ أثناء تسجيل الدخول"));
      }
    } finally {
      setLoading(false);
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
            تسجيل دخول الإدارة
          </h1>

          <p className="mt-3 text-base font-normal text-[#777]">
            الرجاء إدخال بيانات الدخول الخاصة بك
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="رقم الهاتف"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            icon={<Smartphone size={24} />}
            placeholder="500000001"
            prefix="+966"
            required
          />

          <AuthInput
            label="كلمة المرور"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="كلمة المرور"
            required
          />

          <div className="flex items-center justify-start">
            <label className="flex cursor-pointer items-center gap-3 text-lg text-[#333]">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="h-5 w-5 rounded border-[#A15B5B] accent-[#772326]"
              />
              تذكرني
            </label>
          </div>

          <Button disabled={loading}>
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            <LogIn size={24} />
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
