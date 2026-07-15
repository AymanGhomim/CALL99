import { useMemo, useState } from "react";
import Badge from "../ui/Badge";
import Pagination from "../ui/Pagination";
import { PROVIDER_SERVICE_STATUS_TONE } from "../../constants/statusTones";
import type { ProviderServiceInfo } from "../../types/entities";
import { useTranslation } from "react-i18next";
import { translateStatus, translateValue } from "../../i18n/translateEnum";
import useLocale from "../../i18n/useLocale";

export default function ProviderServicesCard({ services }: { services: ProviderServiceInfo[] }) {
  const { t } = useTranslation();
  const { formatCurrency } = useLocale();
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(services.length / pageSize));
  const visibleServices = useMemo(
    () => services.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, services],
  );

  return (
    <div className="rounded-xl border border-[#f2e8e8] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-start text-base font-extrabold text-[#221b1b]">{t("provider.services")}</h3>

      <table className="w-full text-start text-xs">
        <thead>
          <tr className="text-gray-400">
            <th className="pb-2 font-semibold">{t("tables.service")}</th>
            <th className="pb-2 font-semibold">{t("tables.price")}</th>
            <th className="pb-2 font-semibold">{t("common.status")}</th>
          </tr>
        </thead>
        <tbody>
          {visibleServices.map((service) => (
            <tr key={service.name} className="border-t border-[#f2e8e8]">
              <td className="py-2.5 font-bold text-[#221b1b]">{translateValue(service.name, t)}</td>
              <td className="py-2.5 text-gray-500">{formatCurrency(service.price)}</td>
              <td className="py-2.5">
                <Badge tone={PROVIDER_SERVICE_STATUS_TONE[service.status] ?? "neutral"} size="sm">
                  {translateStatus(service.status, t)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={services.length}
        shownCount={pageSize}
        itemLabel={t("provider.serviceItem")}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
