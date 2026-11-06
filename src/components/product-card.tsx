import Link from 'next/link';
import { ProductSummary } from '@/lib/types';
import ProductImage from '@/components/product-image';
import { formatPrice } from '@/lib/format';

function stockCss(stock: number): string {
  return stock > 0 ? 'mt-1 text-sm text-gray-500' : 'mt-1 text-sm text-red-600';
}

function stockText(stock: number): string {
  return stock > 0 ? `${stock} in stock` : 'Out of stock';
}

export default function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link href={`/products/${product.id}`} className="group relative block">
      <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
        <ProductImage src={product.banner} alt={product.name} className="h-full w-full object-cover object-center" />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className={stockCss(product.stock)}>{stockText(product.stock)}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
