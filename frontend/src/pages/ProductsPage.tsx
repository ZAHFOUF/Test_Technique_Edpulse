import { useEffect, useState } from 'react';
import type { PaginatedProducts } from '@shared';
import { productService } from '../services/product.service';
import ProductTable from '../components/ProductTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

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
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-10">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
        <p className="mt-1 text-sm text-slate-500">
          Browse the product catalog.
        </p>
      </header>

      {isLoading && <LoadingSpinner />}

      {!isLoading && error && <ErrorAlert message={error} />}

      {!isLoading && !error && products && (
        <ProductTable products={products.data} />
      )}
    </main>
  );
}

export default ProductsPage;
