'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/store';
import { changeQuantity, fetchCart, removeItem, clearCart } from '@/store/cartSlice';
import { checkout, listDeliveries } from '@/lib/services/cart';
import { errorMessage } from '@/lib/api';
import { CartItem, CheckoutDelivery, Delivery } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { useMemberGuard, useRequireSignIn } from '@/lib/useMemberGuard';
import { openLoginModal } from '@/store/loginSlice';
import Notice from '@/components/notice';

const inputCss = 'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500';
const labelCss = 'block text-sm font-medium text-gray-900';

const emptyDelivery: CheckoutDelivery = { deliveryId: 0, storeName: '', receiverName: '', receiverPhone: '' };

function clampQuantity(value: number, stock: number): number {
  if (!Number.isInteger(value) || value < 1) return 1;
  return Math.min(value, Math.max(stock, 1));
}

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { member, handleUnauthorized } = useMemberGuard();
  const status = useRequireSignIn('Please sign in to view your cart.');
  const cart = useAppSelector((state) => state.cart);
  const [error, setError] = useState('');
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [delivery, setDelivery] = useState<CheckoutDelivery>(emptyDelivery);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!member) return;
    listDeliveries()
      .then((list) => {
        setDeliveries(list);
        if (list.length > 0) setDelivery((prev) => ({ ...prev, deliveryId: prev.deliveryId || list[0].id }));
      })
      .catch((err) => setError(errorMessage(err)));
  }, [member]);

  const run = async (action: () => Promise<unknown>) => {
    setError('');
    try {
      await action();
    } catch (err) {
      if (!handleUnauthorized(err)) setError(errorMessage(err));
    }
  };

  const updateQuantity = (item: CartItem, value: number) => {
    const num = clampQuantity(value, item.stock);
    if (num === item.num) return;
    void run(() => dispatch(changeQuantity({ productId: item.productId, num })).unwrap());
  };

  const remove = (item: CartItem) => run(() => dispatch(removeItem(item.productId)).unwrap());

  const updateDelivery = (field: keyof CheckoutDelivery) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDelivery({ ...delivery, [field]: field === 'deliveryId' ? Number(e.target.value) : e.target.value });

  const submitCheckout = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await run(async () => {
      const result = await checkout(delivery);
      dispatch(clearCart());
      router.push(`/orders/${result.orderId}?placed=1`);
    });
    setSubmitting(false);
  };

  if (status === 'unknown') return <p className="text-gray-500">Loading…</p>;

  if (!member) {
    return (
      <section>
        <h1 className="text-2xl font-bold text-gray-900">Cart</h1>
        <p className="mt-4 text-gray-600">
          Please{' '}
          <button type="button" className="text-blue-700 hover:underline" onClick={() => dispatch(openLoginModal())}>
            sign in
          </button>{' '}
          to see your cart.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Cart</h1>
        <button type="button" className="text-sm text-blue-700 hover:underline" onClick={() => dispatch(fetchCart())}>
          Refresh
        </button>
      </div>
      {error && (
        <div className="mt-4">
          <Notice kind="error">{error}</Notice>
        </div>
      )}

      {cart.items.length === 0 ? (
        <p className="mt-6 text-gray-600">
          Your cart is empty.{' '}
          <Link href="/" className="text-blue-700 hover:underline">
            Browse products
          </Link>
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <ul className="divide-y divide-gray-200 lg:col-span-2">
            {cart.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-4 py-4">
                <div className="flex-1">
                  <Link href={`/products/${item.productId}`} className="font-medium text-gray-900 hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {formatPrice(item.price)} each · {item.stock} in stock
                  </p>
                </div>
                <input
                  type="number"
                  min={1}
                  max={Math.max(item.stock, 1)}
                  defaultValue={item.num}
                  key={`${item.productId}-${item.num}`}
                  aria-label={`Quantity of ${item.name}`}
                  onBlur={(e) => updateQuantity(item, Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                  }}
                  className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
                <p className="w-24 text-right font-medium text-gray-900">{formatPrice(item.subTotal)}</p>
                <button type="button" onClick={() => remove(item)} className="text-gray-400 hover:text-red-600" aria-label={`Remove ${item.name}`}>
                  <TrashIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={submitCheckout} className="rounded-lg border border-gray-200 p-6 space-y-4 h-fit">
            <h2 className="text-lg font-semibold text-gray-900">Checkout</h2>
            <div>
              <label htmlFor="deliveryId" className={labelCss}>
                Delivery
              </label>
              <select id="deliveryId" className={inputCss} value={delivery.deliveryId} onChange={updateDelivery('deliveryId')} required>
                {deliveries.length === 0 && <option value={0}>No delivery option available</option>}
                {deliveries.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="storeName" className={labelCss}>
                Store
              </label>
              <input id="storeName" className={inputCss} value={delivery.storeName} onChange={updateDelivery('storeName')} required />
            </div>
            <div>
              <label htmlFor="receiverName" className={labelCss}>
                Receiver
              </label>
              <input id="receiverName" className={inputCss} value={delivery.receiverName} onChange={updateDelivery('receiverName')} required />
            </div>
            <div>
              <label htmlFor="receiverPhone" className={labelCss}>
                Phone
              </label>
              <input id="receiverPhone" type="tel" className={inputCss} value={delivery.receiverPhone} onChange={updateDelivery('receiverPhone')} required />
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-4 text-base font-medium text-gray-900">
              <span>Total</span>
              <span>{formatPrice(cart.total)}</span>
            </div>
            <button
              type="submit"
              disabled={submitting || deliveries.length === 0}
              className="w-full rounded-md bg-blue-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {submitting ? 'Placing order…' : 'Place order'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
