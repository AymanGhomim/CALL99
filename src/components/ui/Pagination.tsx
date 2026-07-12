/**
 * Bottom-of-table pagination: page number pills + "showing X of Y" summary line.
 * Shared by every table across the app instead of duplicating the same markup per page.
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  shownCount = 0,
  itemLabel = "طلب",
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-5 text-xs text-gray-500">
      <div className="flex items-center gap-3">
        <button type="button">‹</button>
        {Array.from({ length: totalPages }, (_, index) => totalPages - index).map((page) => (
          <button
            key={page}
            type="button"
            className={page === currentPage ? "rounded bg-[#75262d] px-3 py-2 text-white" : ""}
          >
            {page}
          </button>
        ))}
        <button type="button">›</button>
      </div>
      <p>
        عرض 1 إلى {shownCount} من إجمالي {totalCount} {itemLabel}
      </p>
    </div>
  );
}
