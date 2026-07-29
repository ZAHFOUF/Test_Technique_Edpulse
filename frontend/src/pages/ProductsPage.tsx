import { useEffect, useState } from 'react';
import type { PaginatedProducts } from '@shared';
import { productService } from '../services/product.service';

function ProductsPage() {
  const [products, setProducts] = useState<PaginatedProducts | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await productService.getProducts();

        if (isMounted) {
          setProducts(data);
        }
      } catch {
        if (isMounted) {
          setError('Unable to load products. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-10">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
        <p className="mt-1 text-sm text-slate-500">
          Foundation setup — the product table arrives in the next phase.
        </p>
      </header>

      {isLoading && (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Loading products…
        </p>
      )}

      {!isLoading && error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {!isLoading && !error && products && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Successfully fetched {products.total} product(s) — page {products.page}{' '}
          of {products.totalPages}.
        </p>
      )}
    </main>
  );
}

export default ProductsPage;
