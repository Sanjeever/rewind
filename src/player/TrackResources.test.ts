import {jest} from '@jest/globals';
import type {LyricRow} from '../utils/parseLyric';
import type {Provider} from '../services/providers';
import type {TrackId} from '../services/track';
import {extractFullInfo} from '../services/trackInfo';
import {getLyricIndex, getMiniLyric} from './lyricPosition';

type Lyrics = {lyric: LyricRow[]; hasTrans: boolean};
const getLyric = jest.fn<() => Promise<Lyrics>>();
const load = jest.fn<() => Promise<Partial<Record<Provider, TrackId[]>>>>();
const getArtWork = jest.fn<() => Promise<string>>();
const like = jest.fn<() => Promise<void>>();
const updatePlayback = jest.fn();
const toast = jest.fn();
jest.unstable_mockModule('./lyrics', () => ({default: {getLyric}}));
jest.unstable_mockModule('./playMode', () => ({default: {onLike: like}}));
jest.unstable_mockModule('../storage', () => ({storage: {load}}));
jest.unstable_mockModule('../native/mediaStore', () => ({default: {getArtWork}}));
jest.unstable_mockModule('../native/audioPlayer', () => ({default: {updatePlayback}}));
jest.unstable_mockModule('../native/toast', () => ({toast}));
const {default: Resources} = await import('./TrackResources');
const song = {id: 1, name: '歌曲'};

function createResources() {
  let current = 1;
  const setLyric = jest.fn();
  const setLiked = jest.fn();
  const setArtwork = jest.fn();
  const resources = new Resources({
    isCurrent: (request) => request === current,
    setLyric,
    setLiked,
    setArtwork,
  });
  return {
    resources,
    setLyric,
    setLiked,
    setArtwork,
    switchSong: () => {
      current++;
      resources.cancelLyrics();
    },
  };
}
beforeEach(() => {
  jest.clearAllMocks();
  getLyric.mockReset();
  load.mockReset();
  getArtWork.mockReset();
  like.mockReset();
});

test('切歌和取消后，旧歌词成功与失败均不能覆盖新歌词或显示旧错误', async () => {
  let completeOld!: (result: Lyrics) => void;
  let failOld!: (error: Error) => void;
  getLyric.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        completeOld = resolve;
      }),
  );
  getLyric.mockImplementationOnce(
    () =>
      new Promise((_, reject) => {
        failOld = reject;
      }),
  );
  getLyric.mockResolvedValueOnce({lyric: [{txt: '当前', total: 0}], hasTrans: false});
  const {resources, setLyric, switchSong} = createResources();
  const first = resources.loadLyrics('netEase', extractFullInfo(song), song);
  const second = resources.loadLyrics('qqMusic', extractFullInfo(song), song);
  switchSong();
  await resources.loadLyrics('netEase', extractFullInfo(song), song);
  completeOld({lyric: [{txt: '旧歌词', total: 0}], hasTrans: true});
  failOld(new Error('旧请求失败'));
  await Promise.all([first, second]);
  expect(setLyric.mock.calls).toEqual([[[{txt: '当前', total: 0}], false]]);
  expect(toast).not.toHaveBeenCalled();
});

test('旧收藏和封面响应不能更新新歌曲，也不能改写系统媒体信息', async () => {
  let completeLikes!: (likes: Partial<Record<Provider, TrackId[]>>) => void;
  let completeArtwork!: (image: string) => void;
  load.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        completeLikes = resolve;
      }),
  );
  getArtWork.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        completeArtwork = resolve;
      }),
  );
  const {resources, setLiked, setArtwork, switchSong} = createResources();
  const likes = resources.loadLikes(song, 'netEase', 1);
  const artwork = resources.loadArtwork(1, song, 1);
  switchSong();
  completeLikes({netEase: [1]});
  completeArtwork('file:///old.jpg');
  await Promise.all([likes, artwork]);
  expect(setLiked).not.toHaveBeenCalled();
  expect(setArtwork).not.toHaveBeenCalled();
  expect(updatePlayback).not.toHaveBeenCalled();
});

test('收藏写入期间切歌，写入完成后不把旧歌曲收藏状态应用到新歌曲', async () => {
  let finish!: () => void;
  like.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  load.mockResolvedValue({netEase: [1]});
  const {resources, setLiked, switchSong} = createResources();
  const pending = resources.toggleLike(song, 'netEase', false, 1);
  switchSong();
  finish();
  await pending;
  expect(setLiked).not.toHaveBeenCalled();
  await resources.loadLikes(song, 'netEase', 2);
  expect(setLiked).toHaveBeenCalledWith(true);
});

test('歌词定位保留时间容差，迷你歌词按设置组合翻译并跳过署名', () => {
  const lines = [
    {txt: '词：署名', total: 0},
    {txt: '原文', total: 5, trans: {txt: '翻译', total: 5}},
  ];
  expect(getLyricIndex(lines, 4.7)).toBe(1);
  expect(getMiniLyric(lines, 0, true)).toBeUndefined();
  expect(getMiniLyric(lines, 5, true)).toBe('翻译 / 原文');
  expect(getMiniLyric(lines, 5, false)).toBe('原文');
  expect(getLyricIndex([], 0)).toBeNull();
});
