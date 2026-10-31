import {pinyin} from 'pinyin-pro';
import * as trackInfo from '../services/trackInfo';
import * as utils from './index';
import type {Artist, TrackFields} from '../services/track';
type SearchableTrack = TrackFields & {_searchable?: string};
const c: Record<string, 1 | undefined> = {
  ':1': 1,
  ':11': 1,
  ':2': 1,
  ':22': 1,
  ':3': 1,
  ':33': 1,
  ':4': 1,
};
const searchTypesMap = {
  bySong: ':1',
  bySongReversed: ':11',
  byArtist: ':2',
  byArtistReversed: ':22',
  byAlbum: ':3',
  byAlbumReversed: ':33',
  byRandom: ':4',
};
const l = new RegExp(/:\w{1,2}/gi);
const b = (e: string) => e.replace(/\s/, '');
const f = (e: string | undefined) => {
  if (e === undefined) throw new TypeError('歌曲名称格式无效');
  return b(
    pinyin(e, {
      toneType: 'none',
      type: 'array',
    }).join(''),
  );
};
const g = (e: string) => utils.usable(c[e]);
const v = <T extends TrackFields>(e: T[], r: string) => {
  const n = r.replace(l, '');
  const t = r.replace(new RegExp(n, 'gi'), '');
  let a = m(e, t);
  if (!(
    t !== searchTypesMap.bySongReversed &&
    t !== searchTypesMap.byArtistReversed &&
    t !== searchTypesMap.byAlbumReversed
  )) {
    a = a.reverse();
  }
  return a;
};
const m = <T extends TrackFields>(e: T[], r: string) => {
  if (r === searchTypesMap.byRandom) {
    return utils.shuffle(e);
  }
  if (g(r)) {
    return e.sort((e, n) => p(e, n, r));
  }
  return e;
};
const p = (e: TrackFields, r: TrackFields, n: string) => {
  const t = trackInfo.extractBasicInfo(e);
  const a = trackInfo.extractBasicInfo(r);
  let u;
  let s;
  let c = 0;
  switch (n) {
    case searchTypesMap.bySong:
    case searchTypesMap.bySongReversed:
      u = f(t.song);
      s = f(a.song);
      c = u.localeCompare(s);
      break;
    case searchTypesMap.byArtist:
    case searchTypesMap.byArtistReversed: {
      const l = d(t.singer);
      const b = d(a.singer);
      u = f(l);
      s = f(b);
      c = u.localeCompare(s);
      break;
    }
    case searchTypesMap.byAlbum:
    case searchTypesMap.byAlbumReversed:
      u = f(t.album);
      s = f(a.album);
      c = u.localeCompare(s);
  }
  return c;
};
const y = (e: Artist[] | undefined) =>
  e?.map(function (e) {
    return e.name;
  }) || [];
const d = (singer: string | Artist[] | undefined) => {
  if (typeof singer === 'string') {
    return singer;
  }
  return y(singer).join('');
};
const h = (singer: string | Artist[] | undefined) => {
  if (typeof singer === 'string') {
    return singer;
  }
  const r = y(singer);
  return f(r.join(''));
};
const R = {
  search: function <T extends TrackFields>(e: T[], r: string) {
    const n = b(r.replace(/\?/gi, '\\?'));
    if (n.length < 1) {
      return e;
    }
    const t = n.replace(l, '');
    const a = new RegExp(t, 'gi');
    const u = e.filter((e) => {
      const r = trackInfo.extractBasicInfo(e);
      const {song, album} = r;
      const u = d(r.singer);
      const s = f(r.song);
      const c = f(r.album);
      return [song, album, u, h(r.singer), s, c].join(' ').match(a);
    });
    if (n.match(l)) {
      return v(u, n);
    }
    return u;
  },
  quickSearch: function <T extends SearchableTrack>(e: T[], r: string) {
    const n = b(r.replace(/\?/gi, '\\?'));
    if (n.length < 1) {
      return e;
    }
    const t = new RegExp(n, 'gi');
    return e.filter((e) => {
      if (e._searchable && typeof e._searchable === 'string') {
        return e._searchable.match(t);
      }
      const r = trackInfo.extractBasicInfo(e);
      const {song, album} = r;
      const u = d(r.singer);
      const s = f(r.song);
      const c = f(r.album);
      const o = [song, album, u, h(r.singer), s, c].join('');
      e._searchable = o;
      return e._searchable.match(t);
    });
  },
  searchTypesMap,
};
export default R;
