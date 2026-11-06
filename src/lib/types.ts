export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface Paged<T> {
  pageNumber: number;
  fetch: number;
  list: T[];
}

export interface LoginInfo {
  accountId: number;
  account: string;
  name: string;
  token: string;
}

export interface UserProfile {
  accID: number;
  acc: string;
  name: string;
  live: string;
  city: string;
  phone: string;
  id: string;
  createTime: string;
}

export interface RegisterForm {
  acc: string;
  pswd: string;
  name: string;
  live: string;
  city: string;
  phone: string;
  id: string;
}

export interface ProductSummary {
  id: number;
  name: string;
  price: number;
  stock: number;
  banner: string;
}

export interface ProductImage {
  id: number;
  name: string;
  type: number;
  url: string;
}

export interface ProductDetail extends ProductSummary {
  spec: string;
  images: ProductImage[];
}

export interface Delivery {
  id: number;
  name: string;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  stock: number;
  num: number;
  subTotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CheckoutDelivery {
  deliveryId: number;
  storeName: string;
  receiverName: string;
  receiverPhone: string;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: number;
  num: number;
  subTotal: number;
}

export interface Order {
  id: number;
  accountId: number;
  total: number;
  status: OrderStatus;
  delivery: CheckoutDelivery;
  createTime: string;
  items: OrderItem[];
}
