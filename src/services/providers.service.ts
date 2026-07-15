import api from "./axios";
import type { ApiResponse } from "../types/api";
import type {
  AdminProviderProfileData,
  ProviderApplicationActionResult,
  ProviderApplicationDetail,
  ProviderApplicationListData,
  ProviderApplicationStats,
  ProviderApplicationStatus,
  ProviderService,
} from "../types/adminApi";

export interface ProviderApplicationsParams {
  page?: number;
  limit?: number;
  status?: ProviderApplicationStatus;
  category?: ProviderService;
  from?: string;
  to?: string;
  search?: string;
}

export async function getProviderApplicationStats(signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<ProviderApplicationStats>>("/admin/provider-applications/stats", { signal });
  return data.data;
}

export async function getProviderApplications(params: ProviderApplicationsParams, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<ProviderApplicationListData>>("/admin/provider-applications", { params, signal });
  return data.data;
}

export async function getProviderApplication(id: string, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<ProviderApplicationDetail>>(`/admin/provider-applications/${id}`, { signal });
  return data.data;
}

export async function approveProviderApplication(id: string) {
  const { data } = await api.post<ApiResponse<ProviderApplicationActionResult>>(`/admin/provider-applications/${id}/approve`);
  return data.data;
}

export async function rejectProviderApplication(id: string, reason: string) {
  const { data } = await api.post<ApiResponse<ProviderApplicationActionResult>>(`/admin/provider-applications/${id}/reject`, { reason });
  return data.data;
}

export async function getAdminProviderProfile(providerId: string, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<AdminProviderProfileData>>(
    `/admin/providers/${providerId}/profile`,
    { signal },
  );
  return data.data;
}
