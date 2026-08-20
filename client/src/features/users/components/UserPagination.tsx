import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination } from "../users.types";

interface UserPaginationProps {
  paginationDetails: Pagination;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
}

export default function UserPagination({
  paginationDetails,
  setCurrentPage,
  currentPage,
}: UserPaginationProps): React.JSX.Element {
  const { totalPages } = paginationDetails;
  const pages: Array<number> = [];

  let startPage;
  let endPage;

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

  return (
    <div className="p-4 sm:px-5 sm:py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm bg-muted/10 rounded-b-2xl">
      <div className="text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {paginationDetails.page * paginationDetails.limit - paginationDetails.limit + 1}
        </span>{" "}
        to{" "}
        <span className="font-medium text-foreground">
          {paginationDetails.page * paginationDetails.limit}
        </span>{" "}
        of <span className="font-medium text-foreground">{paginationDetails.total}</span> users
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentPage(1);
          }}
          hidden={startPage === 1}
          className={
            1 === currentPage
              ? "w-8 h-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground font-medium shadow-sm shadow-primary/20"
              : "w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
          }
        >
          1
        </button>
        <span hidden={startPage <= 2} className="text-xl">
          . . .
        </span>
        {pages &&
          pages.map((page) => (
            <button
              type="button"
              onClick={() => {
                setCurrentPage(page);
              }}
              className={
                page === currentPage
                  ? "w-8 h-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground font-medium shadow-sm shadow-primary/20"
                  : "w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
              }
            >
              {page}
            </button>
          ))}
        <span hidden={endPage > totalPages - 2} className="text-xl">
          . . .
        </span>
        <button
          type="button"
          onClick={() => {
            setCurrentPage(totalPages);
          }}
          hidden={endPage === totalPages}
          className={
            totalPages === currentPage
              ? "w-8 h-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground font-medium shadow-sm shadow-primary/20"
              : "w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
          }
        >
          {totalPages}
        </button>

        <button
          type="button"
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-50"
          disabled={currentPage >= paginationDetails.totalPages}
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
