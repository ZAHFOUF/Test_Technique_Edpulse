import { useRef, useState } from 'react';
import type { ProductFilters as ProductFiltersType } from '@shared';
import { StockStatus } from '@shared';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductFilters from '../components/ProductFilters';
import ProductTable from '../components/ProductTable';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const INITIAL_FILTERS: ProductFiltersType = { page: 1 };

function ProductsPage() {
  const [filters, setFilters] = useState<ProductFiltersType>(INITIAL_FILTERS);
  const categories = useCategories();
  const { products, isLoading, error } = useProducts(filters);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = (category?: string) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }));
  };

  const handleStockStatusChange = (stockStatus?: StockStatus) => {
    setFilters((prev) => ({ ...prev, stockStatus, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    if (isLoading) {
      return;
    }
    setFilters((prev) => ({ ...prev, page }));
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-10">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
        <p className="mt-1 text-sm text-slate-500">Browse the product catalog.</p>
      </header>

      <ProductFilters
        filters={filters}
        categories={categories}
        onCategoryChange={handleCategoryChange}
        onStockStatusChange={handleStockStatusChange}
      />

      <div ref={resultsRef} className="flex scroll-mt-6 flex-col gap-6">
        {isLoading && <LoadingSpinner />}

        {!isLoading && error && <ErrorAlert message={error} />}

        {!isLoading && !error && products && (
          <>
            <ProductTable products={products.data} />
            <Pagination
              currentPage={products.page}
              totalPages={products.totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </main>
  );
}

export default ProductsPage;
