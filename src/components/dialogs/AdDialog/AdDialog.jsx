import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Modal from "../../ui/Modal";
import AdDialogHeader from "./AdDialogHeader";
import AdForm from "./AdForm";
import AdDialogFooter from "./AdDialogFooter";
import { EMPTY_AD_FORM, AD_DIALOG_MODES, buildFormFromAd } from "./constants";

const TITLES = {
  [AD_DIALOG_MODES.CREATE]: {
    title: "اضافه اعلان جديد",
    subtitle: "قم بإنشاء حملة اعلانيه أو مساحه ترويجيه جديده للتطبيق",
  },
  [AD_DIALOG_MODES.EDIT]: {
    title: "تعديل الاعلان",
    subtitle: "تعديل تفاصيل الاعلان المنشور",
  },
  [AD_DIALOG_MODES.VIEW]: {
    title: "عرض الاعلان",
    subtitle: "عرض تفاصيل الاعلان المنشور",
  },
};

function validateForm(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "اسم الاعلان مطلوب";
  }

  if (!form.service) {
    errors.service = "الخدمه المرتبطه مطلوبه";
  }

  if (!form.startDate.trim()) {
    errors.startDate = "تاريخ البدء مطلوب";
  }

  if (!form.endDate.trim()) {
    errors.endDate = "تاريخ الانتهاء مطلوب";
  }

  return errors;
}

/**
 * Single dialog powering all three ad actions (view / edit / create) from
 * the ads table + header, so there is one place that owns the form shape
 * instead of three near-duplicate modals. Mirrors PackageDialog.
 *
 * `mode` controls the initial view; view mode can switch itself into edit
 * mode in place without closing/reopening the modal.
 */
export default function AdDialog({
  open,
  mode = AD_DIALOG_MODES.VIEW,
  ad,
  serviceOptions = [],
  onClose,
  onCreate,
  onSave,
}) {
  const [activeMode, setActiveMode] = useState(mode);
  const [form, setForm] = useState(EMPTY_AD_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setActiveMode(mode);
    setForm(mode === AD_DIALOG_MODES.CREATE ? EMPTY_AD_FORM : buildFormFromAd(ad));
    setErrors({});
    setSubmitting(false);
  }, [open, mode, ad]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const buildPayload = () => ({
    ...form,
    name: form.name.trim(),
    description: form.description.trim(),
    status: form.isActive ? "نشط" : "غير نشط",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("برجاء تعبئة جميع الحقول المطلوبة بشكل صحيح");
      return;
    }

    const payload = buildPayload();

    try {
      setSubmitting(true);

      if (activeMode === AD_DIALOG_MODES.CREATE) {
        await onCreate?.(payload);
      } else {
        await onSave?.({ ...payload, id: ad?.id });
      }

      onClose?.();
    } catch (error) {
      toast.error(error?.message || "حدث خطأ أثناء حفظ الاعلان");
    } finally {
      setSubmitting(false);
    }
  };

  const isViewMode = activeMode === AD_DIALOG_MODES.VIEW;
  const copy = TITLES[activeMode] ?? TITLES[AD_DIALOG_MODES.VIEW];

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="max-w-[640px]"
      title={<AdDialogHeader title={copy.title} subtitle={copy.subtitle} />}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <AdForm
          form={form}
          errors={errors}
          onChange={updateField}
          readOnly={isViewMode}
          serviceOptions={serviceOptions}
        />

        <AdDialogFooter
          mode={activeMode}
          submitting={submitting}
          onCancel={onClose}
          onEditClick={() => setActiveMode(AD_DIALOG_MODES.EDIT)}
        />
      </form>
    </Modal>
  );
}
