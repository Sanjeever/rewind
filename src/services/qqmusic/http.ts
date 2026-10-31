const endpoint = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
import type * as z from 'zod/mini';
import {audioResponse, detailResponse} from './responses';
import {response} from '../schemas';
import {getSession, guid} from './session';
import type {TrackFields} from '../track';
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

export async function call<S extends z.ZodMiniType>(
  module: string,
  method: string,
  param: Record<string, unknown>,
  stage: string,
  schema: S,
  currentSession?: Awaited<ReturnType<typeof getSession>>,
) {
  const session = currentSession ?? (await getSession());
  return request(
    endpoint,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://y.qq.com/',
        Origin: 'https://y.qq.com',
        Cookie: session.cookies,
      },
      body: JSON.stringify({
        comm: {
          ct: 24,
          cv: 4747474,
          format: 'json',
          platform: 'yqq.json',
          uin: session.musicId,
          g_tk: session.token,
          g_tk_new_20200303: session.token,
          ...(session.musicKey
            ? {qq: session.musicId, authst: session.musicKey, tmeLoginType: session.loginType}
            : {}),
        },
        req_0: {module, method, param},
      }),
    },
    stage,
    schema,
  );
}

export async function getMusicUrl(mid: string, highQuality = false, track?: TrackFields) {
  const session = await getSession();
  let media = track?.file?.media_mid;
  let songType = track?.type ?? 0;
  if (!media) {
    const detail = await call(
      'music.pf_song_detail_svr',
      'get_song_detail_yqq',
      {song_mid: mid},
      '歌曲详情',
      detailResponse,
      session,
    );
    if (detail.req_0?.code !== 0)
      throw new Error('QQ 音乐歌曲详情失败：业务码 ' + detail.req_0?.code);
    media = detail.req_0.data?.track_info?.file?.media_mid;
    songType = detail.req_0.data?.track_info?.type ?? songType;
    if (!media) throw new Error('QQ 音乐歌曲详情缺少媒体标识');
  }
  const response = await call(
    'music.vkey.GetVkey',
    'UrlGetVkey',
    {
      guid,
      songmid: [mid],
      songtype: [songType],
      filename: [(highQuality ? 'M800' : 'M500') + media + '.mp3'],
      uin: session.musicId,
      ctx: 0,
    },
    '音源',
    audioResponse,
    session,
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
