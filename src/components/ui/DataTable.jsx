import Pagination from "./Pagination";

const ALIGN_CLASSES = {
  right: "text-right",
  center: "text-center",
  left: "text-left",
};

/**
 * Generic RTL data table used by every list page (users, orders, providers...).
 * Pass a `columns` config instead of writing a new <table> per page:
 *
 * columns = [
 *   { key: "name", label: "الاسم", render: (row) => <span>{row.name}</span> },
 *   { key: "phone", label: "الهاتف" }, // falls back to row[key] when no render fn
 *   { key: "status", label: "الحالة", align: "center", render: (row) => <Badge>{row.status}</Badge> },
 * ]
 *
 * `align` ("right" | "center" | "left", defaults to "right") is applied to
 * BOTH the header cell and its column's data cells, so a column's title
 * always sits directly above its own values instead of drifting apart.
 * `cellClassName` stays purely cosmetic (color/weight) - never alignment.
 */
export default function DataTable({
  title,
  columns,
  rows,
  rowKey = "id",
  minWidth = "820px",
  pagination,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#f2e8e8] bg-white shadow-sm">
      {title && <div className="px-6 py-5 text-right text-lg font-extrabold">{title}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm" style={{ minWidth }}>
          <thead className="bg-[#75262d] text-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-5 py-4 ${ALIGN_CLASSES[column.align ?? "right"]}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row[rowKey]} className="border-b border-[#f0e8e8] last:border-b-0">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-5 py-4 ${ALIGN_CLASSES[column.align ?? "right"]} ${
                      column.cellClassName ?? "text-gray-600"
                    }`}
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && <Pagination {...pagination} shownCount={pagination.shownCount ?? rows.length} />}
    </div>
  );
}
