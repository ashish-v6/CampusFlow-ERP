import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination } from "../users.types";

interface UserPaginationProps {
  paginationDetails: Pagination;
}

export default function UserPagination({
  paginationDetails,
}: UserPaginationProps): React.JSX.Element {
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
          disabled
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground font-medium shadow-sm shadow-primary/20"
        >
          1
        </button>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
        >
          2
        </button>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
        >
          3
        </button>
        <span className="px-1 text-muted-foreground">...</span>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
        >
          31
        </button>
        <button
          type="button"
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
