import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AuthInput({
  label,
  icon,
  prefix,
  className = "",
  inputClassName = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = props.type === "password";

  return (
    <div className={className}>
      <label className="mb-2 block text-right text-sm font-semibold text-[#262626]">
        {label}
      </label>

      <div className="relative flex h-11 items-center rounded-xl border border-[#E5DCDC] bg-white px-4">
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777] transition-colors hover:text-[#642326]"
          >
            {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
          </button>
        ) : (
          icon && (
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#777]">
              {icon}
            </div>
          )
        )}

        {prefix && (
          <>
            <span className="ml-3 text-sm font-semibold">{prefix}</span>
            <div className="ml-3 h-5 w-px bg-[#DDD]" />
          </>
        )}

        <input
          {...props}
          type={isPassword ? (showPassword ? "text" : "password") : props.type}
          autoComplete={props.autoComplete || "off"}
          spellCheck={false}
          className={`w-full bg-transparent pl-12 text-sm outline-none placeholder:text-[#8E8E8E] selection:bg-transparent autofill:!bg-transparent ${inputClassName}`}
        />
      </div>
    </div>
  );
}
