import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../../ui/Modal";
import NotificationDialogHeader from "./NotificationDialogHeader";
import NotificationForm from "./NotificationForm";
import NotificationDetailsView from "./NotificationDetailsView";
import NotificationDialogFooter from "./NotificationDialogFooter";
import {
  EMPTY_NOTIFICATION_FORM,
  NOTIFICATION_DIALOG_MODES,
  SEND_TIME_MODES,
  buildFormFromNotification,
  buildScheduleSummary,
} from "./constants";

const TITLES = {
  [NOTIFICATION_DIALOG_MODES.CREATE]: {
    title: "إنشاء إشعار جديد",
    subtitle: "قم بإرسال تنبيهات فورية أو مجدولة لمستخدمي النظام",
  },
  [NOTIFICATION_DIALOG_MODES.EDIT]: {
    title: "تعديل الاشعار",
    subtitle: "قم بإرسال تنبيهات فورية أو مجدولة لمستخدمي النظام",
  },
  [NOTIFICATION_DIALOG_MODES.VIEW]: {
    title: "تفاصيل الإشعار",
    subtitle: null,
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

  if (form.sendTimeMode === SEND_TIME_MODES.SCHEDULED) {
    if (!form.sendDate) {
      errors.sendDate = "تاريخ الإرسال مطلوب";
    }
    if (!form.sendTime) {
      errors.sendTime = "وقت الإرسال مطلوب";
    }
  }

  return errors;
}

/**
 * Single dialog powering all three notification actions. Create/edit share
 * NotificationForm; view mode renders NotificationDetailsView instead,
 * since the "تفاصيل الإشعار" screen is a dedicated summary + stats layout,
 * not just the form fields rendered disabled.
 */
export default function NotificationDialog({
  open,
  mode = NOTIFICATION_DIALOG_MODES.VIEW,
  notification,
  onClose,
  onCreate,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY_NOTIFICATION_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

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
    time: buildScheduleSummary(form),
    status: form.isActive
      ? form.sendTimeMode === SEND_TIME_MODES.SCHEDULED
        ? "مجدولة"
        : "نشط"
      : "متوقف",
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

      if (mode === NOTIFICATION_DIALOG_MODES.CREATE) {
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

  const isViewMode = mode === NOTIFICATION_DIALOG_MODES.VIEW;
  const copy = TITLES[mode] ?? TITLES[NOTIFICATION_DIALOG_MODES.VIEW];

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="max-w-[640px]"
      title={
        <NotificationDialogHeader
          title={copy.title}
          subtitle={copy.subtitle}
          icon={isViewMode ? Eye : undefined}
        />
      }
    >
      {isViewMode ? (
        <div className="flex flex-col gap-6">
          <NotificationDetailsView notification={notification} />
          <NotificationDialogFooter mode={mode} onCancel={onClose} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <NotificationForm form={form} errors={errors} onChange={updateField} />
          <NotificationDialogFooter mode={mode} submitting={submitting} onCancel={onClose} />
        </form>
      )}
    </Modal>
  );
}
