import type { ApiResponse, PaginationMeta } from "./api";

export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "GROUND_TEAM"
  | "CUSTOMER_SERVICE"
  | "MANAGER"
  | "USER"
  | "CUSTOMER"
  | "PROVIDER";

export type UserStatus =
  | "ACTIVE"
  | "BLOCKED"
  | "INACTIVE"
  | "PENDING_VERIFICATION"
  | "SUSPENDED"
  | "INCOMPLETE";

export interface AdminUserListItem {
  id: string;
  fullName: string | null;
  role: AdminRole;
  phone: string | null;
  status: UserStatus;
  createdAt: string;
}

export interface AdminUserRecord extends AdminUserListItem {
  profileId: string | null;
  updatedAt: string;
}

export interface AdminCustomerProfile {
  id: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderDocument {
  url?: string | null;
  storageKey?: string | null;
  mimeType?: string | null;
  originalName?: string | null;
}

export type ProviderService = "car_wash" | "car_rental" | "maintenance_repair" | "towing";

export type ProviderApplicationStatus = "pending_review" | "approved" | "rejected";

export interface ProviderApplicationStats {
  total: { count: number };
  pendingReview: { count: number };
  rejected: { count: number };
  awaitingVerification: { count: number };
  approved: { count: number };
}

export interface ProviderApplicationListItem {
  id: string;
  applicationNumber: string;
  providerType: "individual" | "company";
  fullName: string;
  phone: string;
  service: ProviderService;
  status: ProviderApplicationStatus;
  submittedAt: string;
  rejectionReason: unknown;
}

export interface ProviderApplicationListData {
  items: ProviderApplicationListItem[];
  pagination: PaginationMeta;
}

export interface ProviderApplicationDocument {
  url: string;
  mimeType: string;
  originalName: string;
  reviewState: "pending" | "approved" | "rejected";
}

export interface ProviderApplicationDetail {
  applicationNumber: string;
  status: ProviderApplicationStatus;
  submittedAt: string;
  rejectionReason: unknown;
  user: { id: string; fullName: string; phone: string };
  provider: AdminProviderRecord;
  service: ProviderService;
  documents: {
    commercialRegistration: ProviderApplicationDocument;
    managerNationalId: ProviderApplicationDocument;
  };
}

export interface ProviderApplicationActionResult {
  id: string;
  applicationNumber: string;
  status: ProviderApplicationStatus;
  rejectionReason: unknown;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  maxImages: number;
  maxVideos: number;
  maxServices: number;
  maxServiceListings: number;
  hasAdBanner: boolean;
  price: number;
  durationInMonths: number;
  status: "active" | "inactive";
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderSubscription {
  id: string;
  providerId: string;
  subscriptionPlanId: string;
  status: "active" | "expired" | "cancelled";
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  plan: SubscriptionPlan | null;
}

export interface WalletSummary {
  id: string;
  kind: "general" | "earnings" | "refund";
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProviderRecord {
  id: string;
  providerType: "individual" | "company";
  fullName: string | null;
  nationalIdOrIqama: string | number | null;
  commercialRegistrationNumber: string | number | null;
  vatNumber: string | number | null;
  registeredBy: "self" | "ground_team";
  registeredByUserId: string | null;
  status: "incomplete" | "pending_review" | "approved" | "rejected";
  approvalStatus: "pending" | "approved" | "rejected" | "suspended";
  createdBy: "self" | "admin" | "ground_team";
  city: string | null;
  detailedAddress: string | null;
  companyName: string | null;
  responsibleName: string | null;
  email: string | null;
  idNumber: string | number | null;
  licenseNumber: string | null;
  services: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminProviderProfileData {
  provider: AdminProviderRecord;
  documents: {
    commercialRegistration: ProviderDocument;
    managerNationalId: ProviderDocument;
  };
  subscription: ProviderSubscription | null;
  wallet: WalletSummary | null;
}

export interface AdminUserDetail {
  profileType: "user" | "customer" | "provider";
  user: AdminUserRecord;
  customerProfile?: AdminCustomerProfile | null;
  providerProfile?: AdminProviderProfileData | null;
}

export interface AdminUserCounters {
  totalUsers: number;
  customers: number;
  providers: number;
  groundTeam: number;
  customerService: number;
  admins: number;
  superAdmins: number;
}

export interface AdminUsersListData {
  items: AdminUserListItem[];
  pagination: PaginationMeta;
}

export type AdminUsersListResponse = ApiResponse<AdminUsersListData>;

export interface Advertisement {
  id: string;
  name: string;
  description: string | null;
  startAt: string;
  endAt: string;
  isActive: boolean;
  targetCategories: ProviderService[];
  bannerFileId: string;
  couponId: string | null;
  isDisplayableNow: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdvertisementStats {
  totalAds: { count: number };
  activeAds: { percentage: number; displayableCount: number; totalAds: number };
  scheduledAds: { count: number; monthStartAt: string; monthEndAt: string };
  inactiveAds: { count: number };
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  startAt: string;
  endAt: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscountAmount: number | null;
  minimumOrderAmount: number;
  maxUsagePerUser: number;
  maxTotalUsage: number;
  isActive: boolean;
  applicableCategories: ProviderService[];
  totalReservedUsages: number;
  totalRedeemedUsages: number;
  totalReleasedUsages: number;
  isRedeemableNow: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouponStats {
  totalCoupons: { value: number; delta: number };
  activeCoupons: { value: number; delta: number };
  totalUsageCount: { value: number; delta: number };
}
