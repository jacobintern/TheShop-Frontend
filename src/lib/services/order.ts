import { readPaged, request } from '@/lib/api';
import { Order, Paged } from '@/lib/types';

export const ORDER_PAGE_SIZE = 10;

export async function listOrders(page: number, fetch = ORDER_PAGE_SIZE): Promise<Paged<Order>> {
  const raw = await request<unknown>({ method: 'GET', url: '/api/order/list', params: { page, fetch } });
  const paged = readPaged<Order>(raw);
  return { ...paged, list: paged.list.map(normalizeOrder) };
}

export async function getOrder(id: number): Promise<Order> {
  const order = await request<Order>({ method: 'GET', url: `/api/order/${id}` });
  return normalizeOrder(order);
}

export function cancelOrder(id: number): Promise<null> {
  return request<null>({ method: 'DELETE', url: `/api/order/${id}` });
}

export function canCancel(order: Order): boolean {
  return order.status === 'pending';
}

function normalizeOrder(order: Order): Order {
  return { ...order, items: order.items ?? [] };
}
