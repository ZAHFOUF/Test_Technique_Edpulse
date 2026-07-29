import { Injectable } from '@nestjs/common';
import { PaginatedProducts, Product } from '@shared';
import { CacheService } from '../../cache/cache.service';
import { products } from './data/products.data';
import { ProductQueryDto } from './dto/product-query.dto';

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
      stockStatus: query.stockStatus ?? null,
      search: query.search?.toLowerCase() ?? null,
    };
    return `${this.cacheKeyPrefix}:${JSON.stringify(normalized)}`;
  }

  private applyFilters(
    source: readonly Product[],
    query: ProductQueryDto,
  ): Product[] {
    const searchNeedle = query.search?.toLowerCase();

    return source.filter((product) => {
      if (query.category !== undefined && product.category !== query.category) {
        return false;
      }
      if (
        query.stockStatus !== undefined &&
        product.stockStatus !== query.stockStatus
      ) {
        return false;
      }
      if (
        searchNeedle !== undefined &&
        !product.name.toLowerCase().includes(searchNeedle)
      ) {
        return false;
      }
      return true;
    });
  }
}
