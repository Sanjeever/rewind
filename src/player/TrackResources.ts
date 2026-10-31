import type {Provider} from '../services/providers';
import type {TrackFields, TrackId} from '../services/track';
import {extractFullInfo} from '../services/trackInfo';
import providers from '../services/providers';
import {storage} from '../storage';
import keys from '../storage/keys';
import {errorMessage, hasErrorCode} from '../utils/types';
import parseArtist from '../utils/parseArtist';
import {toast} from '../native/toast';
import AudioPlayer from '../native/audioPlayer';
import mediaStore from '../native/mediaStore';
import type {PlayerProps} from './types';
import lyrics from './lyrics';
import playModeActions from './playMode';

interface Host {
  isCurrent(request: number): boolean;
  setLyric: PlayerProps['setLyric'];
  setLiked(liked: boolean): void;
  setArtwork(url: string): void;
}

export default class TrackResources {
  private lyricRequest = 0;
  constructor(private readonly host: Host) {}

  cancelLyrics() {
    this.lyricRequest++;
  }

  async loadLyrics(api: Provider, info: ReturnType<typeof extractFullInfo>, songItem: TrackFields) {
    const request = ++this.lyricRequest;
    try {
      const result = await lyrics.getLyric({api, obj: info, songItem});
      if (request === this.lyricRequest) this.host.setLyric(result.lyric, result.hasTrans);
    } catch (error) {
      if (request !== this.lyricRequest || hasErrorCode(error, 'ERR_CANCELED')) return;
      this.host.setLyric(null, false);
      toast('歌词加载失败：' + errorMessage(error));
    }
  }

  async loadLikes(song: TrackFields, api: Provider, request: number) {
    try {
      const likes = await storage.load<Partial<Record<Provider, TrackId[]>>>({key: keys.likelist});
      if (this.host.isCurrent(request))
        this.host.setLiked(
          (likes[api] || []).includes(
            (api === providers.qqMusic ? song.mid || song.songmid : song.id)!,
          ),
        );
    } catch (error) {
      if (!this.host.isCurrent(request)) return;
      if (!(error instanceof Error && error.name === 'NotFoundError'))
        toast('读取收藏失败：' + errorMessage(error));
      this.host.setLiked(false);
    }
  }

  async toggleLike(song: TrackFields, api: Provider, liked: boolean, request: number) {
    try {
      await playModeActions.onLike(song, api, liked);
      await this.loadLikes(song, api, request);
    } catch (error) {
      toast('更新收藏失败：' + errorMessage(error));
    }
  }

  async loadArtwork(albumId: TrackId | undefined, song: TrackFields, request: number) {
    if (albumId == null) return;
    try {
      const image = await mediaStore.getArtWork(albumId);
      if (!this.host.isCurrent(request)) return;
      if (image) {
        const info = extractFullInfo({...song, img: image});
        this.host.setArtwork(info.img);
        AudioPlayer.updatePlayback({
          title: info.song,
          artwork: info.img,
          artist: parseArtist(info.singer),
        });
      }
    } catch (error) {
      if (this.host.isCurrent(request)) toast('本地封面加载失败：' + errorMessage(error));
    }
  }
}
