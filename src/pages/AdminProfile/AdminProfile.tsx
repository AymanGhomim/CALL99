import { useEffect, useState, type FormEvent } from "react";
import { Camera, Eye, EyeOff, KeyRound, LockKeyhole, Phone, Save, ShieldCheck, Upload, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore, type AuthRole } from "../../store/authStore";
import { changePassword } from "../../services/auth.service";
import { getErrorMessage } from "../../utils/error";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

const roleKeys: Record<AuthRole, string> = {
  SUPER_ADMIN: "roles.SUPER_ADMIN", ADMIN: "roles.ADMIN", GROUND_TEAM: "roles.GROUND_TEAM",
  CUSTOMER_SERVICE: "roles.CUSTOMER_SERVICE", MANAGER: "roles.MANAGER", USER: "roles.USER",
  CUSTOMER: "roles.CUSTOMER", PROVIDER: "roles.PROVIDER",
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export default function AdminProfile() {
  const { t } = useTranslation();
  const { direction } = useLocale();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    setFullName(user?.fullName ?? "");
    setPhone(user?.phone ?? "");
  }, [user?.fullName, user?.phone]);

  const avatarUrl = user?.avatarDataUrl || (user?.avatarFileId
    ? `${apiBaseUrl}/files/public/${user.avatarFileId}`
    : null);

  const handleAvatarChange = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("adminProfile.invalidImage"));
      return;
    }
    if (file.size > 1024 * 1024) {
      toast.error(t("adminProfile.imageTooLarge"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      updateUser({
        fullName: user?.fullName ?? null,
        phone: user?.phone ?? null,
        avatarDataUrl: reader.result,
      });
      setAvatarFailed(false);
      toast.success(t("adminProfile.avatarUpdated"));
    };
    reader.onerror = () => toast.error(t("adminProfile.imageReadError"));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      toast.error(t("adminProfile.nameRequired"));
      return;
    }

    updateUser({ fullName: trimmedName, phone: trimmedPhone || null });
    toast.success(t("adminProfile.saveSuccess"));
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(t("adminProfile.passwordFieldsRequired"));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(t("adminProfile.passwordMinLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("adminProfile.passwordMismatch"));
      return;
    }
    if (currentPassword === newPassword) {
      toast.error(t("adminProfile.passwordMustDiffer"));
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success(t("adminProfile.passwordChanged"));
    } catch (error) {
      toast.error(getErrorMessage(error, t("adminProfile.passwordChangeError")));
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <section dir={direction}>
      <header className="mb-7 text-right">
        <h1 className="text-2xl font-extrabold text-[#75262d] sm:text-3xl">{t("adminProfile.title")}</h1>
        <p className="mt-1.5 text-sm font-medium text-gray-500">
          {t("adminProfile.subtitle")}
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="h-fit overflow-hidden rounded-2xl border border-[#eadfe0] bg-white shadow-[0_8px_28px_rgba(83,40,44,0.06)]">
          <div className="h-24 bg-gradient-to-l from-[#75262d] to-[#9a4048]" />
          <div className="px-6 pb-7 text-center">
            <div className="relative mx-auto -mt-12 h-24 w-24">
              <span className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-[#f3e8e9] text-3xl font-extrabold text-[#75262d] shadow-md">
                {avatarUrl && !avatarFailed ? (
                  <img
                    src={avatarUrl}
                    alt={user?.fullName ?? t("adminProfile.adminFallback")}
                    className="h-full w-full object-cover"
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (user?.fullName?.trim().charAt(0) || t("adminProfile.systemAdmin").charAt(0))}
              </span>
              <label className="absolute -bottom-1 -left-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-[#75262d] text-white transition hover:bg-[#642128]" title={t("adminProfile.changePhoto")}>
                <Camera size={16} />
                <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => handleAvatarChange(event.target.files?.[0])} />
              </label>
            </div>

            <h2 className="mt-4 text-lg font-extrabold text-[#302526]">{user?.fullName || t("adminProfile.systemAdmin")}</h2>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#75262d]/8 px-3 py-1.5 text-xs font-bold text-[#75262d]">
              <ShieldCheck size={14} />
              {user ? t(roleKeys[user.role]) : t("roles.SUPER_ADMIN")}
            </div>
            <p className="mt-4 text-xs leading-6 text-[#928386]">
              {t("adminProfile.profileNote")}
            </p>
            <label className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#dbcfd0] px-4 text-xs font-bold text-[#75262d] transition hover:bg-[#fbf7f7]">
              <Upload size={15} />
              {t("adminProfile.changePhoto")}
              <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => handleAvatarChange(event.target.files?.[0])} />
            </label>
            <p className="mt-2 text-[10px] text-[#a09294]">{t("adminProfile.photoHint")}</p>
          </div>
        </aside>

        <div className="space-y-6">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-[#eadfe0] bg-white p-5 text-right shadow-[0_8px_28px_rgba(83,40,44,0.06)] sm:p-7">
          <div className="mb-6 flex items-center gap-3 border-b border-[#f0e7e8] pb-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#75262d]/8 text-[#75262d]">
              <UserRound size={21} />
            </span>
            <div>
              <h2 className="font-extrabold text-[#302526]">{t("adminProfile.personalInfo")}</h2>
              <p className="mt-0.5 text-xs text-[#928386]">{t("adminProfile.personalInfoHint")}</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-bold text-[#4a3d3f]">
              {t("adminProfile.adminName")}
              <span className="relative mt-2 block">
                <UserRound className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9b8d8f]" size={18} />
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="h-12 w-full rounded-xl border border-[#e3d7d8] bg-[#fdfbfb] pr-11 pl-4 text-sm outline-none transition focus:border-[#75262d] focus:bg-white focus:ring-2 focus:ring-[#75262d]/10"
                  placeholder={t("adminProfile.namePlaceholder")}
                />
              </span>
            </label>

            <label className="block text-sm font-bold text-[#4a3d3f]">
              {t("common.phone")}
              <span className="relative mt-2 block">
                <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9b8d8f]" size={18} />
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="h-12 w-full rounded-xl border border-[#e3d7d8] bg-[#fdfbfb] pr-11 pl-4 text-right text-sm outline-none transition focus:border-[#75262d] focus:bg-white focus:ring-2 focus:ring-[#75262d]/10"
                  placeholder={t("adminProfile.phonePlaceholder")}
                  inputMode="tel"
                />
              </span>
            </label>

            <label className="block text-sm font-bold text-[#4a3d3f] md:col-span-2">
              {t("adminProfile.permission")}
              <span className="relative mt-2 block">
                <ShieldCheck className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9b8d8f]" size={18} />
                <input
                  value={user ? t(roleKeys[user.role]) : t("roles.SUPER_ADMIN")}
                  readOnly
                  className="h-12 w-full cursor-not-allowed rounded-xl border border-[#ebe3e4] bg-[#f7f3f3] pr-11 pl-4 text-sm text-[#7e7072] outline-none"
                />
              </span>
              <span className="mt-1.5 block text-xs font-normal text-[#a09294]">{t("adminProfile.permissionHint")}</span>
            </label>
          </div>

          <div className="mt-8 flex justify-end border-t border-[#f0e7e8] pt-5">
            <button type="submit" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#75262d] px-7 text-sm font-bold text-white shadow-[0_7px_18px_rgba(117,38,45,0.2)] transition hover:bg-[#642128]">
              <Save size={18} />
              {t("common.saveChanges")}
            </button>
          </div>
        </form>
        <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-[#eadfe0] bg-white p-5 text-right shadow-[0_8px_28px_rgba(83,40,44,0.06)] sm:p-7">
          <div className="mb-6 flex items-center gap-3 border-b border-[#f0e7e8] pb-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#75262d]/8 text-[#75262d]">
              <KeyRound size={21} />
            </span>
            <div>
              <h2 className="font-extrabold text-[#302526]">{t("adminProfile.changePassword")}</h2>
              <p className="mt-0.5 text-xs text-[#928386]">{t("adminProfile.passwordHint")}</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <PasswordField label={t("adminProfile.currentPassword")} value={currentPassword} onChange={setCurrentPassword} show={showPasswords} autoComplete="current-password" />
            <div className="hidden md:block" />
            <PasswordField label={t("adminProfile.newPassword")} value={newPassword} onChange={setNewPassword} show={showPasswords} autoComplete="new-password" />
            <PasswordField label={t("adminProfile.confirmPassword")} value={confirmPassword} onChange={setConfirmPassword} show={showPasswords} autoComplete="new-password" />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#f0e7e8] pt-5">
            <button type="button" onClick={() => setShowPasswords((value) => !value)} className="flex items-center gap-2 text-xs font-semibold text-[#756669] hover:text-[#75262d]">
              {showPasswords ? <EyeOff size={17} /> : <Eye size={17} />}
              {t(showPasswords ? "adminProfile.hidePasswords" : "adminProfile.showPasswords")}
            </button>
            <button type="submit" disabled={isChangingPassword} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#75262d] px-7 text-sm font-bold text-white shadow-[0_7px_18px_rgba(117,38,45,0.2)] transition hover:bg-[#642128] disabled:cursor-not-allowed disabled:opacity-60">
              <LockKeyhole size={18} />
              {isChangingPassword ? t("adminProfile.changing") : t("adminProfile.changePassword")}
            </button>
          </div>
        </form>
        </div>
      </div>
    </section>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  autoComplete: string;
}

function PasswordField({ label, value, onChange, show, autoComplete }: PasswordFieldProps) {
  return (
    <label className="block text-sm font-bold text-[#4a3d3f]">
      {label}
      <span className="relative mt-2 block">
        <LockKeyhole className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9b8d8f]" size={18} />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          className="h-12 w-full rounded-xl border border-[#e3d7d8] bg-[#fdfbfb] pr-11 pl-4 text-sm outline-none transition focus:border-[#75262d] focus:bg-white focus:ring-2 focus:ring-[#75262d]/10"
          placeholder="••••••••"
        />
      </span>
    </label>
  );
}
