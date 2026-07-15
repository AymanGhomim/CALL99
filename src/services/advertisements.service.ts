import api from "./axios";
import type { ApiResponse, PaginationMeta } from "../types/api";
import type { Advertisement, AdvertisementStats, ProviderService } from "../types/adminApi";

export interface AdvertisementsQuery {
  page: number;
  limit: number;
  search?: string;
  status?: "active" | "scheduled" | "expired" | "inactive";
  category?: ProviderService;
}

export interface AdvertisementPayload {
  name: string;
  description?: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
  targetCategories: ProviderService[];
  couponId?: string | null;
  bannerFile?: File;
}

function toFormData(payload: Partial<AdvertisementPayload>): FormData {
  const formData = new FormData();
  if (payload.name !== undefined) formData.append("name", payload.name);
  if (payload.description !== undefined) formData.append("description", payload.description);
  if (payload.startAt !== undefined) formData.append("startAt", payload.startAt);
  if (payload.endAt !== undefined) formData.append("endAt", payload.endAt);
  if (payload.isActive !== undefined) formData.append("isActive", String(payload.isActive));
  payload.targetCategories?.forEach((category) => formData.append("targetCategories", category));
  if (payload.couponId !== undefined) formData.append("couponId", payload.couponId ?? "");
  if (payload.bannerFile) formData.append("bannerFile", payload.bannerFile);
  return formData;
}

export async function getAdvertisements(params: AdvertisementsQuery, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<{ items: Advertisement[]; pagination: PaginationMeta }>>(
    "/admin/advertisements",
    { params, signal },
  );
  return data.data;
}

export async function getAdvertisementStats(signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<AdvertisementStats>>("/admin/advertisements/stats", { signal });
  return data.data;
}

export async function getAdvertisement(id: string, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<Advertisement>>(`/admin/advertisements/${id}`, { signal });
  return data.data;
}

export async function createAdvertisement(payload: AdvertisementPayload) {
  const { data } = await api.post<ApiResponse<Advertisement>>("/admin/advertisements", toFormData(payload));
  return data.data;
}

export async function updateAdvertisement(id: string, payload: Partial<AdvertisementPayload>) {
  const { data } = await api.patch<ApiResponse<Advertisement>>(
    `/admin/advertisements/${id}`,
    toFormData(payload),
  );
  return data.data;
}
