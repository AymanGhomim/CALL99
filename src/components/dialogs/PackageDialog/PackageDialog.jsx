import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../../ui/Modal";
import ConfirmDialog from "../../ui/ConfirmDialog";
import PackageDialogHeader from "./PackageDialogHeader";
import PackageForm from "./PackageForm";
import PackageDialogFooter from "./PackageDialogFooter";
import { EMPTY_PACKAGE_FORM, PACKAGE_DIALOG_MODES, buildFormFromPackage } from "./constants";

const TITLES = {
  [PACKAGE_DIALOG_MODES.CREATE]: {
    title: "إنشاء باقه جديده",
    subtitle: "قم بإرسال تنبيهات فورية أو مجدولة لمستخدمي النظام",
  },
  [PACKAGE_DIALOG_MODES.EDIT]: {
    title: "تعديل الباقه",
    subtitle: "تعديل تفاصيل الباقه المرسله",
  },
  [PACKAGE_DIALOG_MODES.VIEW]: {
    title: "عرض الباقه",
    subtitle: "عرض تفاصيل الباقه المرسله",
  },
};

function validateForm(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "اسم الباقه مطلوب";
  }

  return errors;
}

/**
 * Single dialog powering all three package actions (view / edit / create)
 * from the packages table + header, so there is one place that owns the
 * form shape instead of three near-duplicate modals.
 *
 * `mode` controls the initial view; view mode can switch itself into edit
 * mode in place (matching the "تعديل الباقه" button in the design) without
 * closing/reopening the modal.
 */
export default function PackageDialog({
  open,
  mode = PACKAGE_DIALOG_MODES.VIEW,
  package: pkg,
  onClose,
  onCreate,
  onSave,
  onSetDefault,
}) {
  const [activeMode, setActiveMode] = useState(mode);
  const [form, setForm] = useState(EMPTY_PACKAGE_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmDefaultOpen, setConfirmDefaultOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setActiveMode(mode);
    setForm(
      mode === PACKAGE_DIALOG_MODES.CREATE
        ? EMPTY_PACKAGE_FORM
        : buildFormFromPackage(pkg),
    );
    setErrors({});
    setSubmitting(false);
    setConfirmDefaultOpen(false);
  }, [open, mode, pkg]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const buildPayload = () => ({
    ...form,
    name: form.name.trim(),
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

      if (activeMode === PACKAGE_DIALOG_MODES.CREATE) {
        await onCreate?.(payload);
      } else {
        await onSave?.({ ...payload, id: pkg?.id });
      }

      onClose?.();
    } catch (error) {
      toast.error(error?.message || "حدث خطأ أثناء حفظ الباقه");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDefault = async () => {
    try {
      setSubmitting(true);
      await onSetDefault?.(pkg);
      setConfirmDefaultOpen(false);
      onClose?.();
    } catch (error) {
      toast.error(error?.message || "حدث خطأ أثناء تعيين الباقه الافتراضيه");
    } finally {
      setSubmitting(false);
    }
  };

  const isViewMode = activeMode === PACKAGE_DIALOG_MODES.VIEW;
  const copy = TITLES[activeMode] ?? TITLES[PACKAGE_DIALOG_MODES.VIEW];

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        maxWidth="max-w-[640px]"
        title={<PackageDialogHeader title={copy.title} subtitle={copy.subtitle} />}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <PackageForm
            form={form}
            errors={errors}
            onChange={updateField}
            readOnly={isViewMode}
          />

          {isViewMode && (
            <div>
              <button
                type="button"
                disabled={form.isDefault}
                onClick={() => setConfirmDefaultOpen(true)}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-[#E5DCDC] bg-white text-sm font-bold text-[#75262d] transition-colors duration-200 hover:bg-[#f7ecee] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Star size={18} />
                {form.isDefault ? "الباقه الافتراضيه حالياً" : "تعيين كافتراضي"}
              </button>
              {!form.isDefault && (
                <p className="mt-2 text-right text-xs font-medium text-gray-400">
                  سيتم تعيين هذه الباقه كافتراضيه لجميع المستخدمين
                </p>
              )}
            </div>
          )}

          <PackageDialogFooter
            mode={activeMode}
            submitting={submitting}
            onCancel={onClose}
            onEditClick={() => setActiveMode(PACKAGE_DIALOG_MODES.EDIT)}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmDefaultOpen}
        onClose={() => setConfirmDefaultOpen(false)}
        onConfirm={handleConfirmDefault}
        icon={Star}
        title="تعيين كافتراضي؟"
        description="سيتم تعيين هذه الباقة كافتراضية لجميع المستخدمين الجدد تلقائياً بعد تسجيلهم. هل أنت متأكد من المتابعة؟"
        cancelLabel="الغاء"
        confirmLabel="تاكيد"
        loading={submitting}
      />
    </>
  );
}
