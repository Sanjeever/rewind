import {Netease} from '../services';
import providers from '../services/providers';
import type {TrackFields} from '../services/track';
import {toast} from '../native/toast';
import {errorMessage} from '../utils/types';
import lastSong from '../storage/lastSong';
import lastQueue from '../storage/lastQueue';
import lastTime from '../storage/lastTime';
import type {ActiveQueue} from './types';

export function saveSelection(queue: ActiveQueue, restoreQueue: boolean) {
  lastSong
    .save(queue.api, queue.songItem)
    .catch((error) => toast('保存播放记录失败：' + error.message));
  if (restoreQueue)
    lastQueue
      .save({tracks: queue.tracks, index: queue.playingIndex, api: queue.api})
      .catch((error) => toast('保存队列失败：' + error.message));
}

export async function restoreProgress(
  request: number,
  isCurrent: (request: number) => boolean,
  seek: (seconds: number) => void,
) {
  try {
    const seconds = await lastTime.get();
    if (isCurrent(request)) seek(seconds);
  } catch (error) {
    if (isCurrent(request)) toast('恢复进度失败：' + errorMessage(error));
  }
}

export async function recordPlayed(song: TrackFields, enabled: boolean) {
  if (song.api !== providers.netEase || !enabled) return;
  try {
    const response = await Netease.play_count(
      song.id!,
      (typeof song.album === 'object' ? song.album?.id : undefined) ||
        (!Array.isArray(song.al) ? song.al?.id : undefined),
      Math.floor(song.dt! / 1000),
    );
    if (response?.code !== 200) throw new Error('播放记录响应无效');
  } catch (error) {
    toast('记录播放次数失败：' + errorMessage(error));
  }
}
