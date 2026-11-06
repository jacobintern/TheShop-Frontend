import { request } from '@/lib/api';
import { Cart, CheckoutDelivery, Delivery } from '@/lib/types';

export async function getCart(): Promise<Cart> {
  const cart = await request<Cart>({ method: 'GET', url: '/api/cart' });
  return { items: cart?.items ?? [], total: cart?.total ?? 0 };
}

export function addToCart(productId: number, num: number): Promise<null> {
  return request<null>({ method: 'POST', url: '/api/cart/add', data: { productId, num } });
}

export function setCartQuantity(productId: number, num: number): Promise<null> {
  return request<null>({ method: 'PUT', url: '/api/cart/patch', data: { productId, num } });
}

export function removeFromCart(productId: number): Promise<null> {
  return request<null>({ method: 'DELETE', url: `/api/cart/${productId}` });
}

export function checkout(delivery: CheckoutDelivery): Promise<{ orderId: number }> {
  return request<{ orderId: number }>({ method: 'POST', url: '/api/cart/checkout', data: { delivery } });
}

export async function listDeliveries(): Promise<Delivery[]> {
  const list = await request<Delivery[]>({ method: 'GET', url: '/api/delivery/list' });
  return list ?? [];
}
