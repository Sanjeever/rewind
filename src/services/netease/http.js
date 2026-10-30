import axios from 'axios';
import cookies from '../../native/cookies';
import crypto from '../../native/crypto';
import anonymousCookie from './anonymousCookie';

const origin = 'https://music.163.com';
export const http = axios.create({
  baseURL: origin,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Referer: origin,
    Origin: origin,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15',
  },
  timeout: 15000,
  withCredentials: true,
});

http.interceptors.request.use(async config => {
  const stored = await cookies.get(origin);
  const header = Object.values(stored).map(cookie => cookie.name + '=' + cookie.value).join('; ');
  config.headers.set('Cookie', header || anonymousCookie);
  return config;
});

export async function request(path, query = '', options) {
  const response = await http.get(query ? path + '?' + query.replace(/^\?/, '') : path, {signal: options?.signal});
  return response.data;
}

export async function cryptoRequest(path, data, options) {
  const encrypted = await crypto.weapi(data);
  const body = 'params=' + encodeURIComponent(encrypted.params) + '&encSecKey=' + encodeURIComponent(encrypted.encSecKey);
  const response = await http.post(path, body, {signal: options?.signal});
  if (response.data === '') throw new Error('网易云服务返回空响应');
  return response.data;
}

export async function getCsrfToken() {
  return (await cookies.get(origin)).__csrf?.value;
}
