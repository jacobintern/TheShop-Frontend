import axios, { AxiosRequestConfig } from 'axios';
import { ApiResponse, Paged } from '@/lib/types';

const TOKEN_KEY = 'theshop.token';

export class ApiError extends Error {
  code: number;
  status?: number;

  constructor(message: string, code: number, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export const tokenStorage = {
  get(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    window.localStorage.removeItem(TOKEN_KEY);
  },
};

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redux Toolkit 的 thunk 會把 Error 序列化成一般物件，所以錯誤也要有可序列化的形狀
export interface ApiFailure {
  message: string;
  code: number;
  status?: number;
}

export function toFailure(err: unknown): ApiFailure {
  if (err instanceof ApiError) return { message: err.message, code: err.code, status: err.status };
  if (err instanceof Error) return { message: err.message, code: -1 };
  return { message: 'Unexpected error', code: -1 };
}

function asFailure(err: unknown): ApiFailure {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as ApiFailure).message === 'string') {
    return err as ApiFailure;
  }
  return toFailure(err);
}

export function isUnauthorized(err: unknown): boolean {
  return asFailure(err).status === 401;
}

export function errorMessage(err: unknown): string {
  const failure = asFailure(err);
  if (failure.status === 429) return 'Too many attempts, please try again later.';
  return failure.message || 'Unexpected error';
}

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const res = await client.request<ApiResponse<T>>(config);
    if (res.data.code !== 0) throw new ApiError(res.data.msg, res.data.code, res.status);
    return res.data.data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (axios.isAxiosError(err)) {
      const body = err.response?.data as Partial<ApiResponse<unknown>> | undefined;
      const msg = body?.msg || err.message;
      throw new ApiError(msg, body?.code ?? -1, err.response?.status);
    }
    throw err;
  }
}

type Loose = Record<string, unknown>;

// 後端正在從 PascalCase 改成 camelCase，過渡期兩種鍵名都要讀得到
export function pickKey<T>(raw: unknown, camel: string, pascal: string): T {
  const obj = (raw ?? {}) as Loose;
  return (obj[camel] ?? obj[pascal]) as T;
}

export function readPaged<T>(raw: unknown): Paged<T> {
  return {
    pageNumber: pickKey<number>(raw, 'pageNumber', 'PageNumber') ?? 1,
    fetch: pickKey<number>(raw, 'fetch', 'Fetch') ?? 0,
    list: pickKey<T[]>(raw, 'list', 'List') ?? [],
  };
}

export function isLastPage<T>(page: Paged<T>): boolean {
  return page.list.length < page.fetch;
}
