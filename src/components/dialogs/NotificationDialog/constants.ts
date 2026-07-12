// Shared constants for the Notification dialog (create / edit / view all
// reuse the same form shape, mirroring the pattern used by AdDialog).

import { MessageSquareText, Smartphone, User, Users, UsersRound } from "lucide-react";

export const NOTIFICATION_DIALOG_MODES = {
  CREATE: "create",
  EDIT: "edit",
  VIEW: "view",
};

// وسيلة الإرسال — segmented control, App selected by default.
export const CHANNEL_OPTIONS = [
  { value: "sms", label: "SMS رسالة", icon: MessageSquareText },
  { value: "app", label: "إشعار عبر التطبيق", icon: Smartphone },
];

// SMS is a hard 160-char single-segment limit (countdown style); the
// in-app channel allows a longer body (used/total style).
export const CHANNEL_CHAR_LIMITS = {
  sms: 160,
  app: 500,
};

// الفئة المستهدفة — order matches the screen right-to-left: الكل, العملاء, المزودين.
export const CATEGORY_OPTIONS = [
  { value: "الكل", label: "الكل", icon: UsersRound },
  { value: "العملاء", label: "العملاء", icon: User },
  { value: "المزودين", label: "المزودين", icon: Users },
];

export const SEND_TIME_MODES = {
  NOW: "now",
  SCHEDULED: "scheduled",
};

export const RECURRENCE_OPTIONS = [
  { value: "none", label: "لا يتكرر" },
  { value: "daily", label: "كل يوم" },
  { value: "weekly", label: "أيام محددة في الأسبوع" },
  { value: "monthlyDay", label: "يوم محدد في الشهر" },
  { value: "monthly", label: "كل شهر" },
  { value: "yearly", label: "كل سنة" },
  { value: "custom", label: "مخصص" },
];

export const RECURRENCE_LABELS = RECURRENCE_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

export const RECURRENCE_UNIT_OPTIONS = ["يوم", "أسبوع", "شهر", "سنة"];

export const RECURRENCE_END_MODES = {
  NEVER: "never",
  AFTER: "after",
  ON_DATE: "on_date",
};

export const EMPTY_NOTIFICATION_FORM = {
  channel: "app",
  title: "",
  description: "",
  audience: "الكل",
  sendTimeMode: SEND_TIME_MODES.NOW,
  sendDate: "",
  sendTime: "",
  recurrence: "none",
  recurrenceInterval: 1,
  recurrenceUnit: "يوم",
  recurrenceEndMode: RECURRENCE_END_MODES.NEVER,
  recurrenceEndCount: "",
  recurrenceEndDate: "",
  isActive: true,
};

// Maps a notification row (as shaped in data/notifications.data.jsx) to the
// flat form state the dialog edits. Falls back to EMPTY_NOTIFICATION_FORM
// for any missing field so opening the dialog on partial/mock data never crashes.
export function buildFormFromNotification(notification) {
  if (!notification) {
    return EMPTY_NOTIFICATION_FORM;
  }

  return {
    channel: notification.channel ?? EMPTY_NOTIFICATION_FORM.channel,
    title: notification.title ?? EMPTY_NOTIFICATION_FORM.title,
    description: notification.description ?? EMPTY_NOTIFICATION_FORM.description,
    audience: notification.audience ?? EMPTY_NOTIFICATION_FORM.audience,
    sendTimeMode: notification.sendTimeMode ?? EMPTY_NOTIFICATION_FORM.sendTimeMode,
    sendDate: notification.sendDate ?? EMPTY_NOTIFICATION_FORM.sendDate,
    sendTime: notification.sendTime ?? EMPTY_NOTIFICATION_FORM.sendTime,
    recurrence: notification.recurrence ?? EMPTY_NOTIFICATION_FORM.recurrence,
    recurrenceInterval:
      notification.recurrenceInterval ?? EMPTY_NOTIFICATION_FORM.recurrenceInterval,
    recurrenceUnit: notification.recurrenceUnit ?? EMPTY_NOTIFICATION_FORM.recurrenceUnit,
    recurrenceEndMode:
      notification.recurrenceEndMode ?? EMPTY_NOTIFICATION_FORM.recurrenceEndMode,
    recurrenceEndCount:
      notification.recurrenceEndCount ?? EMPTY_NOTIFICATION_FORM.recurrenceEndCount,
    recurrenceEndDate:
      notification.recurrenceEndDate ?? EMPTY_NOTIFICATION_FORM.recurrenceEndDate,
    isActive: notification.status ? notification.status === "نشط" : EMPTY_NOTIFICATION_FORM.isActive,
  };
}

// Builds the human-readable "الوقت" table cell + detail-view send date from
// the structured scheduling fields, optionally noting the recurrence.
export function buildScheduleSummary(form) {
  if (form.sendTimeMode === SEND_TIME_MODES.NOW) {
    return "الإرسال الفوري";
  }

  const datePart = form.sendDate || "بدون تاريخ";
  const timePart = form.sendTime ? ` — ${form.sendTime}` : "";
  const recurrencePart =
    form.recurrence && form.recurrence !== "none"
      ? ` (${RECURRENCE_LABELS[form.recurrence] ?? "متكرر"})`
      : "";

  return `${datePart}${timePart}${recurrencePart}`;
}
