import { StockStatus } from '../enums/stock-status.enum';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock_status: StockStatus;
}
