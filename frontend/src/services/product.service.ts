import type { PaginatedProducts, ProductFilters } from '@shared';
import { apiClient } from '../lib/axios';

const PRODUCTS_ENDPOINT = '/products';
const CATEGORY_FETCH_LIMIT = 1000;

export const productService = {
  async getProducts(filters?: ProductFilters): Promise<PaginatedProducts> {
    const response = await apiClient.get<PaginatedProducts>(PRODUCTS_ENDPOINT, {
      params: filters,
    });

    return response.data;
  },

  async getCategories(): Promise<string[]> {
    const { data } = await this.getProducts({ limit: CATEGORY_FETCH_LIMIT });
    const uniqueCategories = Array.from(
      new Set(data.map((product) => product.category)),
    );

    return uniqueCategories.sort((a, b) => a.localeCompare(b));
  },
};
