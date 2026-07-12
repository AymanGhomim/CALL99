import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  Wallet,
  Car,
} from "lucide-react";

export const ordersStats = [
  {
    title: "إجمالي الطلبات",
    value: "2,482",
    change: "+12%",
    icon: <ClipboardList size={22} />,
    iconBg: "#fbeaea",
    iconColor: "#75262d",
  },
  {
    title: "طلبات جديدة",
    value: "328",
    change: "+8%",
    icon: <Clock3 size={22} />,
    iconBg: "#eaf2fc",
    iconColor: "#3b82f6",
  },
  {
    title: "طلبات مكتملة",
    value: "1,945",
    change: "+15%",
    icon: <CheckCircle2 size={22} />,
    iconBg: "#e8f8ef",
    iconColor: "#22c55e",
  },
  {
    title: "طلبات ملغية",
    value: "209",
    change: "-2%",
    changeType: "down",
    icon: <XCircle size={22} />,
    iconBg: "#fdecec",
    iconColor: "#ef4444",
  },
  {
    title: "إجمالي الإيرادات",
    value: "152,300 ر.س",
    change: "+10%",
    icon: <Wallet size={22} />,
    iconBg: "#fff4e5",
    iconColor: "#d97706",
  },
  {
    title: "الخدمات النشطة",
    value: "6",
    change: "ثابت",
    changeType: "neutral",
    icon: <Car size={22} />,
    iconBg: "#f3f4f6",
    iconColor: "#6b7280",
  },
];

export const statusOptions = ["جديد", "قيد التنفيذ", "مكتمل", "ملغي"];

export const serviceOptions = ["غسيل سيارات", "ونش", "صيانة", "تأجير"];

export const roleOptions = ["عميل", "مقدم خدمة"];

export const ordersList = [
  {
    id: 1,
    orderNo: "#ORD-1001",
    customerName: "أحمد محمد",
    providerName: "شركة النظافة",
    customerPhone: "01011111111",
    providerPhone: "01022222222",
    service: "غسيل سيارات",
    role: "عميل",
    status: "جديد",
    price: 150,
    date: "12/07/2026",
  },
  {
    id: 2,
    orderNo: "#ORD-1002",
    customerName: "محمد علي",
    providerName: "ونش القاهرة",
    customerPhone: "01033333333",
    providerPhone: "01044444444",
    service: "ونش",
    role: "عميل",
    status: "قيد التنفيذ",
    price: 350,
    date: "11/07/2026",
  },
  {
    id: 3,
    orderNo: "#ORD-1003",
    customerName: "سارة أحمد",
    providerName: "صيانة السيارات",
    customerPhone: "01055555555",
    providerPhone: "01066666666",
    service: "صيانة",
    role: "عميل",
    status: "مكتمل",
    price: 700,
    date: "10/07/2026",
  },
  {
    id: 4,
    orderNo: "#ORD-1004",
    customerName: "نور خالد",
    providerName: "تأجير السيارات",
    customerPhone: "01077777777",
    providerPhone: "01088888888",
    service: "تأجير",
    role: "عميل",
    status: "ملغي",
    price: 1200,
    date: "09/07/2026",
  },
];
