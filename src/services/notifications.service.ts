import api from "./axios";
import type { ApiResponse } from "../types/api";
import type {
  InboxNotificationList,
  InboxReadStatus,
  MarkNotificationsReadResult,
  NotificationAudience,
  NotificationCampaignDetail,
  NotificationCampaignList,
  NotificationCampaignPayload,
  NotificationCampaignStats,
  NotificationCampaignStatus,
  NotificationChannel,
  UpdateNotificationCampaignPayload,
} from "../types/notifications";

export async function getNotificationInbox(params: { page?: number; limit?: number; readStatus?: InboxReadStatus }, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<InboxNotificationList>>("/notifications", { params, signal });
  return data.data;
}

export async function getUnreadNotificationCount(signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<{ unreadCount: number }>>("/notifications/unread-count", { signal });
  return data.data;
}

export async function markNotificationsRead(payload: { notificationIds: string[] } | { all: true }) {
  const { data } = await api.patch<ApiResponse<MarkNotificationsReadResult>>("/notifications/mark-read", payload);
  return data.data;
}

export async function getNotificationCampaignStats(signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<NotificationCampaignStats>>("/admin/notifications/stats", { signal });
  return data.data;
}

export async function getNotificationCampaigns(params: { page?: number; limit?: number; status?: NotificationCampaignStatus; channel?: NotificationChannel; targetAudience?: NotificationAudience; search?: string }, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<NotificationCampaignList>>("/admin/notifications", { params, signal });
  return data.data;
}

export async function getNotificationCampaign(id: string, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<NotificationCampaignDetail>>(`/admin/notifications/${id}`, { signal });
  return data.data;
}

export async function createNotificationCampaign(payload: NotificationCampaignPayload) {
  const { data } = await api.post<ApiResponse<NotificationCampaignDetail>>("/admin/notifications", payload);
  return data.data;
}

export async function updateNotificationCampaign(id: string, payload: UpdateNotificationCampaignPayload) {
  const { data } = await api.patch<ApiResponse<NotificationCampaignDetail>>(`/admin/notifications/${id}`, payload);
  return data.data;
}
