import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CalendarClock, Radar, Send, UsersRound } from "lucide-react";

import NotificationsHeader from "../../components/notifications/NotificationsHeader";
import NotificationsStats from "../../components/notifications/NotificationsStats";
import NotificationsFiltersBar from "../../components/notifications/NotificationsFiltersBar";
import NotificationsTable from "../../components/notifications/NotificationsTable";
import NotificationDialog, { NOTIFICATION_DIALOG_MODES } from "../../components/dialogs/NotificationDialog";
import type { NotificationDialogMode, NotificationPayload, NotificationRecord } from "../../components/dialogs/NotificationDialog/constants";
import {
  createNotificationCampaign,
  getNotificationCampaign,
  getNotificationCampaigns,
  getNotificationCampaignStats,
  updateNotificationCampaign,
} from "../../services/notifications.service";
import type {
  NotificationAudience,
  NotificationCampaignDetail,
  NotificationCampaignListItem,
  NotificationCampaignPayload,
  NotificationCampaignStatus,
  NotificationEndCondition,
  NotificationRecurrence,
} from "../../types/notifications";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import useLocale from "../../i18n/useLocale";
import { getErrorMessage } from "../../utils/error";

const PAGE_SIZE = 20;
const STATUS_LABELS: Record<NotificationCampaignStatus, string> = {
  scheduled: "مجدولة", sent: "مرسلة", paused: "متوقف", completed: "مكتمل", failed: "فشل",
};
const LABEL_TO_STATUS = Object.fromEntries(Object.entries(STATUS_LABELS).map(([key, value]) => [value, key])) as Record<string, NotificationCampaignStatus>;
const AUDIENCE_LABELS: Record<NotificationAudience, string> = { all: "الكل", customers: "العملاء", providers: "المزودين" };
const LABEL_TO_AUDIENCE: Record<string, NotificationAudience> = { الكل: "all", العملاء: "customers", المزودين: "providers" };
const CHANNEL_LABELS = { app: "التطبيق", sms: "SMS" } as const;
const LABEL_TO_CHANNEL: Record<string, "app" | "sms"> = { التطبيق: "app", SMS: "sms" };
const UNIT_TO_API: Record<string, "day" | "week" | "month"> = { يوم: "day", أسبوع: "week", شهر: "month" };
const API_TO_UNIT: Record<string, string> = { day: "يوم", week: "أسبوع", month: "شهر" };
const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function localDateParts(value: string) {
  const date = new Date(value);
  const pad = (number: number) => String(number).padStart(2, "0");
  return Number.isNaN(date.getTime()) ? { sendDate: "", sendTime: "" } : {
    sendDate: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    sendTime: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

function endCondition(payload: NotificationPayload): NotificationEndCondition {
  if (payload.recurrenceEndMode === "after" && Number(payload.recurrenceEndCount) > 0) {
    return { type: "after_occurrences", occurrences: Number(payload.recurrenceEndCount) };
  }
  if (payload.recurrenceEndMode === "on_date" && payload.recurrenceEndDate) {
    return { type: "until_date", untilDate: payload.recurrenceEndDate };
  }
  return { type: "never" };
}

function mapRecurrence(payload: NotificationPayload): NotificationRecurrence {
  if (payload.recurrence === "none" || payload.sendTimeMode === "now") return { type: "none" };
  if (["daily", "monthly", "yearly"].includes(payload.recurrence)) {
    return { type: payload.recurrence as "daily" | "monthly" | "yearly" };
  }
  if (payload.recurrence === "weekly") {
    const day = payload.sendDate ? new Date(`${payload.sendDate}T00:00:00`).getDay() : 0;
    return { type: "specific_weekdays", weekdays: [WEEKDAYS[day] ?? "sunday"] };
  }
  if (payload.recurrence === "monthlyDay") {
    return { type: "specific_day_of_month", dayOfMonth: Number(payload.sendDate.slice(-2)) || 1 };
  }
  const selectedUnit = payload.recurrenceUnit === "سنة" ? "month" : (UNIT_TO_API[payload.recurrenceUnit] ?? "day");
  const every = payload.recurrenceUnit === "سنة" ? payload.recurrenceInterval * 12 : payload.recurrenceInterval;
  return { type: "custom", every, unit: selectedUnit, endCondition: endCondition(payload) };
}

function toApiPayload(payload: NotificationPayload): NotificationCampaignPayload {
  return {
    channel: payload.channel as "app" | "sms",
    title: payload.title,
    message: payload.description,
    targetAudience: LABEL_TO_AUDIENCE[payload.audience] ?? "all",
    sendMode: payload.sendTimeMode as "now" | "scheduled",
    ...(payload.sendTimeMode === "scheduled" ? { sendDate: payload.sendDate, sendTime: payload.sendTime } : {}),
    recurrence: mapRecurrence(payload),
  };
}

function recurrenceForm(detail: NotificationCampaignDetail) {
  const recurrence = detail.recurrence;
  if (recurrence.type === "specific_weekdays") return { recurrence: "weekly" };
  if (recurrence.type === "specific_day_of_month") return { recurrence: "monthlyDay" };
  if (recurrence.type !== "custom") return { recurrence: recurrence.type };
  const end = recurrence.endCondition;
  return {
    recurrence: "custom",
    recurrenceInterval: recurrence.every,
    recurrenceUnit: API_TO_UNIT[recurrence.unit] ?? "يوم",
    recurrenceEndMode: end.type === "after_occurrences" ? "after" : end.type === "until_date" ? "on_date" : "never",
    recurrenceEndCount: end.type === "after_occurrences" ? String(end.occurrences) : "",
    recurrenceEndDate: end.type === "until_date" ? end.untilDate : "",
  };
}

function mapListItem(item: NotificationCampaignListItem, formatDate: ReturnType<typeof useLocale>["formatDate"]): NotificationRecord {
  const nextRunAt = typeof item.nextRunAt === "string" ? item.nextRunAt : item.scheduledAt;
  return {
    id: item.id,
    title: item.title,
    description: item.message,
    audience: AUDIENCE_LABELS[item.targetAudience],
    time: formatDate(nextRunAt, { dateStyle: "medium", timeStyle: "short" }),
    status: STATUS_LABELS[item.status],
    recipients: "—",
    channel: item.channel,
    deliveryStatus: STATUS_LABELS[item.status],
    sendTimeMode: item.sendMode,
    ...localDateParts(item.scheduledAt),
    recurrence: item.recurrenceType,
  };
}

function mapDetail(detail: NotificationCampaignDetail, formatDate: ReturnType<typeof useLocale>["formatDate"]): NotificationRecord {
  const schedule = localDateParts(detail.scheduledAt);
  const rate = (value: number | null) => value == null ? "—" : `${value}%`;
  return {
    ...mapListItem({ ...detail, recurrenceType: detail.recurrence.type }, formatDate),
    recipients: detail.deliveryStats.totalRecipients,
    sendDate: schedule.sendDate,
    sendTime: schedule.sendTime,
    ...recurrenceForm(detail),
    stats: {
      totalRecipients: detail.deliveryStats.totalRecipients,
      readRate: rate(detail.deliveryStats.readRate),
      clickRate: rate(detail.deliveryStats.clickRate),
    },
  } as NotificationRecord;
}

export default function Notifications() {
  const queryClient = useQueryClient();
  const { formatDate } = useLocale();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");
  const [audience, setAudience] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [dialogState, setDialogState] = useState<{ open: boolean; mode: NotificationDialogMode; notification: NotificationRecord | null }>({ open: false, mode: NOTIFICATION_DIALOG_MODES.VIEW, notification: null });

  useEffect(() => setPage(1), [debouncedSearch, status, channel, audience]);

  const statsQuery = useQuery({ queryKey: ["notification-campaign-stats"], queryFn: ({ signal }) => getNotificationCampaignStats(signal) });
  const listQuery = useQuery({
    queryKey: ["notification-campaigns", page, debouncedSearch, status, channel, audience],
    queryFn: ({ signal }) => getNotificationCampaigns({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch.trim() || undefined,
      status: LABEL_TO_STATUS[status],
      channel: LABEL_TO_CHANNEL[channel],
      targetAudience: LABEL_TO_AUDIENCE[audience],
    }, signal),
    placeholderData: (previousData) => previousData,
  });
  const selectedId = dialogState.notification ? String(dialogState.notification.id) : "";
  const detailQuery = useQuery({
    queryKey: ["notification-campaign", selectedId],
    queryFn: ({ signal }) => getNotificationCampaign(selectedId, signal),
    enabled: dialogState.open && Boolean(selectedId),
  });

  const invalidate = async () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ["notification-campaigns"] }),
    queryClient.invalidateQueries({ queryKey: ["notification-campaign-stats"] }),
    queryClient.invalidateQueries({ queryKey: ["notification-campaign"] }),
  ]);
  const createMutation = useMutation({ mutationFn: createNotificationCampaign, onSuccess: async () => { await invalidate(); toast.success("تم إنشاء الإشعار بنجاح"); } });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: NotificationCampaignPayload | { status: "paused" | "scheduled" } }) => updateNotificationCampaign(id, payload),
    onSuccess: invalidate,
  });

  const rows = useMemo(() => (listQuery.data?.items ?? []).map((item) => mapListItem(item, formatDate)), [formatDate, listQuery.data?.items]);
  const selectedNotification = detailQuery.data ? mapDetail(detailQuery.data, formatDate) : dialogState.notification;
  const pagination = listQuery.data?.pagination;
  const totalPages = Math.max(1, Math.ceil((pagination?.total ?? 0) / (pagination?.limit ?? PAGE_SIZE)));
  const apiStats = statsQuery.data;
  const stats = [
    { title: "إجمالي المستلمين", value: apiStats?.totalRecipients ?? "—", icon: <UsersRound size={22} />, iconBg: "#f2eaea", iconColor: "#75262d" },
    { title: "المجدولة", value: apiStats?.scheduledCount ?? "—", icon: <CalendarClock size={22} />, iconBg: "#eaf2fc", iconColor: "#3b82f6" },
    { title: "المرسلة", value: apiStats?.sentCount ?? "—", icon: <Send size={22} />, iconBg: "#e8f8ef", iconColor: "#22c55e" },
    { title: "إجمالي الإشعارات", value: apiStats?.totalNotifications ?? "—", icon: <Radar size={22} />, iconBg: "#f2eaea", iconColor: "#75262d" },
  ];

  const closeDialog = () => setDialogState((current) => ({ ...current, open: false }));
  const openDialog = (mode: NotificationDialogMode, notification: NotificationRecord | null = null) => setDialogState({ open: true, mode, notification });
  const handleCreate = async (payload: NotificationPayload) => { await createMutation.mutateAsync(toApiPayload(payload)); };
  const handleSave = async (payload: NotificationPayload) => {
    if (payload.id == null) throw new Error("Notification id is missing");
    await updateMutation.mutateAsync({ id: String(payload.id), payload: toApiPayload(payload) });
    toast.success("تم حفظ تعديلات الإشعار");
  };
  const handleToggleStatus = async (row: NotificationRecord) => {
    const nextStatus = row.status === "متوقف" ? "scheduled" : "paused";
    try {
      await updateMutation.mutateAsync({ id: String(row.id), payload: { status: nextStatus } });
      toast.success(nextStatus === "paused" ? "تم إيقاف الإشعار" : "تم استئناف الإشعار");
    } catch (error) {
      toast.error(getErrorMessage(error, "تعذر تحديث حالة الإشعار"));
    }
  };

  return (
    <section>
      <NotificationsHeader onAddNotification={() => openDialog(NOTIFICATION_DIALOG_MODES.CREATE)} />
      <NotificationsStats stats={stats} />
      <NotificationsFiltersBar
        search={search} onSearchChange={setSearch}
        status={status} onStatusChange={setStatus} statusOptions={Object.values(STATUS_LABELS)}
        channel={channel} onChannelChange={setChannel} channelOptions={Object.values(CHANNEL_LABELS)}
        audience={audience} onAudienceChange={setAudience} audienceOptions={Object.values(AUDIENCE_LABELS)}
        onFilter={() => setPage(1)}
      />
      <NotificationsTable
        rows={rows} totalCount={pagination?.total ?? 0} currentPage={pagination?.page ?? page} totalPages={totalPages}
        loading={listQuery.isLoading} emptyMessage={listQuery.isError ? getErrorMessage(listQuery.error, "تعذر تحميل إشعارات التطبيق") : undefined}
        onPageChange={setPage} onView={(row) => openDialog(NOTIFICATION_DIALOG_MODES.VIEW, row)} onEdit={(row) => openDialog(NOTIFICATION_DIALOG_MODES.EDIT, row)} onToggleStatus={handleToggleStatus}
      />
      <NotificationDialog open={dialogState.open} mode={dialogState.mode} notification={selectedNotification} onClose={closeDialog} onCreate={handleCreate} onSave={handleSave} />
    </section>
  );
}
