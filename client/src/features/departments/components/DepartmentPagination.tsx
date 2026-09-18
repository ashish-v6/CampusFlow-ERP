import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DepartmentPaginationMeta } from "../types/department.types";

interface DepartmentPaginationProps {
  paginationDetails: DepartmentPaginationMeta;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

/**
 * Pagination component for Department directory.
 * Preserves exact layout, styling, and windowed pagination math from FacultyPagination and StudentPagination.
 */
export default function DepartmentPagination({
  paginationDetails,
  currentPage,
  setCurrentPage,
}: DepartmentPaginationProps): React.JSX.Element {
  const { totalPages, total, limit, currentPage: page } = paginationDetails;
  const pages: number[] = [];

  let startPage: number;
  let endPage: number;

  if (totalPages <= 5) {
    startPage = 1;
    endPage = totalPages;
  } else {
    startPage = currentPage - 2;
    endPage = currentPage + 2;

    if (startPage < 1) {
      startPage = 1;
      endPage = 5;
    }
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = endPage - 4;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const startRecord = total === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  return (
    <div className="p-4 sm:px-5 sm:py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm bg-muted/10 rounded-b-2xl">
      {/* Records Count Info */}
      <div className="text-muted-foreground text-xs sm:text-sm">
        Showing <span className="font-medium text-foreground">{startRecord}</span> to{" "}
        <span className="font-medium text-foreground">{endRecord}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span> departments
      </div>

      {/* Pagination Page Selectors */}
      <div className="flex items-center gap-1">
        {/* Previous Page Button */}
        <button
          type="button"
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* First Page Link if not in window */}
        {startPage > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              1
            </button>
            {startPage > 2 && <span className="px-1 text-muted-foreground">...</span>}
          </>
        )}

        {/* Dynamic Pages */}
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setCurrentPage(p)}
            className={
              p === currentPage
                ? "w-8 h-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground font-medium shadow-sm shadow-primary/20 cursor-pointer"
                : "w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
            }
          >
            {p}
          </button>
        ))}

        {/* Last Page Link if not in window */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1 text-muted-foreground">...</span>}
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Page Button */}
        <button
          type="button"
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
