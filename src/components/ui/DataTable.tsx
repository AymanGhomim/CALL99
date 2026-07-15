import type { Key, ReactNode } from "react";
import Pagination, { type PaginationProps } from "./Pagination";
import { useTranslation } from "react-i18next";
import { translateLegacyText } from "../../i18n/translateEnum";

const ALIGN_CLASSES = {
  right: "text-right",
  center: "text-center",
  left: "text-left",
} as const;

type Alignment = keyof typeof ALIGN_CLASSES;
type RowRenderer<T> = { render(row: T): ReactNode }["render"];

export interface DataTableColumn<T> {
  key: string;
  label: ReactNode;
  align?: Alignment | string;
  cellClassName?: string;
  render?: RowRenderer<T>;
}

export interface DataTableProps<T extends object> {
  title?: ReactNode;
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey?: keyof T | string;
  minWidth?: string;
  pagination?: Omit<PaginationProps, "shownCount"> & { shownCount?: number };
  loading?: boolean;
  emptyMessage?: string;
}

function getAlignmentClass(alignment?: string): string {
  return ALIGN_CLASSES[alignment as Alignment] ?? ALIGN_CLASSES.right;
}

function getRowValue<T extends object>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

export default function DataTable<T extends object>({
  title,
  columns,
  rows,
  rowKey = "id",
  minWidth = "820px",
  pagination,
  loading = false,
  emptyMessage,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  return (
    <div className="overflow-hidden rounded-xl border border-[#f2e8e8] bg-white shadow-sm">
      {title && <div className="px-6 py-5 text-start text-lg font-extrabold">{title}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-start text-sm" style={{ minWidth }}>
          <thead className="bg-[#75262d] text-white">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`px-5 py-4 ${getAlignmentClass(column.align)}`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-gray-400">
                  {t("common.loading")}
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-gray-400">
                  {emptyMessage ?? t("common.noData")}
                </td>
              </tr>
            )}
            {!loading && rows.map((row, rowIndex) => {
              const keyValue = getRowValue(row, String(rowKey));
              const stableKey = (typeof keyValue === "string" || typeof keyValue === "number")
                ? keyValue
                : rowIndex;

              return (
                <tr key={stableKey as Key} className="border-b border-[#f0e8e8] last:border-b-0">
                  {columns.map((column) => {
                    const value = getRowValue(row, column.key);
                    return (
                      <td
                        key={column.key}
                        className={`px-5 py-4 ${getAlignmentClass(column.align)} ${column.cellClassName ?? "text-gray-600"}`}
                      >
                        {column.render
                          ? column.render(row)
                          : typeof value === "string"
                            ? translateLegacyText(value, t)
                            : (value as ReactNode)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          {...pagination}
          shownCount={pagination.shownCount ?? Math.min(10, pagination.totalCount ?? rows.length)}
        />
      )}
    </div>
  );
}
