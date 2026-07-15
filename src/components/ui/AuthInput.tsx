import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  prefix?: string;
  inputClassName?: string;
}

export default function AuthInput({
  label,
  icon,
  prefix,
  className = "",
  inputClassName = "",
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const { direction } = useLocale();

  const isPassword = props.type === "password";

  return (
    <div className={className}>
      <label className="mb-2 block text-start text-sm font-semibold text-[#262626]">
        {label}
      </label>

      <div className="relative flex h-11 items-center rounded-xl border border-[#E5DCDC] bg-white px-4">
        {isPassword ? (
          <button
            type="button"
            aria-label={t(showPassword ? "auth.hidePassword" : "auth.showPassword")}
            onClick={() => setShowPassword((prev) => !prev)}
            className={`absolute top-1/2 -translate-y-1/2 text-[#777] transition-colors hover:text-[#642326] ${direction === "rtl" ? "left-4" : "right-4"}`}
          >
            {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
          </button>
        ) : (
          icon && (
            <div className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#777] ${direction === "rtl" ? "right-4" : "left-4"}`}>
              {icon}
            </div>
          )
        )}

        {prefix && (
          <div dir="ltr" className={`pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center gap-3 ${direction === "rtl" ? "left-4" : "right-4"}`}>
            <span dir="ltr" className="text-sm font-semibold">{prefix}</span>
            <div className="h-5 w-px bg-[#DDD]" />
          </div>
        )}

        <input
          {...props}
          type={isPassword ? (showPassword ? "text" : "password") : props.type}
          autoComplete={props.autoComplete || "off"}
          spellCheck={false}
          className={`w-full bg-transparent text-sm outline-none placeholder:text-[#8E8E8E] selection:bg-transparent autofill:!bg-transparent ${isPassword ? direction === "rtl" ? "pl-12" : "pr-12" : icon && prefix ? "px-16" : icon ? direction === "rtl" ? "pr-10" : "pl-10" : prefix ? direction === "rtl" ? "pl-16" : "pr-16" : ""} ${inputClassName}`}
        />
      </div>
    </div>
  );
}
