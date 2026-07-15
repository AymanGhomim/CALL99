import api from "./axios";
import type { ApiResponse } from "../types/api";
import type {
  AdminRole,
  AdminUserCounters,
  AdminUserDetail,
  AdminUserRecord,
  AdminUsersListResponse,
  UserStatus,
} from "../types/adminApi";

export interface AdminUsersQuery {
  page: number;
  limit: number;
  search?: string;
  role?: AdminRole;
  status?: UserStatus;
  createdAtFrom?: string;
  createdAtTo?: string;
}

export interface CreateAdminUserPayload {
  phone: string;
  fullName: string;
  password: string;
  role: "ADMIN" | "GROUND_TEAM" | "CUSTOMER_SERVICE";
}

export async function getAdminUsers(params: AdminUsersQuery, signal?: AbortSignal) {
  const { data } = await api.get<AdminUsersListResponse>("/admin/users", { params, signal });
  return data.data;
}

export async function getAdminUserCounters(signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<AdminUserCounters>>("/admin/users/counters", { signal });
  return data.data;
}

export async function getAdminUser(id: string, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<AdminUserDetail>>(`/admin/users/${id}`, { signal });
  return data.data;
}

export async function createAdminUser(payload: CreateAdminUserPayload) {
  const { data } = await api.post<ApiResponse<AdminUserRecord>>("/admin/users", payload);
  return data.data;
}

export async function blockAdminUser(id: string) {
  const { data } = await api.patch<ApiResponse<AdminUserRecord>>(`/admin/users/${id}/block`);
  return data.data;
}

export async function unblockAdminUser(id: string) {
  const { data } = await api.patch<ApiResponse<AdminUserRecord>>(`/admin/users/${id}/unblock`);
  return data.data;
}

export async function deleteAdminUser(id: string) {
  const { data } = await api.delete<ApiResponse<{ deleted: boolean }>>(`/admin/users/${id}`);
  return data.data;
}
