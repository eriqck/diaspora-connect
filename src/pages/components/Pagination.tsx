import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

type PaginationItem = number | "left-ellipsis" | "right-ellipsis";

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): PaginationItem[] => {
  const visiblePageSlots = 7;

  if (totalPages <= visiblePageSlots) return range(1, totalPages);

  const showLeftEllipsis = currentPage > 4;
  const showRightEllipsis = currentPage < totalPages - 3;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, 5), "right-ellipsis", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, "left-ellipsis", ...range(totalPages - 4, totalPages)];
  }

  return [
    1,
    "left-ellipsis",
    ...range(currentPage - 1, currentPage + 1),
    "right-ellipsis",
    totalPages,
  ];
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const safeTotalPages = Math.max(1, Math.floor(totalPages));
  const safeCurrentPage = Math.min(
    Math.max(1, Math.floor(currentPage)),
    safeTotalPages,
  );
  const items = getPaginationItems(safeCurrentPage, safeTotalPages);

  const selectPage = (page: number) => {
    if (page !== safeCurrentPage && page >= 1 && page <= safeTotalPages) {
      onPageChange(page);
    }
  };

  const pageButtonClass =
    "grid h-10 min-w-10 place-items-center rounded-(--radius-small) border px-2 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/30 focus-visible:ring-offset-2";

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`}
    >
      <button
        type="button"
        onClick={() => selectPage(safeCurrentPage - 1)}
        disabled={safeCurrentPage === 1}
        className={`${pageButtonClass} gap-1 sm:flex sm:px-3 disabled:cursor-not-allowed disabled:border-(--color-border) disabled:text-(--color-muted) disabled:opacity-50 enabled:border-(--color-border) enabled:hover:border-(--color-primary) enabled:hover:text-(--color-primary)`}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {items.map((item) => {
        if (typeof item !== "number") {
          return (
            <span
              key={item}
              className="grid h-10 min-w-7 place-items-center text-(--color-muted)"
              aria-hidden="true"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          );
        }

        const isCurrentPage = item === safeCurrentPage;

        return (
          <button
            key={item}
            type="button"
            onClick={() => selectPage(item)}
            className={`${pageButtonClass} ${
              isCurrentPage
                ? "border-(--color-primary) bg-(--color-primary) text-white"
                : "border-(--color-border) bg-white text-(--color-ink) hover:border-(--color-primary) hover:text-(--color-primary)"
            }`}
            aria-label={isCurrentPage ? `Page ${item}, current page` : `Go to page ${item}`}
            aria-current={isCurrentPage ? "page" : undefined}
            disabled={isCurrentPage}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => selectPage(safeCurrentPage + 1)}
        disabled={safeCurrentPage === safeTotalPages}
        className={`${pageButtonClass} gap-1 sm:flex sm:px-3 disabled:cursor-not-allowed disabled:border-(--color-border) disabled:text-(--color-muted) disabled:opacity-50 enabled:border-(--color-border) enabled:hover:border-(--color-primary) enabled:hover:text-(--color-primary)`}
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
