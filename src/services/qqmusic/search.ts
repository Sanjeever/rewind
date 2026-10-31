import * as z from 'zod/mini';
import {response} from '../schemas';
import {qqTrack} from './responses';
import {call} from './http';

export interface QQSearchCursor {
  searchId: string;
  page: number;
  start: Record<string, unknown>;
}

const searchResponse = response({
  req_0: z.optional(
    z.looseObject({
      code: z.number(),
      data: z.optional(
        z.looseObject({
          body: z.looseObject({
            item_song: z.optional(
              z.looseObject({
                items: z.optional(z.array(qqTrack)),
                total_num: z.optional(z.number()),
              }),
            ),
          }),
          meta: z.looseObject({
            sid: z.string(),
            nextpage: z.number(),
            nextpage_start: z.record(z.string(), z.unknown()),
            ret: z.number(),
            is_filter: z.optional(z.number()),
          }),
        }),
      ),
    }),
  ),
});

export async function searchSongPage(query: string, cursor?: QQSearchCursor) {
  const result = await call(
    'music.adaptor.SearchAdaptor',
    'do_search_v2',
    {
      searchid: cursor?.searchId ?? String(Date.now()),
      search_type: 100,
      page_num: 30,
      query,
      page_id: cursor?.page ?? 1,
      highlight: 0,
      grp: 1,
      ...(cursor ? {page_start: cursor.start} : {}),
    },
    '搜索',
    searchResponse,
  );
  if (result.req_0?.code !== 0) throw new Error('QQ 音乐搜索失败：业务码 ' + result.req_0?.code);
  const data = result.req_0.data;
  if (!data) throw new Error('QQ 音乐搜索响应缺少结果');
  const {meta, body} = data;
  if (meta.ret !== 0 || (meta.is_filter != null && meta.is_filter < 0))
    throw new Error('QQ 音乐搜索被服务拒绝（' + meta.ret + '/' + meta.is_filter + '）');
  const songs = body.item_song?.items;
  if (!songs && meta.nextpage !== -1) throw new Error('QQ 音乐搜索响应缺少歌曲列表');
  return {
    songs: songs ?? [],
    cursor:
      meta.nextpage === -1 || meta.nextpage_start.song === -1
        ? undefined
        : {searchId: meta.sid, page: meta.nextpage, start: meta.nextpage_start},
  };
}
