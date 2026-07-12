import { Globe, ShieldCheck, Lock, ChevronDown } from "lucide-react";

function Call99Badge({ className = "" }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-white p-2 shadow-[0_4px_14px_rgba(0,0,0,.25)] ${className}`}
    >
      <img
        src="/images/logo.png"
        alt="CALL99"
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export default function AuthLayout({ children }) {
  return (
    <div
      dir="rtl"
      className="grid h-screen overflow-hidden bg-[#FBF7F7] lg:grid-cols-[474px_1fr]"
    >
      {/* Image side */}
      <div className="relative hidden h-screen w-[474px] overflow-hidden lg:flex">
        <img
          src="/images/auth-bg.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(85,22,22,0.65) 0%, rgba(85,22,22,0.75) 100%)",
          }}
        />

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-10 text-center text-white">
          <Call99Badge className="mb-6 h-12 w-12" />

          <h2 className="text-5xl font-black">CALL99</h2>

          <h3 className="mt-6 text-4xl font-bold">نظام إدارة شامل</h3>

          <p className="mt-3 text-lg">لوحة تحكم الإدارة</p>

          <div className="my-6 h-[2px] w-14 bg-white" />

          <p className="text-xl leading-8">
            تحكم كامل في جميع عملياتك بسهولة وأمان
          </p>

          <div className="absolute bottom-8 flex items-center gap-2 text-base">
            <ShieldCheck size={18} />
            <span>أمان، موثوقية، احترافية</span>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="relative flex h-screen flex-col items-center justify-center overflow-y-auto px-6 py-4">
        <button className="absolute left-6 top-6 flex h-9 items-center gap-2 rounded-full bg-[#642326] px-4 text-sm text-white">
          <Globe size={14} />
          العربية
          <ChevronDown size={16} />
        </button>

        {children}

        <footer className="mt-4 text-center text-sm text-[#8B8787]">
          <div className="mb-1 flex items-center justify-center gap-2">
            <Lock size={15} />
            الوصول إلى هذه الصفحة محصور بإدارة النظام فقط
          </div>

          <p>جميع الحقوق محفوظة © CALL99 2026</p>
        </footer>
      </div>
    </div>
  );
}
