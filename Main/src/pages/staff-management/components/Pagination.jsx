import React from "react";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const pageSizeOptions = [
    { value: "10", label: "10 per page" },
    { value: "25", label: "25 per page" },
    { value: "50", label: "50 per page" },
    { value: "100", label: "100 per page" },
  ];

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-sm md:mt-6 md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            Showing {startItem} to {endItem} of {totalItems} staff members
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Page {currentPage} of {Math.max(totalPages, 1)}
          </p>
        </div>

        <div className="w-full lg:w-44">
          <Select
            label="Rows"
            options={pageSizeOptions}
            value={itemsPerPage?.toString()}
            onChange={(value) => onItemsPerPageChange(parseInt(value, 10))}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronsLeft"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || totalItems === 0}
            aria-label="First page"
          />
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || totalItems === 0}
            aria-label="Previous page"
          />

          <div className="hidden items-center gap-1 md:flex">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={`${page}-${index}`}>
                {page === "..." ? (
                  <span className="px-3 py-1 text-muted-foreground">...</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onPageChange(page)}
                    className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalItems === 0}
            aria-label="Next page"
          />
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronsRight"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || totalItems === 0}
            aria-label="Last page"
          />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
