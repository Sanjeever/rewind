import providers from '../services/providers';
import {Netease, QQMusic} from '../services';
import {parseLyric} from '../utils';

const empty = () => ({lyric: [], hasTrans: false});
const sameDuration = (left, right) => Math.floor(left) === Math.floor(right) || Math.round(left) === Math.round(right);

function translated(lyric, translation) {
  const byTime = new Map();
  for (const line of translation) if (!byTime.has(line.total)) byTime.set(line.total, line);
  return {lyric: lyric.map(line => byTime.has(line.total) ? {...line, trans: byTime.get(line.total)} : line), hasTrans: translation.length > 0};
}

async function qqLyric(id) {
  const result = await QQMusic.getLyric(id);
  if (!result || !Array.isArray(result.lyric) || !Array.isArray(result.trans)) throw new Error('QQ 音乐歌词响应无效');
  return translated(result.lyric, result.trans);
}

async function matchQQ(query, duration) {
  const songs = await QQMusic.searchSong(query);
  if (!Array.isArray(songs)) throw new Error('QQ 音乐搜索响应无效');
  if (!songs.length) return empty();
  const song = duration ? songs.find(song => sameDuration(song.interval, duration / 1000)) : songs[0];
  return song ? qqLyric(song.mid) : empty();
}

async function neteaseLyric(song, info) {
  if (song.mainTrackId > 0) return {lyric: [{txt: song.description, total: 0}], hasTrans: false};
  const response = await Netease.lyric(song.id);
  if (!response || response.code !== 200) throw new Error('网易云歌词响应无效');
  if (!response.lrc || response.uncollected === true) {
    const query = info.song + (Array.isArray(info.singer) ? '- ' + info.singer[0].name : '');
    return matchQQ(query, song.dt ?? song.duration);
  }
  const lyric = parseLyric(response.lrc.lyric);
  const translation = response.tlyric?.lyric ? parseLyric(response.tlyric.lyric) : [];
  const result = translated(lyric, translation);
  if (response.transUser) result.lyric.push({txt: '翻译贡献者：' + response.transUser.nickname});
  return result;
}

async function localLyric(song, info) {
  const query = song.title + (typeof song.singer === 'string' ? ' ' + song.singer : '');
  const response = await Netease.search({keywords: query});
  if (!response || response.code !== 200 || !response.result) throw new Error('网易云搜索响应无效');
  const songs = response.result.songs;
  if (!Array.isArray(songs)) {
    if (response.result.songCount === 0) return matchQQ(query, song.duration);
    throw new Error('网易云搜索响应缺少歌曲');
  }
  const match = song.duration > 0 && songs.find(item => sameDuration((item.dt ?? item.duration) / 1000, song.duration / 1000)) || songs[0];
  return match ? neteaseLyric(match, info) : matchQQ(query, song.duration);
}

export default {
  getLyric({api, obj, songItem}) {
    switch (api) {
      case providers.netEase: return neteaseLyric(songItem, obj);
      case providers.qqMusic: return qqLyric(obj.uid);
      case providers.local: return localLyric(songItem, obj);
      default: throw new Error('未知歌词来源：' + api);
    }
  },
};
