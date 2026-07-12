export const providerRequestsStats = {
  missingDocuments: { value: 6, change: "+3 الشهر الحالي" },
  underReview: { value: 2000, change: "+3 الشهر الحالي" },
  totalRequests: { value: 24, change: "+3 الشهر الحالي" },
  documentsReview: { value: 2000 },
  awaitingVerification: { value: 24 },
};

export const providerTypeOptions = ["غسيل السيارات", "صيانه", "تأجير السيارات", "سطحه"];

export const requestStatusOptions = ["بانتظار التحقق", "قيد مراجعة المستندات", "قيد المعالجه", "مستندات ناقصة"];

export const pendingProviderRequests = [
  {
    id: 1,
    orderNo: "#ORD-9421",
    providerName: "أحمد محمد علي",
    serviceType: "غسيل",
    phone: "00111111111",
    date: "22يوليو 2026",
    status: "بانتظار التحقق",
  },
  {
    id: 2,
    orderNo: "#ORD-9421",
    providerName: "أحمد محمد علي",
    serviceType: "صيانه",
    phone: "00111111111",
    date: "22يوليو 2026",
    status: "قيد مراجعة المستندات",
  },
  {
    id: 3,
    orderNo: "#ORD-9421",
    providerName: "أحمد محمد علي",
    serviceType: "تاجير السيارات",
    phone: "00111111111",
    date: "22يوليو 2026",
    status: "قيد المعالجه",
  },
  {
    id: 4,
    orderNo: "#ORD-9421",
    providerName: "أحمد محمد علي",
    serviceType: "سطحه",
    phone: "00111111111",
    date: "22يوليو 2026",
    status: "قيد المعالجه",
  },
  {
    id: 5,
    orderNo: "#ORD-9421",
    providerName: "أحمد محمد علي",
    serviceType: "غسيل السيارات",
    phone: "00111111111",
    date: "22يوليو 2026",
    status: "مستندات ناقصة",
  },
];
