import { Car, FileBadge2, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { translateValue } from "../../i18n/translateEnum";

interface ProviderQuickInfoRowProps {
  mainService: string;
  commercialRegisterNo: string;
  providerType: string;
}

export default function ProviderQuickInfoRow({ mainService, commercialRegisterNo, providerType }: ProviderQuickInfoRowProps) {
  const { t } = useTranslation();
  const items = [
    { label: t("provider.mainService"), value: translateValue(mainService, t), icon: <Car size={15} /> },
    { label: t("provider.commercialRegisterNumber"), value: commercialRegisterNo, icon: <FileBadge2 size={15} /> },
    { label: t("provider.providerType"), value: translateValue(providerType, t), icon: <User size={15} /> },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-[#f2e8e8] bg-white p-5 text-start shadow-sm">
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
