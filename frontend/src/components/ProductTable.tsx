import type { Product } from '@shared';
import { STOCK_STATUS_LABELS, formatPrice } from '../lib/product-display';
import StockStatusBadge from './StockStatusBadge';

interface ProductTableProps {
  products: Product[];
}

const headerCellClass =
  'sticky top-0 z-10 bg-slate-50 px-4 py-3 font-semibold text-slate-600';

function ProductTable({ products }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-700">No products found.</p>
        <p className="mt-1 text-sm text-slate-500">
          There are no products to display right now.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead>
            <tr>
              <th scope="col" className={headerCellClass}>
                Product Name
              </th>
              <th scope="col" className={headerCellClass}>
                Category
              </th>
              <th scope="col" className={`${headerCellClass} text-right`}>
                Price
              </th>
              <th scope="col" className={headerCellClass}>
                Stock
              </th>
              <th scope="col" className={headerCellClass}>
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-slate-600">{product.category}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {STOCK_STATUS_LABELS[product.stockStatus]}
                </td>
                <td className="px-4 py-3">
                  <StockStatusBadge status={product.stockStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;
