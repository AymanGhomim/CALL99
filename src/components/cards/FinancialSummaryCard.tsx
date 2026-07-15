import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export interface FinancialSummaryRow {
  label: string;
  value: ReactNode;
  icon: ReactNode;
}

interface FinancialSummaryCardProps {
  title?: string;
  rows: FinancialSummaryRow[];
  onViewReport?: () => void;
  reportLabel?: string;
}

/**
 * Generic "financial summary" card: a title, a stack of label/value rows with
 * matching icons, and a "view report" button. Used by both the provider
 * profile (revenue/orders/commissions/net profit) and the user profile
 * (expenses/orders/commissions) - only the row config differs between them.
 */
export default function FinancialSummaryCard({
  title,
  rows,
  onViewReport,
  reportLabel,
}: FinancialSummaryCardProps) {
  const { t } = useTranslation();
  return (
    <div className="mb-6 rounded-xl border border-[#f2e8e8] bg-white p-8 shadow-sm">
      <div className="flex items-start justify-between gap-8 max-[640px]:flex-col-reverse">
        {/* Text content - renders on the right in RTL */}
        <div className="flex-1 text-right">
          <h3 className="text-lg font-extrabold text-[#221b1b]">{title ?? t("common.financialSummary")}</h3>

          <div className="mt-5 space-y-4 text-sm">
            {rows.map((row, index) => (
              <div
                key={row.label}
                className={`text-right ${
                  index < rows.length - 1 ? "border-b border-[#f2e8e8] pb-3" : ""
                }`}
              >
                <p className="text-gray-500">{row.label}</p>
                <p className="mt-1 text-base font-extrabold text-[#221b1b]">{row.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Icon column - renders on the left in RTL */}
        <div className="flex shrink-0 flex-col gap-4">
          {rows.map((row) => (
            <span
              key={row.label}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fbf1f1] text-[#75262d]"
            >
              {row.icon}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onViewReport}
        className="mt-6 w-full rounded-lg border border-[#e7dede] py-3 text-sm font-bold text-[#3d3434] transition-colors hover:bg-[#fbf7f7]"
      >
        {reportLabel ?? t("common.viewFinancialReport")}
      </button>
    </div>
  );
}
