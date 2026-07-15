import api from "./axios";
import type { ApiResponse, PaginationMeta } from "../types/api";
import type { Coupon, CouponStats, ProviderService } from "../types/adminApi";

export interface CouponsQuery {
  page: number;
  limit: number;
  search?: string;
  status?: "active" | "inactive";
  discountType?: "percentage" | "fixed";
  category?: ProviderService;
}

export interface CouponPayload {
  code: string;
  description: string;
  startAt: string;
  endAt: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscountAmount?: number;
  minimumOrderAmount: number;
  maxUsagePerUser: number;
  maxTotalUsage: number;
  isActive: boolean;
  applicableCategories: ProviderService[];
}

export async function getCoupons(params: CouponsQuery, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<{ items: Coupon[]; pagination: PaginationMeta }>>(
    "/admin/coupons",
    { params, signal },
  );
  return data.data;
}

export async function getCouponStats(signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<CouponStats>>("/admin/coupons/stats", { signal });
  return data.data;
}

export async function getCoupon(id: string, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<Coupon>>(`/admin/coupons/${id}`, { signal });
  return data.data;
}

export async function updateCoupon(id: string, payload: Partial<CouponPayload>) {
  const { data } = await api.patch<ApiResponse<Coupon>>(`/admin/coupons/${id}`, payload);
  return data.data;
}
