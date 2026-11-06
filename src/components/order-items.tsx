'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { OrderItem } from '@/lib/types';
import { getProductName } from '@/lib/services/product';
import { formatPrice } from '@/lib/format';

// 訂單明細只有 productId，名稱逐筆向 /api/product/:id 補
export default function OrderItems({ items }: { items: OrderItem[] }) {
  const [names, setNames] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancelled = false;
    Promise.all(items.map(async (item) => [item.productId, await getProductName(item.productId)] as const)).then((pairs) => {
      if (!cancelled) setNames(Object.fromEntries(pairs));
    });
    return () => {
      cancelled = true;
    };
  }, [items]);

  return (
    <ul className="divide-y divide-gray-200">
      {items.map((item) => (
        <li key={item.productId} className="flex items-center justify-between py-2 text-sm">
          <Link href={`/products/${item.productId}`} className="text-gray-900 hover:underline">
            {names[item.productId] ?? `#${item.productId}`}
          </Link>
          <span className="text-gray-500">× {item.num}</span>
          <span className="w-24 text-right font-medium text-gray-900">{formatPrice(item.subTotal)}</span>
        </li>
      ))}
    </ul>
  );
}
