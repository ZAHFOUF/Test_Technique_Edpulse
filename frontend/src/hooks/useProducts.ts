import { useEffect, useState } from 'react';
import type { PaginatedProducts, ProductFilters } from '@shared';
import { productService } from '../services/product.service';

interface UseProductsResult {
  products: PaginatedProducts | null;
  isLoading: boolean;
  error: string | null;
}

export function useProducts(filters: ProductFilters): UseProductsResult {
  const [products, setProducts] = useState<PaginatedProducts | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { category, stockStatus, search, page, limit } = filters;

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await productService.getProducts({
          category,
          stockStatus,
          search,
          page,
          limit,
        });

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
  }, [category, stockStatus, search, page, limit]);

  return { products, isLoading, error };
}
