import providers from '../services/providers';
import {Netease, QQMusic} from '../services';
import {parseLyric} from '../utils';
import {findMatchingTrack} from '../services/trackMatch';
import {getSong, getSinger} from '../services/trackFields';
import type {LyricRow} from '../utils/parseLyric';
import type {TrackFields, TrackId} from '../services/track';
import type {Provider} from '../services/providers';
import type {extractFullInfo} from '../services/trackInfo';
interface Lyrics {
  lyric: LyricRow[];
  hasTrans: boolean;
}
type Info = ReturnType<typeof extractFullInfo>;

const empty = (): Lyrics => ({lyric: [], hasTrans: false});
function translated(lyric: LyricRow[], translation: LyricRow[]): Lyrics {
  let next = 0;
  let matched = false;
  return {
    lyric: lyric.map((line) => {
      if (line.total == null) return line;
      while (
        next < translation.length &&
        (translation[next].total == null || translation[next].total! < line.total - 0.3)
      )
        next++;
      const trans = translation[next];
      if (trans?.total != null && Math.abs(trans.total - line.total) <= 0.3) {
        next++;
        matched = true;
        return {...line, trans};
      }
      return line;
    }),
    hasTrans: matched,
  };
}

async function qqLyric(id: TrackId) {
  const result = await QQMusic.getLyric(id);
  if (!result || !Array.isArray(result.lyric) || !Array.isArray(result.trans))
    throw new Error('QQ 音乐歌词响应无效');
  return translated(result.lyric, result.trans);
}

function queryFor(song: TrackFields) {
  const singers = getSinger(song);
  const artist = typeof singers === 'string' ? singers : singers?.[0]?.name;
  return [getSong(song), artist].filter(Boolean).join(' ');
}

async function matchQQ(source: TrackFields) {
  const query = queryFor(source);
  const songs = await QQMusic.searchSong(query);
  if (!Array.isArray(songs)) throw new Error('QQ 音乐搜索响应无效');
  if (!songs.length) return empty();
  const song = findMatchingTrack(source, songs);
  return song ? qqLyric(song.mid!) : empty();
}

async function neteaseLyric(song: TrackFields): Promise<Lyrics> {
  if (song.mainTrackId != null && song.mainTrackId > 0)
    return {lyric: [{txt: song.description!, total: 0}], hasTrans: false};
  const response = await Netease.lyric(song.id!);
  if (!response || response.code !== 200) throw new Error('网易云歌词响应无效');
  if (response.nolyric === true) return empty();
  if (!response.lrc || response.uncollected === true) {
    return matchQQ(song);
  }
  const lyric = parseLyric(response.lrc.lyric);
  const translation = response.tlyric?.lyric ? parseLyric(response.tlyric.lyric) : [];
  const result = translated(lyric, translation);
  if (response.transUser) result.lyric.push({txt: '翻译贡献者：' + response.transUser.nickname});
  return result;
}

async function localLyric(song: TrackFields) {
  const query = queryFor(song);
  const response = await Netease.search({keywords: query});
  if (!response || response.code !== 200 || !response.result) throw new Error('网易云搜索响应无效');
  const songs = response.result.songs;
  if (!Array.isArray(songs)) {
    if (response.result.songCount === 0) return matchQQ(song);
    throw new Error('网易云搜索响应缺少歌曲');
  }
  const match = findMatchingTrack(song, songs);
  return match ? neteaseLyric(match) : matchQQ(song);
}

export default {
  getLyric({api, obj, songItem}: {api: Provider; obj: Info; songItem: TrackFields}) {
    switch (api) {
      case providers.netEase:
        return neteaseLyric(songItem);
      case providers.qqMusic:
        return qqLyric(obj.uid!);
      case providers.local:
        return localLyric(songItem);
      default:
        throw new Error('未知歌词来源：' + api);
    }
  },
};
