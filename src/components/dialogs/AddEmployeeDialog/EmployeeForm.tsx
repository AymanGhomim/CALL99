import { useState } from "react";
import { Eye, EyeOff, Phone, User } from "lucide-react";

import { COUNTRY_CODES } from "./constants";

const inputBase =
  "h-14 w-full rounded-2xl border bg-white text-sm text-[#262626] outline-none transition-colors placeholder:text-[#8E8E8E]";

function FieldWrapper({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-right text-sm font-semibold text-[#262626]">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-right text-xs font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}

function TextField({ label, icon: Icon, error, ...props }) {
  return (
    <FieldWrapper label={label} error={error}>
      <div className="relative flex items-center">
        {Icon && (
          <Icon
            size={20}
            className="pointer-events-none absolute left-4 text-[#9c9c9c]"
          />
        )}
        <input
          {...props}
          className={`${inputBase} pl-12 pr-4 ${
            error
              ? "border-rose-300 focus:border-rose-400"
              : "border-[#E5DCDC] focus:border-[#75262d]"
          }`}
        />
      </div>
    </FieldWrapper>
  );
}

function PasswordField({ label, error, value, onChange, name }) {
  const [visible, setVisible] = useState(false);

  return (
    <FieldWrapper label={label} error={error}>
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute left-4 z-10 text-[#9c9c9c] transition-colors hover:text-[#75262d]"
          aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        >
          {visible ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
        <input
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="كلمه المرور"
          autoComplete="new-password"
          className={`${inputBase} pl-12 pr-4 ${
            error
              ? "border-rose-300 focus:border-rose-400"
              : "border-[#E5DCDC] focus:border-[#75262d]"
          }`}
        />
      </div>
    </FieldWrapper>
  );
}

function PhoneField({ label, error, value, onChange, countryCode, onCountryChange }) {
  return (
    <FieldWrapper label={label} error={error}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={countryCode}
            onChange={(event) => onCountryChange(event.target.value)}
            className="h-14 appearance-none rounded-2xl border border-[#E5DCDC] bg-white pl-4 pr-11 text-sm font-semibold text-[#262626] outline-none"
          >
            {COUNTRY_CODES.map((country) => (
              <option key={country.code} value={country.code}>
                +{country.code}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md bg-[#0f9d58] text-xs">
            🇸🇦
          </span>
        </div>

        <div className="relative flex flex-1 items-center">
          <Phone
            size={20}
            className="pointer-events-none absolute right-4 text-[#9c9c9c]"
          />
          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            value={value}
            onChange={onChange}
            placeholder="50XXXXXXXX"
            className={`${inputBase} pl-4 pr-12 text-left ${
              error
                ? "border-rose-300 focus:border-rose-400"
                : "border-[#E5DCDC] focus:border-[#75262d]"
            }`}
          />
        </div>
      </div>
    </FieldWrapper>
  );
}

export default function EmployeeForm({ form, errors, onChange }) {
  const handleTextChange = (field) => (event) => onChange(field, event.target.value);

  return (
    <div className="flex flex-col gap-5">
      <TextField
        label="اسم الموظف"
        name="fullName"
        icon={User}
        value={form.fullName}
        onChange={handleTextChange("fullName")}
        placeholder="ادخل الاسم"
        error={errors.fullName}
      />

      <PhoneField
        label="رقم الهاتف"
        value={form.phone}
        onChange={handleTextChange("phone")}
        countryCode={form.countryCode}
        onCountryChange={(code) => onChange("countryCode", code)}
        error={errors.phone}
      />

      <PasswordField
        label="كلمه المرور"
        name="password"
        value={form.password}
        onChange={handleTextChange("password")}
        error={errors.password}
      />
    </div>
  );
}
