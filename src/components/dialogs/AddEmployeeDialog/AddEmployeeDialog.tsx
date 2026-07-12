import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Modal from "../../ui/Modal";
import RoleSelector from "./RoleSelector";
import EmployeeForm from "./EmployeeForm";
import EmployeeDialogHeader from "./EmployeeDialogHeader";
import EmployeeDialogFooter from "./EmployeeDialogFooter";
import { DEFAULT_ROLE, EMPTY_EMPLOYEE_FORM, ROLE_OPTIONS } from "./constants";

const DIGITS_ONLY_PATTERN = /^\d+$/;

function validateForm(form) {
  const errors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "اسم الموظف مطلوب";
  }

  if (!form.phone.trim()) {
    errors.phone = "رقم الهاتف مطلوب";
  } else if (!DIGITS_ONLY_PATTERN.test(form.phone.trim())) {
    errors.phone = "رقم الهاتف يجب أن يحتوي على أرقام فقط";
  }

  if (!form.password.trim()) {
    errors.password = "كلمة المرور مطلوبة";
  }

  return errors;
}

export default function AddEmployeeDialog({ open, onClose, onSubmit }) {
  const [role, setRole] = useState(DEFAULT_ROLE);
  const [form, setForm] = useState(EMPTY_EMPLOYEE_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Reset the form every time the dialog re-opens.
  useEffect(() => {
    if (open) {
      setRole(DEFAULT_ROLE);
      setForm(EMPTY_EMPLOYEE_FORM);
      setErrors({});
      setSubmitting(false);
    }
  }, [open]);

  const activeRole =
    ROLE_OPTIONS.find((option) => option.id === role) ?? ROLE_OPTIONS[0];

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("برجاء تعبئة جميع الحقول المطلوبة بشكل صحيح");
      return;
    }

    const payload = {
      role,
      fullName: form.fullName.trim(),
      phone: `+${form.countryCode}${form.phone.trim()}`,
      password: form.password,
    };

    try {
      setSubmitting(true);
      await onSubmit?.(payload);
      onClose?.();
    } catch (error) {
      toast.error(error?.message || "حدث خطأ أثناء إضافة الموظف");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="max-w-[640px]"
      title={
        <EmployeeDialogHeader
          title={activeRole.dialogTitle}
          subtitle="ادخل تفاصيل الحساب الجديد ادناه"
        />
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <RoleSelector options={ROLE_OPTIONS} value={role} onChange={setRole} />

        <EmployeeForm form={form} errors={errors} onChange={updateField} />

        <EmployeeDialogFooter onCancel={onClose} submitting={submitting} />
      </form>
    </Modal>
  );
}
