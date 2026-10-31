const endpoint = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
const guid = '4422768122';
const uin = '1152921504792286499';
import type * as z from 'zod/mini';
import {audioResponse, searchResponse} from './responses';
import {response} from '../schemas';
const envelope = response({});

async function request<S extends z.ZodMiniType>(
  url: string,
  options: RequestInit,
  stage: string,
  schema: S,
): Promise<z.output<S>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      // RN 与 WebView 引入的 DOM 声明对 onabort 可空性不同，共用标准 AbortSignal 实例。
      signal: controller.signal as RequestInit['signal'],
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const value: unknown = await response.json();
    const data = envelope.parse(value);
    if (data.code !== 0)
      throw new Error(
        '业务码 ' + data.code + (data.message || data.msg ? '：' + (data.message || data.msg) : ''),
      );
    return schema.parse(value);
  } catch (error) {
    throw new Error(
      'QQ 音乐' +
        stage +
        '失败：' +
        (controller.signal.aborted
          ? '请求超时'
          : error instanceof Error
            ? error.message
            : String(error)),
      {cause: error},
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function searchSongs(query: string, page = 1) {
  const payload = {
    data: {
      method: 'DoSearchForQQMusicDesktop',
      module: 'music.search.SearchCgiService',
      param: {search_type: 0, query, page_num: page, num_per_page: 30},
    },
  };
  const response = await request(
    endpoint + '?_=' + Date.now(),
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    },
    '搜索',
    searchResponse,
  );
  if (response.data?.code !== 0) throw new Error('QQ 音乐搜索失败：业务码 ' + response.data?.code);
  const songs = response.data.data?.body?.song?.list;
  if (!Array.isArray(songs)) throw new Error('QQ 音乐搜索响应缺少歌曲列表');
  return songs;
}

export async function getMusicUrl(mid: string) {
  const payload = {
    req: {
      module: 'CDN.SrfCdnDispatchServer',
      method: 'GetCdnDispatch',
      param: {guid, calltype: 0, userip: ''},
    },
    req_0: {
      module: 'vkey.GetVkeyServer',
      method: 'CgiGetVkey',
      param: {guid, songmid: [mid], songtype: [0], uin, loginflag: 1, platform: '20'},
    },
    comm: {uin, format: 'json', ct: 24, cv: 0},
  };
  const parameters = new URLSearchParams({
    g_tk: '5381',
    loginUin: uin,
    hostUin: '0',
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: '0',
    platform: 'yqq.json',
    needNewCode: '0',
    data: JSON.stringify(payload),
  });
  const response = await request(
    endpoint + '?' + parameters,
    {
      headers: {
        'Accept-Encoding': 'identity;q=1, *;q=0',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.84 Safari/537.36',
      },
    },
    '音源',
    audioResponse,
  );
  if (response.req_0?.code !== 0)
    throw new Error('QQ 音乐音源失败：业务码 ' + response.req_0?.code);
  const data = response.req_0.data;
  const item = data?.midurlinfo?.[0];
  if (!item) throw new Error('QQ 音乐音源响应缺少授权结果');
  if (item.result !== 0 || !item.purl)
    throw new Error('QQ 音乐未返回播放授权（' + item.result + '）');
  const hosts = data?.sip?.length ? data.sip : response.req?.data?.sip;
  const host = hosts?.find((value) => /^https?:\/\//.test(value));
  if (!host) throw new Error('QQ 音乐音源响应缺少 CDN 地址');
  return new URL(item.purl, host).href;
}
