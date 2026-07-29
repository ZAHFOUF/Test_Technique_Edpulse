import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { PaginatedProducts } from '@shared';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
}

describe('Products (e2e)', () => {
  let app: INestApplication<App>;
  let httpServer: App;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
    httpServer = app.getHttpServer() as App;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /products - retrieval', () => {
    it('returns 200 with a paginated envelope', async () => {
      const res = await request(httpServer).get('/products').expect(200);
      const body = res.body as PaginatedProducts;

      expect(body).toMatchObject({
        page: 1,
        limit: 10,
      });
      expect(Array.isArray(body.data)).toBe(true);
    });

    it('exposes data, total, page, limit, totalPages fields', async () => {
      const res = await request(httpServer).get('/products').expect(200);
      const body = res.body as PaginatedProducts;

      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('page');
      expect(body).toHaveProperty('limit');
      expect(body).toHaveProperty('totalPages');
    });

    it('each product item has the expected shape', async () => {
      const res = await request(httpServer).get('/products').expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.data.length).toBeGreaterThan(0);
      for (const product of body.data) {
        expect(product).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            category: expect.any(String),
            price: expect.any(Number),
            stockStatus: expect.stringMatching(
              /^(in_stock|low_stock|out_of_stock)$/,
            ),
          }),
        );
      }
    });

    it('total equals 20 when no filter is applied', async () => {
      const res = await request(httpServer).get('/products').expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.total).toBe(20);
      expect(body.totalPages).toBe(2);
    });
  });

  describe('pagination', () => {
    it('defaults to page=1 limit=10', async () => {
      const res = await request(httpServer).get('/products').expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.page).toBe(1);
      expect(body.limit).toBe(10);
      expect(body.data).toHaveLength(10);
    });

    it('?page=1 returns the first page', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ page: 1 })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.page).toBe(1);
      expect(body.data).toHaveLength(10);
      expect(body.data[0].id).toBe(1);
    });

    it('?limit=5 returns 5 items on page 1', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ limit: 5 })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.limit).toBe(5);
      expect(body.data).toHaveLength(5);
      expect(body.totalPages).toBe(4);
    });

    it('?page=2&limit=5 returns items 6 to 10', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ page: 2, limit: 5 })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.page).toBe(2);
      expect(body.limit).toBe(5);
      expect(body.data.map((p) => p.id)).toEqual([6, 7, 8, 9, 10]);
    });

    it('out-of-range page returns empty data with correct metadata', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ page: 999, limit: 10 })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.data).toEqual([]);
      expect(body.total).toBe(20);
      expect(body.totalPages).toBe(2);
      expect(body.page).toBe(999);
    });
  });

  describe('category filtering', () => {
    it('?category=Electronics returns only Electronics products', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ category: 'Electronics' })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.total).toBe(5);
      expect(body.data.every((p) => p.category === 'Electronics')).toBe(true);
    });

    it('?category=Books returns a single result', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ category: 'Books' })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.total).toBe(1);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].category).toBe('Books');
    });

    it('?category=DoesNotExist returns an empty page', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ category: 'DoesNotExist' })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.data).toEqual([]);
      expect(body.total).toBe(0);
      expect(body.totalPages).toBe(0);
    });
  });

  describe('stockStatus filtering', () => {
    it('?stockStatus=in_stock returns only in-stock items', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ stockStatus: 'in_stock', limit: 50 })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.total).toBe(12);
      expect(body.data.every((p) => p.stockStatus === 'in_stock')).toBe(true);
    });

    it('?stockStatus=low_stock returns 4 items', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ stockStatus: 'low_stock', limit: 50 })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.total).toBe(4);
      expect(body.data.every((p) => p.stockStatus === 'low_stock')).toBe(true);
    });

    it('?stockStatus=out_of_stock returns 4 items', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ stockStatus: 'out_of_stock', limit: 50 })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.total).toBe(4);
      expect(body.data.every((p) => p.stockStatus === 'out_of_stock')).toBe(
        true,
      );
    });
  });

  describe('search filtering (partial, case-insensitive)', () => {
    it('?search=phone matches Headphones with a lowercase input', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ search: 'phone' })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.total).toBe(1);
      expect(body.data[0].name.toLowerCase()).toContain('phone');
    });

    it('?search=PHONE returns the same result (case-insensitive)', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ search: 'PHONE' })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.total).toBe(1);
      expect(body.data[0].name.toLowerCase()).toContain('phone');
    });

    it('?search=Pro matches Wilson Pro Staff', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ search: 'Pro' })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.total).toBeGreaterThanOrEqual(1);
      expect(
        body.data.every((p) => p.name.toLowerCase().includes('pro')),
      ).toBe(true);
    });

    it('?search=iphone returns zero results', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ search: 'iphone' })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.total).toBe(0);
      expect(body.data).toEqual([]);
    });
  });

  describe('combined filters', () => {
    it('?page=1&limit=5&category=Electronics&stockStatus=in_stock&search=phone returns only the Sony headphones', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({
          page: 1,
          limit: 5,
          category: 'Electronics',
          stockStatus: 'in_stock',
          search: 'phone',
        })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.page).toBe(1);
      expect(body.limit).toBe(5);
      expect(body.total).toBe(1);
      expect(body.data).toHaveLength(1);
      expect(body.data[0]).toMatchObject({
        category: 'Electronics',
        stockStatus: 'in_stock',
      });
      expect(body.data[0].name.toLowerCase()).toContain('phone');
    });

    it('?category=Sports&stockStatus=low_stock narrows down to Peloton', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ category: 'Sports', stockStatus: 'low_stock' })
        .expect(200);
      const body = res.body as PaginatedProducts;

      expect(body.total).toBe(1);
      expect(body.data[0].category).toBe('Sports');
      expect(body.data[0].stockStatus).toBe('low_stock');
    });
  });

  describe('validation errors (400)', () => {
    it('?page=-1 returns 400', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ page: -1 })
        .expect(400);
      const body = res.body as ErrorResponse;

      expect(body.statusCode).toBe(400);
    });

    it('?page=0 returns 400', async () => {
      await request(httpServer)
        .get('/products')
        .query({ page: 0 })
        .expect(400);
    });

    it('?page=abc returns 400', async () => {
      await request(httpServer)
        .get('/products')
        .query({ page: 'abc' })
        .expect(400);
    });

    it('?limit=0 returns 400', async () => {
      await request(httpServer)
        .get('/products')
        .query({ limit: 0 })
        .expect(400);
    });

    it('?stockStatus=invalid returns 400', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ stockStatus: 'invalid' })
        .expect(400);
      const body = res.body as ErrorResponse;

      const messages = Array.isArray(body.message)
        ? body.message.join(' ')
        : body.message;
      expect(messages).toContain('stockStatus');
    });

    it('?search=<151 chars> returns 400 (DTO MaxLength is 150)', async () => {
      const oversizedSearch = 'a'.repeat(151);
      await request(httpServer)
        .get('/products')
        .query({ search: oversizedSearch })
        .expect(400);
    });

    it('?foo=1 returns 400 (forbidNonWhitelisted)', async () => {
      await request(httpServer)
        .get('/products')
        .query({ foo: 1 })
        .expect(400);
    });

    it('error body matches the HttpExceptionFilter envelope', async () => {
      const res = await request(httpServer)
        .get('/products')
        .query({ page: -1 })
        .expect(400);
      const body = res.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 400,
          timestamp: expect.any(String),
          path: expect.stringContaining('/products'),
          message: expect.anything(),
        }),
      );
      expect(new Date(body.timestamp).toString()).not.toBe('Invalid Date');
    });
  });

  describe('cache verification', () => {
    it('two identical requests return the exact same body', async () => {
      const query = { category: 'Home & Garden', stockStatus: 'in_stock' };

      const first = await request(httpServer)
        .get('/products')
        .query(query)
        .expect(200);
      const second = await request(httpServer)
        .get('/products')
        .query(query)
        .expect(200);

      expect(second.body).toEqual(first.body);
    });

    it('cached response keeps the same envelope shape as a fresh response', async () => {
      const query = { category: 'Clothing', limit: 3 };

      const first = await request(httpServer)
        .get('/products')
        .query(query)
        .expect(200);
      const second = await request(httpServer)
        .get('/products')
        .query(query)
        .expect(200);

      for (const body of [first.body, second.body] as PaginatedProducts[]) {
        expect(body).toHaveProperty('data');
        expect(body).toHaveProperty('total');
        expect(body).toHaveProperty('page');
        expect(body).toHaveProperty('limit');
        expect(body).toHaveProperty('totalPages');
      }
      expect(second.body).toEqual(first.body);
    });
  });
});
