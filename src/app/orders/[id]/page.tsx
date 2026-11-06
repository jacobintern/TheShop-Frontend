'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { cancelOrder, canCancel, getOrder } from '@/lib/services/order';
import { errorMessage } from '@/lib/api';
import { Order } from '@/lib/types';
import { formatDateTime, formatPrice } from '@/lib/format';
import { useMemberGuard, useRequireSignIn } from '@/lib/useMemberGuard';
import { useAppDispatch } from '@/store';
import { openLoginModal } from '@/store/loginSlice';
import OrderStatusBadge from '@/components/order-status-badge';
import OrderItems from '@/components/order-items';
import Notice from '@/components/notice';

export default function OrderPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading order…</p>}>
      <OrderDetail />
    </Suspense>
  );
}

function OrderDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const justPlaced = useSearchParams().get('placed') === '1';
  const dispatch = useAppDispatch();
  const status = useRequireSignIn('Please sign in to view this order.');
  const { member, handleUnauthorized } = useMemberGuard();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!member) return;
    if (!Number.isInteger(id) || id < 1) {
      setError('Order not found.');
      return;
    }
    let cancelled = false;
    getOrder(id)
      .then((result) => {
        if (!cancelled) setOrder(result);
      })
      .catch((err) => {
        if (!cancelled && !handleUnauthorized(err)) setError(errorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, [member, id, handleUnauthorized]);

  const cancel = async () => {
    if (!order) return;
    setCancelling(true);
    setError('');
    try {
      await cancelOrder(order.id);
      setOrder(await getOrder(order.id));
    } catch (err) {
      if (!handleUnauthorized(err)) setError(errorMessage(err));
    } finally {
      setCancelling(false);
    }
  };

  if (status === 'unknown') return <p className="text-gray-500">Loading…</p>;

  if (!member) {
    return (
      <p className="text-gray-600">
        Please{' '}
        <button type="button" className="text-blue-700 hover:underline" onClick={() => dispatch(openLoginModal())}>
          sign in
        </button>{' '}
        to see this order.
      </p>
    );
  }

  return (
    <section className="max-w-3xl">
      <Link href="/orders" className="text-sm text-blue-700 hover:underline">
        ← All orders
      </Link>
      {justPlaced && (
        <div className="mt-4">
          <Notice kind="success">Your order has been placed.</Notice>
        </div>
      )}
      {error && (
        <div className="mt-4">
          <Notice kind="error">{error}</Notice>
        </div>
      )}
      {order && (
        <>
          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-gray-500">Placed {formatDateTime(order.createTime)}</p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900">Items</h2>
          <OrderItems items={order.items} />
          <div className="mt-2 flex justify-between border-t border-gray-200 pt-3 font-medium text-gray-900">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>

          <h2 className="mt-8 text-lg font-semibold text-gray-900">Delivery</h2>
          <dl className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-500">Store</dt>
              <dd className="text-gray-900">{order.delivery.storeName}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Receiver</dt>
              <dd className="text-gray-900">{order.delivery.receiverName}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Phone</dt>
              <dd className="text-gray-900">{order.delivery.receiverPhone}</dd>
            </div>
          </dl>

          {canCancel(order) && (
            <button
              type="button"
              onClick={cancel}
              disabled={cancelling}
              className="mt-8 rounded-md border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {cancelling ? 'Cancelling…' : 'Cancel order'}
            </button>
          )}
        </>
      )}
    </section>
  );
}
