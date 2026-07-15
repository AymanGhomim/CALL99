import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import type { ReadyReply } from "./ReadyRepliesTable";

export type ReadyReplyDialogMode = "create" | "edit" | "view";

interface ReadyReplyDialogProps {
  open: boolean;
  mode: ReadyReplyDialogMode;
  reply: ReadyReply | null;
  onClose: () => void;
  onSave: (reply: ReadyReply) => void;
  onEdit: () => void;
}

const fieldClass = "mt-2 h-12 w-full rounded-xl border border-[#e3d7d8] bg-[#fdfbfb] px-4 text-sm outline-none transition focus:border-[#75262d] focus:bg-white focus:ring-2 focus:ring-[#75262d]/10";

export default function ReadyReplyDialog({ open, mode, reply, onClose, onSave, onEdit }: ReadyReplyDialogProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<ReadyReply>({ id: 0, title: "", text: "", usage: 0, lastUpdated: new Date().toISOString(), status: "نشط" });

  useEffect(() => {
    setForm(reply ?? { id: 0, title: "", text: "", usage: 0, lastUpdated: new Date().toISOString(), status: "نشط" });
  }, [open, reply]);

  const title = t(mode === "create" ? "readyReplies.create" : mode === "edit" ? "readyReplies.edit" : "readyReplies.details");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSave({ ...form, id: form.id || Date.now(), lastUpdated: new Date().toISOString(), translationId: undefined });
  };

  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-[680px]">
      {mode === "view" ? (
        <div className="space-y-5 text-start">
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#faf6f6] p-5">
            <h3 className="text-xl font-extrabold text-[#75262d]">{form.title}</h3>
            <Badge tone={form.status === "نشط" ? "success" : "danger"}>{t(form.status === "نشط" ? "statuses.active" : "statuses.inactive")}</Badge>
          </div>
          <div className="rounded-2xl border border-[#eee5e5] p-5">
            <p className="mb-2 text-xs font-bold text-gray-400">{t("readyReplies.replyText")}</p>
            <p className="leading-8 text-[#3d3434]">{form.text}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#eee5e5] p-4"><p className="text-xs text-gray-400">{t("readyReplies.usage")}</p><strong className="mt-1 block text-[#75262d]">{form.usage}</strong></div>
            <div className="rounded-xl border border-[#eee5e5] p-4"><p className="text-xs text-gray-400">{t("readyReplies.lastUpdated")}</p><strong className="mt-1 block text-[#75262d]">{form.lastUpdated.slice(0, 10)}</strong></div>
          </div>
          <div className="flex justify-end border-t border-[#f0e7e8] pt-5">
            <button type="button" onClick={onEdit} className="h-11 rounded-xl bg-[#75262d] px-7 text-sm font-bold text-white transition hover:bg-[#642128]">
              {t("common.edit")}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5 text-start">
          <label className="block text-sm font-bold text-[#4a3d3f]">{t("readyReplies.replyTitle")}<input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder={t("readyReplies.titlePlaceholder")} className={fieldClass} /></label>
          <label className="block text-sm font-bold text-[#4a3d3f]">{t("readyReplies.replyText")}<textarea required value={form.text} onChange={(event) => setForm((current) => ({ ...current, text: event.target.value }))} placeholder={t("readyReplies.textPlaceholder")} className={`${fieldClass} h-36 resize-none py-3`} /></label>
          <label className="block text-sm font-bold text-[#4a3d3f]">{t("readyReplies.status")}<select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ReadyReply["status"] }))} className={fieldClass}><option value="نشط">{t("statuses.active")}</option><option value="غير نشط">{t("statuses.inactive")}</option></select></label>
          <div className="flex justify-end gap-3 border-t border-[#f0e7e8] pt-5">
            <button type="button" onClick={onClose} className="h-11 rounded-xl border border-[#e3d7d8] px-6 text-sm font-bold text-gray-500">{t("common.cancel")}</button>
            <button type="submit" className="h-11 rounded-xl bg-[#75262d] px-7 text-sm font-bold text-white hover:bg-[#642128]">{t(mode === "create" ? "readyReplies.create" : "common.saveChanges")}</button>
          </div>
        </form>
      )}
    </Modal>
  );
}
