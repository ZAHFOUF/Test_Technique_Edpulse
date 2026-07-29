import type { Pagination } from './pagination.interface';
import type { Product } from './product.interface';

export interface PaginatedProducts extends Pagination {
  data: Product[];
}
