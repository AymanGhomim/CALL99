import type { BadgeTone } from "../components/ui/Badge";

// Badge "tone" lookups shared across tables and cards.
// Each map is scoped to the domain it colors (order status, request status, ...)
// so unrelated status vocabularies never collide. Usage stays the same everywhere:
//   <Badge tone={SOME_TONE_MAP[value] ?? "neutral"}>{value}</Badge>

// Order lifecycle status shared by ProviderOrdersTable and UserOrdersTable.
export const ORDER_STATUS_TONE: Record<string, BadgeTone> = {
  جديد: "info",
  مكتمل: "success",
  مجدولة: "info",
  "قيد التنفيذ": "sky",
  ملغي: "danger",
};

// Same order lifecycle, exposed as a plain list for filter dropdowns
// (provider profile + user profile order filters). Derived from the tone
// map above so the two can never drift out of sync.
export const ORDER_STATUS_OPTIONS = Object.keys(ORDER_STATUS_TONE);

// Dashboard "latest orders" widget uses a slightly different status vocabulary.
export const DASHBOARD_ORDER_STATUS_TONE: Record<string, BadgeTone> = {
  نشط: "success",
  مجدولة: "info",
  مكتمل: "neutral",
  متوقف: "danger",
};

// Provider onboarding/registration request status (Providers page).
export const PROVIDER_REQUEST_STATUS_TONE: Record<string, BadgeTone> = {
  "بانتظار التحقق": "info",
  "قيد مراجعة المستندات": "warning",
  "قيد المعالجه": "warning",
  "مستندات ناقصة": "danger",
};

// Provider document verification status.
export const PROVIDER_DOCUMENT_STATUS_TONE: Record<string, BadgeTone> = {
  "تم التحقق": "success",
  "قيد المراجعة": "warning",
  مرفوض: "danger",
};

// Provider service active/inactive status.
export const PROVIDER_SERVICE_STATUS_TONE: Record<string, BadgeTone> = {
  نشط: "success",
  "غير نشط": "danger",
};

// Package (الباقات) active/inactive status.
export const PACKAGE_STATUS_TONE: Record<string, BadgeTone> = {
  نشط: "success",
  "غير نشط": "danger",
};

// Ad campaign (الاعلانات) active/scheduled/inactive status.
export const AD_STATUS_TONE: Record<string, BadgeTone> = {
  نشط: "success",
  مجدولة: "info",
  "غير نشط": "danger",
};

// Notification lifecycle status (Notifications page).
export const NOTIFICATION_STATUS_TONE: Record<string, BadgeTone> = {
  نشط: "success",
  مجدولة: "info",
  مرسلة: "success",
  مكتمل: "neutral",
  متوقف: "danger",
  فشل: "danger",
};

export const NOTIFICATION_STATUS_OPTIONS = Object.keys(
  NOTIFICATION_STATUS_TONE,
);

// User role badge tone (Users table).
export const USER_ROLE_TONE: Record<string, BadgeTone> = {
  "مقدم خدمة": "warning",
  عميل: "info",
  مدير: "purple",
  "خدمة عملاء": "success",
  "فريق ميداني": "sky",
};
