import { Globe, ShieldCheck, Lock, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useLocale from "../i18n/useLocale";
import { changeLanguage } from "../i18n";

function Call99Badge({ className = "" }: { className?: string }) {
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

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { language, direction } = useLocale();
  return (
    <div
      dir={direction}
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

          <h3 className="mt-6 text-4xl font-bold">{t("auth.managementSystem")}</h3>

          <p className="mt-3 text-lg">{t("auth.adminDashboard")}</p>

          <div className="my-6 h-[2px] w-14 bg-white" />

          <p className="text-xl leading-8">
            {t("auth.managementTagline")}
          </p>

          <div className="absolute bottom-8 flex items-center gap-2 text-base">
            <ShieldCheck size={18} />
            <span>{t("auth.trustTagline")}</span>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="relative flex h-screen flex-col items-center justify-center overflow-y-auto px-6 py-4">
        <button type="button" onClick={() => void changeLanguage(language === "ar" ? "en" : "ar")} className={`absolute top-6 flex h-9 items-center gap-2 rounded-full bg-[#642326] px-4 text-sm text-white ${direction === "rtl" ? "left-6" : "right-6"}`}>
          <Globe size={14} />
          {t("common.languageSwitch")}
          <ChevronDown size={16} />
        </button>

        {children}

        <footer className="mt-4 text-center text-sm text-[#8B8787]">
          <div className="mb-1 flex items-center justify-center gap-2">
            <Lock size={15} />
            {t("auth.restrictedAccess")}
          </div>

          <p>{t("auth.copyright")}</p>
        </footer>
      </div>
    </div>
  );
}
