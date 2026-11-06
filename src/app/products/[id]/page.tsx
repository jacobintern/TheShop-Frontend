'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProduct } from '@/lib/services/product';
import { errorMessage } from '@/lib/api';
import { ProductDetail } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { useMemberGuard } from '@/lib/useMemberGuard';
import { useAppDispatch } from '@/store';
import { addItem } from '@/store/cartSlice';
import ProductImage from '@/components/product-image';
import Notice from '@/components/notice';

type NoticeState = { kind: 'error' | 'success'; text: string } | null;

function contentImages(product: ProductDetail) {
  return product.images.filter((img) => img.type === 1);
}

function clampQuantity(value: number, stock: number): number {
  if (!Number.isInteger(value) || value < 1) return 1;
  return Math.min(value, Math.max(stock, 1));
}

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const dispatch = useAppDispatch();
  const { requireMember, handleUnauthorized } = useMemberGuard();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loadError, setLoadError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!Number.isInteger(id) || id < 1) {
      setLoadError('Product not found.');
      return;
    }
    getProduct(id)
      .then(setProduct)
      .catch((err) => setLoadError(errorMessage(err)));
  }, [id]);

  if (loadError) return <Notice kind="error">{loadError}</Notice>;
  if (!product) return <p className="text-gray-500">Loading…</p>;

  const soldOut = product.stock <= 0;

  const addToCart = () =>
    requireMember(async () => {
      setAdding(true);
      setNotice(null);
      try {
        await dispatch(addItem({ productId: product.id, num: quantity })).unwrap();
        setNotice({ kind: 'success', text: `Added ${quantity} × ${product.name} to your cart.` });
      } catch (err) {
        if (!handleUnauthorized(err)) setNotice({ kind: 'error', text: errorMessage(err) });
      } finally {
        setAdding(false);
      }
    });

  return (
    <article className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <div>
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
          <ProductImage src={product.banner} alt={product.name} className="h-full w-full object-cover object-center" />
        </div>
        {contentImages(product).length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {contentImages(product).map((img) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-md bg-gray-100">
                <ProductImage src={img.url} alt={img.name} className="h-full w-full object-cover object-center" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Link href="/" className="text-sm text-blue-700 hover:underline">
          ← Back to products
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
        <p className="mt-3 text-2xl text-gray-900">{formatPrice(product.price)}</p>
        <p className="mt-1 text-sm text-gray-500">{soldOut ? 'Out of stock' : `${product.stock} in stock`}</p>
        {product.spec && <p className="mt-6 whitespace-pre-line text-gray-700">{product.spec}</p>}

        <div className="mt-8 flex items-end gap-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-900">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              max={Math.max(product.stock, 1)}
              value={quantity}
              disabled={soldOut}
              onChange={(e) => setQuantity(clampQuantity(Number(e.target.value), product.stock))}
              className="mt-1 w-24 rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={addToCart}
            disabled={soldOut || adding}
            className="rounded-md bg-blue-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {soldOut ? 'Sold out' : adding ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
        {notice && (
          <div className="mt-4">
            <Notice kind={notice.kind}>{notice.text}</Notice>
          </div>
        )}
      </div>
    </article>
  );
}
