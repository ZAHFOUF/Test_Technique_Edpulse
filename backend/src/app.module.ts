import { Module } from '@nestjs/common';
import { ProductsModule } from './app/products/products.module';

@Module({
  imports: [ProductsModule],
})
export class AppModule {}
