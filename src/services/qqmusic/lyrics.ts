import * as z from 'zod/mini';
import {response, id} from '../schemas';
import crypto from '../../native/crypto';
import parseLyric from '../../utils/parseLyric';
import {call} from './http';
import type {TrackId} from '../track';

const lyricResponse = response({
  req_0: z.optional(
    z.looseObject({
      code: z.number(),
      data: z.optional(
        z.looseObject({
          songID: id,
          lyric: z.string(),
          trans: z.optional(z.string()),
          crypt: z.number(),
          qrc: z.number(),
        }),
      ),
    }),
  ),
});

export async function getLyric(value: TrackId) {
  const result = await call(
    'music.musichallSong.PlayLyricInfo',
    'GetPlayLyricInfo',
    {
      ...(typeof value === 'number' || /^\d+$/.test(value)
        ? {songId: Number(value)}
        : {songMid: value}),
      type: 0,
      crypt: 0,
      qrc: 0,
      qrc_t: 0,
      lrc_t: 0,
      trans: 1,
      trans_t: 0,
      roma: 0,
      roma_t: 0,
    },
    '歌词',
    lyricResponse,
  );
  if (result.req_0?.code !== 0) throw new Error('QQ 音乐歌词失败：业务码 ' + result.req_0?.code);
  const data = result.req_0.data;
  if (!data) throw new Error('QQ 音乐歌词响应缺少内容');
  if (data.crypt !== 0 || data.qrc !== 0) throw new Error('QQ 音乐未返回请求的逐行歌词格式');
  const [lyric, trans] = await crypto.decodeBase64([data.lyric, data.trans ?? '']);
  return {lyric: parseLyric(lyric), trans: parseLyric(trans)};
}
