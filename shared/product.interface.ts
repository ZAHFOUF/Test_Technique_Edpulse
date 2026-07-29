import type { StockStatus } from './stock-status.enum';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stockStatus: StockStatus;
}
