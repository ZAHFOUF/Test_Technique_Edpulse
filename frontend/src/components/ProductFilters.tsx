import type { ChangeEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, CheckCircle2, LayoutGrid, XCircle } from 'lucide-react';
import type { ProductFilters as ProductFiltersType } from '@shared';
import { StockStatus } from '@shared';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  categories: string[];
  onCategoryChange: (category?: string) => void;
  onStockStatusChange: (stockStatus?: StockStatus) => void;
}

interface StockStatusOption {
  value?: StockStatus;
  label: string;
  icon: LucideIcon;
}

const STOCK_STATUS_OPTIONS: StockStatusOption[] = [
  { value: undefined, label: 'All', icon: LayoutGrid },
  { value: StockStatus.IN_STOCK, label: 'In Stock', icon: CheckCircle2 },
  { value: StockStatus.LOW_STOCK, label: 'Low Stock', icon: AlertTriangle },
  { value: StockStatus.OUT_OF_STOCK, label: 'Out of Stock', icon: XCircle },
];

const ALL_CATEGORIES_VALUE = '';

function ProductFilters({
  filters,
  categories,
  onCategoryChange,
  onStockStatusChange,
}: ProductFiltersProps) {
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onCategoryChange(value === ALL_CATEGORIES_VALUE ? undefined : value);
  };

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="category-filter"
          className="text-xs font-medium text-slate-500"
        >
          Category
        </label>
        <select
          id="category-filter"
          value={filters.category ?? ALL_CATEGORIES_VALUE}
          onChange={handleCategoryChange}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:min-w-56"
        >
          <option value={ALL_CATEGORIES_VALUE}>All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter by stock status"
      >
        {STOCK_STATUS_OPTIONS.map((option) => {
          const isActive = filters.stockStatus === option.value;
          const Icon = option.icon;

          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => onStockStatusChange(option.value)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ProductFilters;
