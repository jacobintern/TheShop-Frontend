'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { cancelOrder, canCancel, listOrders } from '@/lib/services/order';
import { errorMessage, isLastPage } from '@/lib/api';
import { Order, Paged } from '@/lib/types';
import { formatDateTime, formatPrice } from '@/lib/format';
import { useMemberGuard, useRequireSignIn } from '@/lib/useMemberGuard';
import { useAppDispatch } from '@/store';
import { openLoginModal } from '@/store/loginSlice';
import OrderStatusBadge from '@/components/order-status-badge';
import Pagination from '@/components/pagination';
import Notice from '@/components/notice';

function readPage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading orders…</p>}>
      <OrderList />
    </Suspense>
  );
}

function OrderList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = readPage(searchParams.get('page'));
  const dispatch = useAppDispatch();
  const status = useRequireSignIn('Please sign in to view your orders.');
  const { member, handleUnauthorized } = useMemberGuard();
  const [paged, setPaged] = useState<Paged<Order> | null>(null);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(0);

  const load = async () => {
    setError('');
    try {
      setPaged(await listOrders(page));
    } catch (err) {
      if (!handleUnauthorized(err)) setError(errorMessage(err));
    }
  };

  useEffect(() => {
    if (!member) return;
    let cancelled = false;
    listOrders(page)
      .then((result) => {
        if (!cancelled) setPaged(result);
      })
      .catch((err) => {
        if (!cancelled && !handleUnauthorized(err)) setError(errorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, [member, page, handleUnauthorized]);

  const cancel = async (order: Order) => {
    setCancelling(order.id);
    setError('');
    try {
      await cancelOrder(order.id);
      await load();
    } catch (err) {
      if (!handleUnauthorized(err)) setError(errorMessage(err));
    } finally {
      setCancelling(0);
    }
  };

  const changePage = (next: number) => router.push(next === 1 ? '/orders' : `/orders?page=${next}`);

  if (status === 'unknown') return <p className="text-gray-500">Loading…</p>;

  if (!member) {
    return (
      <section>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-4 text-gray-600">
          Please{' '}
          <button type="button" className="text-blue-700 hover:underline" onClick={() => dispatch(openLoginModal())}>
            sign in
          </button>{' '}
          to see your orders.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      {error && (
        <div className="mt-4">
          <Notice kind="error">{error}</Notice>
        </div>
      )}
      {paged && paged.list.length === 0 && <p className="mt-6 text-gray-600">No orders yet.</p>}
      {paged && paged.list.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2 pr-4 font-medium">Order</th>
                <th className="py-2 pr-4 font-medium">Date</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Items</th>
                <th className="py-2 pr-4 font-medium text-right">Total</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paged.list.map((order) => (
                <tr key={order.id}>
                  <td className="py-3 pr-4">
                    <Link href={`/orders/${order.id}`} className="text-blue-700 hover:underline">
                      #{order.id}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-gray-700">{formatDateTime(order.createTime)}</td>
                  <td className="py-3 pr-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-3 pr-4 text-gray-700">{order.items.reduce((sum, item) => sum + item.num, 0)}</td>
                  <td className="py-3 pr-4 text-right font-medium text-gray-900">{formatPrice(order.total)}</td>
                  <td className="py-3 text-right">
                    {canCancel(order) && (
                      <button
                        type="button"
                        disabled={cancelling === order.id}
                        onClick={() => cancel(order)}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        {cancelling === order.id ? 'Cancelling…' : 'Cancel'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {paged && <Pagination page={page} isLast={isLastPage(paged)} onChange={changePage} />}
    </section>
  );
}
