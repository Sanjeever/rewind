import * as z from 'zod/mini';
import {
  response,
  artist,
  album,
  audio,
  comment,
  id,
  playlist,
  profile,
  program,
  radio,
  status,
  track,
  userMessage,
  video,
} from '../schemas';
const optional = z.optional;
const tracks = z.array(track);
const search = response({
  result: optional(
    z.looseObject({
      songs: optional(tracks),
      songCount: optional(z.number()),
      artists: optional(z.array(artist)),
      artistCount: optional(z.number()),
      albums: optional(z.array(album)),
      albumCount: optional(z.number()),
      playlists: optional(z.array(playlist)),
      playlistCount: optional(z.number()),
      mvs: optional(z.array(video)),
      mvCount: optional(z.number()),
    }),
  ),
});
const suggestions = response({
  result: optional(
    z.looseObject({
      songs: optional(tracks),
      artists: optional(z.array(artist)),
      albums: optional(z.array(album)),
    }),
  ),
});
const user = response({
  profile: optional(profile),
  listenSongs: optional(z.number()),
  level: optional(z.number()),
});
const comments = response({
  comments: optional(z.array(comment)),
  hotComments: optional(z.array(comment)),
  total: optional(z.number()),
  more: optional(z.boolean()),
});
const playlists = response({playlist: optional(z.array(playlist))});
const songs = response({songs: optional(tracks)});
const sound = response({data: optional(z.array(audio))});
const category = z.looseObject({name: z.string(), category: optional(z.number())});
export const responses = {
  login_out: status,
  login_cellphone: user,
  login_email: user,
  login_refresh: status,
  daily_signin: status,
  user_playlist: playlists,
  user_detail: user,
  user_follows: response({follow: optional(z.array(profile)), more: optional(z.boolean())}),
  user_followeds: response({followeds: optional(z.array(profile)), more: optional(z.boolean())}),
  playlist_detail: response({playlist: optional(playlist)}),
  song_detail: songs,
  search,
  cloud_search: search,
  search_suggest: suggestions,
  artist: response({artist: optional(artist), hotSongs: optional(tracks)}),
  artist_album: response({hotAlbums: optional(z.array(album))}),
  artist_mv: response({mvs: optional(z.array(video))}),
  album: response({album: optional(album), songs: optional(tracks)}),
  musicUrl: sound,
  freeMusicUrl: sound,
  recommend_songs: response({recommend: optional(tracks)}),
  recommend_dislike: status,
  recommend_playlists: response({recommend: optional(z.array(playlist))}),
  likelist: response({ids: optional(z.array(id))}),
  like: status,
  msg: response({msgs: optional(z.array(userMessage))}),
  msg_history: response({msgs: optional(z.array(userMessage)), more: optional(z.boolean())}),
  comment: comments,
  comment_radio: comments,
  comment_add: status,
  playlist_tracks: status,
  personal_fm: response({data: optional(tracks)}),
  charts: response({list: optional(z.array(playlist))}),
  play_count: status,
  sublist_artist: response({data: optional(z.array(artist)), hasMore: optional(z.boolean())}),
  sublist_album: response({data: optional(z.array(album)), hasMore: optional(z.boolean())}),
  subcount: response({artistCount: optional(z.number()), albumCount: optional(z.number())}),
  sublist_artist_add: status,
  sublist_album_add: status,
  playlist_catalogue: response({
    sub: optional(z.array(category)),
    categories: optional(z.record(z.string(), z.string())),
  }),
  playlist_category: response({categories: optional(z.array(category))}),
  topPlaylist: response({playlists: optional(z.array(playlist)), more: optional(z.boolean())}),
  lyric: response({
    lrc: optional(z.nullable(z.looseObject({lyric: z.string()}))),
    tlyric: optional(z.nullable(z.looseObject({lyric: z.string()}))),
    transUser: optional(z.looseObject({nickname: z.string()})),
    uncollected: optional(z.boolean()),
  }),
  mv: response({
    data: optional(
      z.looseObject({
        name: z.string(),
        artistName: z.string(),
        brs: z.record(z.string(), z.string()),
      }),
    ),
  }),
  radio_category: response({categories: optional(z.array(z.looseObject({id, name: z.string()})))}),
  radio_sublist: response({djRadios: optional(z.array(radio))}),
  radio_detail: response({programs: optional(z.array(program)), more: optional(z.boolean())}),
  radio_hot: response({djRadios: optional(z.array(radio))}),
  heart_mode: response({data: optional(z.array(z.looseObject({songInfo: track})))}),
  cloud: response({
    data: optional(
      z.array(
        z.looseObject({
          simpleSong: track,
          songId: id,
          songName: z.string(),
          fileName: optional(z.string()),
          artist: optional(z.string()),
          album: optional(z.string()),
        }),
      ),
    ),
  }),
  listen_record: response({
    weekData: optional(
      z.array(z.looseObject({song: track, playCount: z.number(), score: optional(z.number())})),
    ),
    allData: optional(
      z.array(z.looseObject({song: track, playCount: z.number(), score: optional(z.number())})),
    ),
  }),
  follow_user: status,
  subscribe_playlist: status,
  profile: user,
  sub_new_songs: response({
    data: optional(
      z.looseObject({
        newWorks: z.array(
          z.looseObject({
            blockType: z.string(),
            blockTitle: z.looseObject({
              resourceName: z.string(),
              imgUrl: optional(z.string()),
              artistName: optional(z.string()),
              artistId: optional(id),
              resourceId: optional(id),
            }),
            songLists: tracks,
          }),
        ),
      }),
    ),
  }),
  sub_new_mv: response({data: optional(z.looseObject({newWorks: z.array(video)}))}),
};
