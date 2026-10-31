import * as z from 'zod/mini';
import {album, artist, id, response, track} from '../schemas';
const optional = z.optional;
const string = optional(z.string());
const number = optional(z.number());
export const qqTrack = z.extend(track, {singer: optional(z.array(artist)), album: optional(album)});
const entity = z.looseObject({
  id: optional(id),
  mid: string,
  v_id: string,
  name: string,
  singerPic: string,
  singerName: string,
  albumNum: number,
  albumName: string,
  albumPic: string,
  publicTime: string,
  dissname: string,
  imgurl: string,
  song_count: number,
  creator: optional(z.looseObject({name: string})),
  duration: number,
  mv_name: string,
  mv_pic_url: string,
  albumname: string,
  albummid: string,
  singername: string,
  singermid: string,
  singernum: number,
  pic: string,
  singerid: optional(id),
  is_follow: number,
  albumid: optional(id),
  singer_mid: string,
});
export const qqPlaylist = z.looseObject({
  id: optional(id),
  dissid: optional(id),
  dirid: optional(id),
  title: string,
  name: string,
  type: number,
  subtitle: string,
  picurl: string,
  picurl2: string,
  dissname: string,
  imgurl: string,
  logo: string,
  songnum: number,
  song_count: number,
  songlist: optional(z.array(qqTrack)),
  desc: string,
  creator: optional(z.looseObject({name: string, uin: optional(id)})),
});
const page = z.looseObject({list: z.array(entity), total: number, totalnum: number});
export const searchBody = z.looseObject({
  song: optional(z.looseObject({list: z.array(qqTrack)})),
  singer: optional(page),
  album: optional(page),
  mv: optional(page),
  playlist: optional(page),
});
export const searchResponse = response({
  data: optional(
    z.looseObject({code: z.number(), data: optional(z.looseObject({body: optional(searchBody)}))}),
  ),
});
const mid = z.looseObject({result: z.number(), purl: z.string()});
export const detailResponse = response({
  req_0: optional(
    z.looseObject({
      code: z.number(),
      data: optional(z.looseObject({track_info: optional(qqTrack)})),
    }),
  ),
});
const cdn = z.looseObject({sip: optional(z.array(z.string()))});
export const audioResponse = response({
  req_0: optional(
    z.looseObject({
      code: z.number(),
      data: optional(
        z.looseObject({sip: optional(z.array(z.string())), midurlinfo: optional(z.array(mid))}),
      ),
    }),
  ),
  req: optional(z.looseObject({data: optional(cdn)})),
});
export const qqProfile = z.looseObject({
  uin: optional(id),
  headpic: string,
  nick: string,
  cookies: string,
});
const profile = z.looseObject({
  creator: qqProfile,
  mymusic: z.array(qqPlaylist),
  mydiss: z.looseObject({list: z.array(qqPlaylist)}),
});
const suggestion = z.looseObject({id: optional(id), mid: string, name: z.string(), singer: string});
const suggestions = z.looseObject({itemlist: z.array(suggestion)});
export const qqComment = z.looseObject({
  commentid: optional(id),
  rootcommentcontent: z.string(),
  nick: z.string(),
  avatarurl: z.string(),
  time: z.number(),
  uin: optional(id),
  praise_num: number,
});
const comments = z.looseObject({commentlist: z.array(qqComment), commenttotal: z.number()});
export const responses = {
  user_subed_artist: response({list: z.array(entity)}),
  user_subed_album: response({data: z.looseObject({albumlist: z.array(entity)})}),
  like_artist: response({}),
  search: searchResponse,
  search_playlist: response({data: page}),
  artist_song: response({
    songList: z.looseObject({
      data: z.looseObject({songList: optional(z.array(z.looseObject({songInfo: qqTrack})))}),
    }),
  }),
  artist_mv: response({data: page}),
  album: response({data: page}),
  album_song: response({
    data: z.looseObject({
      list: z.array(qqTrack),
      name: string,
      desc: string,
      aDate: string,
      singername: string,
      singermid: string,
      company: string,
    }),
  }),
  profile: response({data: optional(profile)}),
  user_created_list: response({data: z.looseObject({cdlist: z.array(qqPlaylist)})}),
  disslist: response({cdlist: optional(z.array(qqPlaylist))}),
  addToDir: response({}),
  like: response({}),
  dislike: response({}),
  subscribe_playlist: response({}),
  song_comments: response({comment: optional(comments), hot_comment: optional(comments)}),
  search_suggest: response({
    data: optional(
      z.looseObject({
        song: optional(suggestions),
        singer: optional(suggestions),
        album: optional(suggestions),
      }),
    ),
  }),
};
export const lyricResponse = z.looseObject({lyric: z.string(), trans: z.string()});
export const videoKey = z.looseObject({key: z.string()});
export const videoFiles = z.looseObject({
  vl: z.looseObject({
    vi: z.array(
      z.looseObject({
        lnk: z.string(),
        ul: z.looseObject({ui: z.array(z.looseObject({url: z.string()}))}),
        cl: z.looseObject({fc: z.number()}),
      }),
    ),
  }),
  fl: z.looseObject({fi: z.array(z.looseObject({id: z.number()}))}),
});
