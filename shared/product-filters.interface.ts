import type { StockStatus } from './stock-status.enum';

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  stockStatus?: StockStatus;
  search?: string;
}
