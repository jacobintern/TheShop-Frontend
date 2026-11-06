import { readPaged, request } from '@/lib/api';
import { Paged, ProductDetail, ProductSummary } from '@/lib/types';

export const PRODUCT_PAGE_SIZE = 12;

export async function listProducts(page: number, fetch = PRODUCT_PAGE_SIZE): Promise<Paged<ProductSummary>> {
  const raw = await request<unknown>({ method: 'GET', url: '/api/product/list', params: { page, fetch } });
  return readPaged<ProductSummary>(raw);
}

export async function getProduct(id: number): Promise<ProductDetail> {
  const detail = await request<ProductDetail>({ method: 'GET', url: `/api/product/${id}` });
  return { ...detail, images: detail.images ?? [] };
}

const nameCache = new Map<number, string>();

// 訂單明細只有 productId，名稱要另外補；同一個 session 內查過就不再打
export async function getProductName(id: number): Promise<string> {
  const cached = nameCache.get(id);
  if (cached) return cached;
  try {
    const detail = await getProduct(id);
    nameCache.set(id, detail.name);
    return detail.name;
  } catch {
    return `#${id}`;
  }
}
