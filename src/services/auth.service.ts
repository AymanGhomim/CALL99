import api from "./axios";
import type { AuthSession } from "../store/authStore";
import type { ApiResponse } from "../types/api";

export type LoginResponse = ApiResponse<AuthSession>;

export interface OtpResponse {
  success: true;
  meta: ApiResponse<never>["meta"];
  data: { requested: boolean; otpCode?: string };
}

export interface ResetPasswordPayload {
  phone: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function login(phone: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", { phone, password });
  return data;
}

export async function requestRegistrationOtp(phone: string): Promise<OtpResponse> {
  const { data } = await api.post<OtpResponse>("/auth/phone-verification/request-otp", { phone });
  return data;
}

export async function requestPasswordResetOtp(phone: string): Promise<OtpResponse> {
  const { data } = await api.post<OtpResponse>("/auth/forgot-password", { phone });
  return data;
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<{ updated: boolean }>> {
  const { data } = await api.post<ApiResponse<{ updated: boolean }>>("/auth/reset-password", payload);
  return data;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<ApiResponse<{ updated: boolean }>> {
  const { data } = await api.post<ApiResponse<{ updated: boolean }>>("/auth/change-password", payload);
  return data;
}

export function resendOtp(phone: string): Promise<OtpResponse> {
  return requestRegistrationOtp(phone);
}

export async function logout(): Promise<unknown> {
  const sessionId = localStorage.getItem("sessionId");
  const { data } = await api.post<unknown>("/auth/logout", sessionId ? { sessionId } : {});
  return data;
}
