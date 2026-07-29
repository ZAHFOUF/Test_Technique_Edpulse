import { Injectable } from '@nestjs/common';
import { CacheService } from '../../cache/cache.service';
import { products } from './data/products.data';
import { ProductQueryDto } from './dto/product-query.dto';
import { PaginatedProducts } from './interfaces/paginated-products.interface';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  private readonly defaultPage = 1;
  private readonly defaultLimit = 10;
  private readonly cacheKeyPrefix = 'products:findAll';

  constructor(private readonly cacheService: CacheService) {}

  findAll(query: ProductQueryDto): PaginatedProducts {
    const cacheKey = this.buildCacheKey(query);

    const cached = this.cacheService.get<PaginatedProducts>(cacheKey);
    if (cached) {
      return cached;
    }

    const page = query.page ?? this.defaultPage;
    const limit = query.limit ?? this.defaultLimit;

    const filtered = this.applyFilters(products, query);
    const total = filtered.length;
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    const offset = (page - 1) * limit;
    const data = filtered.slice(offset, offset + limit);

    const result: PaginatedProducts = {
      data,
      total,
      page,
      limit,
      totalPages,
    };

    this.cacheService.set(cacheKey, result);

    return result;
  }

  private buildCacheKey(query: ProductQueryDto): string {
    const normalized = {
      page: query.page ?? this.defaultPage,
      limit: query.limit ?? this.defaultLimit,
      category: query.category ?? null,
      stock_status: query.stock_status ?? null,
      name: query.name?.toLowerCase() ?? null,
    };
    return `${this.cacheKeyPrefix}:${JSON.stringify(normalized)}`;
  }

  private applyFilters(
    source: readonly Product[],
    query: ProductQueryDto,
  ): Product[] {
    const nameNeedle = query.name?.toLowerCase();

    return source.filter((product) => {
      if (query.category !== undefined && product.category !== query.category) {
        return false;
      }
      if (
        query.stock_status !== undefined &&
        product.stock_status !== query.stock_status
      ) {
        return false;
      }
      if (
        nameNeedle !== undefined &&
        !product.name.toLowerCase().includes(nameNeedle)
      ) {
        return false;
      }
      return true;
    });
  }
}
