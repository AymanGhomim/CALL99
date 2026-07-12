import {
  Banknote,
  BellRing,
  BriefcaseBusiness,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  Clock3,
  FileText,
  Heart,
  PackageCheck,
  RefreshCcw,
  Scale,
  ShieldAlert,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";
import { colors } from "../constants/colors";

export { colors };

export const dashboardStats = [
  { title: "إجمالي الطلبات اليوم", value: "1,254", change: "+12.5% عن أمس", icon: <ChartNoAxesColumnIncreasing size={17} className="text-blue-500" /> },
  { title: "إجمالي الطلبات النشطة", value: "318", change: "", icon: <Heart size={17} className="text-emerald-500" /> },
  { title: "الطلبات بانتظار قبول مقدم الخدمة", value: "42", change: "", icon: <Clock3 size={17} className="text-orange-500" /> },
  { title: "الطلبات المكتملة اليوم", value: "892", change: "+8%", icon: <CheckCircle2 size={17} className="text-emerald-500" /> },
  { title: "الطلبات الملغاة اليوم", value: "56", change: "-5%", changeType: "down", icon: <ShieldAlert size={17} className="text-red-500" /> },
  { title: "إجمالي الإيرادات اليوم", value: "240,000 ر.س", change: "", icon: <Banknote size={17} className="text-emerald-600" /> },
  { title: "عمولة المنصة اليوم", value: "2,768 ر.س", change: "", icon: <FileText size={17} className="text-blue-500" /> },
  { title: "مستحقات مقدمي الخدمة المعلقة", value: "41,250 ر.س", change: "", icon: <WalletCards size={17} className="text-orange-500" /> },
  { title: "طلبات استرداد أموال معلقة", value: "3,620 ر.س", change: "", icon: <FileText size={17} className="text-pink-500" /> },
  { title: "إجمالي الطلبات النشطة الحالية", value: "124", change: "", icon: <RefreshCcw size={17} className="text-teal-500" /> },
  { title: "العملاء النشطون", value: "5,284", change: "", icon: <Users size={17} className="text-blue-500" /> },
  { title: "مقدمو الخدمة النشطون", value: "1,128", change: "", icon: <BriefcaseBusiness size={17} className="text-emerald-500" /> },
  { title: "تسجيلات العملاء الجدد", value: "245", change: "", icon: <UserPlus size={17} className="text-purple-500" /> },
  { title: "تسجيلات مقدمي الخدمة الجدد", value: "89", change: "", icon: <PackageCheck size={17} className="text-purple-500" /> },
  { title: "الطلبات الملغاة تلقائياً", value: "18", change: "", icon: <BellRing size={17} className="text-red-500" /> },
  { title: "النزاعات المفتوحة", value: "8", change: "", icon: <Scale size={17} className="text-red-500" /> },
];

export const revenueData = [
  { name: "تأجير السيارات", value: 18500 },
  { name: "صيانة دورية", value: 18500 },
  { name: "سطحة", value: 18500 },
  { name: "غسيل", value: 18500 },
];

export const serviceOrdersData = [
  { name: "غسيل سيارات", value: 38, color: colors.primary },
  { name: "صيانة متنقلة", value: 28, color: colors.green },
  { name: "سطحة وسحب", value: 20, color: colors.blue },
  { name: "تأجير", value: 14, color: "#506070" },
];

export const statusData = [
  { name: "مكتملة", value: 52, color: colors.primary },
  { name: "قيد التنفيذ", value: 18, color: colors.blue },
  { name: "بانتظار قبول", value: 14, color: colors.orange },
  { name: "مجدولة", value: 8, color: colors.pink },
  { name: "ملغاة", value: 6, color: "#22c55e" },
  { name: "ملغاة تلقائياً", value: 2, color: colors.purple },
];

export const cancellationReasons = [
  { label: "مقدم الخدمة لم يستجب", value: 38 },
  { label: "العميل ألغى الطلب", value: 26 },
  { label: "تأخير في الدفع", value: 14 },
  { label: "لا توجد خدمات قريبة", value: 12 },
  { label: "حجز مكرر", value: 10 },
];

export const customersGrowthData = [
  { name: "يناير", value: 260 },
  { name: "فبراير", value: 420 },
  { name: "مارس", value: 520 },
  { name: "أبريل", value: 710 },
  { name: "مايو", value: 870 },
  { name: "يونيو", value: 1180 },
];

export const providerAcceptanceData = [
  { name: "الجمعة", value: 78 },
  { name: "الخميس", value: 80 },
  { name: "الأربعاء", value: 82 },
  { name: "الثلاثاء", value: 79 },
  { name: "الإثنين", value: 84 },
  { name: "الأحد", value: 82 },
  { name: "السبت", value: 81 },
];

export const latestOrders = [
  { orderNo: "#ORD-9421", client: "أحمد محمد علي", provider: "أحمد محمد علي", status: "نشط", price: "150 ريال", date: "23 مايو 2026" },
  { orderNo: "#ORD-9421", client: "سارة أحمد حسين", provider: "أحمد محمد علي", status: "مجدولة", price: "150 ريال", date: "23 مايو 2026" },
  { orderNo: "#ORD-9421", client: "عمر خالد إبراهيم", provider: "أحمد محمد علي", status: "مكتمل", price: "150 ريال", date: "23 مايو 2026" },
  { orderNo: "#ORD-9421", client: "نورهان مصطفى محمود", provider: "أحمد محمد علي", status: "متوقف", price: "150 ريال", date: "23 مايو 2026" },
];

export const recentActivities = [
  {
    title: "انضمام مقدم خدمة جديد",
    description: 'تم قبول طلب انضمام "ورشة العناية" لتقديم خدمات الصيانة.',
    time: "منذ 15 دقيقة",
  },
  {
    title: "اكتمال طلب غسيل",
    description: "تم إكمال الطلب #ORD-9419 من قبل العميل عمر خالد.",
    time: "منذ 15 دقيقة",
  },
];
