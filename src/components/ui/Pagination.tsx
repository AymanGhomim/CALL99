import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  shownCount?: number;
  itemLabel?: string;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  shownCount = 10,
  itemLabel,
  onPageChange,
}: PaginationProps) {
  const [activePage, setActivePage] = useState(currentPage);
  const { t } = useTranslation();
  const { direction, formatNumber } = useLocale();

  useEffect(() => setActivePage(currentPage), [currentPage]);

  const changePage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setActivePage(nextPage);
    onPageChange?.(nextPage);
  };

  const firstShownItem = totalCount === 0 ? 0 : (activePage - 1) * shownCount + 1;
  const lastShownItem = Math.min(activePage * shownCount, totalCount);

  return (
    <div className="flex flex-col items-center gap-3 py-5 text-xs text-gray-500">
      <div className="flex items-center gap-3">
        <button type="button" aria-label={t("pagination.previousLabel")} disabled={activePage <= 1} onClick={() => changePage(activePage - 1)} className="disabled:cursor-not-allowed disabled:opacity-30">{direction === "rtl" ? "›" : "‹"}</button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button key={page} type="button" onClick={() => changePage(page)} className={page === activePage ? "rounded bg-[#75262d] px-3 py-2 text-white" : ""}>
            {page}
          </button>
        ))}
        <button type="button" aria-label={t("pagination.nextLabel")} disabled={activePage >= totalPages} onClick={() => changePage(activePage + 1)} className="disabled:cursor-not-allowed disabled:opacity-30">{direction === "rtl" ? "‹" : "›"}</button>
      </div>
      <p>{t("pagination.summary", { from: formatNumber(firstShownItem), to: formatNumber(lastShownItem), total: formatNumber(totalCount) })}{itemLabel ? ` ${itemLabel}` : ""}</p>
    </div>
  );
}
