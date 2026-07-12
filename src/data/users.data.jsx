import {
  Headset,
  ShieldCheck,
  Truck,
  User,
  UserCog,
  Users,
} from "lucide-react";

export const usersStats = [
  {
    title: "مقدمو الخدمة",
    value: "456",
    change: "-3%",
    changeType: "down",
    icon: <UserCog size={22} />,
    iconBg: "#fdf1e3",
    iconColor: "#c9862e",
  },
  {
    title: "العملاء",
    value: "1,820",
    change: "+8%",
    icon: <User size={22} />,
    iconBg: "#eaf2fc",
    iconColor: "#3b82f6",
  },
  {
    title: "إجمالي المستخدمين",
    value: "2,482",
    change: "+12%",
    icon: <Users size={22} />,
    iconBg: "#fbeaea",
    iconColor: "#75262d",
  },
  {
    title: "المدراء",
    value: "14",
    change: "ثابت",
    changeType: "neutral",
    icon: <ShieldCheck size={22} />,
    iconBg: "#fbeaea",
    iconColor: "#75262d",
  },
  {
    title: "خدمة العملاء",
    value: "24",
    change: "+1%",
    icon: <Headset size={22} />,
    iconBg: "#e8f8ef",
    iconColor: "#22c55e",
  },
  {
    title: "الفريق الميداني",
    value: "168",
    change: "+15%",
    icon: <Truck size={22} />,
    iconBg: "#e8f8ef",
    iconColor: "#16a34a",
  },
];

export const roleOptions = [
  "مقدم خدمة",
  "عميل",
  "مدير",
  "خدمة عملاء",
  "فريق ميداني",
];

export const statusOptions = ["نشط", "محظور"];

export const usersList = [
  {
    id: 1,
    name: "أحمد محمد علي",
    phone: "011111111111",
    role: "مقدم خدمة",
    ordersCount: 50,
    createdAt: "23 مايو 2026",
    status: "نشط",
  },
  {
    id: 2,
    name: "سارة أحمد حسن",
    phone: "011111111111",
    role: "عميل",
    ordersCount: 140,
    createdAt: "23 مايو 2026",
    status: "محظور",
  },
  {
    id: 3,
    name: "عمر خالد إبراهيم",
    phone: "011111111111",
    role: "مقدم خدمة",
    ordersCount: 120,
    createdAt: "23 مايو 2026",
    status: "نشط",
  },
  {
    id: 4,
    name: "نورهان مصطفى محمود",
    phone: "011111111111",
    role: "عميل",
    ordersCount: 156,
    createdAt: "23 مايو 2026",
    status: "محظور",
  },
];
