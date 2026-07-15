import type { PaginationMeta } from "./api";

export type InboxReadStatus = "all" | "unread" | "read";

export interface InboxNotification {
  id: string;
  title: string;
  body: string;
  sourceType: "system" | "campaign";
  category: string;
  data: Record<string, unknown>;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface InboxNotificationList {
  items: InboxNotification[];
  pagination: PaginationMeta;
}

export interface MarkNotificationsReadResult {
  unreadCount: number;
  markedReadCount: number;
}

export type NotificationChannel = "app" | "sms";
export type NotificationAudience = "all" | "customers" | "providers";
export type NotificationSendMode = "now" | "scheduled";
export type NotificationCampaignStatus = "scheduled" | "sent" | "paused" | "completed" | "failed";
export type NotificationRecurrenceType = "none" | "daily" | "specific_weekdays" | "specific_day_of_month" | "monthly" | "yearly" | "custom";

export type NotificationEndCondition =
  | { type: "never" }
  | { type: "after_occurrences"; occurrences: number }
  | { type: "until_date"; untilDate: string };

export type NotificationRecurrence =
  | { type: "none" | "daily" | "monthly" | "yearly" }
  | { type: "specific_weekdays"; weekdays: string[] }
  | { type: "specific_day_of_month"; dayOfMonth: number }
  | { type: "custom"; every: number; unit: "day" | "week" | "month"; endCondition: NotificationEndCondition };

export interface NotificationCampaignStats {
  totalNotifications: number;
  sentCount: number;
  scheduledCount: number;
  totalRecipients: number;
}

export interface NotificationCampaignListItem {
  id: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  targetAudience: NotificationAudience;
  sendMode: NotificationSendMode;
  scheduledAt: string;
  recurrenceType: NotificationRecurrenceType;
  status: NotificationCampaignStatus;
  nextRunAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationCampaignList {
  items: NotificationCampaignListItem[];
  pagination: PaginationMeta;
}

export interface NotificationCampaignDetail extends Omit<NotificationCampaignListItem, "recurrenceType"> {
  resolvedTargetAudience: { strategy: string; roles: string[]; requiresRegisteredDevice: boolean };
  timeZone: string;
  recurrence: NotificationRecurrence;
  pauseReason: "admin" | "channel_unavailable" | null;
  lastSentAt: string | null;
  deliveryStats: { totalRecipients: number; readRate: number | null; clickRate: number | null };
}

export interface NotificationCampaignPayload {
  channel: NotificationChannel;
  title: string;
  message: string;
  targetAudience: NotificationAudience;
  sendMode: NotificationSendMode;
  sendDate?: string;
  sendTime?: string;
  recurrence: NotificationRecurrence;
}

export type UpdateNotificationCampaignPayload = Partial<NotificationCampaignPayload> & {
  status?: "paused" | "scheduled";
};
