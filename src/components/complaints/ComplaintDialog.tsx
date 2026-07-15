import { useEffect, useState, type FormEvent } from "react";
import { ImageUp, PlusCircle, Save, Trash2, UploadCloud } from "lucide-react";
import Modal from "../ui/Modal";
import ConfirmDialog from "../ui/ConfirmDialog";
import type { Complaint } from "./ComplaintsTable";

export type ComplaintDialogMode = "create" | "edit" | "view";

interface ComplaintDialogProps {
  open: boolean;
  mode: ComplaintDialogMode;
  complaint: Complaint | null;
  onClose: () => void;
  onSubmit: (complaint: Complaint) => void;
}

const emptyComplaint: Complaint = {
  id: 0,
  ticketNo: "",
  customer: "",
  type: "",
  orderNo: "",
  date: "",
  status: "قيد المراجعة",
  details: "",
  imageName: "",
  adminNotes: "",
};

const fieldClass = "mt-2 h-12 w-full rounded-xl border border-[#e7dede] bg-white px-4 text-right outline-none focus:border-[#75262d]";

export default function ComplaintDialog({ open, mode, complaint, onClose, onSubmit }: ComplaintDialogProps) {
  const [form, setForm] = useState<Complaint>(emptyComplaint);
  const [isDeleteImageConfirmationOpen, setIsDeleteImageConfirmationOpen] = useState(false);

  useEffect(() => {
    setForm(complaint ?? emptyComplaint);
    setIsDeleteImageConfirmationOpen(false);
  }, [complaint, open]);

  const update = <Key extends keyof Complaint>(key: Key, value: Complaint[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "view") return;
    onSubmit(form);
  };

  const isEdit = mode !== "create";
  const isView = mode === "view";
  const title = isView ? "تفاصيل الشكوى" : isEdit ? "تعديل الشكوى" : "إنشاء شكوى جديدة";

  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-[680px]">
      <form onSubmit={submit} dir="rtl" className="space-y-5">
        <fieldset disabled={isView} className="space-y-5 disabled:opacity-90">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-right text-sm font-semibold">
            رقم الطلب
            <input required value={form.orderNo} onChange={(event) => update("orderNo", event.target.value)} placeholder="مثال: #ORD-5542" className={fieldClass} />
          </label>
          <label className="text-right text-sm font-semibold">
            اسم العميل
            <input required value={form.customer} onChange={(event) => update("customer", event.target.value)} placeholder="أدخل اسم العميل بالكامل" className={fieldClass} />
          </label>
        </div>

        <div className={`grid grid-cols-1 gap-4 ${isEdit ? "sm:grid-cols-2" : ""}`}>
          <label className="text-right text-sm font-semibold">
            نوع الشكوى
            <select required value={form.type} onChange={(event) => update("type", event.target.value)} className={fieldClass}>
              <option value="">اختر نوع الشكوى</option>
              <option>تأخير مقدم الخدمة</option>
              <option>جودة الخدمة منخفضة</option>
              <option>مشكلة في الدفع</option>
              <option>سلوك غير مناسب</option>
            </select>
          </label>
          {isEdit && (
            <label className="text-right text-sm font-semibold">
              حالة الشكوى
              <select value={form.status} onChange={(event) => update("status", event.target.value)} className={fieldClass}>
                <option>نشط</option>
                <option>قيد المراجعة</option>
                <option>قيد المعالجة</option>
                <option>تم الحل</option>
                <option>مرفوضة</option>
              </select>
            </label>
          )}
        </div>

        <label className="block text-right text-sm font-semibold">
          تفاصيل الشكوى
          <textarea required value={form.details ?? ""} onChange={(event) => update("details", event.target.value)} placeholder="اكتب تفاصيل الشكوى هنا..." className="mt-2 h-32 w-full resize-none rounded-xl border border-[#e7dede] p-4 text-right outline-none focus:border-[#75262d]" />
        </label>

        {isEdit ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="text-right">
              <p className="mb-2 text-sm font-semibold">صورة الشكوى</p>
              <div className="flex h-28 items-center justify-center rounded-xl border border-[#e7dede] bg-[#faf8f8] text-center text-sm text-gray-400">
                {form.imageName ? <span><ImageUp className="mx-auto mb-2" />{form.imageName}</span> : "لا توجد صورة مرفقة"}
              </div>
              <div className="mt-2 flex gap-2">
                <label className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#e7dede] text-sm font-semibold"><UploadCloud size={15} />استبدال الصورة<input type="file" accept="image/*" className="sr-only" onChange={(event) => update("imageName", event.target.files?.[0]?.name ?? "")} /></label>
                <button type="button" onClick={() => setIsDeleteImageConfirmationOpen(true)} className="flex h-10 items-center gap-1 rounded-lg border border-red-200 px-3 text-sm text-red-500"><Trash2 size={14} />حذف</button>
              </div>
            </div>
            <label className="text-right text-sm font-semibold">ملاحظات الإدارة<textarea value={form.adminNotes ?? ""} onChange={(event) => update("adminNotes", event.target.value)} placeholder="أضف ملاحظات داخلية..." className="mt-2 h-40 w-full resize-none rounded-xl border border-[#e7dede] p-4 outline-none focus:border-[#75262d]" /></label>
          </div>
        ) : (
          <label className="block cursor-pointer text-right text-sm font-semibold">
            تحميل صورة الشكوى
            <div className="mt-2 flex h-44 flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#ded4d4] bg-[#fcfafa] text-center">
              <UploadCloud className="mb-3 text-[#75262d]" />
              <strong>{form.imageName || "اضغط للرفع أو اسحب الصورة هنا"}</strong>
              <span className="mt-1 text-xs text-gray-400">JPG, PNG أو GIF بحد أقصى 5 ميجابايت</span>
            </div>
            <input type="file" accept="image/png,image/jpeg,image/gif" className="sr-only" onChange={(event) => update("imageName", event.target.files?.[0]?.name ?? "")} />
          </label>
        )}

        </fieldset>

        <div className="flex items-center justify-between border-t border-[#eee7e7] pt-5">
          {!isView && <button type="submit" className="flex h-12 items-center gap-2 rounded-xl bg-[#75262d] px-7 font-bold text-white">
            {isEdit ? <Save size={17} /> : <PlusCircle size={18} />}
            {isEdit ? "حفظ التعديلات" : "إنشاء شكوى"}
          </button>}
          <button type="button" onClick={onClose} className="h-11 rounded-xl border border-[#e7dede] px-5 text-sm font-semibold">إلغاء</button>
        </div>
      </form>

      <ConfirmDialog
        open={isDeleteImageConfirmationOpen}
        onClose={() => setIsDeleteImageConfirmationOpen(false)}
        onConfirm={() => {
          update("imageName", "");
          setIsDeleteImageConfirmationOpen(false);
        }}
        icon={Trash2}
        title="تأكيد حذف صورة الشكوى"
        description="هل أنت متأكد من حذف صورة الشكوى المرفقة؟"
        confirmLabel="حذف الصورة"
        tone="danger"
      />
    </Modal>
  );
}
