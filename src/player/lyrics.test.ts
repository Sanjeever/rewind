import {jest} from '@jest/globals';
import parseLyric from '../utils/parseLyric';
import type {TrackFields} from '../services/track';
import type {extractFullInfo} from '../services/trackInfo';
const search = jest.fn<() => Promise<{code: number; result: {songs: TrackFields[]}}>>();
const lyric = jest.fn<() => Promise<unknown>>();
const qqSearch = jest.fn<() => Promise<TrackFields[]>>();
const qqLyric =
  jest.fn<
    () => Promise<{lyric: ReturnType<typeof parseLyric>; trans: ReturnType<typeof parseLyric>}>
  >();
jest.unstable_mockModule('../services', () => ({
  Netease: {search, lyric},
  QQMusic: {searchSong: qqSearch, getLyric: qqLyric},
}));
jest.unstable_mockModule('../utils', () => ({parseLyric}));
const {default: lyrics} = await import('./lyrics');
const info: ReturnType<typeof extractFullInfo> = {
  song: 'Hello',
  album: '',
  singer: 'Adele',
  api: 'local',
  uid: 1,
  img: '',
  alias: undefined,
  qqAlbumId: undefined,
  localAlbumId: undefined,
};
beforeEach(() => {
  jest.clearAllMocks();
  qqSearch.mockResolvedValue([]);
});

test('本地歌词不因时长相近或首项位置选择错误歌手或现场版本', async () => {
  search.mockResolvedValue({
    code: 200,
    result: {
      songs: [
        {id: 1, name: 'Hello (Live)', ar: [{name: 'Adele'}], dt: 295000},
        {id: 2, name: 'Hello', ar: [{name: '其他歌手'}], dt: 295000},
      ],
    },
  });
  const result = await lyrics.getLyric({
    api: 'local',
    obj: info,
    songItem: {title: 'Hello', singer: 'Adele', duration: 295000},
  });
  expect(result).toEqual({lyric: [], hasTrans: false});
  expect(lyric).not.toHaveBeenCalled();
});

test('纯音乐不触发跨平台匹配，翻译的小时间偏差按顺序匹配且不重复使用', async () => {
  lyric.mockResolvedValue({code: 200, nolyric: true});
  expect(await lyrics.getLyric({api: 'netEase', obj: info, songItem: {id: 1}})).toEqual({
    lyric: [],
    hasTrans: false,
  });
  expect(qqSearch).not.toHaveBeenCalled();
  qqLyric.mockResolvedValue({
    lyric: parseLyric('[00:01.00]Hello\n[00:01.15]Again'),
    trans: parseLyric('[00:01.10]你好'),
  });
  const result = await lyrics.getLyric({api: 'qqMusic', obj: info, songItem: {mid: 'mid'}});
  expect(result.hasTrans).toBe(true);
  expect(result.lyric[0].trans?.txt).toBe('你好');
  expect(result.lyric[1].trans).toBeUndefined();
});
