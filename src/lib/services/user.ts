import { pickKey, request } from '@/lib/api';
import { LoginInfo, RegisterForm, UserProfile } from '@/lib/types';

export async function login(acc: string, pswd: string): Promise<LoginInfo> {
  const raw = await request<unknown>({ method: 'POST', url: '/api/user/login', data: { acc, pswd } });
  return {
    accountId: pickKey<number>(raw, 'accountId', 'AccountID'),
    account: pickKey<string>(raw, 'account', 'Account'),
    name: pickKey<string>(raw, 'name', 'Name'),
    token: pickKey<string>(raw, 'token', 'Token'),
  };
}

export function register(form: RegisterForm): Promise<null> {
  return request<null>({ method: 'POST', url: '/api/user/register', data: form });
}

export function getProfile(): Promise<UserProfile> {
  return request<UserProfile>({ method: 'GET', url: '/api/user' });
}

export function logout(): Promise<null> {
  return request<null>({ method: 'POST', url: '/api/user/logout' });
}
