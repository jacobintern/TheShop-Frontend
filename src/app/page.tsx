'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { listProducts } from '@/lib/services/product';
import { errorMessage, isLastPage } from '@/lib/api';
import { Paged, ProductSummary } from '@/lib/types';
import ProductCard from '@/components/product-card';
import Pagination from '@/components/pagination';
import Notice from '@/components/notice';

function readPage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

// useSearchParams 在 next build 預渲染時需要 Suspense 邊界
export default function Home() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading products…</p>}>
      <ProductList />
    </Suspense>
  );
}

function ProductList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = readPage(searchParams.get('page'));
  const [paged, setPaged] = useState<Paged<ProductSummary> | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setError('');
    listProducts(page)
      .then((result) => {
        if (!cancelled) setPaged(result);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const changePage = (next: number) => router.push(next === 1 ? '/' : `/?page=${next}`);

  return (
    <section>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products</h1>
      {error && (
        <div className="mt-4">
          <Notice kind="error">{error}</Notice>
        </div>
      )}
      {paged && paged.list.length === 0 && <p className="mt-6 text-gray-500">No products on this page.</p>}
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {paged?.list.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      {paged && <Pagination page={page} isLast={isLastPage(paged)} onChange={changePage} />}
    </section>
  );
}
