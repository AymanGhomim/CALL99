import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Modal from "../../ui/Modal";
import NotificationDialogHeader from "./NotificationDialogHeader";
import NotificationForm from "./NotificationForm";
import NotificationDialogFooter from "./NotificationDialogFooter";
import {
  EMPTY_NOTIFICATION_FORM,
  NOTIFICATION_DIALOG_MODES,
  buildFormFromNotification,
} from "./constants";

const TITLES = {
  [NOTIFICATION_DIALOG_MODES.CREATE]: {
    title: "انشاء اشعار جديد",
    subtitle: "قم بإنشاء تنبيه أو رسالة جديدة لإرسالها للمستخدمين",
  },
  [NOTIFICATION_DIALOG_MODES.EDIT]: {
    title: "تعديل الإشعار",
    subtitle: "تعديل تفاصيل الإشعار الحالي",
  },
  [NOTIFICATION_DIALOG_MODES.VIEW]: {
    title: "عرض الإشعار",
    subtitle: "عرض تفاصيل الإشعار المرسل",
  },
};

function validateForm(form) {
  const errors = {};

  if (!form.title.trim()) {
    errors.title = "عنوان الإشعار مطلوب";
  }

  if (!form.audience) {
    errors.audience = "فئة المستلمين مطلوبة";
  }

  return errors;
}

/**
 * Single dialog powering all three notification actions (view / edit / create)
 * from the notifications table + header, so there is one place that owns the
 * form shape instead of three near-duplicate modals. Mirrors AdDialog.
 *
 * `mode` controls the initial view; view mode can switch itself into edit
 * mode in place without closing/reopening the modal.
 */
export default function NotificationDialog({
  open,
  mode = NOTIFICATION_DIALOG_MODES.VIEW,
  notification,
  audienceOptions = [],
  onClose,
  onCreate,
  onSave,
}) {
  const [activeMode, setActiveMode] = useState(mode);
  const [form, setForm] = useState(EMPTY_NOTIFICATION_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setActiveMode(mode);
    setForm(
      mode === NOTIFICATION_DIALOG_MODES.CREATE
        ? EMPTY_NOTIFICATION_FORM
        : buildFormFromNotification(notification),
    );
    setErrors({});
    setSubmitting(false);
  }, [open, mode, notification]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const buildPayload = () => ({
    ...form,
    title: form.title.trim(),
    description: form.description.trim(),
    time: form.time.trim() || "الإرسال الفوري",
    status: form.isActive ? "نشط" : "متوقف",
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

      if (activeMode === NOTIFICATION_DIALOG_MODES.CREATE) {
        await onCreate?.(payload);
      } else {
        await onSave?.({ ...payload, id: notification?.id });
      }

      onClose?.();
    } catch (error) {
      toast.error(error?.message || "حدث خطأ أثناء حفظ الإشعار");
    } finally {
      setSubmitting(false);
    }
  };

  const isViewMode = activeMode === NOTIFICATION_DIALOG_MODES.VIEW;
  const copy = TITLES[activeMode] ?? TITLES[NOTIFICATION_DIALOG_MODES.VIEW];

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="max-w-[640px]"
      title={<NotificationDialogHeader title={copy.title} subtitle={copy.subtitle} />}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <NotificationForm
          form={form}
          errors={errors}
          onChange={updateField}
          readOnly={isViewMode}
          audienceOptions={audienceOptions}
        />

        <NotificationDialogFooter
          mode={activeMode}
          submitting={submitting}
          onCancel={onClose}
          onEditClick={() => setActiveMode(NOTIFICATION_DIALOG_MODES.EDIT)}
        />
      </form>
    </Modal>
  );
}
