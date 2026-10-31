import axios from 'axios';
import cookies from '../../native/cookies';
import crypto from '../../native/crypto';
import anonymousCookie from './anonymousCookie';
import type * as z from 'zod/mini';
import {parseResponse} from '../schemas';

const origin = 'https://music.163.com';
export const http = axios.create({
  baseURL: origin,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Referer: origin,
    Origin: origin,
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15',
  },
  timeout: 15000,
  withCredentials: true,
});

http.interceptors.request.use(async (config) => {
  const stored = await cookies.get(origin);
  const header = Object.values(stored)
    .map((cookie) => cookie.name + '=' + cookie.value)
    .join('; ');
  config.headers.set('Cookie', header || anonymousCookie);
  return config;
});

export async function request<S extends z.ZodMiniType>(
  schema: S,
  path: string,
  query = '',
  options?: {signal: AbortSignal},
) {
  const response = await http.get<unknown>(query ? path + '?' + query.replace(/^\?/, '') : path, {
    signal: options?.signal,
  });
  return parseResponse(schema, response.data);
}

export async function cryptoRequest<S extends z.ZodMiniType>(
  schema: S,
  path: string,
  data: Record<string, unknown>,
  options?: {signal: AbortSignal},
) {
  const encrypted = await crypto.weapi(data);
  const body =
    'params=' +
    encodeURIComponent(encrypted.params) +
    '&encSecKey=' +
    encodeURIComponent(encrypted.encSecKey);
  const response = await http.post<unknown>(path, body, {signal: options?.signal});
  if (response.data === '') throw new Error('网易云服务返回空响应');
  return parseResponse(schema, response.data);
}

export async function getCsrfToken() {
  return (await cookies.get(origin)).__csrf?.value;
}
