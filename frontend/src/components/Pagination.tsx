import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

type PageItem = number | 'left-ellipsis' | 'right-ellipsis';

const MAX_VISIBLE_PAGES = 7;

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) {
    items.push('left-ellipsis');
  }

  for (let page = left; page <= right; page += 1) {
    items.push(page);
  }

  if (right < totalPages - 1) {
    items.push('right-ellipsis');
  }

  items.push(totalPages);

  return items;
}

const baseButtonClass =
  'inline-flex items-center justify-center gap-1 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50';
const inactiveButtonClass =
  'border-slate-200 bg-white text-slate-700 hover:bg-slate-100';
const activeButtonClass = 'border-slate-900 bg-slate-900 text-white';

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const goToPage = (page: number) => {
    if (isLoading) {
      return;
    }
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    onPageChange(page);
  };

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;
  const pageItems = getPageItems(currentPage, totalPages);

  return (
    <nav
      className="flex items-center justify-between gap-3"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={isFirstPage || isLoading}
        className={`${baseButtonClass} ${inactiveButtonClass}`}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <span className="text-sm text-slate-600 sm:hidden">
        Page {currentPage} of {totalPages}
      </span>

      <div className="hidden items-center gap-2 sm:flex">
        {pageItems.map((item) => {
          if (item === 'left-ellipsis' || item === 'right-ellipsis') {
            return (
              <span key={item} className="px-2 text-slate-400" aria-hidden="true">
                …
              </span>
            );
          }

          const isActive = item === currentPage;

          return (
            <button
              key={item}
              type="button"
              onClick={() => goToPage(item)}
              disabled={isLoading}
              aria-current={isActive ? 'page' : undefined}
              className={`${baseButtonClass} ${
                isActive ? activeButtonClass : inactiveButtonClass
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={isLastPage || isLoading}
        className={`${baseButtonClass} ${inactiveButtonClass}`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}

export default Pagination;
