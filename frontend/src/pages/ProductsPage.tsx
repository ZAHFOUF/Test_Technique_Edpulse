import { useState } from 'react';
import type { ProductFilters as ProductFiltersType } from '@shared';
import { StockStatus } from '@shared';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductFilters from '../components/ProductFilters';
import ProductTable from '../components/ProductTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function ProductsPage() {
  const [filters, setFilters] = useState<ProductFiltersType>({});
  const categories = useCategories();
  const { products, isLoading, error } = useProducts(filters);

  const handleCategoryChange = (category?: string) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const handleStockStatusChange = (stockStatus?: StockStatus) => {
    setFilters((prev) => ({ ...prev, stockStatus }));
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

      {isLoading && <LoadingSpinner />}

      {!isLoading && error && <ErrorAlert message={error} />}

      {!isLoading && !error && products && (
        <ProductTable products={products.data} />
      )}
    </main>
  );
}

export default ProductsPage;
