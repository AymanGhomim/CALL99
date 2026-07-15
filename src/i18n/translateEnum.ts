import type { TFunction } from "i18next";

const statusKeys: Readonly<Record<string, string>> = {
  ACTIVE: "statuses.ACTIVE", INACTIVE: "statuses.INACTIVE", BLOCKED: "statuses.BLOCKED",
  PENDING: "statuses.PENDING", PENDING_VERIFICATION: "statuses.PENDING_VERIFICATION",
  SUSPENDED: "statuses.SUSPENDED", INCOMPLETE: "statuses.INCOMPLETE",
  active: "statuses.active", inactive: "statuses.inactive", scheduled: "statuses.scheduled", expired: "statuses.expired",
  "مرسلة": "statuses.sent", "فشل": "statuses.failed",
  "قيد المراجعة": "statuses.underReview", "تم القبول": "statuses.accepted", "مرفوض": "statuses.rejected",
  "نشط": "statuses.active", "غير نشط": "statuses.inactive", "محظور": "statuses.BLOCKED",
  "قيد الانتظار": "statuses.PENDING", "مجدولة": "statuses.scheduled", "منتهي": "statuses.expired",
  "مكتمل": "dashboard.orderStatuses.completed", "مكتملة": "dashboard.orderStatuses.completed",
  "متوقف": "dashboard.orderStatuses.stopped", "ملغاة": "dashboard.orderStatuses.canceled",
};

export function translateStatus(value: string, t: TFunction): string {
  const key = statusKeys[value];
  return key ? t(key) : value;
}

export function translateRole(value: string, t: TFunction): string {
  const key = `roles.${value}`;
  return t(key, { defaultValue: value });
}

const valueKeys: Readonly<Record<string, string>> = {
  ...statusKeys,
  "مستخدم": "roles.USER", "عميل": "roles.CUSTOMER", "مقدم خدمة": "roles.PROVIDER",
  "مدير": "roles.MANAGER", "فريق ميداني": "roles.GROUND_TEAM", "خدمة العملاء": "roles.CUSTOMER_SERVICE",
  "نشط": "statuses.active", "نشطة": "statuses.active", "غير نشط": "statuses.inactive",
  "غير نشطة": "statuses.inactive", "محظور": "statuses.BLOCKED", "قيد الانتظار": "statuses.PENDING",
  "مجدول": "statuses.scheduled", "مجدولة": "statuses.scheduled", "منتهي": "statuses.expired",
  "مكتمل": "dashboard.orderStatuses.completed", "مكتملة": "dashboard.orderStatuses.completed",
  "قيد التنفيذ": "dashboard.orderStatuses.inProgress", "ملغي": "dashboard.orderStatuses.canceled",
  "ملغاة": "dashboard.orderStatuses.canceled", "متوقف": "dashboard.orderStatuses.stopped"
  ,"قيد المعالجة": "statuses.processing", "قيد المعالجه": "statuses.processing", "قيد المراجعة": "statuses.underReview",
  "تم حلها": "statuses.resolved", "مرفوض": "statuses.rejected", "مرفوضة": "statuses.rejected",
  "مرسلة": "statuses.sent", "فشل": "statuses.failed", "مفتوحة": "statuses.open", "مغلقة": "statuses.closed",
  "بانتظار العميل": "statuses.waitingCustomer", "معتمد": "statuses.approved", "تم التحقق": "statuses.verified",
  "مستندات ناقصة": "statuses.missingDocuments", "مستندات ناقصه": "statuses.missingDocuments",
  "قيد مراجعة المستندات": "statuses.pendingDocuments", "في الطريق": "statuses.onTheWay", "استرداد": "statuses.refunded"
  ,"غسيل سيارات": "values.carWash", "غسيل السيارات": "values.carWash", "صيانة": "values.maintenance",
  "صيانة دورية": "values.maintenance", "صيانة سريعة": "values.maintenance", "ونش": "values.towing", "سطحة": "values.towing", "سطحة وسحب": "values.towing",
  "صيانة متنقلة": "values.mobileMaintenance", "تأجير سيارات": "values.carRental", "تأجير السيارات": "values.carRental",
  "نقل": "values.transport", "جميع الخدمات": "values.allServices", "فرد": "values.individual",
  "شركة": "provider.company",
  "التطبيق": "notifications.appChannel", "SMS": "notifications.smsChannel", "الكل": "notifications.allAudience", "العملاء": "notifications.customersAudience", "المزودين": "notifications.providersAudience",
  "نسبة مئوية": "values.percentage", "مبلغ ثابت": "values.fixedAmount", "الدفع عند الاستلام": "values.cash", "مدى": "values.mada",
  "تحصيل": "values.collection", "تسوية": "values.settlement", "تفويض مسبق": "values.preAuthorization",
  "في الانتظار": "statuses.PENDING", "بانتظار التحقق": "statuses.awaitingVerification", "تم القبول": "statuses.accepted", "تمت الموافقة": "statuses.approved",
  "تم إنشاء الطلب": "statuses.created", "بانتظار الموافقة": "statuses.awaitingApproval", "جديد": "statuses.new"
};

export function translateValue(value: string, t: TFunction): string {
  const key = valueKeys[value];
  return key ? t(key) : value;
}

const legacyTextKeys: Readonly<Record<string, string>> = {
  "إجمالي الاعلانات": "stats.totalAds", "الاعلانات النشطه": "stats.activeAds", "الاعلانات المجدوله": "stats.scheduledAds", "الاعلانات غير النشطه": "stats.inactiveAds",
  "شكاوى جديدة": "stats.newComplaints", "تم حلها": "stats.resolved", "قيد المعالجة": "stats.processing", "مرفوضة": "stats.rejected",
  "إجمالي المستلمين": "stats.totalRecipients", "المجدولة": "stats.scheduled", "المرسلة": "stats.sent", "إجمالي الإشعارات": "stats.totalNotifications",
  "طلبات جديدة": "stats.newRequests", "تمت الموافقة": "stats.approved", "إجمالي التذاكر": "stats.totalTickets", "مفتوحة": "stats.open", "بانتظار العميل": "stats.waitingCustomer",
  "إجمالي عدد الكوبونات": "stats.totalCoupons", "إجمالي مرات الاستخدام": "stats.totalUsage", "الكوبونات النشطة": "stats.activeCoupons",
  "إجمالي الإيرادات": "stats.totalRevenue", "أرباح مقدمي الخدمة": "stats.providerEarnings", "عمولة المنصة": "stats.platformCommission", "إجمالي السحوبات": "stats.totalWithdrawals",
  "إجمالي الباقات": "stats.totalPlans", "الباقات النشطه": "stats.activePlans", "الباقات غير النشطه": "stats.inactivePlans",
  "إجمالي الطلبات": "stats.totalOrders", "طلبات مكتملة": "stats.completedOrders", "طلبات ملغية": "stats.canceledOrders", "الخدمات النشطة": "stats.activeServices",
  "مقدمو الخدمة": "stats.providers", "العملاء": "stats.customers", "إجمالي المستخدمين": "stats.totalUsers", "المدراء": "stats.admins", "خدمة العملاء": "stats.customerService", "الفريق الميداني": "stats.fieldTeam",
  "+3 الشهر الحالي": "stats.thisMonth", "تشكل 75% من الإجمالي": "stats.ofTotal", "لشهر يوليو": "stats.july", "تحتاج إلى مراجعة": "stats.needsReview", "+12.5% عن الشهر الماضي": "stats.vsLastMonth"
  ,"ملف المستخدم": "modules.profile.title", "عرض وإدارة معلومات المستخدم": "modules.profile.subtitle",
  "ملف مقدم الخدمه": "modules.providerProfile.title", "ملف مقدم الخدمة": "modules.providerProfile.title",
  "عرض وإدارة معلومات مقدم الخدمة": "modules.providerProfile.subtitle"
  ,"قيد المراجعه": "statuses.underReview", "مستندات ناقصه": "statuses.missingDocuments",
  "بانتظار التحقق": "statuses.awaitingVerification", "قيد مراجعة المستندات": "statuses.pendingDocuments"
};

export function translateLegacyText(value: string, t: TFunction): string {
  const key = legacyTextKeys[value];
  return key ? t(key) : translateValue(value, t);
}
