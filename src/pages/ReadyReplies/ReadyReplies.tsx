import { useMemo, useState } from "react";
import { CheckCircle2, MessageSquareText, PencilLine, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import StatsGrid from "../../components/dashboard/StatsGrid";
import FiltersBar from "../../components/ui/FiltersBar";
import ReadyRepliesHeader from "../../components/readyReplies/ReadyRepliesHeader";
import ReadyRepliesTable, { type ReadyReply } from "../../components/readyReplies/ReadyRepliesTable";
import ReadyReplyDialog, { type ReadyReplyDialogMode } from "../../components/readyReplies/ReadyReplyDialog";
import type { StatCardData } from "../../types/dashboard";

const initialReplies: ReadyReply[] = [
  { id: 1, translationId: 1, title: "#ORD-9421", text: "شكرًا لتواصلك معنا، تم استلام طلبك وسيتم الرد عليك قريبًا.", usage: 20, lastUpdated: "2026-07-22", status: "نشط" },
  { id: 2, translationId: 2, title: "#ORD-9422", text: "عذرًا للإزعاج، نحن نعمل حاليًا على حل المشكلة.", usage: 50, lastUpdated: "2026-07-22", status: "نشط" },
  { id: 3, translationId: 3, title: "#ORD-9423", text: "تم إلغاء طلبك بنجاح، وسيتم استرداد المبلغ.", usage: 30, lastUpdated: "2026-07-22", status: "غير نشط" },
  { id: 4, translationId: 4, title: "#ORD-9424", text: "لا يمكننا تنفيذ طلبك حاليًا بسبب عدم توفر الخدمة.", usage: 58, lastUpdated: "2026-07-22", status: "غير نشط" },
  { id: 5, translationId: 5, title: "#ORD-9425", text: "تم تحديث حالة طلبك إلى: قيد المعالجة.", usage: 88, lastUpdated: "2026-07-22", status: "غير نشط" },
];

export default function ReadyReplies() {
  const { t } = useTranslation();
  const [replies, setReplies] = useState(initialReplies);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dialog, setDialog] = useState<{ open: boolean; mode: ReadyReplyDialogMode; reply: ReadyReply | null }>({ open: false, mode: "create", reply: null });

  const stats: StatCardData[] = [
    { title: t("readyReplies.usedThisMonth"), value: "1,240", change: t("readyReplies.currentMonthChange"), icon: <PencilLine />, iconBg: "#f7efff", iconColor: "#a855f7" },
    { title: t("readyReplies.resolved"), value: 24, change: t("readyReplies.totalShare"), icon: <CheckCircle2 />, iconBg: "#e8f8f2", iconColor: "#10b981" },
    { title: t("readyReplies.total"), value: 342, change: t("readyReplies.july"), changeType: "neutral", icon: <MessageSquareText />, iconBg: "#edf4ff", iconColor: "#3b82f6" },
    { title: t("readyReplies.disabled"), value: 6, change: t("readyReplies.previousMonthChange"), changeType: "down", icon: <XCircle />, iconBg: "#fcebec", iconColor: "#ef4444" },
  ];

  const filteredReplies = useMemo(() => {
    const query = search.trim().toLowerCase();
    return replies.filter((reply) => {
      const title = reply.translationId ? t(`readyReplies.items.${reply.translationId}.title`, { defaultValue: reply.title }) : reply.title;
      const text = reply.translationId ? t(`readyReplies.items.${reply.translationId}.text`, { defaultValue: reply.text }) : reply.text;
      return (!query || title.toLowerCase().includes(query) || text.toLowerCase().includes(query)) && (!status || reply.status === status);
    });
  }, [replies, search, status, t]);

  const openDialog = (mode: ReadyReplyDialogMode, reply: ReadyReply | null = null) => setDialog({ open: true, mode, reply });
  const closeDialog = () => setDialog((current) => ({ ...current, open: false }));
  const saveReply = (reply: ReadyReply) => {
    const exists = replies.some((item) => item.id === reply.id);
    setReplies((current) => exists ? current.map((item) => item.id === reply.id ? reply : item) : [reply, ...current]);
    toast.success(t(exists ? "readyReplies.saveSuccess" : "readyReplies.createSuccess"));
    closeDialog();
  };

  return (
    <section>
      <ReadyRepliesHeader onCreate={() => openDialog("create")} />
      <div className="mb-7"><StatsGrid stats={stats} /></div>
      <FiltersBar
        search={{ value: search, onChange: setSearch, placeholder: t("readyReplies.search") }}
        fields={[{ key: "status", type: "select", value: status, onChange: setStatus, placeholder: t("readyReplies.allStatuses"), options: ["نشط", "غير نشط"] }]}
      />
      <ReadyRepliesTable rows={filteredReplies} onView={(reply) => openDialog("view", reply)} onEdit={(reply) => openDialog("edit", reply)} />
      <ReadyReplyDialog
        open={dialog.open}
        mode={dialog.mode}
        reply={dialog.reply}
        onClose={closeDialog}
        onSave={saveReply}
        onEdit={() => setDialog((current) => ({ ...current, mode: "edit" }))}
      />
    </section>
  );
}
