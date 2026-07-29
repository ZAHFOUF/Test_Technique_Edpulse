import { Controller, Get, Query } from '@nestjs/common';
import { ProductQueryDto } from './dto/product-query.dto';
import type { PaginatedProducts } from './interfaces/paginated-products.interface';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: ProductQueryDto): PaginatedProducts {
    return this.productsService.findAll(query);
  }
}
