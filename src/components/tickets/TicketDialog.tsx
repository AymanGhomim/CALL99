import { useEffect, useState, type FormEvent } from "react";
import { PlusCircle, Save } from "lucide-react";
import Modal from "../ui/Modal";
import type { TicketRecord } from "../../data/tickets.data";

export type TicketDialogMode = "create" | "edit" | "view";

interface TicketDialogProps {
  open: boolean;
  mode: TicketDialogMode;
  ticket: TicketRecord | null;
  statusOptions: string[];
  serviceOptions: string[];
  onClose: () => void;
  onSubmit: (ticket: TicketRecord) => void;
}

const emptyTicket: TicketRecord = {
  id: 0,
  ticketNo: "",
  orderNo: "",
  service: "",
  customer: "",
  subject: "",
  createdAt: "",
  status: "مفتوحة",
  description: "",
};

const fieldClass = "mt-2 h-12 w-full rounded-xl border border-[#e7dede] bg-white px-4 text-right outline-none focus:border-[#75262d] disabled:bg-[#fcf9f9] disabled:text-[#3d3434]";

export default function TicketDialog({ open, mode, ticket, statusOptions, serviceOptions, onClose, onSubmit }: TicketDialogProps) {
  const [form, setForm] = useState<TicketRecord>(emptyTicket);

  useEffect(() => {
    if (open) setForm(ticket ?? emptyTicket);
  }, [open, ticket]);

  const update = <Key extends keyof TicketRecord>(key: Key, value: TicketRecord[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode !== "view") onSubmit(form);
  };

  const isView = mode === "view";
  const title = mode === "create" ? "إنشاء تذكرة جديدة" : mode === "edit" ? "تعديل التذكرة" : "تفاصيل التذكرة";

  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-[720px]">
      <form onSubmit={submit} dir="rtl" className="space-y-5">
        <fieldset disabled={isView} className="space-y-5 disabled:opacity-90">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-right text-sm font-semibold">رقم الطلب<input required value={form.orderNo} onChange={(event) => update("orderNo", event.target.value)} placeholder="مثال: #ORD-9421" className={fieldClass} /></label>
            <label className="text-right text-sm font-semibold">اسم العميل<input required value={form.customer} onChange={(event) => update("customer", event.target.value)} placeholder="أدخل اسم العميل" className={fieldClass} /></label>
            <label className="text-right text-sm font-semibold">الخدمة<select required value={form.service} onChange={(event) => update("service", event.target.value)} className={fieldClass}><option value="">اختر الخدمة</option>{serviceOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="text-right text-sm font-semibold">الحالة<select value={form.status} onChange={(event) => update("status", event.target.value)} className={fieldClass}>{statusOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          </div>

          <label className="block text-right text-sm font-semibold">موضوع التذكرة<input required value={form.subject} onChange={(event) => update("subject", event.target.value)} placeholder="أدخل موضوع التذكرة" className={fieldClass} /></label>
          <label className="block text-right text-sm font-semibold">تفاصيل التذكرة<textarea required value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="اكتب تفاصيل التذكرة هنا..." className="mt-2 h-32 w-full resize-none rounded-xl border border-[#e7dede] bg-white p-4 text-right outline-none focus:border-[#75262d] disabled:bg-[#fcf9f9]" /></label>
        </fieldset>

        <div className="flex items-center justify-between border-t border-[#eee7e7] pt-5">
          {!isView && <button type="submit" className="flex h-12 items-center gap-2 rounded-xl bg-[#75262d] px-7 font-bold text-white hover:bg-[#642326]">{mode === "create" ? <PlusCircle size={18} /> : <Save size={17} />}{mode === "create" ? "إنشاء التذكرة" : "حفظ التعديلات"}</button>}
          <button type="button" onClick={onClose} className="h-11 rounded-xl border border-[#e7dede] px-5 text-sm font-semibold hover:bg-[#fbf7f7]">إغلاق</button>
        </div>
      </form>
    </Modal>
  );
}
