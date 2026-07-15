import api from "./axios";
import type { ApiResponse, PaginationMeta } from "../types/api";
import type { SubscriptionPlan } from "../types/adminApi";

export interface SubscriptionPlanPayload {
  name: string;
  description: string;
  maxImages: number;
  maxVideos: number;
  hasAdBanner: boolean;
  price: number;
  durationInMonths: number;
  status: "active" | "inactive";
}

export async function getSubscriptionPlans(page: number, limit: number, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<{ items: SubscriptionPlan[]; pagination: PaginationMeta }>>(
    "/admin/subscription-plans",
    { params: { page, limit }, signal },
  );
  return data.data;
}

export async function getSubscriptionPlan(id: string, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<SubscriptionPlan>>(`/admin/subscription-plans/${id}`, { signal });
  return data.data;
}

export async function createSubscriptionPlan(payload: SubscriptionPlanPayload) {
  const { data } = await api.post<ApiResponse<SubscriptionPlan>>("/admin/subscription-plans", payload);
  return data.data;
}

export async function updateSubscriptionPlan(id: string, payload: Partial<SubscriptionPlanPayload> & { maxServices?: 1 }) {
  const { data } = await api.patch<ApiResponse<SubscriptionPlan>>(`/admin/subscription-plans/${id}`, payload);
  return data.data;
}

export async function toggleSubscriptionPlanStatus(id: string, isActive: boolean) {
  const { data } = await api.patch<ApiResponse<SubscriptionPlan>>(
    `/admin/subscription-plans/${id}/toggle-status`,
    { isActive },
  );
  return data.data;
}

export async function setDefaultSubscriptionPlan(id: string) {
  const { data } = await api.patch<ApiResponse<{ plan: SubscriptionPlan }>>(
    `/admin/subscription-plans/${id}/set-default`,
  );
  return data.data.plan;
}
