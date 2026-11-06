import { OrderStatus } from '@/lib/types';

function badgeCss(status: OrderStatus): string {
  const color: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-200 text-gray-700',
  };
  return `inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${color[status] ?? 'bg-gray-100 text-gray-700'}`;
}

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={badgeCss(status)}>{status}</span>;
}
