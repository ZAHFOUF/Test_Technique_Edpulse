import type { PaginatedProducts, ProductFilters } from '@shared';
import { apiClient } from '../lib/axios';

const PRODUCTS_ENDPOINT = '/products';

export const productService = {
  async getProducts(filters?: ProductFilters): Promise<PaginatedProducts> {
    const response = await apiClient.get<PaginatedProducts>(PRODUCTS_ENDPOINT, {
      params: filters,
    });

    return response.data;
  },
};
