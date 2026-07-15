import Badge from "../ui/Badge";
import type { ProviderPackageInfo } from "../../types/entities";
import { useTranslation } from "react-i18next";
import { translateStatus } from "../../i18n/translateEnum";
import useLocale from "../../i18n/useLocale";

export default function ProviderPackageCard({ pkg }: { pkg: ProviderPackageInfo }) {
  const { t } = useTranslation();
  const { formatCurrency } = useLocale();
  return (
    <div className="rounded-xl border border-[#f2e8e8] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-start text-base font-extrabold text-[#221b1b]">{t("provider.currentPlan")}</h3>

      <div className="mb-4 rounded-lg bg-[#fbf1f1] py-3 text-center text-base font-extrabold text-[#75262d]">
        {pkg.name}
      </div>

      {pkg.description && <p className="mb-4 text-start text-xs leading-5 text-gray-500">{pkg.description}</p>}

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between border-b border-[#f2e8e8] pb-2.5">
          <span className="font-bold text-[#221b1b]">{formatCurrency(pkg.price)}</span>
          <span className="text-gray-500">{t("tables.price")}</span>
        </div>
        <div className="flex items-center justify-between border-b border-[#f2e8e8] pb-2.5">
          <span className="font-bold text-[#221b1b]">{pkg.startDate}</span>
          <span className="text-gray-500">{t("provider.startDate")}</span>
        </div>
        <div className="flex items-center justify-between border-b border-[#f2e8e8] pb-2.5">
          <span className="font-bold text-[#221b1b]">{pkg.endDate}</span>
          <span className="text-gray-500">{t("provider.endDate")}</span>
        </div>
        <div className="flex items-center justify-between">
          <Badge tone="success" size="sm">
            {translateStatus(pkg.status, t)}
          </Badge>
          <span className="text-gray-500">{t("common.status")}</span>
        </div>
        {(pkg.maxImages !== undefined || pkg.maxVideos !== undefined) && (
          <div className="grid grid-cols-2 gap-2 border-t border-[#f2e8e8] pt-3 text-center text-xs">
            <div><strong className="block text-[#221b1b]">{pkg.maxImages ?? 0}</strong>{t("provider.maxImages")}</div>
            <div><strong className="block text-[#221b1b]">{pkg.maxVideos ?? 0}</strong>{t("provider.maxVideos")}</div>
            <div><strong className="block text-[#221b1b]">{pkg.maxServices ?? 0}</strong>{t("provider.maxServices")}</div>
            <div><strong className="block text-[#221b1b]">{pkg.maxServiceListings ?? 0}</strong>{t("provider.maxListings")}</div>
          </div>
        )}
      </div>
    </div>
  );
}
