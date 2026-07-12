import { Car, FileBadge2, User } from "lucide-react";

export default function ProviderQuickInfoRow({ mainService, commercialRegisterNo, providerType }) {
  const items = [
    { label: "الخدمة الرئيسية", value: mainService, icon: <Car size={15} /> },
    { label: "رقم السجل التجاري", value: commercialRegisterNo, icon: <FileBadge2 size={15} /> },
    { label: "نوع مزود الخدمة", value: providerType, icon: <User size={15} /> },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-[#f2e8e8] bg-white p-5 text-right shadow-sm">
          <p className="flex items-center justify-start gap-1.5 text-xs font-semibold text-gray-500">
            {item.label}
            <span className="text-gray-400">{item.icon}</span>
          </p>
          <p className="mt-2 text-base font-extrabold text-[#221b1b]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
