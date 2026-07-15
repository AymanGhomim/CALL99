import { useEffect, useState, type FormEvent } from "react";
import { Pencil, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import type { Coupon } from "./CouponsTable";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";
import { translateStatus, translateValue } from "../../i18n/translateEnum";

export type CouponDialogMode = "create" | "view" | "edit";

interface CouponDialogProps {
  open: boolean;
  mode: CouponDialogMode;
  coupon: Coupon | null;
  onClose: () => void;
  onSubmit: (coupon: Coupon) => void | Promise<void>;
  onEdit: () => void;
}

const emptyCoupon: Coupon = {
  id: 0, code: "", description: "", discountType: "نسبة مئوية", discountValue: "",
  services: "جميع الخدمات", maxDiscount: "", minOrder: "", usageLimit: 1,
  maxTotalUsage: 0, totalUsage: 0,
  startDate: "", endDate: "", status: "نشط",
};

const fieldClass = "mt-2 h-12 w-full rounded-xl border border-[#e7dede] bg-white px-4 outline-none focus:border-[#75262d]";

function CouponForm({ initialValue, submitLabel, onSubmit }: { initialValue: Coupon; submitLabel: string; onSubmit: (coupon: Coupon) => void | Promise<void> }) {
  const { t } = useTranslation();
  const { direction } = useLocale();
  const [form, setForm] = useState(initialValue);
  const [selectedServices, setSelectedServices] = useState<string[]>(initialValue.services === "جميع الخدمات" ? ["جميع الخدمات"] : initialValue.services.split("، "));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(initialValue);
    setSelectedServices(initialValue.services === "جميع الخدمات" ? ["جميع الخدمات"] : initialValue.services.split("، "));
    setSubmitting(false);
  }, [initialValue]);

  const update = <Key extends keyof Coupon>(key: Key, value: Coupon[Key]) => setForm((current) => ({ ...current, [key]: value }));
  const toggleService = (service: string) => {
    if (service === "جميع الخدمات") return setSelectedServices([service]);
    setSelectedServices((current) => {
      const withoutAll = current.filter((item) => item !== "جميع الخدمات");
      return withoutAll.includes(service) ? withoutAll.filter((item) => item !== service) : [...withoutAll, service];
    });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit({ ...form, services: selectedServices.length ? selectedServices.join("، ") : "جميع الخدمات" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("coupon.saveError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5" dir={direction}>
      <label className="block text-start text-sm font-semibold">{t("coupon.code")}<input required value={form.code} onChange={(e) => update("code", e.target.value.toUpperCase())} placeholder={t("coupon.codePlaceholder")} className={fieldClass} /></label>
      <label className="block text-start text-sm font-semibold">{t("tables.description")}<input required value={form.description} onChange={(e) => update("description", e.target.value)} placeholder={t("coupon.descriptionPlaceholder")} className={fieldClass} /></label>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="text-start text-sm font-semibold">{t("tables.startDate")}<input required type="date" value={form.startDate.replaceAll("/", "-")} onChange={(e) => update("startDate", e.target.value)} className={fieldClass} /></label>
        <label className="text-start text-sm font-semibold">{t("tables.endDate")}<input required type="date" value={form.endDate.replaceAll("/", "-")} onChange={(e) => update("endDate", e.target.value)} className={fieldClass} /></label>
        <label className="text-start text-sm font-semibold">{t("coupon.discountType")}<select value={form.discountType} onChange={(e) => update("discountType", e.target.value)} className={fieldClass}><option value="نسبة مئوية">{t("values.percentage")}</option><option value="مبلغ ثابت">{t("values.fixedAmount")}</option></select></label>
        <label className="text-start text-sm font-semibold">{t("coupon.discountValue")}<input required value={form.discountValue} onChange={(e) => update("discountValue", e.target.value)} placeholder="20%" className={fieldClass} /></label>
        <label className="text-start text-sm font-semibold">{t("coupon.maxDiscount")}<input value={form.maxDiscount} onChange={(e) => update("maxDiscount", e.target.value)} placeholder="100" className={fieldClass} /></label>
        <label className="text-start text-sm font-semibold">{t("coupon.minimumOrder")}<input value={form.minOrder} onChange={(e) => update("minOrder", e.target.value)} placeholder="50" className={fieldClass} /></label>
      </div>
      <label className="block text-start text-sm font-semibold">{t("coupon.usagePerUser")}<input type="number" min={1} value={form.usageLimit} onChange={(e) => update("usageLimit", Number(e.target.value) || 1)} className={fieldClass} /></label>
      <fieldset><legend className="mb-3 text-start text-sm font-semibold">{t("coupon.appliesTo")}</legend><div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-3">{["جميع الخدمات", "غسيل السيارات", "صيانة سريعة", "تأجير السيارات", "سطحة"].map((service) => <label key={service} className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-500"><span>{translateValue(service, t)}</span><input type="checkbox" checked={selectedServices.includes(service)} onChange={() => toggleService(service)} className="accent-[#75262d]" /></label>)}</div></fieldset>
      <div className="flex items-center justify-between border-t border-[#eee7e7] pt-5"><button type="submit" disabled={submitting} className="flex h-12 items-center gap-2 rounded-xl bg-[#75262d] px-7 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"><Ticket size={18} />{submitting ? t("coupon.saving") : submitLabel}</button></div>
    </form>
  );
}

function CouponDetails({ coupon, onEdit }: { coupon: Coupon; onEdit: () => void }) {
  const { t } = useTranslation();
  const details = [
    [t("tables.endDate"), coupon.endDate], [t("tables.startDate"), coupon.startDate], [t("coupon.discountType"), translateValue(coupon.discountType, t)],
    [t("coupon.discountValue"), coupon.discountValue], [t("coupon.maxDiscount"), coupon.maxDiscount || "—"], [t("coupon.minimumOrder"), coupon.minOrder || "—"],
    [t("tables.usageLimit"), t("coupon.times", { count: coupon.usageLimit })], [t("stats.totalUsage"), t("coupon.times", { count: coupon.totalUsage })],
  ];
  return (
    <div dir="rtl">
      <div className="mb-6 flex items-start justify-start gap-5"><div className="flex h-32 w-40 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-[#75262d] bg-[#fbf4f4]"><Ticket size={42} className="text-[#75262d]" /></div><div className="text-start"><Badge tone={coupon.status === "نشط" ? "success" : "danger"}>{translateStatus(coupon.status, t)}</Badge><p className="mt-5 text-xs text-gray-400">{t("coupon.code")}</p><h3 className="text-2xl font-extrabold">{coupon.code}</h3><p className="mt-2 text-sm text-gray-500">{coupon.description}</p></div></div>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#eee5e5] bg-[#eee5e5] sm:grid-cols-3">{details.map(([label, value]) => <div key={label} className="bg-white p-5 text-center"><p className="text-sm font-bold">{label}</p><p className="mt-2 text-gray-600">{value}</p></div>)}</div>
      <div className="mt-6 text-start"><p className="mb-3 font-bold">{t("coupon.appliesTo")}</p><div className="flex flex-wrap gap-2">{coupon.services.split("، ").map((service) => <span key={service} className="rounded-full border border-[#e7dede] px-4 py-2 text-sm text-gray-500">{translateValue(service, t)}</span>)}</div></div>
      <button type="button" onClick={onEdit} className="mt-7 flex h-12 items-center gap-2 rounded-xl bg-[#75262d] px-7 font-bold text-white"><Pencil size={17} />{t("coupon.edit")}</button>
    </div>
  );
}

export default function CouponDialog({ open, mode, coupon, onClose, onSubmit, onEdit }: CouponDialogProps) {
  const { t } = useTranslation();
  const title = t(mode === "create" ? "coupon.create" : mode === "edit" ? "coupon.edit" : "coupon.details");
  return <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-[720px]">{mode === "view" && coupon ? <CouponDetails coupon={coupon} onEdit={onEdit} /> : <CouponForm initialValue={coupon ?? emptyCoupon} submitLabel={t(mode === "create" ? "coupon.add" : "coupon.save")} onSubmit={onSubmit} />}</Modal>;
}
