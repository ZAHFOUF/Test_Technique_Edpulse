import { StockStatus } from '@shared';
import { STOCK_STATUS_LABELS } from '../lib/product-display';

const STATUS_STYLES: Record<StockStatus, string> = {
  [StockStatus.IN_STOCK]:
    'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  [StockStatus.LOW_STOCK]:
    'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  [StockStatus.OUT_OF_STOCK]:
    'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
};

interface StockStatusBadgeProps {
  status: StockStatus;
}

function StockStatusBadge({ status }: StockStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STOCK_STATUS_LABELS[status]}
    </span>
  );
}

export default StockStatusBadge;
