import {Netease} from '../services';
import providers from '../services/providers';
import locales from '../locales';
import {toast} from '../native/toast';
import {errorMessage} from '../utils/types';
import universalNavigator from '../utils/universalNavigator';
import type {QueueSnapshot, QueueSelection} from './types';

type SavedQueue = Pick<QueueSnapshot, 'tracks' | 'playingIndex' | 'songItem' | 'api'>;
interface Host {
  getQueue(): SavedQueue;
  getRequest(): number;
  isPlayingRadio(): boolean;
  play(command: QueueSelection): void;
  clearQueue(): void;
}

export default class PersonalRadio {
  private savedQueue: SavedQueue | null = null;
  constructor(private readonly host: Host) {}

  toggle = () => {
    if (this.host.isPlayingRadio()) this.stop();
    else {
      const {tracks, playingIndex, songItem, api} = this.host.getQueue();
      this.savedQueue = {tracks, playingIndex, songItem, api};
      this.load();
    }
  };

  load = async () => {
    const request = this.host.getRequest();
    try {
      const response = await Netease.personal_fm();
      if (request !== this.host.getRequest()) return;
      if (response?.code === 405) {
        toast(locales.NETEASE_NOT_LOGIN);
        universalNavigator.navigate('NeteaseLogin');
        return;
      }
      if (!Array.isArray(response?.data) || !response.data.length)
        throw new Error('私人电台未返回歌曲');
      const tracks = response.data.map((song) => ({...song, isFM: true}));
      this.host.play({song: tracks[0], data: tracks, index: 0, api: providers.netEase});
    } catch (error) {
      if (request === this.host.getRequest()) toast('私人电台加载失败：' + errorMessage(error));
    }
  };

  stop = () => {
    const saved = this.savedQueue;
    this.savedQueue = null;
    if (saved?.songItem && saved.api != null && saved.playingIndex != null)
      this.host.play({
        song: saved.songItem,
        data: saved.tracks,
        index: saved.playingIndex,
        api: saved.api,
      });
    else this.host.clearQueue();
  };
}
