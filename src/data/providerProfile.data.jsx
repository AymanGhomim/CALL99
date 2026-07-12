import { ORDER_STATUS_OPTIONS } from "../constants/statusTones";

export const providerMonthlyActivity = [
  { name: "يونيو", value: 46 },
  { name: "مايو", value: 100 },
  { name: "ابريل", value: 70 },
  { name: "مارس", value: 88 },
  { name: "فبراير", value: 60 },
  { name: "يناير", value: 42 },
];

export const providerOrderStatusOptions = ORDER_STATUS_OPTIONS;

export function getProviderOrders(customerNames) {
  const services = ["غسيل خارجي", "غسيل داخلي"];
  const statuses = ORDER_STATUS_OPTIONS;

  return customerNames.map((name, index) => ({
    id: index + 1,
    orderNo: "#ORD-9421",
    customer: name,
    service: services[index % services.length],
    status: statuses[index % statuses.length],
    price: "150 ريال",
    date: "23مايو 2026",
  }));
}

export function getProviderProfile() {
  return {
    name: "ديتيلنج برو",
    status: "مفعل",
    memberSince: "عضو منذ يناير 2023",
    rating: 4.9,
    reviewsCount: 124,
    basicInfo: [
      { label: "البريد الإلكتروني", value: "detailpro@example.com" },
      { label: "رقم الجوال", value: "+966 55 987 6543" },
      { label: "العنوان", value: "الرياض - حي العليا - شارع التحلية" },
      { label: "الخدمه", value: "غسيل السيارات" },
      { label: "رقم السجل التجاري", value: "1010234567" },
      { label: "اللغة", value: "العربية" },
    ],
    mainService: "غسيل السيارات",
    commercialRegisterNo: "1010234567",
    providerType: "فرد",
    galleryCount: 12,
    documents: [
      { label: "السجل التجاري", status: "تم التحقق" },
      { label: "الهوية الوطنية", status: "تم التحقق" },
    ],
    services: [
      { name: "غسيل داخلي", price: "80 ريال", status: "نشط" },
      { name: "غسيل خارجي", price: "60 ريال", status: "نشط" },
      { name: "تلميع شامل", price: "150 ريال", status: "غير نشط" },
      { name: "تغيير زيوت", price: "220 ريال", status: "نشط" },
      { name: "فحص كمبيوتر", price: "100 ريال", status: "نشط" },
    ],
    currentPackage: {
      name: "Premium",
      price: "299 ريال / شهر",
      startDate: "12 مايو 2026",
      endDate: "12 يونيو 2026",
      status: "نشطة",
    },
    stats: {
      cancelledOrders: 104,
      completedOrders: 124,
      totalOrders: 1024,
      scheduledOrders: 124,
      activeOrders: 124,
    },
    financialSummary: {
      totalRevenue: "23,450 ر.س",
      totalOrders: 128,
      commissions: "2,345 ر.س",
      netProfit: "21,105 ر.س",
    },
    reviews: [
      {
        id: 1,
        name: "أحمد محمد علي",
        rating: 5,
        comment: "خدمة ممتازة ومستعملة وجودة في العمل، أنصح بالتعامل معهم.",
        date: "23 مايو 2026",
      },
      {
        id: 2,
        name: "سارة أحمد حسن",
        rating: 4,
        comment: "تعامل راقي وسرعة في الإنجاز، شكراً لكم.",
        date: "20 مايو 2026",
      },
      {
        id: 3,
        name: "عمر إبراهيم",
        rating: 5,
        comment: "جودة عالية وأسعار مناسبة.",
        date: "18 مايو 2026",
      },
    ],
  };
}
